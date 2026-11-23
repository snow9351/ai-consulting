import type { ReactNode } from "react";

import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { ArrowRight } from "~/components/ui/icons";

/* ------------------------------------------------------------------------ */
/* Solid pillar marks, each on its own tinted disc.                          */
/* ------------------------------------------------------------------------ */

function ScaleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
      <g fill="currentColor">
        <circle cx="24" cy="8" r="3" />
        <rect x="22.4" y="9" width="3.2" height="28" rx="1.2" />
        <rect x="8" y="11.5" width="32" height="3" rx="1.5" />
        <rect x="14" y="37" width="20" height="4" rx="2" />
        <path d="M5 28h14a7 7 0 0 1-14 0Z" />
        <path d="M29 28h14a7 7 0 0 1-14 0Z" />
      </g>
      <path
        d="M12 14 6 27.5M12 14l6 13.5M36 14l-6 13.5M36 14l6 13.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PeopleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" fill="currentColor">
      <circle cx="11" cy="17" r="5" />
      <circle cx="37" cy="17" r="5" />
      <circle cx="24" cy="13.5" r="6.5" />
      <path d="M2 36c0-6 4-10 9-10 2.6 0 4.9 1 6.5 2.8A13 13 0 0 0 14 38H4a2 2 0 0 1-2-2Z" />
      <path d="M46 36c0-6-4-10-9-10-2.6 0-4.9 1-6.5 2.8A13 13 0 0 1 34 38h10a2 2 0 0 0 2-2Z" />
      <path d="M12 38c0-7.5 5.4-13 12-13s12 5.5 12 13a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2Z" />
    </svg>
  );
}

function GrowthMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
      <g fill="currentColor">
        <rect x="6" y="31" width="7" height="11" rx="1.5" />
        <rect x="16" y="26" width="7" height="16" rx="1.5" />
        <rect x="26" y="28" width="7" height="14" rx="1.5" />
        <rect x="36" y="19" width="7" height="23" rx="1.5" />
      </g>
      <path
        d="m5 23 11-9 9 6 15-13"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M34 5.5h7.5V13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Pillar {
  mark: () => ReactNode;
  /** Disc background and mark colour. */
  disc: string;
  title: string;
  body: string;
}

const PILLARS: Pillar[] = [
  {
    mark: ScaleMark,
    disc: "bg-gradient-to-br from-[#dbe8ff] to-[#c4d8fd] text-[#1f5fe0]",
    title: "Engineering excellence",
    body: "Modern architecture, clean code and automated testing keep your software fast, secure and easy to evolve.",
  },
  {
    mark: PeopleMark,
    disc: "bg-gradient-to-br from-[#dcf7ea] to-[#c2efd8] text-[#1fa35c]",
    title: "Client partnership",
    body: "We work as an extension of your team, with clear communication and shared ownership of every milestone.",
  },
  {
    mark: GrowthMark,
    disc: "bg-gradient-to-br from-[#f1e6fe] to-[#e2cffc] text-[#7c2de0]",
    title: "Measurable growth",
    body: "We focus on outcomes you can measure — faster releases, lower costs and better experiences for your users.",
  },
];

export function Mission() {
  return (
    <section
      id="mission"
      className="relative overflow-hidden py-20 sm:py-28"
      style={{
        background:
          "linear-gradient(180deg, var(--mission-top) 0%, #e8f0ff 55%, #f4f7fe 100%)",
      }}
    >
      {/* Flowing blue waves, like light through water — mostly to the right,
          behind the cards, and along the bottom edge. */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="mission-wave-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#cfe0ff" stopOpacity="0" />
            <stop offset="0.55" stopColor="#a9c8ff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#6ea6ff" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="mission-wave-b" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mission-wave-c" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#bcd5ff" stopOpacity="0.5" />
            <stop offset="0.6" stopColor="#d6e5ff" stopOpacity="0.2" />
            <stop offset="1" stopColor="#8db8ff" stopOpacity="0.75" />
          </linearGradient>
        </defs>
        {/* Big sweep from the top-right corner. */}
        <path d="M760 0C930 120 1080 170 1440 120V0Z" fill="url(#mission-wave-a)" opacity="0.55" />
        <path d="M1010 0c90 110 220 170 430 190V0Z" fill="url(#mission-wave-a)" />
        {/* A pale ribbon across the middle. */}
        <path d="M0 520C300 430 640 470 900 560s390 90 540 40v80c-170 50-360 30-560-50S300 470 0 600Z" fill="url(#mission-wave-b)" />
        {/* Bottom waves. */}
        <path d="M0 760c260-60 520-40 760 20s460 70 680 10v110H0Z" fill="url(#mission-wave-c)" />
        <path d="M600 900c220-80 520-120 840-90v90Z" fill="#8db8ff" opacity="0.45" />
      </svg>

      {/* Edge fades: the waves dissolve into the hero's colour at the top and
          into How It Works' colour at the bottom, so neither seam shows. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{ background: "linear-gradient(180deg, var(--mission-top), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
        style={{ background: "linear-gradient(0deg, #f4f7fe, transparent)" }}
      />

      <Container width="wide" className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* Copy */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2.5 rounded-full bg-brand-100/80 px-5 py-2 text-base font-semibold text-brand-600">
                <span aria-hidden="true" className="h-3 w-3 rounded-full bg-brand-600" />
                About Us
              </span>

              <h2 className="mt-7 text-balance text-4xl font-bold leading-[1.06] tracking-[-0.03em] text-ink-950 sm:text-5xl lg:text-[3.6rem]">
                We turn complex ideas into software that{" "}
                <span className="text-brand-600">
                  delivers{" "}
                  <span className="relative inline-block whitespace-nowrap">
                    real results.
                    <svg
                      viewBox="0 0 300 20"
                      preserveAspectRatio="none"
                      className="absolute -bottom-3 left-[3%] h-3.5 w-[96%] text-brand-600"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M3 14C40 8 120 4 200 6s80 4 97 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </span>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-10 max-w-xl space-y-6 text-lg leading-relaxed text-ink-700">
                <p>
                  We are a team of software engineers, designers and technical
                  consultants. We partner with startups and established
                  businesses to plan, build and modernise the software they
                  depend on.
                </p>
                <p>
                  <strong className="font-semibold text-ink-900">JRA</strong>{" "}
                  combines hands-on engineering with strategic consulting, so
                  every line of code serves a business goal. Whether you need a
                  new product, a rescue for an existing one, or advice on your
                  next step, we are ready to help.
                </p>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-10">
                <Button
                  to="/contact"
                  size="lg"
                  className="h-14! px-9! text-lg! font-semibold! shadow-[0_14px_30px_-10px_rgb(42_88_208/0.6)]!"
                >
                  Work With Us
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Pillars */}
          <div className="flex flex-col gap-5">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 90}>
                <article className="flex items-center gap-5 rounded-[1.75rem] border border-white/80 bg-white/75 p-5 shadow-[0_18px_40px_-24px_rgb(42_88_208/0.4)] backdrop-blur-md transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-22px_rgb(42_88_208/0.5)] sm:gap-6 sm:p-6">
                  <span
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full sm:h-24 sm:w-24 ${pillar.disc}`}
                  >
                    <pillar.mark />
                  </span>
                  <span aria-hidden="true" className="hidden h-20 w-px self-center bg-brand-200 sm:block" />
                  <div className="text-left">
                    <h3 className="text-xl font-bold tracking-tight text-ink-950 sm:text-2xl">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
                      {pillar.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
