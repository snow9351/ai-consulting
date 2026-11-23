import { Link } from "react-router";
import { SITE } from "~/lib/site";

export interface LogoProps {
  tone?: "light" | "dark";
  className?: string;
}

/** The JRA mark: red chevron star on a dark rounded square (SVG). */
export const MARK_SRC = "/images/brand/jrati-mark.svg";

/**
 * Company logo: the mark plus the company name (SITE.name) set as text —
 * navy on light backgrounds, white on dark ones. Change the name in
 * ~/lib/site and the logo follows.
 */
export function Logo({ tone = "light", className = "" }: LogoProps) {
  return (
    <Link
      to="/"
      className={`group inline-flex shrink-0 items-center gap-2.5 ${className}`}
      aria-label={`${SITE.name} — home`}
    >
      <img
        src={MARK_SRC}
        alt=""
        width={100}
        height={100}
        className="h-9 w-9 transition-transform duration-500 ease-out group-hover:scale-110 sm:h-11 sm:w-11"
      />
      <span
        className={`text-[1.375rem] leading-none font-extrabold tracking-[0.08em] sm:text-[1.625rem] ${
          tone === "light" ? "text-[#0b1f4f]" : "text-white"
        }`}
      >
        {SITE.name}
      </span>
    </Link>
  );
}
