import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useUser, type AuthMode, type PublicUser } from "~/lib/auth";
import { AuthDialog } from "./AuthDialog";

interface AuthContextValue {
  user: PublicUser | null;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>.");
  return value;
}

/** Text that means "I already have an account". */
const SIGN_IN_TEXT = /\b(sign|log)\s?in\b/i;

/**
 * Owns the sign-in / sign-up dialog, and gates the page while signed out:
 * any click on a link or button asks the visitor to sign in or sign up, in
 * a dialog, instead of navigating. Once signed in, clicks behave normally.
 *
 * Opt an element out of the gate with `data-auth-free` (the menu toggle and
 * the skip link use it). Choose the dialog's starting tab with
 * `data-auth-mode="signin" | "signup"`; otherwise it is guessed from the
 * element's text ("Sign in" → sign in, anything else → sign up).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useUser();
  const [mode, setMode] = useState<AuthMode | null>(null);

  const openAuth = useCallback((next: AuthMode = "signup") => setMode(next), []);
  const closeAuth = useCallback(() => setMode(null), []);

  // Read inside the window listener without re-binding it on every change.
  const signedIn = useRef(Boolean(user));
  signedIn.current = Boolean(user);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (signedIn.current) return;
      const target = event.target as Element | null;
      const control = target?.closest?.("a[href], button, [role='button']");
      if (!control) return;
      if (control.closest("[data-auth-ui], [data-auth-free]")) return;

      // Capture phase on window runs before React's handlers, so stopping
      // here means Links never navigate and buttons never fire.
      event.preventDefault();
      event.stopPropagation();

      const explicit = control.closest("[data-auth-mode]")?.getAttribute("data-auth-mode");
      const next: AuthMode =
        explicit === "signin" || explicit === "signup"
          ? explicit
          : SIGN_IN_TEXT.test(control.textContent ?? "")
            ? "signin"
            : "signup";
      setMode(next);
    };

    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  // Close the dialog as soon as a session appears.
  useEffect(() => {
    if (user) setMode(null);
  }, [user]);

  const value = useMemo(() => ({ user, openAuth, closeAuth }), [user, openAuth, closeAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      {mode && <AuthDialog mode={mode} onModeChange={setMode} onClose={closeAuth} />}
    </AuthContext.Provider>
  );
}
