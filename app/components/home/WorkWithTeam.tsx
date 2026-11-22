import type { ComponentType } from "react";

import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { ArrowRight, Clock, Globe, NoFee, Shield, Users } from "~/components/ui/icons";
import type { FlagProps } from "~/components/ui/flags";
import { FlagCA, FlagEU, FlagUK, FlagUS } from "~/components/ui/flags";
import { SITE } from "~/lib/site";

/** Regions we deliver for. Add a flag to ~/components/ui/flags to extend. */
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
    title: "Experts on every project",
    body: "Experienced engineers and designers lead your project, with one point of contact from kickoff to launch.",
  },
  {
    icon: Globe,
    title: "Working in your time zone",
    body: "Our distributed team overlaps with your working hours, so questions are answered and decisions made fast.",
  },
];

/** What every client can count on. */
const NEVER: Point[] = [
  {
    icon: NoFee,
    title: "Transparent pricing",
    body: "Clear estimates up front and no hidden costs — you always know what you are paying for.",
  },
  {
    icon: Shield,
    title: "Secure, tested code",
    body: "Code reviews, automated testing and security best practices on every single release.",
  },
  {
    icon: Clock,
    title: "On-time delivery",
    body: "Agile sprints and regular demos keep your project predictable and on schedule.",
  },
];

/* ------------------------------------------------------------------------ */
/* Grid marks — broken blue lines on a square grid, like a street plan seen  */
/* from above. Each segment is [x1, y1, x2, y2] in grid units; segments are  */
/* trimmed at their ends so every crossing shows a small gap.               */
/* ------------------------------------------------------------------------ */

type Segment = [number, number, number, number];

const UNIT = 40;
const BAR = 13;
const GAP = 4;

const LEFT_MARK: Segment[] = [
  [2, 0.6, 2, 2], [4, 0, 4, 2], [0, 2, 2, 2], [2, 2, 4, 2], [4, 2, 5, 2],
  [2, 2, 2, 4], [4, 2, 4, 4], [5, 2, 5, 4], [0, 4, 2, 4], [2, 4, 4, 4],
  [4, 4, 5.4, 4], [5.4, 4, 5.4, 4.8], [2, 4, 2, 5.6], [4, 4, 4, 4.8],
  [5, 4, 5, 5.6], [0, 5.6, 0.8, 5.6], [0.8, 5.6, 0.8, 6.6], [2, 5.6, 2, 6],
];

const RIGHT_MARK: Segment[] = [
  [4, -1, 4, 1], [4, 1, 5, 1], [0, 2.4, 0, 3], [1.4, 1.4, 1.4, 2.6],
  [0, 2.6, 1.4, 2.6], [1.4, 2.6, 2.8, 2.6], [2.8, 2.6, 4, 2.6], [4, 2.6, 5, 2.6],
  [2.8, 1.8, 2.8, 2.6], [4, 1.4, 4, 2.6], [1.4, 2.6, 1.4, 4], [2.8, 2.6, 2.8, 4.4],
  [4, 2.6, 4, 4], [0, 3.4, 0, 4.2], [1.4, 4, 2.8, 4], [2.8, 4, 4, 4], [4, 4, 5, 4],
  [2.8, 4, 2.8, 5.6], [4, 4, 4, 4.8],
];

function GridMark({ segments, className = "" }: { segments: Segment[]; className?: string }) {
  const xs = segments.flatMap(([a, , c]) => [a, c]);
  const ys = segments.flatMap(([, b, , d]) => [b, d]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const width = (Math.max(...xs) - minX) * UNIT + BAR;
  const height = (Math.max(...ys) - minY) * UNIT + BAR;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Horizontals first, then verticals on top with a stroke in the band's
          own colour, which cuts a clean gap wherever two bars cross. */}
      {[...segments]
        .map((s, i) => [s, i] as const)
        .sort(([a], [b]) => Number(a[1] !== a[3]) - Number(b[1] !== b[3]))
        .map(([[x1, y1, x2, y2], i]) => {
        const horizontal = y1 === y2;
        const left = (Math.min(x1, x2) - minX) * UNIT;
        const top = (Math.min(y1, y2) - minY) * UNIT;
        const length = (horizontal ? Math.abs(x2 - x1) : Math.abs(y2 - y1)) * UNIT;
        return (
          <rect
            key={i}
            className="work-grid-bar"
            style={{ animationDelay: `${(i % 7) * -0.9}s` }}
            x={horizontal ? left + GAP : left}
            y={horizontal ? top : top + GAP}
            width={horizontal ? Math.max(length - GAP * 2 + BAR, BAR) : BAR}
            height={horizontal ? BAR : Math.max(length - GAP * 2 + BAR, BAR)}
            rx="2"
            fill="currentColor"
            stroke={horizontal ? undefined : "#f2f5fe"}
            strokeWidth={horizontal ? undefined : 7}
            paintOrder="stroke"
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------------ */

export function WorkWithTeam() {
  return (
    <section id="work" className="relative overflow-hidden bg-white py-16 sm:py-24">
      <Container width="wide">
        {/* Two halves side by side: a light "join" panel and a dark "why"
            panel. They stack on narrow screens. */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-0">
          {/* ---- Left half: join the team ----------------------------- */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[#f2f5fe] transition-[transform,box-shadow] duration-500 ease-out hover:z-10 hover:scale-[1.02] hover:shadow-[0_40px_80px_-36px_rgb(10_20_60/0.5)] px-6 pb-14 pt-16 shadow-[0_30px_70px_-40px_rgb(10_20_60/0.45)] sm:px-10 lg:mb-24 lg:rounded-r-none lg:px-12 lg:pb-16 lg:pt-20">
            <GridMark
              segments={LEFT_MARK}
              className="pointer-events-none absolute -left-10 top-64 hidden h-40 text-brand-500 sm:block xl:-left-6 xl:h-44"
            />
            <GridMark
              segments={RIGHT_MARK}
              className="pointer-events-none absolute -right-16 top-10 hidden h-44 text-brand-500 sm:block xl:-right-10 xl:h-52"
            />

            <Reveal>
              <div className="relative mx-auto max-w-sm text-center">
                <span className="inline-flex rounded-full bg-brand-100/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                  Work With Our Team
                </span>
                <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.1] tracking-[-0.03em] text-ink-950 xl:text-[2.75rem]">
                  Welcome to our Team!
                </h2>
                <p className="mx-auto mt-5 max-w-xs text-pretty text-sm leading-relaxed text-ink-700">
                  One team for strategy, design, engineering and support — and
                  a quick reply whenever you need us.
                </p>
                <div className="mt-7">
                  <Button to="/contact" size="md" className="px-6!">
                    <ArrowRight className="h-4 w-4 -rotate-45" />
                    Start a project
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <ul className="relative mt-10 flex flex-wrap items-center justify-center gap-2.5">
                {COUNTRIES.map(({ name, Flag }) => (
                  <li key={name}>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4 shadow-[0_10px_24px_-16px_rgb(42_88_208/0.5)]">
                      {/* Ring, because Canada's and the US's white edges would
                          otherwise bleed into the white chip behind them. */}
                      <Flag className="h-4 w-6 shrink-0 rounded-[3px] ring-1 ring-inset ring-ink-900/15" />
                      <span className="text-xs font-medium text-ink-800">{name}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Statement, then the two cards side by side. */}
            <div className="relative mt-20">
              <Reveal>
                <h3 className="text-balance text-2xl font-medium leading-[1.25] tracking-[-0.02em] text-ink-950 sm:text-3xl">
                  A partner, not just a vendor.
                </h3>
                <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-ink-600">
                  We don&rsquo;t just write code to a spec. We help you decide
                  what to build — then we build it right.
                </p>
              </Reveal>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {HOW_WE_WORK.map((point, index) => (
                  <Reveal key={point.title} delay={index * 90} className="h-full">
                    <article className="h-full rounded-xl bg-white p-6 shadow-[0_1px_2px_rgb(20_36_59/0.04),0_18px_40px_-28px_rgb(42_88_208/0.4)] transition-transform duration-300 hover:-translate-y-1">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-white">
                        <point.icon className="h-5.5 w-5.5" />
                      </span>
                      <h4 className="mt-5 text-sm font-semibold text-ink-950">{point.title}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{point.body}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* ---- Right half: why we're great to work with ------------- */}
          {/* Sits a little lower than the light half, so the two are staggered. */}
          <div className="relative rounded-[2rem] bg-[#071233] transition-[transform,box-shadow] duration-500 ease-out hover:z-10 hover:scale-[1.02] hover:shadow-[0_40px_80px_-36px_rgb(10_20_60/0.7)] px-6 pb-14 pt-16 flex flex-col text-white shadow-[0_30px_70px_-40px_rgb(10_20_60/0.6)] sm:px-10 lg:mt-24 lg:rounded-l-none lg:px-12 lg:pb-16 lg:pt-20">
            <div>
              <Reveal>
                <h3 className="text-balance text-3xl font-medium leading-[1.2] tracking-[-0.02em] xl:text-[2.25rem]">
                  Why we&rsquo;re great to work with
                </h3>
                <p className="mt-6 max-w-md text-pretty text-sm leading-relaxed text-ink-300">
                  Clear process, honest communication and engineering you can
                  rely on. Here is what every client can expect from us.
                </p>
              </Reveal>

              <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {NEVER.map((point, index) => (
                  <Reveal key={point.title} delay={index * 90} className="h-full">
                    <article className="h-full rounded-xl bg-[#18233f] p-5 transition-colors duration-300 hover:bg-[#1d2a4a]">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2e85c] text-[#0b1638]">
                        <point.icon className="h-5.5 w-5.5" />
                      </span>
                      <h4 className="mt-7 text-sm font-medium text-white">{point.title}</h4>
                      <p className="mt-2.5 text-xs leading-relaxed text-ink-300">{point.body}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Call to action, with a notched night-earth panel on the right. */}
            <Reveal delay={60} className="mt-auto pt-14">
              <div className="relative grid overflow-hidden rounded-xl bg-[#18233f] sm:grid-cols-[1.5fr_1fr]">
                <div className="p-7 sm:p-9">
                  <h3 className="text-balance text-xl font-medium leading-snug tracking-[-0.01em] sm:text-2xl">
                    Have a project in mind? Let&rsquo;s build it together with {SITE.name}.
                  </h3>
                  <div className="mt-7">
                    <Button to="/contact" size="sm" className="whitespace-nowrap px-5!">
                      <ArrowRight className="h-3.5 w-3.5 -rotate-45" />
                      Start a project
                    </Button>
                  </div>
                  <p className="mt-5 text-[0.7rem] leading-relaxed text-ink-400">
                    Your first consultation is free — tell us about your idea and
                    we will reply with next steps.
                  </p>
                </div>

                <div className="relative hidden min-h-56 sm:block">
                  <svg
                    viewBox="0 0 300 300"
                    preserveAspectRatio="xMaxYMid slice"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <defs>
                      <clipPath id="work-notch">
                        <path d="M150 0H300V300H95a30 30 0 0 1-30-30V125a30 30 0 0 1 30-30h25a30 30 0 0 0 30-30Z" />
                      </clipPath>
                      <linearGradient id="work-notch-tint" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#356ae6" stopOpacity="0.25" />
                        <stop offset="1" stopColor="#071233" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <g clipPath="url(#work-notch)">
                      <image
                        href="/images/earth/earth-night-blue.jpg"
                        x="-160"
                        y="-30"
                        width="720"
                        height="360"
                        preserveAspectRatio="xMidYMid slice"
                      />
                      <rect width="300" height="300" fill="url(#work-notch-tint)" />
                    </g>
                  </svg>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
