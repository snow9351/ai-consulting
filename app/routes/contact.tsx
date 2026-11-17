import type { ComponentType } from "react";

import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { ArrowRight, Briefcase, Chat, Shield } from "~/components/ui/icons";
import { CONTACT_EMAIL, SITE } from "~/lib/site";

export function meta() {
  return [
    { title: `Contact | ${SITE.name}` },
    {
      name: "description",
      content: `How to reach ${SITE.name} before the platform opens.`,
    },
  ];
}

interface Channel {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

const CHANNELS: Channel[] = [
  {
    icon: Chat,
    title: "General questions",
    body: "Anything about the mission, the launch timeline, or how the platform will work.",
  },
  {
    icon: Briefcase,
    title: "Employers and partners",
    body: "Businesses who want to post opportunities, and organisations who want to work with us.",
  },
  {
    icon: Shield,
    title: "Trust and safety",
    body: "Report a listing that asks for money, or anything that looks like it targets people looking for work.",
  },
];

export default function Contact() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container width="narrow">
        <SectionHeading
          eyebrow="Contact"
          title={`Get in touch with ${SITE.name}`}
          description={
            CONTACT_EMAIL
              ? "We read everything. Before launch we are a small team, so a reply may take a few days."
              : "What we want to hear about, and when you will be able to send it."
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {CHANNELS.map((channel, index) => (
            <Reveal key={channel.title} delay={index * 80} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-6 shadow-card">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <channel.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-base font-semibold text-ink-900">
                  {channel.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {channel.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 rounded-3xl border border-ink-100 bg-ink-50 p-7 text-center sm:p-10">
            {/*
              No contact form here, and that is deliberate. A form with no
              backend takes someone's message and silently discards it — worse
              than no form at all, and worst for the people this platform is
              for. It goes in when there is an inbox behind it.
            */}
            {CONTACT_EMAIL ? (
              <>
                <h2 className="text-xl font-semibold text-ink-900">
                  Email us directly
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-600">
                  One address for now, read by the people building {SITE.name}.
                </p>
                <div className="mt-7 flex justify-center">
                  <Button href={`mailto:${CONTACT_EMAIL}`} size="lg">
                    {CONTACT_EMAIL}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-ink-900">
                  The contact channel is not open yet
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-600">
                  Rather than publish an address nobody is watching, or a form
                  that quietly throws your message away, we would rather tell
                  you straight: there is nowhere to send it today. This page
                  becomes a real inbox before the platform opens.
                </p>
                <div className="mt-7 flex justify-center">
                  <Button to="/join" variant="secondary" size="lg">
                    What joining will involve
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
