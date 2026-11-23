import type { CSSProperties } from "react";

import { Container } from "~/components/ui/Container";
import { Button } from "~/components/ui/Button";
import { Reveal } from "~/components/ui/Reveal";
import {
  ArrowRight,
  Check,
  Compass,
  RocketSolid,
  ShieldSolid,
} from "~/components/ui/icons";
import { COMMITMENTS } from "~/content/mission";
import { GlobeVisual } from "./GlobeVisual";
import { ShootingStars } from "./ShootingStars";

/**
 * Deterministic pseudo-random numbers (mulberry32), so the server and the
 * browser place every star identically and hydration never mismatches.
 */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number, places = 2) => Number(n.toFixed(places));

/**
 * Stars on the night side only (x from 52% to 99% of the section). Most are
 * small; about one in six is a bright, larger star, which is what makes a
 * sky read as deep rather than evenly speckled.
 */
const STARS = (() => {
  const rand = seeded(7);
  return Array.from({ length: 120 }, () => {
    const bright = rand() < 0.17;
    return {
      x: round(52 + rand() * 47),
      y: round(1 + rand() * 95),
      size: round(bright ? 3.4 + rand() * 1.8 : 1.8 + rand() * 1.6),
      period: round(1.8 + rand() * 4),
      delay: round(-rand() * 6),
    };
  });
})();

/**
 * A dense field of tiny stars behind the main ones. They only fade (no
 * scaling), which keeps a couple of hundred of them cheap to animate.
 */
const SMALL_STARS = (() => {
  const rand = seeded(23);
  return Array.from({ length: 240 }, () => ({
    x: round(51 + rand() * 48.5),
    y: round(rand() * 98),
    size: round(0.9 + rand() * 1.1),
    period: round(2.5 + rand() * 5),
    delay: round(-rand() * 8),
  }));
})();

export function Hero() {
  return (
    <section className="hero-sky relative overflow-hidden">
      {/* ---- Animated backdrop (wide screens) ------------------------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* Stars, masked to the space side so none land behind the copy. */}
        <div
          className="absolute inset-0"
          style={{
            maskImage: "linear-gradient(100deg, transparent 50%, black 68%)",
            WebkitMaskImage: "linear-gradient(100deg, transparent 50%, black 68%)",
          }}
        >
          {/* Faint static star dust. */}
          <div className="hero-stars absolute inset-0 opacity-60" />
          <div className="hero-stars hero-stars-alt absolute inset-0 opacity-60" />
          <div className="hero-stars hero-stars-dense absolute inset-0 opacity-50" />

          {/* Dense field of tiny twinkling stars. */}
          {SMALL_STARS.map((star, i) => (
            <span
              key={`s${i}`}
              className="hero-star-sm"
              style={
                {
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  "--s": `${star.size}px`,
                  "--d": `${star.period}s`,
                  "--delay": `${star.delay}s`,
                } as CSSProperties
              }
            />
          ))}

          {/* Blinking stars, each on its own beat. */}
          {STARS.map((star, i) => (
            <span
              key={i}
              className="hero-star"
              style={
                {
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  "--s": `${star.size}px`,
                  "--d": `${star.period}s`,
                  "--delay": `${star.delay}s`,
                } as CSSProperties
              }
            />
          ))}

          {/* Fireball shooting stars, every second or two. */}
          <ShootingStars className="absolute inset-0 h-full w-full" />
        </div>

        {/* Sunrise bloom on the globe's limb. */}
        <div className="hero-glow absolute right-[18%] top-[2%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgb(150_190_255/0.55)_0%,rgb(53_106_230/0.25)_35%,transparent_70%)] blur-2xl" />

        {/* Soft daylight wash over the text side. */}
        <div className="absolute -left-40 top-1/3 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgb(220_232_255/0.9)_0%,transparent_65%)]" />
      </div>

      <Container width="wide" className="relative py-16 sm:py-20 lg:pt-10 lg:pb-20">
        {/* min-w-0 on both grid items: a grid item defaults to min-width:auto,
            so the globe's 440px viewBox would otherwise set a min-content
            floor and push the whole page wider than a phone viewport. */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
          <div className="min-w-0">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-4 py-2 text-sm font-semibold text-brand-700 shadow-[0_4px_18px_-6px_rgb(53_106_230/0.35)] backdrop-blur-sm">
                <ShieldSolid className="h-4.5 w-4.5 text-brand-600" />
                Software Development &amp; Consulting
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-7 lg:mt-5 text-balance text-[2.25rem] font-bold leading-[1.05] tracking-[-0.035em] text-ink-950 sm:text-5xl lg:text-[3.75rem]">
                We Build <span className="text-brand-500">Software</span>{" "}
                That Moves Your{" "}
                <span className="relative inline-block whitespace-nowrap">
                  Business Forward.
                  {/* Hand-drawn underline that draws itself in on load. */}
                  <svg
                    viewBox="0 0 320 20"
                    preserveAspectRatio="none"
                    className="hero-swoosh absolute -bottom-3 -left-2 h-4 w-[calc(100%+0.75rem)] text-brand-600"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M3 15C70 9 150 7 230 9c32 1 62 4 84 9"
                      pathLength={1}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-8 max-w-xl lg:mt-6 text-pretty text-lg font-medium leading-relaxed text-ink-700 sm:text-xl">
                JRA designs, builds and scales web, mobile, cloud and AI
                products — and gives you the technical advice to make the right
                decisions, from first idea to production.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-9 flex flex-col gap-4 lg:mt-7 sm:flex-row sm:items-center">
                <Button
                  to="/contact"
                  size="lg"
                  className="hero-cta-glow h-14! px-8! font-semibold!"
                >
                  <RocketSolid className="h-5 w-5" />
                  Start Your Project
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  to="/#why"
                  variant="outline"
                  size="lg"
                  className="h-14! px-8! font-semibold!"
                >
                  <Compass className="h-5 w-5 text-brand-600" />
                  Explore Our Services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7 lg:mt-7">
                {COMMITMENTS.map((commitment) => (
                  <li
                    key={commitment}
                    className="inline-flex items-center gap-2.5 text-[0.9375rem] font-medium text-ink-800"
                  >
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    {commitment}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Below lg the section is light, so the globe brings its own
              night sky; on wide screens the section gradient provides it. */}
          <Reveal delay={160} className="min-w-0">
            <div className="relative rounded-[2rem] bg-[radial-gradient(ellipse_at_center,#0b2463_0%,#06123a_55%,#030a24_100%)] p-4 sm:p-8 lg:-mt-10 lg:-mb-16 lg:-mr-20 lg:rounded-none lg:bg-none lg:p-0 xl:-mr-28">
              <GlobeVisual />
            </div>
          </Reveal>
        </div>
      </Container>

      {/*
        Horizon: a translucent glow wave, then a solid wave filled with the
        exact colour the Mission section starts with (--mission-top). The
        curve is the only transition between the two sections — there is no
        straight edge for the eye to catch.
      */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -bottom-px hidden h-28 w-full lg:block"
      >
        <defs>
          <linearGradient id="hero-wave-glow" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="0.55" stopColor="#dbe7ff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#8fb3ff" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          d="M0 74C240 44 480 34 720 56s520 58 720 20v64H0Z"
          fill="url(#hero-wave-glow)"
        />
        <path
          d="M0 100C260 78 520 74 760 92s480 40 680 14v34H0Z"
          fill="var(--mission-top)"
        />
      </svg>
    </section>
  );
}
