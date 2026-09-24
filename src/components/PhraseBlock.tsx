import type { Phrase } from "@/data/types";
import { Marker } from "./Marker";
import { SectionLabel } from "./SectionLabel";

export function PhraseBlock({ phrases }: { phrases: Phrase[] }) {
  return (
    <section className="rounded-lg border border-accent/25 bg-surface-tool px-4 py-4">
      <div className="flex items-center gap-2">
        <Marker kind="PHRASE" />
        <SectionLabel>Exact phrases</SectionLabel>
      </div>
      <ul className="mt-3 space-y-3">
        {phrases.map((p) => (
          <li
            key={p.text}
            className="border-l-4 border-accent pl-3 text-lg font-semibold leading-snug text-ink"
          >
            “{p.text}”
          </li>
        ))}
      </ul>
    </section>
  );
}
