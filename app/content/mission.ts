/**
 * Mission copy. Real content — not placeholder — and the single place to edit
 * the values and process wording so the homepage, employer pages, and future
 * mission page never drift apart.
 */

export interface Step {
  number: string;
  title: string;
  description: string;
  icon: "userPlus" | "sparkle" | "globe" | "handshake";
}

export const STEPS: Step[] = [
  {
    number: "01",
    title: "Join for free",
    description:
      "Create an account with an email address. No fee, no membership tier, no payment details.",
    icon: "userPlus",
  },
  {
    number: "02",
    title: "Build your profile",
    description:
      "Describe your skills, languages, availability, and what you want to work on. Experience counts, a diploma is not required.",
    icon: "sparkle",
  },
  {
    number: "03",
    title: "Discover opportunities",
    description:
      "Browse remote roles and projects from people and businesses in other countries, with requirements stated upfront.",
    icon: "globe",
  },
  {
    number: "04",
    title: "Connect and grow",
    description:
      "Apply, message directly, and build a track record that travels with you to the next opportunity.",
    icon: "handshake",
  },
];

export interface Value {
  title: string;
  description: string;
  icon: "scale" | "globe" | "shield" | "handshake" | "users" | "check";
}

export const VALUES: Value[] = [
  {
    title: "Humanity before money",
    description:
      "Human beings create money. Money should serve human beings — never the other way around.",
    icon: "scale",
  },
  {
    title: "Equal opportunity",
    description:
      "Nationality, gender, race, and background are not qualifications, and they are not disqualifications either.",
    icon: "globe",
  },
  {
    title: "No financial barriers to job seeking",
    description:
      "Job seekers never pay to join, to build a profile, or to apply. That is a permanent commitment, not an introductory offer.",
    icon: "shield",
  },
  {
    title: "Respect across borders",
    description:
      "Distance is not a licence for lower standards. Everyone on this platform is treated as a professional.",
    icon: "handshake",
  },
  {
    title: "Talent over background",
    description:
      "People are evaluated on skills, character, motivation, and potential — not on where they were born or what they have.",
    icon: "users",
  },
  {
    title: "Fair and transparent work",
    description:
      "Requirements, compensation, and expectations are stated plainly before anyone invests their time.",
    icon: "check",
  },
];

/** Promises we hold ourselves to. Shown on the hero and the join page. */
export const COMMITMENTS: string[] = [
  "Free for job seekers — forever",
  "No upfront payments, ever",
  "Open to every nationality",
];
