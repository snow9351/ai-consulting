import type { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
  /** `wide` for full bento grids, `narrow` for prose-led sections. */
  width?: "default" | "wide" | "narrow";
  className?: string;
}

const WIDTHS = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  children,
  width = "default",
  className = "",
}: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 ${WIDTHS[width]} ${className}`}>
      {children}
    </div>
  );
}
