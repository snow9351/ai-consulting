import type { ReactNode } from "react";
import { Link } from "react-router";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "inverse"
  | "ghost"
  | "ghostDark"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Internal route — renders a react-router <Link>. */
  to?: string;
  /** External URL — renders an <a>. */
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-200 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white shadow-[0_6px_18px_-6px_rgb(53_106_230/0.55)] hover:bg-brand-600 hover:shadow-[0_10px_26px_-8px_rgb(53_106_230/0.6)]",
  secondary:
    "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 hover:ring-ink-300 hover:bg-ink-50",
  inverse: "bg-white text-ink-900 hover:bg-brand-50",
  ghost: "text-ink-700 hover:text-brand-600 hover:bg-brand-50",
  /* Ghost on a dark band. A separate variant rather than a className
     override, because competing Tailwind utilities resolve by stylesheet
     order, not by the order they appear in the class attribute. */
  ghostDark: "text-ink-200 hover:bg-white/10 hover:text-white",
  /* Brand-ringed, on a light or gradient backdrop. */
  outline:
    "bg-white/70 text-ink-900 ring-1 ring-inset ring-brand-300 backdrop-blur-sm hover:bg-white hover:ring-brand-500",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  href,
  type = "button",
  onClick,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        rel="noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
