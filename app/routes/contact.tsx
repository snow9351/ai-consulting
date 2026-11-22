import { useEffect, useRef, useState, type ComponentType } from "react";
import { data, useFetcher } from "react-router";

import type { Route } from "./+types/contact";
import { Container } from "~/components/ui/Container";
import { DotGlobe } from "~/components/ui/DotGlobe";
import { Reveal } from "~/components/ui/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { ArrowRight, Briefcase, Chat, Check, Shield } from "~/components/ui/icons";
import { saveContactMessage } from "~/lib/contact.server";
import { SITE } from "~/lib/site";

export function meta() {
  return [
    { title: `Contact Us | ${SITE.name}` },
    {
      name: "description",
      content: `Talk to ${SITE.name} about software development and consulting.`,
    },
  ];
}

/* ------------------------------------------------------------------------ */
/* Topics. Each one opens its own "Contact Us" form.                         */
/* ------------------------------------------------------------------------ */

type TopicId = "project" | "consulting" | "support";

interface Field {
  name: string;
  label: string;
  kind: "text" | "email" | "select" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  /** Grid columns on wide screens: 1 = half row, 2 = full row. */
  span?: 1 | 2;
}

interface Topic {
  id: TopicId;
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  /** Heading of the form this topic opens. */
  formTitle: string;
  formIntro: string;
  submit: string;
  thanks: string;
  fields: Field[];
}

const PERSON: Field[] = [
  { name: "name", label: "Full name", kind: "text", required: true, placeholder: "Your name", span: 1 },
  { name: "email", label: "Work email", kind: "email", required: true, placeholder: "you@company.com", span: 1 },
  { name: "company", label: "Company", kind: "text", placeholder: "Company name (optional)", span: 2 },
];

const TOPICS: Topic[] = [
  {
    id: "project",
    icon: Briefcase,
    title: "New projects",
    body: "Tell us about the product you want to build or the problem you need solved.",
    formTitle: "Tell us about your project",
    formIntro: "Share a few details and we will come back with questions, ideas and next steps.",
    submit: "Send project request",
    thanks: "Thanks — your project request is in. We will review it and reply with next steps.",
    fields: [
      ...PERSON,
      {
        name: "projectType",
        label: "What do you need?",
        kind: "select",
        required: true,
        options: [
          "Web application",
          "Mobile app",
          "Cloud & DevOps",
          "AI agents & automation",
          "Product & UI/UX design",
          "Something else",
        ],
        span: 1,
      },
      {
        name: "budget",
        label: "Estimated budget",
        kind: "select",
        options: ["Not sure yet", "Under $10k", "$10k – $50k", "$50k – $150k", "$150k+"],
        span: 1,
      },
      {
        name: "timeline",
        label: "Ideal timeline",
        kind: "select",
        options: ["As soon as possible", "Within 1–3 months", "Within 3–6 months", "Just exploring"],
        span: 2,
      },
      {
        name: "message",
        label: "Project details",
        kind: "textarea",
        required: true,
        placeholder: "What are you building, who is it for, and what would success look like?",
        span: 2,
      },
    ],
  },
  {
    id: "consulting",
    icon: Chat,
    title: "Technology consulting",
    body: "Architecture reviews, technical audits, and advice on your technology roadmap.",
    formTitle: "Book a consultation",
    formIntro: "Tell us where you need a second opinion, and we will set up a call with the right consultant.",
    submit: "Request consultation",
    thanks: "Thanks — your consultation request is in. We will reply to arrange a time.",
    fields: [
      ...PERSON,
      {
        name: "area",
        label: "Consulting area",
        kind: "select",
        required: true,
        options: [
          "Architecture review",
          "Technical audit",
          "Technology roadmap",
          "Cloud migration",
          "AI strategy",
          "Something else",
        ],
        span: 1,
      },
      {
        name: "stack",
        label: "Current tech stack",
        kind: "text",
        placeholder: "e.g. React, Node.js, AWS",
        span: 1,
      },
      {
        name: "message",
        label: "What do you need help with?",
        kind: "textarea",
        required: true,
        placeholder: "Describe the challenge, the decision you are facing, or the question you want answered.",
        span: 2,
      },
    ],
  },
  {
    id: "support",
    icon: Shield,
    title: "Support and partnerships",
    body: "Help for existing clients, and companies who want to partner with us.",
    formTitle: "Get support or partner with us",
    formIntro: "Existing client, or interested in working together? Tell us what you need.",
    submit: "Send message",
    thanks: "Thanks — your message is in. The right person on our team will get back to you.",
    fields: [
      ...PERSON,
      {
        name: "requestType",
        label: "Type of request",
        kind: "select",
        required: true,
        options: ["Support for an existing project", "Partnership", "Something else"],
        span: 2,
      },
      {
        name: "message",
        label: "Message",
        kind: "textarea",
        required: true,
        placeholder: "How can we help?",
        span: 2,
      },
    ],
  },
];

/* ------------------------------------------------------------------------ */
/* Server: validate and store the message.                                   */
/* ------------------------------------------------------------------------ */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = 5000;

type ActionResult =
  | { ok: true; topic: TopicId }
  | { ok: false; topic: TopicId | null; fieldErrors?: Record<string, string>; error?: string };

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const topic = TOPICS.find((candidate) => candidate.id === form.get("topic"));
  if (!topic) {
    return data<ActionResult>({ ok: false, topic: null, error: "Please choose a topic first." }, { status: 400 });
  }

  // Bots fill every field, including this hidden one; people never see it.
  if (String(form.get("website") ?? "")) return data<ActionResult>({ ok: true, topic: topic.id });

  const fields: Record<string, string> = {};
  const fieldErrors: Record<string, string> = {};
  for (const field of topic.fields) {
    const value = String(form.get(field.name) ?? "").trim().slice(0, MAX_LENGTH);
    if (field.required && !value) fieldErrors[field.name] = "This field is required.";
    else if (field.kind === "select" && value && !field.options?.includes(value)) fieldErrors[field.name] = "Choose one of the options.";
    if (value) fields[field.name] = value;
  }
  if (fields.email && !EMAIL_PATTERN.test(fields.email)) fieldErrors.email = "Enter a valid email address.";

  if (Object.keys(fieldErrors).length) {
    return data<ActionResult>({ ok: false, topic: topic.id, fieldErrors }, { status: 400 });
  }

  await saveContactMessage(topic.title, fields);
  return data<ActionResult>({ ok: true, topic: topic.id });
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */

const inputBase =
  "mt-1.5 block w-full rounded-xl border bg-white px-4 text-[0.9375rem] text-ink-900 placeholder:text-ink-400 transition-[border-color,box-shadow] focus:outline-none focus:ring-4";
const inputState = (error?: string) =>
  error
    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
    : "border-ink-200 focus:border-brand-500 focus:ring-brand-100";

function ContactForm({ topic }: { topic: Topic }) {
  const fetcher = useFetcher<ActionResult>();
  const busy = fetcher.state !== "idle";
  const result = fetcher.data && fetcher.data.topic === topic.id ? fetcher.data : undefined;
  const errors = result && !result.ok ? result.fieldErrors : undefined;
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (fetcher.state === "idle" && result?.ok) setSent(true);
  }, [fetcher.state, result]);

  if (sent) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-signal-50 text-signal-600">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-ink-900">Message sent</h3>
        <p className="mt-2 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">{topic.thanks}</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 rounded-full px-5 py-2.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <fetcher.Form method="post" noValidate className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="topic" value={topic.id} />
      {/* Honeypot for bots — hidden from people and assistive tech. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {result && !result.ok && result.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
          {result.error}
        </p>
      )}

      {topic.fields.map((field) => {
        const error = errors?.[field.name];
        const id = `${topic.id}-${field.name}`;
        return (
          <label key={field.name} htmlFor={id} className={`block ${field.span === 2 ? "sm:col-span-2" : ""}`}>
            <span className="text-sm font-semibold text-ink-800">
              {field.label}
              {field.required && <span className="text-brand-600"> *</span>}
            </span>
            {field.kind === "textarea" ? (
              <textarea
                id={id}
                name={field.name}
                rows={5}
                placeholder={field.placeholder}
                aria-invalid={Boolean(error)}
                className={`${inputBase} ${inputState(error)} py-3`}
              />
            ) : field.kind === "select" ? (
              <select
                id={id}
                name={field.name}
                defaultValue=""
                aria-invalid={Boolean(error)}
                className={`${inputBase} ${inputState(error)} h-12`}
              >
                <option value="" disabled={field.required}>
                  {field.required ? "Choose one…" : "Optional"}
                </option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                name={field.name}
                type={field.kind}
                autoComplete={field.name === "name" ? "name" : field.name === "email" ? "email" : field.name === "company" ? "organization" : undefined}
                placeholder={field.placeholder}
                aria-invalid={Boolean(error)}
                className={`${inputBase} ${inputState(error)} h-12`}
              />
            )}
            {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
          </label>
        );
      })}

      <div className="flex flex-col items-start gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-500">
          Fields marked <span className="text-brand-600">*</span> are required.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-500 px-7 font-semibold text-white shadow-[0_10px_24px_-10px_rgb(53_106_230/0.7)] transition-[background-color,transform] hover:bg-brand-600 active:translate-y-px disabled:opacity-70"
        >
          {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {busy ? "Sending…" : topic.submit}
          {!busy && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </fetcher.Form>
  );
}

export default function Contact() {
  const [selected, setSelected] = useState<TopicId | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const topic = TOPICS.find((candidate) => candidate.id === selected);

  // Bring the form into view when a topic is picked.
  useEffect(() => {
    if (selected) formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected]);

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      {/* Faint dotted Earth behind the heading and topic cards, fading out
          towards the form so it never competes with the fields. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-6 w-[42rem] max-w-[140vw] -translate-x-1/2 opacity-55"
        style={{
          maskImage: "linear-gradient(180deg, black 55%, transparent 92%)",
          WebkitMaskImage: "linear-gradient(180deg, black 55%, transparent 92%)",
        }}
      >
        <DotGlobe className="w-full" />
      </div>

      <Container width="narrow" className="relative">
        <SectionHeading
          eyebrow="Contact"
          title={`Get in touch with ${SITE.name}`}
          description="Choose what you would like to talk about, and we will show you the right form."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {TOPICS.map((item, index) => {
            const active = item.id === selected;
            return (
              <Reveal key={item.id} delay={index * 80} className="h-full">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(item.id)}
                  className={`flex h-full w-full flex-col rounded-3xl border p-6 text-left transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-1 ${
                    active
                      ? "border-brand-400 bg-brand-50/60 shadow-[0_18px_40px_-24px_rgb(42_88_208/0.6)] ring-2 ring-brand-200"
                      : "border-ink-100 bg-white shadow-card hover:border-brand-200"
                  }`}
                >
                  <span className="flex w-full items-start justify-between">
                    <span
                      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                        active ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-600"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                        active ? "border-brand-500 bg-brand-500 text-white" : "border-ink-200 text-transparent"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </span>
                  <span className="mt-5 text-base font-semibold text-ink-900">{item.title}</span>
                  <span className="mt-2 text-sm leading-relaxed text-ink-600">{item.body}</span>
                </button>
              </Reveal>
            );
          })}
        </div>

        <div ref={formRef} className="scroll-mt-28">
          {topic ? (
            <div
              key={topic.id}
              className="contact-form-in mt-10 rounded-3xl border border-ink-100 bg-ink-50 p-6 sm:p-10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Contact Us</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900">{topic.formTitle}</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{topic.formIntro}</p>
              <div className="mt-8">
                <ContactForm topic={topic} />
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
