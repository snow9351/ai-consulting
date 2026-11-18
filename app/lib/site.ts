/**
 * Single source of truth for brand copy and navigation.
 * Keeping this out of the components means Phase 2+ pages inherit the same
 * nav/footer without any copy drift.
 */

export const SITE = {
  name: "HUMNOVA",
  /** What the name is built from. Surfaced in the footer, under the logo. */
  // nameOrigin: "",
  primaryMessage: "Opportunity has no borders.",
  secondaryMessage: "Your financial situation should never define your future.",
  philosophy: "Human beings create money. Money should serve human beings.",
  description:
    "HUMNOVA connects talented people with remote work and international opportunities. Free for job seekers — always.",
} as const;

export interface NavLink {
  label: string;
  to: string;
  /** Marks routes whose full experience lands in a later phase. */
  upcoming?: boolean;
}

/**
 * Set this to a real inbox and the contact page becomes a working mailto
 * link. Null is deliberate: publishing an address nobody reads is worse than
 * saying plainly that the channel is not open yet.
 */
export const CONTACT_EMAIL: string | null = null;

export const PRIMARY_NAV: NavLink[] = [
  { label: "Find Opportunities", to: "/opportunities", upcoming: true },
  { label: "For Companies", to: "/employers", upcoming: true },
  { label: "Why HUMNOVA", to: "/#why" },
  { label: "Our Mission", to: "/#mission" },
  { label: "How It Works", to: "/#how-it-works" },
];

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export const FOOTER_NAV: FooterColumn[] = [
  {
    heading: "Platform",
    links: [
      { label: "Find Opportunities", to: "/opportunities", upcoming: true },
      { label: "For Employers", to: "/employers", upcoming: true },
      { label: "Why HUMNOVA", to: "/#why" },
      { label: "How It Works", to: "/#how-it-works" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", to: "/#mission" },
      { label: "Our Mission", to: "/#mission" },
      { label: "Our Values", to: "/#values" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Trust & Safety",
    links: [
      { label: "Community Guidelines", to: "/guidelines" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];
