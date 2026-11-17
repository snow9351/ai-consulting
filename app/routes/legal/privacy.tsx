import { PagePlaceholder } from "~/components/site/PagePlaceholder";
import { SITE } from "~/lib/site";

export function meta() {
  return [
    { title: `Privacy Policy | ${SITE.name}` },
    {
      name: "description",
      content:
        "How HUMNOVA will handle your personal data. The full policy is being prepared.",
    },
  ];
}

export default function PrivacyRoute() {
  return (
    <PagePlaceholder
      eyebrow="Legal"
      title="Privacy Policy"
      description="No accounts exist yet, so no personal data is collected on this site today. The full policy will be published before registration opens, and these commitments will be in it."
      planned={[
        "We will never sell your personal data",
        "You decide what on your profile is public and what is not",
        "You can export everything we hold about you",
        "You can delete your account and your data permanently",
        "Data handling will meet GDPR standards for every member, everywhere",
        "Clear disclosure of any third-party processors we rely on",
      ]}
    />
  );
}
