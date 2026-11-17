import { PagePlaceholder } from "~/components/site/PagePlaceholder";
import { SITE } from "~/lib/site";

export function meta() {
  return [
    { title: `Find Opportunities | ${SITE.name}` },
    {
      name: "description",
      content: `Open positions on ${SITE.name} projects. Free to apply, with the terms stated upfront.`,
    },
  ];
}

export default function OpportunitiesRoute() {
  return (
    <PagePlaceholder
      phase="Phase 3"
      eyebrow="Find Opportunities"
      title="Open positions are not posted yet."
      description={`${SITE.name} is a senior software team, and the work on offer comes from the projects we are building. When places open, they appear here with the terms stated before you spend any time applying.`}
      planned={[
        "Open positions on our own projects, with compensation stated upfront",
        "Requirements in full, so you know before you apply",
        "Free to apply — no fee at any stage, for anyone",
        "A reply from the engineers you would actually work with",
        "A clear no rather than silence",
        "One-tap reporting for anyone impersonating us to ask for money",
      ]}
    />
  );
}
