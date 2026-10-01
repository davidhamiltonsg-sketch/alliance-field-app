import { SectionLabel } from "./SectionLabel";
import { SignupForm } from "./SignupForm";
import { SituationMapDownload } from "./SituationMapDownload";
import { FULL_SYSTEM_URL, POSITIONING_LINE } from "@/lib/links";

/**
 * Free-app CTA (decision #3): the app stays free as the way in. This card
 * offers the full Manual + Field Kit purchase, a free printable Situation
 * Map, and an email signup for anyone not ready to buy yet.
 */
export function GetFullSystem() {
  return (
    <section className="space-y-3">
      <SectionLabel>Get the full system</SectionLabel>
      <div className="card space-y-3 px-4 py-4">
        <p className="text-base leading-normal text-ink">
          This app is free, always. The Operating Manual and Field Kit — the
          deep protocols, the printable cards, the worksheets — are a
          one-time purchase.
        </p>
        <p className="text-base font-medium leading-normal text-accent">{POSITIONING_LINE}</p>
        {FULL_SYSTEM_URL ? (
          <a
            href={FULL_SYSTEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-base font-semibold text-paper shadow-[0_6px_16px_-8px_rgb(61_90_76/0.7)] transition hover:bg-[#35503f] active:scale-[0.99]"
          >
            Get the full system
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <p className="flex min-h-12 w-full items-center justify-center rounded-xl border border-dashed border-accent/35 px-4 text-base font-medium text-accent">
            Coming soon — sign up below to hear first.
          </p>
        )}

        <div className="border-t border-rule/[0.08] pt-3">
          <SituationMapDownload />
        </div>

        <div className="border-t border-rule/[0.08] pt-3">
          <SignupForm />
        </div>
      </div>
    </section>
  );
}
