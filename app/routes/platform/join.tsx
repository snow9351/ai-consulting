import { PagePlaceholder } from "~/components/site/PagePlaceholder";
import { Reveal } from "~/components/ui/Reveal";
import { Check, Shield } from "~/components/ui/icons";
import { SITE } from "~/lib/site";

export function meta() {
  return [
    { title: `Join for Free | ${SITE.name}` },
    {
      name: "description",
      content:
        "JRA is free for job seekers — to join, to build a profile, and to apply. Accounts open in Phase 5.",
    },
  ];
}

const PROMISES = [
  "Creating an account is free, and it stays free.",
  "Building and keeping a profile is free.",
  "Applying to any opportunity is free.",
  "There is no paid tier that moves you up a shortlist.",
  "We will never ask you for a deposit, a registration fee, or an investment.",
  "No bank or payment details are needed to look for work here.",
];

export default function JoinRoute() {
  return (
    <PagePlaceholder
      phase="Phase 5"
      eyebrow="Join for Free"
      title="Accounts are not open yet."
      description="Sign-in and registration arrive with the database and security work in Phase 5. Rather than show you a form that goes nowhere, here is exactly what joining will — and will never — cost you."
    >
      <Reveal>
        <div className="rounded-4xl border border-signal-100 bg-signal-50 p-7 sm:p-10">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-signal-600 shadow-card">
              <Shield className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-ink-900">
                Our promise to job seekers
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-700">
                This is the commitment the whole platform is built on. It is
                not an introductory offer and it has no expiry.
              </p>
            </div>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {PROMISES.map((promise) => (
              <li
                key={promise}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal-100 text-signal-600">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-[0.9375rem] leading-relaxed text-ink-700">
                  {promise}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm leading-relaxed text-ink-600">
            If anyone ever asks you to pay {SITE.name} to find work, it is not
            us. Report it.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 rounded-3xl border border-ink-100 bg-white p-7 shadow-card">
          <h2 className="text-lg font-semibold text-ink-900">
            What we cannot promise
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">
            {SITE.name} is a platform for discovering opportunities, not an
            employer. We do not guarantee that you will be hired, that an
            opportunity will suit you, or that any particular income is
            achievable. Every opportunity depends on the employer&rsquo;s own
            decision and on what is available at the time. Anyone who promises
            you otherwise is not being honest with you.
          </p>
        </div>
      </Reveal>
    </PagePlaceholder>
  );
}
