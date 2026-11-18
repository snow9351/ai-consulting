import type { ComponentType } from "react";

import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import {
  ArrowRight,
  Document,
  Globe,
  GraduationCap,
  Handshake,
  NoFee,
  Search,
  Shield,
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
    icon: Search,
    title: "Free for Job Seekers — Forever",
    body: "You will never pay to build a profile, search, or apply. Not a trial, not a limited offer, not a fee at the end.",
  },
  {
    icon: NoFee,
    title: "No Upfront Payments, Ever",
    body: "No deposits, no processing fees, no equipment charges. Any listing that asks you for money is removed.",
  },
  {
    icon: Globe,
    title: "Open to Every Nationality",
    body: "No country is excluded, and no passport ranks above another. Where you were born is not a filter here.",
  },
  {
    icon: Document,
    title: "The Terms Are on the Table First",
    body: "Compensation and requirements are stated before you apply — or clearly marked as undisclosed, so you can decide.",
  },
  {
    icon: GraduationCap,
    title: "Judged on What You Can Do",
    body: "Skills, languages, and availability lead every profile. Not your school, your network, or who you happen to know.",
  },
  {
    icon: Handshake,
    title: "Paid for by Employers, Not by You",
    body: "Revenue comes from employer tools and subscriptions. The people looking for work are never the ones charged.",
  },
];

const PILLARS: Reason[] = [
  { icon: Shield, title: "100% Free for Job Seekers", body: "" },
  { icon: Users, title: "A Global & Inclusive Platform", body: "" },
  { icon: Handshake, title: "Fair and Transparent Hiring", body: "" },
];

export function WhyChoose() {
  return (
    <section id="why" className="bg-white py-20 sm:py-28">
      <Container width="wide">
        {/* Heading */}
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600 sm:text-sm">
              <span aria-hidden="true" className="h-px w-10 bg-brand-300 sm:w-24" />
              Join Our Global Team
              <span aria-hidden="true" className="h-px w-10 bg-brand-300 sm:w-24" />
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">
              Why Choose <span className="text-brand-600">{SITE.name}</span>{" "}
              Consultants?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-600 sm:text-xl">
              Not a promise of a job — a promise about how you will be treated
              while you look for one.
            </p>

            <div className="mt-8 flex justify-center">
              <Button to="/join" size="lg">
                Join Our Global Team
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Reason cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => (
            <Reveal
              key={reason.title}
              delay={(index % 3) * 80}
              className="h-full"
            >
              <article className="flex h-full items-start gap-5 rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-lift">
                <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <reason.icon className="h-9 w-9" />
                </span>

                <div>
                  <h3 className="text-lg font-semibold leading-snug text-ink-950">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
                    {reason.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Trust strip */}
        <Reveal delay={80}>
          <div className="mt-14 flex items-center justify-center gap-6">
            <span aria-hidden="true" className="hidden h-px flex-1 bg-brand-200 lg:block" />
            <ul className="flex flex-col items-center gap-6 sm:flex-row sm:gap-0 sm:divide-x sm:divide-ink-200">
              {PILLARS.map((pillar) => (
                <li
                  key={pillar.title}
                  className="flex items-center gap-3 sm:px-8 lg:px-12"
                >
                  <pillar.icon className="h-9 w-9 shrink-0 text-brand-700" />
                  <span className="text-base font-semibold text-ink-900 sm:text-lg">
                    {pillar.title}
                  </span>
                </li>
              ))}
            </ul>
            <span aria-hidden="true" className="hidden h-px flex-1 bg-brand-200 lg:block" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
