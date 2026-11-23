import { PagePlaceholder } from "~/components/site/PagePlaceholder";
import { SITE } from "~/lib/site";

export function meta() {
  return [
    { title: `Terms of Service | ${SITE.name}` },
    {
      name: "description",
      content:
        "The terms that will govern use of JRA. The full terms are being prepared.",
    },
  ];
}

export default function TermsRoute() {
  return (
    <PagePlaceholder
      eyebrow="Legal"
      title="Terms of Service"
      description="The full terms will be published before accounts open. They are being drafted around the points below, which are not up for negotiation."
      planned={[
        "JRA is a discovery platform, not an employer or a recruiter",
        "We do not guarantee employment, selection, or any level of income",
        "Job seekers are never charged — the platform is funded by employers",
        "Accounts that demand payment from job seekers are removed",
        "You keep ownership of the work and the content you post",
        "Clear, plain-language dispute and appeal process",
      ]}
    />
  );
}
