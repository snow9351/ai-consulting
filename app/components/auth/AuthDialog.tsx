import { useEffect, useId, useRef, useState } from "react";
import { useFetcher } from "react-router";

import { Close } from "~/components/ui/icons";
import type { AuthMode, AuthResult, Role } from "~/lib/auth";
import { SITE } from "~/lib/site";
import { MARK_SRC } from "~/components/site/Logo";

interface AuthDialogProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
}

const COPY: Record<AuthMode, { title: string; subtitle: string; submit: string; pending: string }> = {
  signin: {
    title: "Welcome back",
    subtitle: `Sign in to continue to ${SITE.name}.`,
    submit: "Sign In",
    pending: "Signing in…",
  },
  signup: {
    title: `Join ${SITE.name} for free`,
    subtitle: "Joining is by invitation. Sign up with the email address your invite was sent to.",
    submit: "Create Free Account",
    pending: "Creating your account…",
  },
};

const ROLES: { value: Role; label: string }[] = [
  { value: "talent", label: "I'm looking for work" },
  { value: "employer", label: "I'm hiring" },
];

export function AuthDialog({ mode, onModeChange, onClose }: AuthDialogProps) {
  const fetcher = useFetcher<AuthResult>();
  const titleId = useId();
  const firstField = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("talent");

  const busy = fetcher.state !== "idle";
  // Only show a response that belongs to the tab on screen.
  const result = fetcher.data && fetcher.data.mode === mode ? fetcher.data : undefined;
  const errors = result?.ok ? undefined : result?.fieldErrors;
  const copy = COPY[mode];

  // Escape closes; the page behind does not scroll; focus returns on close.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    firstField.current?.focus();
  }, [mode]);

  const field =
    "mt-1.5 block h-12 w-full rounded-xl border bg-white px-4 text-[0.9375rem] text-ink-900 placeholder:text-ink-400 transition-[border-color,box-shadow] focus:outline-none focus:ring-4";
  const fieldState = (error?: string) =>
    error
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-ink-200 focus:border-brand-500 focus:ring-brand-100";

  return (
    <div
      data-auth-ui
      className="auth-backdrop fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink-950/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="auth-panel relative my-auto w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_90px_-30px_rgb(10_20_60/0.6)]"
      >
        {/* Soft brand wash across the top. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-50 to-transparent"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
        >
          <Close className="h-5 w-5" />
        </button>

        <div className="relative px-7 pb-8 pt-9 sm:px-9">
          <img src={MARK_SRC} alt="" width={256} height={256} className="h-14 w-14" />

          <h2 id={titleId} className="mt-5 text-2xl font-bold tracking-[-0.02em] text-ink-950">
            {copy.title}
          </h2>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">{copy.subtitle}</p>

          {/* Tabs */}
          <div role="tablist" className="mt-6 grid grid-cols-2 rounded-full bg-ink-100/80 p-1">
            {(["signin", "signup"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={mode === tab}
                onClick={() => onModeChange(tab)}
                className={`h-10 rounded-full text-sm font-semibold transition-[background-color,color,box-shadow] ${
                  mode === tab
                    ? "bg-white text-ink-950 shadow-[0_2px_8px_-2px_rgb(20_36_59/0.2)]"
                    : "text-ink-500 hover:text-ink-800"
                }`}
              >
                {tab === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <fetcher.Form method="post" action="/auth" noValidate className="mt-6 space-y-4">
            <input type="hidden" name="intent" value={mode} />

            {result?.error && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {result.error}
              </p>
            )}

            {mode === "signup" && (
              <>
                <fieldset>
                  <legend className="sr-only">Account type</legend>
                  <input type="hidden" name="role" value={role} />
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={role === option.value}
                        onClick={() => setRole(option.value)}
                        className={`h-11 rounded-xl border text-sm font-semibold transition-colors ${
                          role === option.value
                            ? "border-brand-500 bg-brand-50 text-brand-700"
                            : "border-ink-200 text-ink-600 hover:border-ink-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="block">
                  <span className="text-sm font-semibold text-ink-800">Full name</span>
                  <input
                    ref={firstField}
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={Boolean(errors?.name)}
                    className={`${field} ${fieldState(errors?.name)}`}
                  />
                  {errors?.name && <span className="mt-1 block text-sm text-red-600">{errors.name}</span>}
                </label>
              </>
            )}

            <label className="block">
              <span className="text-sm font-semibold text-ink-800">Email</span>
              <input
                ref={mode === "signin" ? firstField : undefined}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors?.email)}
                className={`${field} ${fieldState(errors?.email)}`}
              />
              {errors?.email && <span className="mt-1 block text-sm text-red-600">{errors.email}</span>}
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink-800">Password</span>
              <span className="relative block">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                  aria-invalid={Boolean(errors?.password)}
                  className={`${field} ${fieldState(errors?.password)} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((shown) => !shown)}
                  className="absolute right-2 top-1/2 mt-[3px] -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
              {errors?.password && (
                <span className="mt-1 block text-sm text-red-600">{errors.password}</span>
              )}
            </label>

            <button
              type="submit"
              disabled={busy}
              className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgb(53_106_230/0.7)] transition-[background-color,transform] hover:bg-brand-600 active:translate-y-px disabled:opacity-70"
            >
              {busy && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {busy ? copy.pending : copy.submit}
            </button>
          </fetcher.Form>

          <p className="mt-5 text-center text-sm text-ink-600">
            {mode === "signin" ? "New to " + SITE.name + "? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => onModeChange(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-brand-600 hover:underline"
            >
              {mode === "signin" ? "Create a free account" : "Sign in"}
            </button>
          </p>

          <p className="mt-5 border-t border-ink-100 pt-4 text-center text-xs text-ink-500">
            Free for job seekers — always. No card or payment details needed.
          </p>
        </div>
      </div>
    </div>
  );
}
