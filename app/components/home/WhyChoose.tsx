import type { ComponentType } from "react";

import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import {
  ArrowRight,
  Bolt,
  Chat,
  Compass,
  Globe,
  Handshake,
  Shield,
  Sparkle,
  Users,
} from "~/components/ui/icons";
import { SITE } from "~/lib/site";

interface Reason {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

/** What we build and advise on. No statistics or client names — add real ones when they can be published. */
const REASONS: Reason[] = [
  {
    icon: Globe,
    title: "Web Application Development",
    body: "Fast, scalable web apps, portals and SaaS platforms built on modern frameworks and clean architecture.",
  },
  {
    icon: Bolt,
    title: "Mobile App Development",
    body: "Native and cross-platform iOS and Android apps that feel fast, look great and are easy to maintain.",
  },
  {
    icon: Shield,
    title: "Cloud & DevOps",
    body: "Cloud architecture, CI/CD pipelines and infrastructure that scale reliably, securely and cost-effectively.",
  },
  {
    icon: Sparkle,
    title: "AI Agents & Automation",
    body: "AI-powered features, intelligent agents and workflow automation that save time and unlock new value.",
  },
  {
    icon: Compass,
    title: "Product & UI/UX Design",
    body: "Research-driven product design, from user flows and wireframes to polished, accessible interfaces.",
  },
  {
    icon: Chat,
    title: "Technology Consulting",
    body: "Architecture reviews, technical audits and roadmaps that help you make confident technology decisions.",
  },
];

const PILLARS: Reason[] = [
  { icon: Shield, title: "Secure & Reliable Delivery", body: "" },
  { icon: Users, title: "Dedicated Expert Team", body: "" },
  { icon: Handshake, title: "Long-Term Partnership", body: "" },
];

export function WhyChoose() {
  return (
    <section id="why" className="bg-white py-20 sm:py-28">
      <Container width="wide">
        {/* Heading */}
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600 sm:text-sm">
              <span aria-hidden="true" className="h-px w-10 bg-brand-300 sm:w-24" />
              Our Services
              <span aria-hidden="true" className="h-px w-10 bg-brand-300 sm:w-24" />
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">
              What <span className="text-brand-600">{SITE.name}</span>{" "}
              Builds for You
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-600 sm:text-xl">
              End-to-end software development and consulting, tailored to your
              goals — from a single feature to a complete platform.
            </p>

            <div className="mt-8 flex justify-center">
              <Button to="/contact" size="lg">
                Discuss Your Project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Reason cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => (
            <Reveal
              key={reason.title}
              delay={(index % 3) * 80}
              className="h-full"
            >
              <article className="flex h-full items-start gap-5 rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-lift">
                <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <reason.icon className="h-9 w-9" />
                </span>

                <div>
                  <h3 className="text-lg font-semibold leading-snug text-ink-950">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
                    {reason.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Trust strip */}
        <Reveal delay={80}>
          <div className="mt-14 flex items-center justify-center gap-6">
            <span aria-hidden="true" className="hidden h-px flex-1 bg-brand-200 lg:block" />
            <ul className="flex flex-col items-center gap-6 sm:flex-row sm:gap-0 sm:divide-x sm:divide-ink-200">
              {PILLARS.map((pillar) => (
                <li
                  key={pillar.title}
                  className="flex items-center gap-3 sm:px-8 lg:px-12"
                >
                  <pillar.icon className="h-9 w-9 shrink-0 text-brand-700" />
                  <span className="text-base font-semibold text-ink-900 sm:text-lg">
                    {pillar.title}
                  </span>
                </li>
              ))}
            </ul>
            <span aria-hidden="true" className="hidden h-px flex-1 bg-brand-200 lg:block" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
