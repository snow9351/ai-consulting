import { PagePlaceholder } from "~/components/site/PagePlaceholder";
import { SITE } from "~/lib/site";

export function meta() {
  return [
    { title: `Community Guidelines | ${SITE.name}` },
    {
      name: "description",
      content:
        "The standards everyone on JRATI agrees to. Full guidelines are being finalised.",
    },
  ];
}

export default function GuidelinesRoute() {
  return (
    <PagePlaceholder
      eyebrow="Trust & Safety"
      title="Community Guidelines"
      description="The full guidelines are being finalised with legal review before accounts open. The standards below are already settled and will not change in that process."
      planned={[
        "No one may ask a job seeker for money — no fees, deposits, or equipment payments",
        "No discrimination by nationality, gender, race, religion, age, or background",
        "Opportunities must state their real requirements, pay, and expectations",
        "No misrepresenting who you are or who you are hiring for",
        "Harassment, threats, and exploitative conditions result in removal",
        "Every profile and listing can be reported; every account can be blocked",
      ]}
    />
  );
}
