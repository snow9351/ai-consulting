import { Link } from "react-router";
import { SITE } from "~/lib/site";

export interface LogoProps {
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Wordmark. The mark is a meridian-ringed globe: two overlapping orbits,
 * no single country at the centre.
 */
export function Logo({ tone = "light", className = "" }: LogoProps) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${SITE.name} — home`}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-[20deg] group-hover:scale-110"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="16" cy="16" r="15" className="fill-brand-500" />
        <g
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.95"
        >
          <circle cx="16" cy="16" r="9.5" />
          <ellipse cx="16" cy="16" rx="4.2" ry="9.5" />
          <path d="M7 13.2h18M7 18.8h18" />
        </g>
      </svg>

      <span
        className={`text-[1.0625rem] font-semibold tracking-[-0.01em] ${
          tone === "dark" ? "text-white" : "text-ink-900"
        }`}
      >
        {SITE.name}
      </span>
    </Link>
  );
}
