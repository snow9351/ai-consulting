import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  /** Heading level — keeps the document outline sane across sections. */
  as?: "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  as: Tag = "h2",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <Reveal
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow ? (
        <p
          className={`mb-4 text-xs font-semibold uppercase tracking-[0.18em] ${
            tone === "dark" ? "text-brand-300" : "text-brand-600"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}

      <Tag
        className={`text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.02em] sm:text-4xl ${
          tone === "dark" ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </Tag>

      {description ? (
        <p
          className={`mt-5 text-pretty text-base leading-relaxed sm:text-lg ${
            tone === "dark" ? "text-ink-200" : "text-ink-600"
          }`}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
