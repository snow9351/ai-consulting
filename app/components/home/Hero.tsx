import { Container } from "~/components/ui/Container";
import { Button } from "~/components/ui/Button";
import { Reveal } from "~/components/ui/Reveal";
import { ArrowRight, Check, Globe } from "~/components/ui/icons";
import { COMMITMENTS } from "~/content/mission";
import { GlobeVisual } from "./GlobeVisual";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ink-50 via-white to-white">
      {/* Faint grid, masked out toward the bottom so it never competes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(20 36 59 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(20 36 59 / 0.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      <Container width="wide" className="relative py-16 sm:py-20 lg:py-28">
        {/* min-w-0 on both grid items: a grid item defaults to min-width:auto,
            so the globe SVG's 440px viewBox would otherwise set a min-content
            floor and push the whole page wider than a phone viewport. */}
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div className="min-w-0">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm font-medium text-ink-700 shadow-[0_1px_2px_rgb(20_36_59/0.04)]">
                <Globe className="h-4 w-4 text-brand-500" />
                Opportunity has no borders
              </span>
            </Reveal>

            <Reveal delay={80}>
              {/* Base size is held down so the no-wrap "Bank Account." phrase
                  and its hand-drawn circle still fit a 320px viewport. */}
              <h1 className="mt-7 text-balance text-[2.125rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-900 sm:text-5xl lg:text-[3.5rem]">
                Your{" "}
                <span className="text-brand-500">Future</span> Shouldn&rsquo;t
                Depend on Your{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10">Bank Account.</span>
                  <svg
                    viewBox="0 0 320 54"
                    preserveAspectRatio="none"
                    className="absolute -inset-x-3 -inset-y-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+1.5rem)] text-brand-400"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M163 4C94 1 24 10 9 25c-14 14 51 26 148 25 84-1 156-12 155-26C311 11 247 3 170 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-600">
                Your talent deserves an opportunity. Meet people around the
                world, discover remote work, and build your future without
                financial barriers.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button to="/join" size="lg">
                  Find Opportunities — Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button to="/#mission" variant="secondary" size="lg">
                  Explore Our Mission
                </Button>
              </div>
            </Reveal>

            <Reveal delay={260}>
              {/* Stacked rather than wrapped: three of these never divide
                  evenly across the hero column, and 2-then-1 reads as an
                  accident. */}
              <ul className="mt-9 flex flex-col gap-3">
                {COMMITMENTS.map((commitment) => (
                  <li
                    key={commitment}
                    className="inline-flex items-center gap-2 text-sm font-medium text-ink-700"
                  >
                    <Check className="h-4 w-4 shrink-0 text-signal-500" />
                    {commitment}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={160} className="min-w-0 lg:pl-4">
            <GlobeVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
