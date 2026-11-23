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

/** Public contact channels, shown in the footer. */
export const CONTACT = {
  email: "hello@jrati.tech",
  phone: "+1 (770) 769-5194",
  /** The phone number in tel: form (digits only, with country code). */
  phoneHref: "tel:+17707695194",
  linkedin: "https://www.linkedin.com/company/jrati/",
} as const;

export const PRIMARY_NAV: NavLink[] = [
  { label: "About Us", to: "/#mission" },
  { label: "Services", to: "/#why" },
  { label: "Features", to: "/#work" },
  { label: "FAQ", to: "/#faq" },
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
      { label: "FAQ", to: "/#faq" },
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
