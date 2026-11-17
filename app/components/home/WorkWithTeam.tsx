import type { ComponentType } from "react";

import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { ArrowRight, Check, Globe, Shield, Users } from "~/components/ui/icons";
import type { FlagProps } from "~/components/ui/flags";
import { FlagCA, FlagEU, FlagUK, FlagUS } from "~/components/ui/flags";
import { SITE } from "~/lib/site";

/** Where the work comes from. Add a flag to ~/components/ui/flags to extend. */
const COUNTRIES: { name: string; Flag: ComponentType<FlagProps> }[] = [
  { name: "United States", Flag: FlagUS },
  { name: "Canada", Flag: FlagCA },
  { name: "Europe", Flag: FlagEU },
  { name: "United Kingdom", Flag: FlagUK },
];

interface Point {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

const HOW_WE_WORK: Point[] = [
  {
    icon: Users,
    title: "Humans read what you send",
    body: "Not a keyword filter, not an automated score. This opportunity is open to anyone who is trustworthy and not a scammer.",
  },
  {
    icon: Globe,
    title: "Where you are from decides nothing",
    body: "We work across time zones by default. Your country is a logistics detail, not a qualification.",
  },
];

/**
 * Stated as things we will never do, not as a list of rules for third-party
 * posters. The team here is the one offering the work, so these are promises
 * we are making about ourselves rather than conditions we police in others.
 */
const NEVER: string[] = [
  "Charge you to join, to be seen, or to be considered.",
  "Ask you for a deposit, a fee, or money for equipment or training.",
  "Rank you by your passport, your school, or who you happen to know.",
];

export function WorkWithTeam() {
  return (
    <section id="work" className="bg-white py-20 sm:py-28">
      <Container width="wide">
        <SectionHeading
          eyebrow="Work With Our Team"
          title="Our team will give anyone the job from the following countries."
        />

        <Reveal delay={40}>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {COUNTRIES.map(({ name, Flag }) => (
              <li key={name}>
                <span className="inline-flex items-center gap-2.5 rounded-full border border-ink-100 bg-white py-2.5 pl-2.5 pr-5 shadow-card">
                  {/* Ring, because Canada's and the US's white edges would
                      otherwise bleed into the white chip behind them. */}
                  <Flag className="h-5 w-[1.875rem] shrink-0 rounded-[3px] ring-1 ring-inset ring-ink-900/15" />
                  <span className="text-sm font-medium text-ink-800">
                    {name}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-12 overflow-hidden rounded-4xl border border-ink-100 shadow-lift lg:grid lg:grid-cols-[1.25fr_1fr]">
            <div className="bg-ink-900 p-8 sm:p-10 lg:p-12">
              <h3 className="text-xl font-semibold text-white">
                A team, not a job board
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-300">
                The opportunity comes from us. That is the whole difference — we
                respond quickly without delay.
              </p>

              <ul className="mt-9 space-y-7">
                {HOW_WE_WORK.map((point) => (
                  <li key={point.title} className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-300">
                      <point.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-[0.9375rem] font-semibold text-white">
                        {point.title}
                      </h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-300">
                        {point.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Centred: the left column runs taller, and bottom-aligning this
                one left an obvious well of empty space under it. */}
            <div className="flex flex-col justify-center bg-ink-50 p-8 sm:p-10 lg:p-12">
              <h3 className="text-xl font-semibold text-ink-900">
                What we will never do
              </h3>

              <ul className="mt-7 space-y-4">
                {NEVER.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink-700"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-ink-200 bg-white p-4">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-signal-600" />
                <p className="text-sm leading-relaxed text-ink-700">
                  If anyone claiming to be from {SITE.name} asks you for money,
                  it is not us. Tell us and we will deal with it.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Button to="/join" size="lg">
              Tell us what you can do
              <ArrowRight className="h-4 w-4" />
            </Button>
            {/*
              Deliberately not "we will find you a job". How many people we can
              take on depends on what the team is building at the time, and a
              guarantee we cannot keep is the one thing that would make this
              page dishonest.
            */}
            <p className="max-w-md text-center text-sm leading-relaxed text-ink-500">
              Free to join, and free to stay. How many people we can take on at
              once depends on what the team is building.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
