/**
 * Frequently asked questions, shown in the FAQ section on the home page and
 * published to search engines as FAQPage structured data.
 *
 * Keep answers short, plain and true: every sentence here is a promise.
 */

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "What does JRATI do?",
    answer:
      "We are a software development and consulting company. We design, build and scale web applications, mobile apps, cloud infrastructure and AI agents and automation, and we offer product and UI/UX design and technology consulting.",
  },
  {
    question: "How does a project get started?",
    answer:
      "It starts with a free consultation. We learn about your business, your goals and any existing systems, then send you a clear proposal with scope, timeline and cost, so you know exactly what you will get before any work begins.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "It depends on what you need. After the consultation you receive a transparent, fixed-scope estimate. There are no hidden fees, and if the scope changes along the way, we agree on it with you before doing the extra work.",
  },
  {
    question: "How long will it take?",
    answer:
      "Timelines depend on scope. Your proposal breaks the work into milestones with dates, and we share working versions as we go, so you can see progress and give feedback early instead of waiting for one big reveal.",
  },
  {
    question: "Can you work with our existing team or codebase?",
    answer:
      "Yes. We can take over or extend an existing product, or provide a dedicated development team that works alongside your in-house engineers, using your tools and processes.",
  },
  {
    question: "Do you work with clients in other countries and time zones?",
    answer:
      "Yes. We work with businesses around the world and plan meetings and hand-offs around your working hours, so communication stays easy wherever you are.",
  },
  {
    question: "Who owns the code and designs?",
    answer:
      "You do. Once the work is paid for, the source code, designs and documentation we create for your project belong to you.",
  },
  {
    question: "How do you keep our data and ideas secure?",
    answer:
      "Security is built into how we work: limited access to your systems, code reviews and testing before every release, and we are happy to sign an NDA before you share any details.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We stay with you. We monitor, fix and improve what we build, and help it grow as your business does, through ongoing support or a dedicated team.",
  },
];
