import { Link } from "react-router";
import { FOOTER_NAV, SITE } from "~/lib/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-100 bg-ink-50">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm font-medium tracking-wide text-brand-600">
              {SITE.nameOrigin}
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-600">
              {SITE.description}
            </p>
            <p className="mt-6 text-sm font-medium text-ink-800">
              {SITE.philosophy}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_NAV.map((column) => (
              <div key={column.heading}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  {column.heading}
                </h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-[0.9375rem] text-ink-700 transition-colors hover:text-brand-600"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-500">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="text-sm font-medium text-ink-600">
            {SITE.primaryMessage}
          </p>
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink-500">
          {SITE.name} is a platform for discovering opportunities. We do not
          guarantee employment, income, or selection for any role. Opportunities
          depend on employer decisions and availability.
        </p>
      </div>
    </footer>
  );
}
