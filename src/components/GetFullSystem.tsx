import { SectionLabel } from "./SectionLabel";
import { SignupForm } from "./SignupForm";
import { SituationMapDownload } from "./SituationMapDownload";
import { POSITIONING_LINE, SIGNUP_ACTIVE, STORE_URLS, type StoreProduct } from "@/lib/links";

const products: { id: StoreProduct; name: string; note: string }[] = [
  { id: "manual", name: "Operating Manual", note: "The reference: every protocol in full" },
  { id: "kit", name: "Field Kit", note: "Printable cards, worksheets and the Situation Map" },
  { id: "bundle", name: "Complete Bundle", note: "Manual + Field Kit + Companion Book" },
];

/**
 * Free-app CTA (decision #3): the app stays free as the way in. This card
 * offers the Manual, Field Kit and bundle (each with its own store link when
 * one is configured), a free printable Situation Map, and the email signup
 * for anyone not ready to buy yet.
 */
export function GetFullSystem() {
  const forSale = products.filter((p) => STORE_URLS[p.id]);
  return (
    <section className="space-y-3">
      <SectionLabel>Get the full system</SectionLabel>
      <div className="card space-y-3 px-4 py-4">
        <p className="text-base leading-normal text-ink">
          This app is free, always. The Operating Manual and Field Kit — the
          deep protocols, the printable cards, the worksheets — are a
          one-time purchase. Digital PDF + HTML.
        </p>
        <p className="text-base font-medium leading-normal text-accent">{POSITIONING_LINE}</p>
        {forSale.length > 0 ? (
          <ul className="space-y-2">
            {forSale.map((p) => (
              <li key={p.id}>
                <a
                  href={STORE_URLS[p.id]!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl bg-accent px-4 py-2 text-left text-paper shadow-[0_6px_16px_-8px_rgb(44_62_45/0.7)] transition hover:brightness-110 active:scale-[0.99]"
                >
                  <span className="flex flex-col">
                    <span className="text-base font-semibold">{p.name}</span>
                    <span className="text-sm text-paper/85">{p.note} · Digital PDF + HTML</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold">
                    Buy
                    <span className="sr-only"> {p.name} (opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex min-h-12 w-full items-center justify-center rounded-xl border border-dashed border-accent/35 px-4 text-center text-base font-medium text-accent">
            {SIGNUP_ACTIVE ? "Coming soon — sign up below to hear first." : "Coming soon."}
          </p>
        )}

        <div className="border-t border-rule/35 pt-3">
          <SituationMapDownload />
        </div>

        <div className="border-t border-rule/35 pt-3">
          <SignupForm />
        </div>
      </div>
    </section>
  );
}
