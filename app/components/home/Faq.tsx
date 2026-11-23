import { useId, useState, type ComponentType } from "react";
import { Link } from "react-router";

import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { DotMapBackground } from "~/components/ui/DotMapBackground";
import { ArrowRight, Chat, Mail } from "~/components/ui/icons";
import { MARK_SRC } from "~/components/site/Logo";
import { FAQS } from "~/content/faq";
import { CONTACT, SITE } from "~/lib/site";
import { CollabLaptop } from "./CollabLaptop";

/** Zoom-style mark: a blue rounded square with a white video camera. */
function ZoomMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#0b5cff" />
      <rect x="6.5" y="10.5" width="13" height="11" rx="2.6" fill="#fff" />
      <path d="M20.8 14.2l4.7-3.1v9.8l-4.7-3.1Z" fill="#fff" />
    </svg>
  );
}

/** A solid handset, in the site's navy. */
function PhoneMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        fill="#16233f"
        d="M6.6 2.8c.6-.4 1.4-.3 1.9.3l2.2 2.9c.5.6.4 1.5-.1 2l-1.3 1.3c-.3.3-.3.7-.2 1 .9 1.9 2.6 3.6 4.5 4.5.3.2.7.1 1-.2l1.3-1.3c.6-.6 1.4-.6 2-.1l2.9 2.2c.6.5.7 1.3.3 1.9l-1.2 1.8c-.7 1-1.9 1.6-3.1 1.4C10.6 19.7 4.3 13.4 3.5 7.2c-.2-1.2.4-2.4 1.4-3.1Z"
      />
    </svg>
  );
}

/**
 * Ways to talk to us, shown as round badges in a pentagon: Zoom on top,
 * Phone and Google Meet either side, Slack and WhatsApp below, evenly spaced
 * on a circle that slowly turns. `angle` is each badge's starting position
 * (degrees, 0 = right, -90 = top). Video calls open the
 * consultation form, Phone dials us, and Slack/WhatsApp open the contact
 * form until those accounts are published.
 */
type Channel = {
  name: string;
  hint: string;
  href: string;
  angle: number;
  logo?: string;
  Mark?: ComponentType<{ className?: string }>;
};
const CHANNELS: Channel[] = [
  { name: "Zoom", hint: "Book a Zoom call", href: "/contact?topic=consulting", angle: -90, Mark: ZoomMark },
  { name: "Google Meet", hint: "Book a Google Meet call", href: "/contact?topic=consulting", angle: -18, logo: "googlemeet" },
  { name: "Phone", hint: `Call us on ${CONTACT.phone}`, href: CONTACT.phoneHref, angle: 198, Mark: PhoneMark },
  { name: "Slack", hint: "Work with us on Slack", href: "/contact", angle: 126, logo: "slack" },
  { name: "WhatsApp", hint: "Chat with us on WhatsApp", href: "/contact", angle: 54, logo: "whatsapp" },
];

function ChannelBadge({ channel, index }: { channel: Channel; index: number }) {
  const { name, hint, href, logo, Mark, angle } = channel;
  const radius = 36; // % of the badge area
  const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
  const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
  const className =
    "channel-badge absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand-200 bg-white text-[0.625rem] font-semibold text-ink-900 shadow-[0_8px_20px_-8px_rgb(53_106_230/0.55),0_0_0_4px_rgb(219_231_255/0.6)] transition-[border-color,box-shadow] duration-300 hover:border-brand-500 hover:shadow-[0_12px_24px_-8px_rgb(53_106_230/0.75),0_0_0_6px_rgb(219_231_255/0.9)]";
  const style = { left: `${x}%`, top: `${y}%`, animationDelay: `${900 + index * 140}ms` };
  // The ring turns; this inner part turns back the other way, so logos and
  // names stay upright.
  const content = (
    <span className="channel-upright flex flex-col items-center gap-0.5">
      {Mark ? (
        <Mark className="h-6 w-6" />
      ) : (
        <img src={`/images/tools/${logo}.svg`} alt="" width={24} height={24} className="h-6 w-6" />
      )}
      <span className="leading-none whitespace-nowrap">{name}</span>
    </span>
  );
  return (
    <li>
      {href.startsWith("/") ? (
        <Link to={href} title={hint} aria-label={hint} className={className} style={style}>
          {content}
        </Link>
      ) : (
        <a href={href} title={hint} aria-label={hint} className={className} style={style}>
          {content}
        </a>
      )}
    </li>
  );
}

/** "Still have a question?" as a speech bubble rising from the laptop. */
function ChatBubble() {
  return (
    <div className="chat-pop relative origin-bottom-left">
      <div className="rounded-[1.4rem] border border-white bg-white/95 p-4 shadow-[0_30px_60px_-28px_rgb(11_31_79/0.55)] backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-9 w-9 shrink-0">
            <img src={MARK_SRC} alt="" width={100} height={100} className="h-9 w-9" />
            <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#3ddc84]" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-semibold text-ink-900">{SITE.name} Team</p>
            <p className="text-xs text-ink-500">Online &middot; here to help</p>
          </div>
        </div>

        <div className="chat-bubble mt-3.5">
          <p className="text-base font-bold text-ink-950">Still have a question?</p>
          <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-600">
            Talk to us wherever suits you best.
          </p>
        </div>

        {/* Channels: round badges in a pentagon, with soft rings spreading
            out behind them. */}
        <div className="channel-ring relative mx-auto mt-1 aspect-square w-[92%]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {[0, 1, 2].map((ring) => (
              <span
                key={ring}
                className="channel-ripple absolute inset-[4%] rounded-full border-2 border-brand-300/70 shadow-[0_0_24px_rgb(53_106_230/0.25)]"
                style={{ animationDelay: `${ring * 1.4}s` }}
              />
            ))}
          </div>
          <ul aria-label="Ways to talk to us" className="channel-orbit absolute inset-0">
            {CHANNELS.map((channel, index) => (
              <ChannelBadge key={channel.name} channel={channel} index={index} />
            ))}
          </ul>
        </div>

        <div className="chat-bubble chat-bubble-3 mt-4 flex items-center gap-2">
          <Button to="/contact" variant="primary" size="sm" className="h-10! flex-1 justify-center gap-2.5 whitespace-nowrap hover:scale-[1.02]">
            <Chat className="h-4.5 w-4.5" />
            <span aria-hidden="true" className="h-5 w-px bg-white/50" />
            Send a message
            <ArrowRight className="h-4 w-4" />
          </Button>
          <a
            href={`mailto:${CONTACT.email}`}
            aria-label={`Email us at ${CONTACT.email}`}
            title={`Email us at ${CONTACT.email}`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-600 shadow-[0_8px_20px_-12px_rgb(53_106_230/0.7)] transition-colors duration-300 hover:border-brand-500 hover:bg-brand-500 hover:text-white"
          >
            <Mail className="h-4.5 w-4.5" />
          </a>
        </div>
      </div>

      {/* The bubble's tail, curving down towards the laptop. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 40 30"
        className="absolute -bottom-[26px] left-10 h-[30px] w-10 drop-shadow-[0_6px_6px_rgb(11_31_79/0.12)]"
      >
        <path d="M2 0h30C26 10 16 22 2 30c6-10 8-20 0-30Z" fill="#ffffff" fillOpacity="0.95" />
      </svg>
    </div>
  );
}

/** FAQPage structured data, so search engines can show the answers directly. */
const STRUCTURED_DATA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
}).replace(/</g, "\\u003c");

function Item({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  return (
    <div
      className={`rounded-3xl border bg-white transition-[border-color,box-shadow] duration-300 ${
        open
          ? "border-brand-200 shadow-[0_24px_50px_-30px_rgb(42_88_208/0.55)]"
          : "border-ink-100 hover:border-ink-200"
      }`}
    >
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="group flex w-full items-center gap-4 px-6 py-5 text-left text-[1.0625rem] font-semibold text-ink-900 sm:px-7"
        >
          <span className="flex-1 transition-colors group-hover:text-brand-600">{question}</span>
          {/* Plus that turns into a minus. */}
          <span
            aria-hidden="true"
            className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
              open ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-600 group-hover:bg-brand-100"
            }`}
          >
            <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
            <span
              className={`absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-300 ${
                open ? "scale-y-0" : "scale-y-100"
              }`}
            />
          </span>
        </button>
      </h3>

      {/* grid-rows 0fr → 1fr animates to the answer's natural height. */}
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className={`grid transition-[grid-template-rows] duration-400 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <p className="px-6 pb-6 text-[0.9375rem] leading-relaxed text-ink-600 sm:px-7">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-[#f6f9ff] py-20 sm:py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }} />

      {/* Faint dotted world map behind the whole section, fading out at the
          top and bottom edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[46rem] lg:inset-y-0 lg:h-auto"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 12%, black 82%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 12%, black 82%, transparent)",
        }}
      >
        <DotMapBackground className="h-full w-full" />
      </div>

      <Container width="wide" className="relative">
        <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
          <div className="relative">
            <Reveal>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">FAQ</p>
              <h2 className="text-balance text-3xl font-bold tracking-[-0.03em] text-ink-950 sm:text-[2.5rem] sm:leading-[1.1]">
                Questions, <span className="text-brand-500">answered.</span>
              </h2>
              <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-ink-600 lg:max-w-[18rem] xl:max-w-[21rem]">
                What clients usually ask before working with us. Don&rsquo;t see yours? Just ask.
              </p>
            </Reveal>

            {/* Speech bubble: above the laptop on small screens, in the space
                to the right of the heading on large ones. */}
            <Reveal
              delay={120}
              className="relative z-10 mt-8 ml-auto w-full max-w-[18.5rem] lg:absolute lg:top-[5.75rem] lg:right-0 lg:mt-0 lg:w-[17.5rem]"
            >
              <ChatBubble />
            </Reveal>

            {/* The 3D laptop, with VS Code on screen. */}
            <Reveal delay={80} className="relative mt-4 lg:mt-[18rem]">
              <div className="pointer-events-none lg:-ml-6">
                <CollabLaptop className="w-full" />
              </div>
            </Reveal>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <Reveal key={faq.question} delay={Math.min(index, 4) * 50}>
                <Item
                  question={faq.question}
                  answer={faq.answer}
                  open={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
