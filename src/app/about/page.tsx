import Link from "next/link";
import { Marker } from "@/components/Marker";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">
          THE ALLIANCE
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Field App</h1>
        <p className="mt-3 leading-relaxed text-ink-muted">
          A relationship operating system with named tools — clear protocols,
          not pep talks. Built for precision. Designed for connection.
        </p>
      </div>

      <section className="space-y-2 rounded-lg border border-rule/20 bg-surface-tool px-4 py-4 text-sm leading-relaxed">
        <p className="font-semibold text-ink">How the product line fits</p>
        <ul className="list-disc space-y-1 pl-4 text-ink-muted">
          <li>
            <strong className="text-ink">Operating Manual</strong> — depth,
            theory, Full Recovery, decks.
          </li>
          <li>
            <strong className="text-ink">Field Kit</strong> — cards, worksheets,
            Situation Map (content source for this app).
          </li>
          <li>
            <strong className="text-ink">Field App</strong> — this pocket
            companion: route under stress, exact phrases, Pause timer, Weekly
            Reset.
          </li>
        </ul>
      </section>

      <section
        id="detachment"
        className="scroll-mt-4 rounded-lg border border-pause/40 bg-surface-warn px-4 py-3"
      >
        <Marker kind="NOTE" />
        <p className="mt-2 text-sm leading-relaxed">
          <strong>Detachment / uninvestment:</strong> Use Manual XIII-D
          Uninvestment Check. If ≥3 signs → Full Recovery + Proof — not hope.
          Proceed only with regulated Proof when appropriate.
        </p>
        <Link
          href="/protocols/proof-protocol"
          className="mt-2 inline-block min-h-10 py-2 text-sm font-semibold text-repair"
        >
          Open Proof Protocol →
        </Link>
      </section>

      <section className="text-sm leading-relaxed text-ink-muted">
        <p>
          Markers are print-safe: [TOOL] [✓] [✗] [DO] [WARN]. No emoji clutter.
          Drafts and pause return times stay on this device (localStorage).
        </p>
      </section>

      <div className="flex flex-col gap-3 text-sm font-semibold">
        <Link href="/install" className="text-accent">
          7-Day Install plan →
        </Link>
        <Link href="/" className="text-accent">
          ← Situation Map
        </Link>
      </div>
    </div>
  );
}
