import { useEffect, useRef } from "react";

/**
 * "Flow band" under the hero: an endless, slowly scrolling strip of the
 * technologies we build with. Two rows drift in opposite directions and never
 * stop. Whichever chip is under the mouse lifts, with its neighbours rising a
 * little less; as the row flows on, the lift passes from chip to chip.
 *
 * The band sits on --mission-top, the colour the hero's bottom wave ends in
 * and the About section starts with, so it joins both without a seam.
 * Edit the two lists below to change what scrolls past. Each logo is an SVG
 * in public/images/tech (sources and licences in CREDITS.md there).
 */

interface Tech {
  name: string;
  /** File name (without .svg) in public/images/tech. */
  icon: string;
}

const ROW_ONE: Tech[] = [
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Node.js", icon: "nodejs" },
  { name: "Python", icon: "python" },
  { name: "Django", icon: "django" },
  { name: ".NET", icon: "dotnet" },
  { name: "Java", icon: "java" },
  { name: "Go", icon: "go" },
  { name: "GraphQL", icon: "graphql" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "MongoDB", icon: "mongodb" },
];

const ROW_TWO: Tech[] = [
  { name: "AWS", icon: "aws" },
  { name: "Microsoft Azure", icon: "azure" },
  { name: "Google Cloud", icon: "googlecloud" },
  { name: "Docker", icon: "docker" },
  { name: "Kubernetes", icon: "kubernetes" },
  { name: "Terraform", icon: "terraform" },
  { name: "Flutter", icon: "flutter" },
  { name: "React Native", icon: "react" },
  { name: "Swift", icon: "swift" },
  { name: "Kotlin", icon: "kotlin" },
  { name: "OpenAI", icon: "openai" },
  { name: "LangChain", icon: "langchain" },
];

function Row({ items, reverse = false }: { items: Tech[]; reverse?: boolean }) {
  // Rendered twice back to back; the track slides by exactly one copy's
  // width, so the loop has no visible jump.
  const loop = [...items, ...items];
  return (
    // Vertical padding leaves room for a lifted chip to rise and grow
    // (see .tech-chip in app.css) without being clipped.
    <div className="marquee flex overflow-hidden pt-3.5 pb-1.5">
      <ul
        className={`marquee-track flex shrink-0 items-center gap-4 pr-4 ${reverse ? "marquee-reverse" : ""}`}
      >
        {loop.map(({ name, icon }, i) => (
          <li
            key={`${name}-${i}`}
            aria-hidden={i >= items.length ? true : undefined}
            className="tech-chip group/chip inline-flex shrink-0 items-center gap-3 rounded-full border border-white bg-white/80 px-5 py-2.5 text-[0.9375rem] font-semibold whitespace-nowrap text-ink-800 shadow-[0_10px_24px_-18px_rgb(42_88_208/0.6)] backdrop-blur-sm [&.is-hot]:text-brand-600 [&.is-hot]:shadow-[0_18px_30px_-16px_rgb(42_88_208/0.7)]"
          >
            <img
              src={`/images/tech/${icon}.svg`}
              alt=""
              width={22}
              height={22}
              className="h-5.5 w-5.5 object-contain"
            />
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Marks the chip under the pointer with .is-hot, every frame while the
 * pointer is over the band. CSS :hover is not enough here: browsers do not
 * reliably update it when elements slide under a still mouse.
 *
 * Hit-testing uses each row's box for y and the chips' x positions only, so a
 * chip lifting out from under the cursor does not make it flicker.
 */
function useFlowHover() {
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    let pointer: { x: number; y: number } | null = null;
    let hot: Element | null = null;
    let frame = 0;

    const setHot = (chip: Element | null) => {
      if (chip === hot) return;
      hot?.classList.remove("is-hot");
      chip?.classList.add("is-hot");
      hot = chip;
    };

    const update = () => {
      frame = 0;
      if (!pointer) return setHot(null);
      const { x, y } = pointer;
      let found: Element | null = null;
      for (const row of band.querySelectorAll(".marquee")) {
        const box = row.getBoundingClientRect();
        if (y < box.top || y > box.bottom) continue;
        let best = Infinity;
        for (const chip of row.querySelectorAll(".tech-chip")) {
          const r = chip.getBoundingClientRect();
          if (x < r.left - 8 || x > r.right + 8) continue;
          const distance = Math.abs(x - (r.left + r.right) / 2);
          if (distance < best) {
            best = distance;
            found = chip;
          }
        }
      }
      setHot(found);
      frame = requestAnimationFrame(update);
    };

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      pointer = null;
      cancelAnimationFrame(frame);
      frame = 0;
      setHot(null);
    };

    band.addEventListener("pointermove", onMove);
    band.addEventListener("pointerleave", onLeave);
    return () => {
      band.removeEventListener("pointermove", onMove);
      band.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return bandRef;
}

export function TechMarquee() {
  const bandRef = useFlowHover();
  return (
    <section
      aria-label="Technologies we work with"
      className="relative bg-(--mission-top) pt-6 pb-4 sm:pt-8 lg:pt-4"
    >
      {/* Soft fade at both ends, so chips drift in and out of view. */}
      <div
        ref={bandRef}
        className="flex flex-col"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <Row items={ROW_ONE} />
        <Row items={ROW_TWO} reverse />
      </div>
    </section>
  );
}
