import { PagePlaceholder } from "~/components/site/PagePlaceholder";
import { SITE } from "~/lib/site";

export function meta() {
  return [
    { title: `For Companies | ${SITE.name}` },
    {
      name: "description",
      content:
        "Hire remote talent from anywhere. Employer accounts and hiring tools are in development.",
    },
  ];
}

export default function EmployersRoute() {
  return (
    <PagePlaceholder
      phase="Phase 4"
      eyebrow="For Companies"
      title="Employer accounts are being built."
      description="Businesses, founders, and project owners will be able to post opportunities and search talent here. Employer tooling is where HUMNOVA earns its revenue — never from job seekers."
      planned={[
        "Company and project-owner profiles",
        "Post opportunities with required skills, pay, and expectations",
        "Search talent by skill, language, and timezone overlap",
        "Shortlisting, messaging, and collaboration requests",
        "Subscription and recruitment tools — the platform's revenue model",
        "Conduct standards enforced on every listing",
      ]}
    />
  );
}
