import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { Scale, Globe, Users } from "~/components/ui/icons";

const PILLARS = [
  {
    icon: Scale,
    title: "Equal dignity",
    body: "A person's worth is not a number in an account. Everyone here is treated as a professional with something real to offer.",
  },
  {
    icon: Globe,
    title: "Fair access",
    body: "No membership fee, no paid tier that jumps the queue. The people with the least money get the same access as everyone else.",
  },
  {
    icon: Users,
    title: "Human potential",
    body: "Skills, character, motivation, and potential decide who is right for a role — not a passport or a bank balance.",
  },
];

export function Mission() {
  return (
    <section id="mission" className="bg-ink-900 py-20 sm:py-28">
      <Container width="wide">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
                Our Mission
              </p>
              <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem]">
                Human beings create money.{" "}
                <span className="text-brand-300">
                  Money should serve human beings.
                </span>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-ink-300">
                <p>
                  Millions of capable people never reach a good job — not
                  because they lack ability, but because they lack money,
                  contacts, formal credentials, or a network that reaches past
                  their own border. The talent was always there. The door was
                  not.
                </p>
                <p>
                  HUMNOVA exists to open that door. We connect people who have
                  opportunities with people who need them, and we remove the
                  cost of trying. Your financial situation should never define
                  your future.
                </p>
                <p className="font-medium text-white">
                  This is not charity. It is a platform built on the belief that
                  opportunity should be distributed by talent, not by wealth.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-4">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 90}>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07] sm:p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                    <pillar.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-300">
                    {pillar.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
