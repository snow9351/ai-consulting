import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { ArrowRight } from "~/components/ui/icons";

export function FinalCta() {
  return (
    <section className="bg-white pb-20 sm:pb-28">
      <Container width="wide">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl bg-ink-900 px-6 py-16 text-center sm:px-12 sm:py-20">
            {/* Concentric rings — the globe motif, abstracted. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2"
            >
              <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
              <div className="absolute inset-[14%] rounded-full border border-white/[0.07]" />
              <div className="absolute inset-[28%] rounded-full border border-white/[0.08]" />
              <div className="absolute inset-[42%] rounded-full bg-brand-500/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem]">
                Your Potential Deserves an Opportunity.
              </h2>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-ink-300">
                Wherever you live. Whatever your financial situation. Your next
                opportunity can begin here.
              </p>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button to="/join" variant="inverse" size="lg">
                  Join HUMNOVA for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button to="/employers" size="lg" variant="ghostDark">
                  I&rsquo;m hiring
                </Button>
              </div>

              <p className="mt-8 text-sm text-ink-400">
                Free to join. Free to apply. No fee at any stage, for any job
                seeker.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
