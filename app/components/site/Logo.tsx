import { Link } from "react-router";
import { SITE } from "~/lib/site";

export interface LogoProps {
  tone?: "light" | "dark";
  className?: string;
}

/** Full wordmark (people + orbit + star, then "HUMNOVA"), transparent PNG. */
export const LOGO_SRC = "/images/brand/humnova-logo.png";
/** Just the mark, square — for tight spots like the sign-in dialog. */
export const MARK_SRC = "/images/brand/humnova-mark.png";

/**
 * Company logo. On light backgrounds it is the full artwork. On dark ones the
 * navy wordmark would disappear, so it falls back to the mark plus the name
 * set in white.
 */
export function Logo({ tone = "light", className = "" }: LogoProps) {
  return (
    <Link
      to="/"
      className={`group inline-flex shrink-0 items-center gap-2.5 ${className}`}
      aria-label={`${SITE.name} — home`}
    >
      {tone === "light" ? (
        <img
          src={LOGO_SRC}
          alt=""
          width={892}
          height={160}
          className="h-9 w-auto transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:h-11"
        />
      ) : (
        <>
          <img
            src={MARK_SRC}
            alt=""
            width={256}
            height={256}
            className="h-9 w-9 transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <span className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-white">
            {SITE.name}
          </span>
        </>
      )}
    </Link>
  );
}
