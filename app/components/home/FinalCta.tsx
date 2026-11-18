import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { ArrowRight, Bolt, RocketSolid, Shield, Users } from "~/components/ui/icons";

const ASSURANCES = [
  { icon: Shield, label: "Free to join" },
  { icon: Bolt, label: "Free to apply" },
  { icon: Users, label: "No fee at any stage" },
];

/** Left decoration: a frosted tile holding a group of people with a "+". */
function PeopleArt() {
  return (
    <div className="flex h-36 w-44 -rotate-6 items-center justify-center rounded-[2rem] border border-white/70 bg-white/45 shadow-[0_20px_44px_-20px_rgb(42_88_208/0.45)] backdrop-blur-md">
      <svg viewBox="0 0 120 90" className="h-24 w-32" aria-hidden="true">
        <defs>
          <linearGradient id="cta-people" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7ea6f6" />
            <stop offset="1" stopColor="#a9c4fa" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="cta-people-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5b8ff3" />
            <stop offset="1" stopColor="#8db0f7" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {/* Back row */}
        <circle cx="24" cy="30" r="10" fill="url(#cta-people)" />
        <path d="M6 70c0-12 8-21 18-21s18 9 18 21Z" fill="url(#cta-people)" />
        <circle cx="86" cy="26" r="10" fill="url(#cta-people)" />
        <path d="M68 66c0-12 8-21 18-21s18 9 18 21Z" fill="url(#cta-people)" />
        {/* Front */}
        <circle cx="55" cy="24" r="13" fill="url(#cta-people-front)" />
        <path d="M30 76c0-15 11-27 25-27s25 12 25 27Z" fill="url(#cta-people-front)" />
        {/* Plus badge */}
        <circle cx="94" cy="62" r="15" fill="#fff" fillOpacity="0.9" />
        <circle cx="94" cy="62" r="12.5" fill="#1f55d6" />
        <path d="M94 55.5v13M87.5 62h13" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Right decoration: rising bars with a sweeping growth arrow. */
function GrowthArt() {
  return (
    <svg viewBox="0 0 220 230" className="h-56 w-52" aria-hidden="true">
      <defs>
        <linearGradient id="cta-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8c3f8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#dbe7fd" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cta-arrow" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#3d78f0" stopOpacity="0" />
          <stop offset="0.45" stopColor="#3d78f0" stopOpacity="0.7" />
          <stop offset="1" stopColor="#1f55d6" />
        </linearGradient>
      </defs>
      <rect x="30" y="150" width="28" height="80" rx="4" fill="url(#cta-bar)" />
      <rect x="72" y="128" width="28" height="102" rx="4" fill="url(#cta-bar)" />
      <rect x="114" y="104" width="28" height="126" rx="4" fill="url(#cta-bar)" />
      <rect x="156" y="70" width="28" height="160" rx="4" fill="url(#cta-bar)" />
      <path
        d="M0 140C70 125 140 90 192 22"
        fill="none"
        stroke="url(#cta-arrow)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="m168 18 32-6-6 32Z" fill="#1f55d6" />
    </svg>
  );
}

export function FinalCta() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container width="wide">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-gradient-to-br from-[#e9f0fe] via-[#f7f9ff] to-[#e6eefd] px-6 py-14 text-center shadow-[0_30px_70px_-34px_rgb(42_88_208/0.45)] sm:px-12 sm:py-16">
            {/* Soft shapes in the corners. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(196_214_252/0.75)_0%,transparent_70%)]" />
              <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(170_196_250/0.8)_0%,transparent_70%)]" />
              <div className="absolute -bottom-32 -left-20 h-80 w-[28rem] rounded-full bg-[radial-gradient(ellipse,rgb(170_196_250/0.65)_0%,transparent_70%)]" />
              <div className="absolute -bottom-36 -right-20 h-80 w-[28rem] rounded-full bg-[radial-gradient(ellipse,rgb(150_182_248/0.75)_0%,transparent_70%)]" />
              <div className="absolute left-[8%] top-[6%] h-[34rem] w-[34rem] rounded-full border border-white/70" />
            </div>

            {/* Side illustrations — wide screens only, so they never crowd the copy. */}
            <div aria-hidden="true" className="pointer-events-none absolute left-10 top-1/2 hidden -translate-y-1/2 xl:block">
              <PeopleArt />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute bottom-6 right-8 hidden xl:block">
              <GrowthArt />
            </div>

            <div className="relative mx-auto max-w-3xl">
              <div className="flex items-center justify-center gap-4">
                <span aria-hidden="true" className="hidden h-px w-24 bg-brand-200 sm:block lg:w-40" />
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-100/70 px-5 py-2 text-sm font-semibold text-brand-600">
                  <RocketSolid className="h-5 w-5 text-brand-600" />
                  Your Next Opportunity
                </span>
                <span aria-hidden="true" className="hidden h-px w-24 bg-brand-200 sm:block lg:w-40" />
              </div>

              <h2 className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-ink-950 sm:text-5xl lg:text-[3.75rem]">
                Your Potential Deserves an{" "}
                <span className="relative inline-block whitespace-nowrap text-brand-600">
                  Opportunity
                  <svg
                    viewBox="0 0 300 20"
                    preserveAspectRatio="none"
                    className="absolute -bottom-2.5 left-[12%] h-3.5 w-[78%] text-brand-700"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M3 15C60 7 160 4 297 9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                .
              </h2>

              <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg font-medium leading-relaxed text-ink-600 sm:text-xl">
                Wherever you live. Whatever your financial situation.
                <br className="hidden sm:block" /> Your next opportunity can
                begin here.
              </p>

              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  to="/join"
                  size="lg"
                  className="h-14! px-9! font-semibold! shadow-[0_14px_30px_-10px_rgb(42_88_208/0.6)]!"
                >
                  Join HUMNOVA for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  to="/employers"
                  variant="outline"
                  size="lg"
                  className="h-14! px-12! font-semibold! text-brand-700!"
                >
                  I&rsquo;m hiring
                </Button>
              </div>

              <ul className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-0 sm:divide-x sm:divide-brand-200">
                {ASSURANCES.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2.5 text-base font-medium text-ink-600 sm:px-6"
                  >
                    <Icon className="h-6 w-6 text-brand-600" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
