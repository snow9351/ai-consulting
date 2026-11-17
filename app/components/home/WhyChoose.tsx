import type { ComponentType } from "react";

import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import {
  ArrowRight,
  Globe,
  Handshake,
  Scale,
  Shield,
  Sparkle,
  Users,
} from "~/components/ui/icons";
import { SITE } from "~/lib/site";

interface Reason {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

/**
 * Every item here restates a commitment the site already makes elsewhere —
 * the hero bullets, the employer standards, the funding model. Nothing is a
 * statistic, a testimonial, or a promise of employment, because none of those
 * can be made honestly before launch.
 */
const REASONS: Reason[] = [
  {
    icon: Sparkle,
    title: "Free for job seekers — forever",
    body: "You will never pay to build a profile, search, or apply. Not a trial, not a limited tier, not a fee at the end.",
  },
  {
    icon: Shield,
    title: "No upfront payments, ever",
    body: "No deposits, no processing fees, no equipment charges. Any listing that asks you for money is removed.",
  },
  {
    icon: Globe,
    title: "Open to every nationality",
    body: "No country is excluded, and no passport ranks above another. Where you were born is not a filter here.",
  },
  {
    icon: Scale,
    title: "The terms are on the table first",
    body: "Compensation and requirements are stated before you apply — or clearly marked as undisclosed, so you can decide.",
  },
  {
    icon: Users,
    title: "Judged on what you can do",
    body: "Skills, languages, and availability lead every profile. Not your school, your network, or who you happen to know.",
  },
  {
    icon: Handshake,
    title: "Paid for by employers, not by you",
    body: "Revenue comes from employer tools and subscriptions. The people looking for work are never the ones charged.",
  },
];

export function WhyChoose() {
  return (
    <section id="why" className="bg-ink-50 py-20 sm:py-28">
      <Container width="wide">
        <SectionHeading
          eyebrow={`Why ${SITE.name}`}
          title={`Why Choose ${SITE.name} Consultants`}
          description="Not a promise of a job — a promise about how you will be treated while you look for one."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => (
            <Reveal
              key={reason.title}
              delay={(index % 3) * 80}
              className="h-full"
            >
              <article className="flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-7 shadow-card transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-ink-200 hover:shadow-lift">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <reason.icon className="h-5 w-5" />
                </span>

                <h3 className="mt-5 text-base font-semibold text-ink-900">
                  {reason.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                  {reason.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80}>
          <div className="mt-12 flex justify-center">
            <Button to="/join" variant="secondary" size="lg">
              What joining involves
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
