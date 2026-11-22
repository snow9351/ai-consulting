/**
 * Mission copy. Real content — not placeholder — and the single place to edit
 * the values and process wording so the homepage, employer pages, and future
 * mission page never drift apart.
 */

export interface Step {
  number: string;
  title: string;
  description: string;
  icon: "userPlus" | "code" | "briefcase" | "growth";
}

export const STEPS: Step[] = [
  {
    number: "01",
    title: "Discover & consult",
    description:
      "We start with a free consultation to understand your goals, users and constraints, then turn them into a clear scope and plan.",
    icon: "userPlus",
  },
  {
    number: "02",
    title: "Design & build",
    description:
      "Our designers and engineers build your product in short iterations, so you see working software early and often.",
    icon: "code",
  },
  {
    number: "03",
    title: "Test & launch",
    description:
      "Every release is reviewed, tested and deployed with care, so launch day is calm and predictable.",
    icon: "briefcase",
  },
  {
    number: "04",
    title: "Support & scale",
    description:
      "After launch we monitor, maintain and improve your product as your users and your business grow.",
    icon: "growth",
  },
];

export interface Value {
  title: string;
  description: string;
  icon: "scale" | "globe" | "shield" | "handshake" | "users" | "check";
}

export const VALUES: Value[] = [
  {
    title: "Quality without shortcuts",
    description:
      "Clean code, code review and automated tests are part of every project — never optional extras.",
    icon: "scale",
  },
  {
    title: "Global by default",
    description:
      "Our team works across time zones, so your project keeps moving and your questions get answered fast.",
    icon: "globe",
  },
  {
    title: "Security first",
    description:
      "We design for security, privacy and reliability from the first line of code, not as an afterthought.",
    icon: "shield",
  },
  {
    title: "Partnership, not just delivery",
    description:
      "We treat your goals as our own, and we stay with you long after the first release.",
    icon: "handshake",
  },
  {
    title: "People who own their work",
    description:
      "Experienced engineers, designers and consultants who communicate clearly and take responsibility for results.",
    icon: "users",
  },
  {
    title: "Transparent from day one",
    description:
      "Clear estimates, honest timelines and regular updates — no surprises on scope or cost.",
    icon: "check",
  },
];

/** Short promises shown under the hero buttons. */
export const COMMITMENTS: string[] = [
  "Free initial consultation",
  "Transparent, fixed-scope estimates",
  "Delivery across every time zone",
];
