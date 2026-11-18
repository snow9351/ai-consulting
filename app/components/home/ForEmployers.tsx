import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { ArrowRight, Check, Globe, Scale, Users } from "~/components/ui/icons";

const BENEFITS = [
  {
    icon: Users,
    title: "A wider shortlist",
    body: "Reach capable people who are invisible to networks built on referrals, elite universities, and expensive job boards.",
  },
  {
    icon: Globe,
    title: "Work across time zones",
    body: "Profiles state working hours and overlap upfront, so you can hire for the coverage you actually need.",
  },
  {
    icon: Scale,
    title: "Hire on evidence",
    body: "Skills, languages, and track record lead every profile. Background and nationality are not ranking signals.",
  },
];

const EXPECTATIONS = [
  "Pay fairly for the work and the market you are hiring in",
  "State compensation and requirements before anyone applies",
  "Never ask a candidate for money, equipment deposits, or fees",
  "Respond to applicants — a clear no is better than silence",
];

export function ForEmployers() {
  return (
    <section className="bg-ink-50 py-20 sm:py-28">
      <Container width="wide">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                For Employers
              </p>
              <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-ink-900 sm:text-4xl">
                Find Talent Beyond Borders.
              </h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-600">
                Businesses, founders, and project owners can discover people
                whose ability has never had a route to the international market
                — not because they are cheap, but because they are good and
                nobody was looking.
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
                <Button to="/employers" size="lg">
                  Discover Global Talent
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Vertically centred against the taller copy column. */}
          <Reveal delay={120} className="lg:self-center">
            <div className="rounded-4xl border border-ink-100 bg-white p-8 shadow-card sm:p-10">
              <h3 className="text-xl font-semibold text-ink-900">
                What we expect from employers
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">
                Posting here means agreeing to a short, non-negotiable standard
                of conduct. It is the reason job seekers can trust what they
                find.
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
                    How HUMNOVA will be funded:
                  </span>{" "}
                  employer subscriptions, recruitment tools, and business
                  services. Never by charging the people looking for work.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
