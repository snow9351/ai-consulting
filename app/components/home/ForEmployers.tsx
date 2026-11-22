import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { ArrowRight, Check, Globe, Scale, Users } from "~/components/ui/icons";

const BENEFITS = [
  {
    icon: Users,
    title: "Scale your team on demand",
    body: "Add developers, designers or QA engineers as your roadmap requires — without the cost and delay of hiring.",
  },
  {
    icon: Globe,
    title: "Work across time zones",
    body: "Our engineers overlap with your working hours, so collaboration stays fast and natural.",
  },
  {
    icon: Scale,
    title: "Flexible engagement models",
    body: "Fixed-price projects, dedicated teams or time-and-materials — choose the model that fits your budget.",
  },
];

const EXPECTATIONS = [
  "A dedicated project manager and one point of contact",
  "Weekly progress updates and demos you can see and test",
  "Full ownership of your source code and intellectual property",
  "Ongoing support and maintenance after launch",
];

export function ForEmployers() {
  return (
    <section id="hire" className="bg-ink-50 py-20 sm:py-28">
      <Container width="wide">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                For Businesses
              </p>
              <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-ink-900 sm:text-4xl">
                Hire a Dedicated Development Team.
              </h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-600">
                Need extra hands or a complete product team? Extend your
                in-house capacity with HUMNOVA engineers who plug into your
                tools, processes and culture from day one.
              </p>
            </Reveal>

            <div className="mt-10 space-y-6">
              {BENEFITS.map((benefit, index) => (
                <Reveal key={benefit.title} delay={index * 80}>
                  <div className="flex gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card">
                      <benefit.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-ink-900">
                        {benefit.title}
                      </h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">
                        {benefit.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={240}>
              <div className="mt-10">
                <Button to="/contact" size="lg">
                  Hire Our Team
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Vertically centred against the taller copy column. */}
          <Reveal delay={120} className="lg:self-center">
            <div className="rounded-4xl border border-ink-100 bg-white p-8 shadow-card sm:p-10">
              <h3 className="text-xl font-semibold text-ink-900">
                What you can expect from us
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">
                Every engagement follows the same standards, whether it lasts
                two weeks or two years.
              </p>

              <ul className="mt-7 space-y-4">
                {EXPECTATIONS.map((expectation) => (
                  <li key={expectation} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal-100 text-signal-600">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed text-ink-700">
                      {expectation}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl bg-ink-50 p-5">
                <p className="text-sm leading-relaxed text-ink-700">
                  <span className="font-semibold text-ink-900">
                    How we start:
                  </span>{" "}
                  a short discovery call, then a clear proposal with scope,
                  timeline and cost — before any work begins.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
