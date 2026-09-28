import Link from "next/link";
import { AllianceMark } from "@/components/AllianceMark";
import { Marker } from "@/components/Marker";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, ChevronRight } from "@/components/icons";

export const metadata = { title: "About" };

const products = [
  {
    name: "Operating Manual",
    tag: "Manual",
    body: "Depth, theory, Full Recovery, decks.",
  },
  {
    name: "Field Kit",
    tag: "Kit",
    body: "Cards, worksheets, Situation Map — the source for this app.",
  },
  {
    name: "Complete Bundle",
    tag: "Bundle",
    body: "Manual and Kit together, with this Field App as the pocket companion.",
  },
];

/** Miniature of the store covers: accent field, mark, tracked label. */
function CoverThumb({ tag }: { tag: string }) {
  return (
    <span
      className="relative flex h-[79px] w-14 shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md bg-accent text-paper shadow-[0_2px_6px_rgb(26_26_26/0.18)]"
      aria-hidden
    >
      <span className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgb(255_255_255/0.16),transparent_70%)]" />
      <AllianceMark size={24} className="relative" />
      <span className="relative h-px w-7 bg-paper/35" />
      <span className="relative text-[6.5px] font-medium uppercase tracking-[0.08em] pl-[0.08em]">
        {tag}
      </span>
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-accent px-5 pb-6 pt-7 text-center text-paper shadow-[var(--shadow-lift)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,rgb(255_255_255/0.14),transparent_60%)]"
          aria-hidden
        />
        <div className="relative flex flex-col items-center">
          <AllianceMark size={76} className="text-paper" title="THE ALLIANCE" />
          <p className="mt-4 text-[20px] font-medium tracking-[0.14em] pl-[0.14em]">
            THE ALLIANCE
          </p>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.08em] pl-[0.08em] text-paper/75">
            Field App
          </p>
          <div className="my-4 h-px w-40 bg-paper/25" aria-hidden />
          <p className="phrase text-[17px] leading-snug">
            Built for precision. Designed for connection.
          </p>
          <p className="mt-3 text-[13px] text-paper/80">
            by David Hamilton
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-[15px] leading-normal text-ink">
          A relationship operating system with named tools — clear protocols,
          not pep talks.
        </p>
        <a
          href="#product-line"
          className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-accent"
        >
          Explore the product line
          <ArrowRight size={16} />
        </a>
      </section>

      <section id="product-line" className="scroll-mt-20 space-y-3">
        <SectionLabel>The product line</SectionLabel>
        <ul className="space-y-2.5">
          {products.map((p) => (
            <li key={p.name} className="card flex items-center gap-3.5 p-2.5 pr-4">
              <CoverThumb tag={p.tag} />
              <div className="min-w-0">
                <p className="display text-[17px] leading-snug">{p.name}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">{p.body}</p>
              </div>
            </li>
          ))}
          <li className="card flex items-center gap-3.5 border-accent/20 bg-surface-tool p-2.5 pr-4">
            <CoverThumb tag="App" />
            <div className="min-w-0">
              <p className="display text-[17px] leading-snug">Field App</p>
              <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
                This pocket companion: route under stress, exact phrases, Pause
                timer, Weekly Reset.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <section
        id="detachment"
        className="relative scroll-mt-20 overflow-hidden rounded-2xl border border-pause/25 bg-surface-warn px-4 py-3.5"
      >
        <span className="absolute inset-y-0 left-0 w-1 bg-pause" aria-hidden />
        <Marker kind="NOTE" label="Detachment" />
        <p className="mt-2 text-[15px] leading-normal">
          <strong>Detachment / uninvestment:</strong> Use Manual XIII-D
          Uninvestment Check. If ≥3 signs → Full Recovery + Proof — not hope.
          Proceed only with regulated Proof when appropriate.
        </p>
        <Link
          href="/protocols/proof-protocol"
          className="-mb-1.5 mt-1 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-repair"
        >
          Open Proof Protocol
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className="space-y-3">
        <SectionLabel>More</SectionLabel>
        <ul className="card divide-y divide-rule/[0.07] overflow-hidden">
          <li>
            <Link
              href="/install"
              className="flex min-h-12 items-center justify-between px-4 text-[15px] font-medium text-ink hover:bg-surface-tool"
            >
              7-Day Install plan
              <ChevronRight size={18} className="text-ink-muted/50" />
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="flex min-h-12 items-center justify-between px-4 text-[15px] font-medium text-ink hover:bg-surface-tool"
            >
              Situation Map
              <ChevronRight size={18} className="text-ink-muted/50" />
            </Link>
          </li>
        </ul>
        <p className="px-1 text-[13px] leading-normal text-ink-muted">
          Private by default: pause return times and Weekly Reset answers stay
          on this device.
        </p>
      </section>
    </div>
  );
}
