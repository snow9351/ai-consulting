import type { Route } from "./+types/home";
import { Hero } from "~/components/home/Hero";
import { TechMarquee } from "~/components/home/TechMarquee";
import { ContactPrompt } from "~/components/site/ContactPrompt";
import { Mission } from "~/components/home/Mission";
import { HowItWorks } from "~/components/home/HowItWorks";
import { WhyChoose } from "~/components/home/WhyChoose";
import { WorkWithTeam } from "~/components/home/WorkWithTeam";
import { ForEmployers } from "~/components/home/ForEmployers";
import { Values } from "~/components/home/Values";
import { FinalCta } from "~/components/home/FinalCta";
import { SITE } from "~/lib/site";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `${SITE.name} — ${SITE.primaryMessage}` },
    { name: "description", content: SITE.description },
    { property: "og:title", content: `${SITE.name} — ${SITE.primaryMessage}` },
    { property: "og:description", content: SITE.description },
    { property: "og:type", content: "website" },
  ];
}

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <Mission />
      <HowItWorks />
      <WhyChoose />
      <WorkWithTeam />
      <ForEmployers />
      <Values />
      <FinalCta />
      <ContactPrompt />
    </>
  );
}
