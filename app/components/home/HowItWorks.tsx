import { Fragment, type ReactNode } from "react";

import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { ArrowRight } from "~/components/ui/icons";
import { STEPS } from "~/content/mission";
import type { Step } from "~/content/mission";

/* ------------------------------------------------------------------------ */
/* Illustrations — solid, softly shaded blue marks on a 64-unit grid.        */
/* Gradient ids are prefixed per illustration so they never collide.        */
/* ------------------------------------------------------------------------ */

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-main`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4f86f7" />
        <stop offset="1" stopColor="#1f55d6" />
      </linearGradient>
      <linearGradient id={`${id}-soft`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bcd3fb" />
        <stop offset="1" stopColor="#8db2f5" />
      </linearGradient>
    </defs>
  );
}

function UserPlusArt() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Defs id="hiw-user" />
      <circle cx="26" cy="21" r="10" fill="url(#hiw-user-main)" />
      <path
        d="M8 50c0-10 8-17 18-17s18 7 18 17a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3Z"
        fill="url(#hiw-user-main)"
      />
      <circle cx="46" cy="44" r="10.5" fill="#fff" />
      <circle cx="46" cy="44" r="8.5" fill="#1f55d6" />
      <path d="M46 39.5v9M41.5 44h9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function CodeLaptopArt() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Defs id="hiw-code" />
      <rect x="10" y="12" width="44" height="31" rx="4" fill="url(#hiw-code-soft)" />
      <rect x="13.5" y="15.5" width="37" height="24" rx="2.5" fill="url(#hiw-code-main)" />
      <path
        d="m26.5 23.5-4 4 4 4M37.5 23.5l4 4-4 4M33.5 22l-3 11"
        fill="none"
        stroke="#fff"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 45h56l-2.5 4.5a3 3 0 0 1-2.6 1.5H9.1a3 3 0 0 1-2.6-1.5Z" fill="url(#hiw-code-soft)" />
      <rect x="27" y="45" width="10" height="2" rx="1" fill="#7aa3f0" />
    </svg>
  );
}

function BriefcaseArt() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Defs id="hiw-case" />
      <path
        d="M24 17v-3a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3"
        fill="none"
        stroke="#1f55d6"
        strokeWidth="3.4"
      />
      <rect x="7" y="17" width="50" height="33" rx="6" fill="url(#hiw-case-main)" />
      <path d="M7 30h50" stroke="#174bc4" strokeWidth="1.6" opacity="0.6" />
      <rect x="27.5" y="27" width="9" height="6.5" rx="1.6" fill="#dbe7ff" />
      <circle cx="49" cy="47" r="10.5" fill="#fff" />
      <circle cx="49" cy="47" r="8.5" fill="#3f78ee" />
      <path
        d="m45 47.2 2.8 2.8 5.4-5.6"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GrowthArt() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <Defs id="hiw-grow" />
      <rect x="8" y="40" width="9" height="14" rx="2" fill="url(#hiw-grow-main)" />
      <rect x="21" y="34" width="9" height="20" rx="2" fill="url(#hiw-grow-main)" />
      <rect x="34" y="37" width="9" height="17" rx="2" fill="url(#hiw-grow-main)" />
      <rect x="47" y="26" width="9" height="28" rx="2" fill="url(#hiw-grow-main)" />
      <path
        d="m8 31 13-11 11 7 18-16"
        fill="none"
        stroke="#1f55d6"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M43 9.5h9.5V19" fill="none" stroke="#1f55d6" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ART: Record<Step["icon"], () => ReactNode> = {
  userPlus: UserPlusArt,
  code: CodeLaptopArt,
  briefcase: BriefcaseArt,
  growth: GrowthArt,
};

/* ------------------------------------------------------------------------ */

function StepCard({ step, index }: { step: Step; index: number }) {
  const Art = ART[step.icon];

  return (
    <Reveal delay={index * 90} className="h-full">
      <article className="group relative flex h-full flex-col items-center overflow-hidden rounded-[1.75rem] border border-white bg-white/90 px-6 pb-10 pt-8 text-center shadow-[0_2px_6px_rgb(20_36_59/0.04),0_22px_48px_-24px_rgb(42_88_208/0.35)] backdrop-blur-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_2px_6px_rgb(20_36_59/0.05),0_28px_56px_-22px_rgb(42_88_208/0.45)]">
        {/* Soft wave along the bottom of the card. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 300 80"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full"
        >
          <defs>
            <linearGradient id={`hiw-wave-${index}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#c9dbfb" stopOpacity="0.8" />
              <stop offset="0.6" stopColor="#e3ecfd" stopOpacity="0.5" />
              <stop offset="1" stopColor="#eef4fe" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 20C60 18 110 45 170 62s100 14 130 10v8H0Z" fill={`url(#hiw-wave-${index})`} />
        </svg>

        {/* Icon tile with two little "spark" strokes at its corner. */}
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="absolute -left-7 -top-3 h-7 w-7 text-brand-500"
          >
            <path d="M14 4.5 17 9M5 15l5.5 1.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <div className="flex h-28 w-28 items-center justify-center rounded-[1.75rem] bg-gradient-to-b from-brand-50 to-[#e4edfd] shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_10px_24px_-14px_rgb(42_88_208/0.45)] transition-transform duration-300 group-hover:scale-105">
            <div className="h-[5rem] w-[5rem]">
              <Art />
            </div>
          </div>
        </div>

        <span className="relative mt-5 inline-flex h-8 min-w-12 items-center justify-center rounded-full bg-brand-50 px-3 text-sm font-bold tracking-wide text-ink-900">
          {step.number}
        </span>

        <h3 className="relative mt-4 text-xl font-bold tracking-tight text-ink-950">
          {step.title}
        </h3>
        <p className="relative mt-3 text-[0.9375rem] leading-relaxed text-ink-600">
          {step.description}
        </p>
      </article>
    </Reveal>
  );
}

function Connector() {
  return (
    <li aria-hidden="true" className="hidden list-none items-center justify-center lg:flex">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600 shadow-[0_6px_16px_-8px_rgb(42_88_208/0.5)]">
        <ArrowRight className="h-5 w-5" />
      </span>
    </li>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-gradient-to-b from-[#f4f7fe] to-[#f8faff] py-20 sm:py-28"
    >
      {/* Soft decorative circles in the corners. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgb(200_218_252/0.7)_0%,rgb(200_218_252/0.25)_55%,transparent_72%)]" />
        <div className="absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgb(200_218_252/0.6)_0%,rgb(200_218_252/0.2)_55%,transparent_72%)]" />
        <div className="absolute right-[12%] top-16 h-16 w-16 rounded-full bg-brand-100/60" />
        <div className="absolute -bottom-40 -right-24 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgb(190_210_250/0.6)_0%,transparent_70%)]" />
      </div>

      <Container width="wide" className="relative">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center gap-4">
              <span aria-hidden="true" className="h-px w-16 bg-brand-200 sm:w-48" />
              <span className="rounded-full bg-brand-100/70 px-6 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600 sm:text-sm">
                How It Works
              </span>
              <span aria-hidden="true" className="h-px w-16 bg-brand-200 sm:w-48" />
            </div>

            <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
              Four steps. <span className="text-brand-500">No fee</span> at any
              one of them.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-pretty text-lg text-ink-600 sm:text-xl">
              Getting started takes an email address and your own account of
              what you can do.
            </p>
          </div>
        </Reveal>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:gap-3">
          {STEPS.map((step, index) => (
            <Fragment key={step.number}>
              {index > 0 && <Connector />}
              <li className="list-none">
                <StepCard step={step} index={index} />
              </li>
            </Fragment>
          ))}
        </ol>
      </Container>
    </section>
  );
}
