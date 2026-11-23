import { useEffect, useState } from "react";
import { Link } from "react-router";

import { ArrowRight, Briefcase, Chat, Close, Mail, Phone, Shield } from "~/components/ui/icons";
import { CONTACT, SITE } from "~/lib/site";
import { MARK_SRC } from "./Logo";

/**
 * A small "Contact us" card that slides in at the bottom-right once the
 * visitor scrolls down to the section with id TRIGGER_ID.
 *
 * Deliberately not a blocking modal: the page stays readable and usable
 * behind it, it never takes focus, and it closes with the X or Esc. Once
 * closed (or used), it stays away for SNOOZE_DAYS on that browser.
 */

const TRIGGER_ID = "how-it-works";
const SNOOZE_DAYS = 7;
const STORAGE_KEY = "jrati:contact-prompt-closed-at";

const OPTIONS = [
  { topic: "project", label: "Start a project", Icon: Briefcase },
  { topic: "consulting", label: "Book a free consultation", Icon: Chat },
  { topic: "support", label: "Get support", Icon: Shield },
] as const;

function recentlyClosed() {
  try {
    const closedAt = Number(localStorage.getItem(STORAGE_KEY));
    return closedAt > 0 && Date.now() - closedAt < SNOOZE_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function rememberClosed() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Storage blocked (private mode etc.): the card simply may show again.
  }
}

export function ContactPrompt() {
  const [open, setOpen] = useState(false);
  // Kept mounted after closing so the slide-out can play.
  const [mounted, setMounted] = useState(false);

  // Watch for the trigger section reaching the middle of the screen.
  useEffect(() => {
    if (recentlyClosed()) return;
    const target = document.getElementById(TRIGGER_ID);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setMounted(true);
        // Next frame, so the entering transition starts from the hidden state.
        requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
      },
      { rootMargin: "0px 0px -45% 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const close = () => {
    rememberClosed();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!mounted) return null;

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="contact-prompt-title"
      aria-hidden={!open}
      inert={!open}
      onTransitionEnd={(event) => {
        if (!open && event.target === event.currentTarget) setMounted(false);
      }}
      className={`fixed right-4 bottom-4 z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-white bg-white/95 shadow-[0_30px_70px_-25px_rgb(11_31_79/0.55)] backdrop-blur-md transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:right-6 sm:bottom-6 ${
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
      }`}
    >
      {/* Brand strip along the top edge. */}
      <div aria-hidden="true" className="h-1.5 bg-[linear-gradient(90deg,#2a58d0,#5b8cff,#8fb3ff)]" />

      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
      >
        <Close className="h-4.5 w-4.5" />
      </button>

      <div className="p-6 pt-5">
        <div className="flex items-center gap-2.5">
          <img src={MARK_SRC} alt="" width={256} height={256} className="h-8 w-8" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Contact Us</p>
        </div>

        <h2
          id="contact-prompt-title"
          className="mt-4 pr-6 text-xl font-bold tracking-[-0.02em] text-ink-950"
        >
          Have a project in mind?
        </h2>
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">
          Tell {SITE.name} what you are building. Your first consultation is free.
        </p>

        <ul className="mt-5 space-y-2">
          {OPTIONS.map(({ topic, label, Icon }) => (
            <li key={topic}>
              <Link
                to={`/contact?topic=${topic}`}
                onClick={close}
                className="group flex items-center gap-3 rounded-2xl border border-ink-100 bg-white px-4 py-3 text-[0.9375rem] font-semibold text-ink-800 transition-[border-color,background-color,color,translate] duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                {label}
                <ArrowRight className="ml-auto h-4 w-4 text-ink-400 transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:text-brand-600" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink-100 pt-4 text-sm font-medium text-ink-600">
          <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-brand-600">
            <Mail className="h-4 w-4 text-brand-600" />
            {CONTACT.email}
          </a>
          <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-brand-600">
            <Phone className="h-4 w-4 text-brand-600" />
            {CONTACT.phone}
          </a>
        </div>
      </div>
    </aside>
  );
}
