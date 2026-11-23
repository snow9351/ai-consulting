import { Link } from "react-router";
import { CONTACT, FOOTER_NAV, SITE } from "~/lib/site";
import { LinkedIn, Mail, Phone } from "~/components/ui/icons";
import { Logo } from "./Logo";

const CHANNELS = [
  { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, Icon: Mail },
  { label: "Phone", value: CONTACT.phone, href: CONTACT.phoneHref, Icon: Phone },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-100 bg-ink-50">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-600">
              {SITE.description}
            </p>
            <p className="mt-6 text-sm font-medium text-ink-800">
              {SITE.philosophy}
            </p>

            <ul className="mt-7 space-y-3">
              {CHANNELS.map(({ label, value, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-3 text-[0.9375rem] font-medium text-ink-700 transition-colors hover:text-brand-600"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-white text-brand-600 transition-colors duration-300 group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="sr-only">{label}: </span>
                    {value}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${SITE.name} on LinkedIn (opens in a new tab)`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgb(10_102_194/0.8)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#004182]"
            >
              <LinkedIn className="h-4.5 w-4.5" />
              Follow us on LinkedIn
            </a>
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

      </div>
    </footer>
  );
}
