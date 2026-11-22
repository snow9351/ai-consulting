import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/**
 * App shell.
 *
 * `main` is intentionally full-bleed so pages own their own containers —
 * required for edge-to-edge hero and band sections. Every existing page
 * (about, services, contact, countries) already supplies its own container,
 * so they are unaffected.
 */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
