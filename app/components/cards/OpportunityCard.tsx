import { Badge } from "~/components/ui/Badge";
import { ArrowRight, Briefcase, Check, Globe } from "~/components/ui/icons";

/**
 * The shape a real opportunity has to supply.
 *
 * Declared on the component rather than in a data module, because nothing
 * populates it yet: this card is what defines the terms a listing must put on
 * the table before anyone applies. The loader that lands with Phase 3
 * (marketplace) has to satisfy it.
 */
export interface Opportunity {
  id: string;
  title: string;
  /** Generic descriptor of the poster, or a verified business name. */
  postedBy: string;
  description: string;
  skills: string[];
  countryCode: string;
  country: string;
  remote: "Fully remote" | "Remote · timezone overlap";
  /**
   * Null when a poster has not disclosed pay. The card says so plainly rather
   * than hiding the row — an applicant should never have to ask.
   */
  compensation: string | null;
  requirements: string[];
  commitment: string;
}

export interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-6 shadow-card transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-ink-200 hover:shadow-lift sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug text-ink-900">
            {opportunity.title}
          </h3>
          <p className="mt-1 text-sm text-ink-500">{opportunity.postedBy}</p>
        </div>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Briefcase className="h-5 w-5" />
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-600">
        {opportunity.description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {opportunity.skills.map((skill) => (
          <li key={skill}>
            <Badge tone="brand">{skill}</Badge>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-600">
        <span className="inline-flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-ink-400" />
          {opportunity.country} · {opportunity.remote}
        </span>
        <span className="text-ink-300" aria-hidden="true">
          |
        </span>
        <span>{opportunity.commitment}</span>
      </div>

      {/* mt-auto keeps the terms block and action pinned to the bottom, so
          cards in a row align despite different description lengths. */}
      <div className="mt-auto pt-5">
        <div className="rounded-2xl bg-ink-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
            Compensation
          </p>
          <p className="mt-1 text-[0.9375rem] font-semibold text-ink-900">
            {opportunity.compensation ?? "Not disclosed by the poster"}
          </p>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
            Requirements
          </p>
          <ul className="mt-2 space-y-1.5">
            {opportunity.requirements.map((requirement) => (
              <li
                key={requirement}
                className="flex items-start gap-2 text-sm text-ink-700"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal-500" />
                {requirement}
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-6 flex items-center justify-end">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
            Apply
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </footer>
      </div>
    </article>
  );
}
