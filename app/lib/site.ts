/**
 * Single source of truth for brand copy and navigation.
 * Keeping this out of the components means Phase 2+ pages inherit the same
 * nav/footer without any copy drift.
 */

export const SITE = {
  name: "JRATI",
  primaryMessage: "Software that moves your business forward.",
  secondaryMessage: "Engineering and consulting, from first idea to production.",
  philosophy: "Great software starts with understanding the business behind it.",
  description:
    "JRATI is a software development and consulting company. We design, build and scale web, mobile, cloud and AI products for businesses around the world.",
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
  { label: "About Us", to: "/#mission" },
  { label: "Services", to: "/#why" },
  { label: "Features", to: "/#work" },
  { label: "Contact Us", to: "/contact" },
];

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export const FOOTER_NAV: FooterColumn[] = [
  {
    heading: "Services",
    links: [
      { label: "What We Build", to: "/#why" },
      { label: "How We Work", to: "/#how-it-works" },
      { label: "Why Work With Us", to: "/#work" },
      { label: "Dedicated Teams", to: "/#hire" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", to: "/#mission" },
      { label: "Our Values", to: "/#values" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];
