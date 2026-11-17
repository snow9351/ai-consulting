import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { Globe, Handshake, Sparkle, UserPlus } from "~/components/ui/icons";
import { STEPS } from "~/content/mission";
import type { Step } from "~/content/mission";

const ICONS = {
  userPlus: UserPlus,
  sparkle: Sparkle,
  globe: Globe,
  handshake: Handshake,
} as const;

function StepCard({ step, index }: { step: Step; index: number }) {
  const Icon = ICONS[step.icon];

  return (
    <Reveal delay={index * 80} className="h-full">
      <div className="relative flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-7 shadow-card">
        <div className="flex items-center justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Icon className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold tracking-[0.08em] text-ink-300">
            {step.number}
          </span>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-ink-900">{step.title}</h3>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-600">
          {step.description}
        </p>
      </div>
    </Reveal>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28">
      <Container width="wide">
        <SectionHeading
          eyebrow="How It Works"
          title="Four steps. No fee at any one of them."
          description="Getting started takes an email address and your own account of what you can do."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
