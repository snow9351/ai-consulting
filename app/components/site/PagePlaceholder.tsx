import type { ReactNode } from "react";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { ArrowRight, Check, Clock } from "~/components/ui/icons";

export interface PagePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Which implementation phase ships this page, stated plainly to visitors. */
  phase?: string;
  /** Concrete capabilities this page will carry. */
  planned?: string[];
  children?: ReactNode;
}

/**
 * Honest placeholder for routes whose functionality lands in Phase 2–5.
 *
 * Linking the navigation to 404s would be worse than linking it here, and
 * mocking up a working page would misrepresent what exists. This states the
 * position directly.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
  phase,
  planned,
  children,
}: PagePlaceholderProps) {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50 py-16 sm:py-20">
        <Container>
          <Reveal>
            {phase ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-sm font-medium text-amber-800">
                <Clock className="h-4 w-4" />
                In development — {phase}
              </span>
            ) : null}

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-ink-900 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-600">
              {description}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          {planned && planned.length > 0 ? (
            <Reveal>
              <h2 className="text-xl font-semibold text-ink-900">
                What this page will do
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {planned.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-card"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed text-ink-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {children ? <div className="mt-12">{children}</div> : null}

          <Reveal>
            <div className="mt-14 flex flex-col gap-3 border-t border-ink-100 pt-10 sm:flex-row">
              <Button to="/" variant="secondary" size="lg">
                Back to home
              </Button>
              <Button to="/#mission" variant="ghost" size="lg">
                Read our mission
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
