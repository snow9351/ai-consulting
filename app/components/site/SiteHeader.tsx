import { useEffect, useState } from "react";
import { Link, useFetcher, useLocation } from "react-router";
import { Button } from "~/components/ui/Button";
import { Close, Menu } from "~/components/ui/icons";
import { PRIMARY_NAV } from "~/lib/site";
import { Logo } from "./Logo";
import { useAuth } from "~/components/auth/AuthProvider";
import { initials, type PublicUser } from "~/lib/auth";

/** Avatar, name and a sign-out button, for a signed-in visitor. */
function AccountChip({ user, stacked = false }: { user: PublicUser; stacked?: boolean }) {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  return (
    <div className={stacked ? "flex items-center justify-between gap-3" : "flex items-center gap-3"}>
      <span className="inline-flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white shadow-[0_6px_14px_-6px_rgb(53_106_230/0.7)]">
          {initials(user.name)}
        </span>
        <span className="max-w-40 truncate text-[0.9375rem] font-semibold text-ink-900">{user.name}</span>
      </span>
      {user.isAdmin && (
        <Button to="/admin/invites" variant="secondary" size="sm" className="hover:scale-105">
          Invites
        </Button>
      )}
      <fetcher.Form method="post" action="/auth">
        <input type="hidden" name="intent" value="signout" />
        <Button type="submit" variant="ghost" size="sm" className="hover:scale-105">
          {busy ? "Signing out…" : "Sign out"}
        </Button>
      </fetcher.Form>
    </div>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, openAuth } = useAuth();

  // Collapse the panel whenever navigation happens.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the panel; body scroll is locked while it is open.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || menuOpen
          ? "border-b border-ink-100 bg-white/85 backdrop-blur-md"
          : "border-b border-transparent bg-white"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:h-18 sm:px-8"
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className="relative inline-flex rounded-full px-3.5 py-2 text-[0.9375rem] font-medium text-ink-600 transition-[color,background-color,transform] duration-300 after:absolute after:inset-x-3.5 after:bottom-1 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-brand-500 after:transition-transform after:duration-300 hover:-translate-y-px hover:bg-brand-50 hover:text-brand-600 hover:after:scale-x-100"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <AccountChip user={user} />
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hover:scale-105" onClick={() => openAuth("signin")} data-auth-mode="signin">
                Sign In
              </Button>
              <Button variant="primary" size="sm" className="hover:scale-105" onClick={() => openAuth("signup")} data-auth-mode="signup">
                Join for Free
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          data-auth-free
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-50 lg:hidden"
        >
          {menuOpen ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="border-t border-ink-100 bg-white lg:hidden"
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-5 sm:px-8">
          <ul className="flex flex-col">
            {PRIMARY_NAV.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-ink-100 py-3.5 text-base font-medium text-ink-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            {user ? (
              <AccountChip user={user} stacked />
            ) : (
              <>
                <Button variant="primary" size="lg" data-auth-mode="signup" onClick={() => openAuth("signup")}>
                  Join for Free
                </Button>
                <Button variant="secondary" size="lg" data-auth-mode="signin" onClick={() => openAuth("signin")}>
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
