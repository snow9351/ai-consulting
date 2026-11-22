/**
 * "Flow band" under the hero: an endless, slowly scrolling strip of the
 * technologies we build with. Two rows drift in opposite directions; hovering
 * a row pauses it so a name can be read.
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
    <div className="marquee group flex overflow-hidden">
      <ul
        className={`marquee-track flex shrink-0 items-center gap-4 pr-4 ${reverse ? "marquee-reverse" : ""}`}
      >
        {loop.map(({ name, icon }, i) => (
          <li
            key={`${name}-${i}`}
            aria-hidden={i >= items.length ? true : undefined}
            className="group/chip inline-flex shrink-0 items-center gap-3 rounded-full border border-white bg-white/80 px-5 py-2.5 text-[0.9375rem] font-semibold whitespace-nowrap text-ink-800 shadow-[0_10px_24px_-18px_rgb(42_88_208/0.6)] backdrop-blur-sm transition-colors duration-300 hover:text-brand-600"
          >
            <img
              src={`/images/tech/${icon}.svg`}
              alt=""
              width={22}
              height={22}
              className="h-5.5 w-5.5 object-contain transition-transform duration-300 group-hover/chip:scale-110"
            />
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TechMarquee() {
  return (
    <section
      aria-label="Technologies we work with"
      className="relative pt-6 pb-4 sm:pt-8"
      style={{ background: "var(--mission-top)" }}
    >
      <p className="mb-6 flex items-center justify-center gap-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-brand-600">
        <span aria-hidden="true" className="h-px w-10 bg-brand-300 sm:w-24" />
        Technologies we work with
        <span aria-hidden="true" className="h-px w-10 bg-brand-300 sm:w-24" />
      </p>

      {/* Soft fade at both ends, so chips drift in and out of view. */}
      <div
        className="flex flex-col gap-4"
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
