import { SectionLabel } from "./SectionLabel";
import { SignupForm } from "./SignupForm";
import { CompanionSampleDownload } from "./CompanionSampleDownload";
import { SituationMapDownload } from "./SituationMapDownload";
import { POSITIONING_LINE, SIGNUP_ACTIVE, STORE_URLS, type StoreProduct } from "@/lib/links";

type Product = { id: StoreProduct; name: string; price: string; note: string; format: string; sub?: boolean };

/** Order: Kit, Volume A, Volume B, then the Complete Edition as an "in one file" option under the volumes, then the Bundle. */
const products: Product[] = [
  { id: "kit", name: "Field Kit", price: "US$24", note: "Printable cards, worksheets and the Situation Map. US$24.", format: "PDF + print-ready files" },
  { id: "volumeA", name: "Volume A: The Architecture of Staying", price: "US$14", note: "The stories behind the tools, and the book to hand a sceptical partner. US$14.", format: "PDF + HTML" },
  { id: "manual", name: "Volume B: Operating Manual", price: "US$44", note: "Every tool in full, for when you want the steps. US$44.", format: "PDF + HTML" },
  { id: "complete", name: "Complete Edition", price: "US$52", note: "Volume A and Volume B together. US$52.", format: "PDF", sub: true },
  { id: "bundle", name: "Complete Bundle", price: "US$69", note: "The Kit, the Complete Edition, and Volume A and Volume B as separate files. US$13 less than the Kit, Volume A and Volume B bought separately. US$69.", format: "PDF + HTML + print-ready files" },
];

const BUY_FIRST = [
  "Start with the free app.",
  "The Kit for the fridge; Volume A if your partner is sceptical.",
  "The Bundle for everything.",
];

/**
 * Free-app CTA (decision #3): the app stays free as the way in. This card
 * offers Volume A, Volume B, the Complete Edition, the Field Kit and the bundle (each with its own store link when
 * one is configured), a free printable Situation Map, and the email signup
 * for anyone not ready to buy yet.
 */
export function GetFullSystem() {
  const forSale = products.filter((p) => STORE_URLS[p.id]);
  const linked = new Set(forSale.map((p) => p.id));
  return (
    <section className="space-y-3">
      <SectionLabel>The books, if you want more.</SectionLabel>
      <div className="card space-y-3 px-4 py-4">
        <p className="text-base leading-normal text-ink">
          The app is free. The books go further. Pay once; digital files.
        </p>
        <div className="space-y-1 rounded-xl bg-surface-tool px-4 py-3">
          <p className="text-base font-semibold text-accent">Which one first?</p>
          <ol className="list-decimal space-y-0.5 pl-5 text-base leading-normal text-ink">
            {BUY_FIRST.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ol>
        </div>
        <p className="text-base font-medium leading-normal text-accent">{POSITIONING_LINE}</p>
        {forSale.length === 0 && (
          <p className="flex min-h-12 w-full items-center justify-center rounded-xl border border-dashed border-accent/35 px-4 text-center text-base font-medium text-accent">
            {SIGNUP_ACTIVE
              ? "The books aren’t on sale yet; leave your email and we’ll tell you when they are."
              : "The books aren’t on sale yet."}
          </p>
        )}
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p.id} className={p.sub ? "ml-5" : undefined}>
              {linked.has(p.id) ? (
                <a
                  href={STORE_URLS[p.id]!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl bg-accent px-4 py-2 text-left text-paper shadow-[0_6px_16px_-8px_rgb(44_62_45/0.7)] transition hover:brightness-110 active:scale-[0.99]"
                >
                  <span className="flex flex-col">
                    <span className="text-base font-semibold">{p.name}</span>
                    <span className="text-sm text-paper/90">{p.sub ? "In one file: " : ""}{p.note}</span>
                    <span className="text-sm font-medium text-paper/90">{p.format}</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold">
                    Buy
                    <span className="sr-only"> {p.name} (opens in a new tab)</span>
                  </span>
                </a>
              ) : (
                <div className="flex min-h-12 w-full flex-col justify-center rounded-xl border border-rule/60 px-4 py-2">
                  <span className="text-base font-semibold text-ink">{p.name}</span>
                  <span className="text-sm text-ink-muted">{p.sub ? "In one file: " : ""}{p.note}</span>
                  <span className="text-sm font-medium text-ink">{p.format}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
        <p className="text-sm text-ink-muted">Prices in US dollars. Prices may exclude VAT/GST.</p>

        <div className="border-t border-rule/35 pt-3">
          <SituationMapDownload />
        </div>

        <div className="border-t border-rule/35 pt-3">
          <CompanionSampleDownload />
        </div>

        <div className="border-t border-rule/35 pt-3">
          <SignupForm />
        </div>
      </div>
    </section>
  );
}
