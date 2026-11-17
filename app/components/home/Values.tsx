import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import {
  Check,
  Globe,
  Handshake,
  Scale,
  Shield,
  Users,
} from "~/components/ui/icons";
import { VALUES } from "~/content/mission";

const ICONS = {
  scale: Scale,
  globe: Globe,
  shield: Shield,
  handshake: Handshake,
  users: Users,
  check: Check,
} as const;

export function Values() {
  return (
    <section id="values" className="bg-white py-20 sm:py-28">
      <Container width="wide">
        <SectionHeading
          eyebrow="Our Values"
          title="The principles we will not trade away."
          description="These are the commitments that decide what we build, who we let in, and how we make money."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value, index) => {
            const Icon = ICONS[value.icon];

            return (
              <Reveal
                key={value.title}
                delay={(index % 3) * 80}
                className="h-full"
              >
                <div className="flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-7 transition-[border-color,box-shadow] duration-300 hover:border-ink-200 hover:shadow-card">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-ink-900">
                    {value.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-600">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
