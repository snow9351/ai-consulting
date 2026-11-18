import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/Button";
import { Close, Menu } from "~/components/ui/icons";
import { PRIMARY_NAV } from "~/lib/site";
import { Logo } from "./Logo";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
          <Button to="/join" variant="ghost" size="sm" className="hover:scale-105">
            Sign In
          </Button>
          <Button to="/join" variant="primary" size="sm" className="hover:scale-105">
            Join for Free
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
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
            <Button to="/join" variant="primary" size="lg" onClick={() => setMenuOpen(false)}>
              Join for Free
            </Button>
            <Button to="/join" variant="secondary" size="lg" onClick={() => setMenuOpen(false)}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
