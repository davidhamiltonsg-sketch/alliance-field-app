import type { Phrase } from "@/data/types";
import { Marker } from "./Marker";

export function PhraseBlock({ phrases }: { phrases: Phrase[] }) {
  return (
    <section className="space-y-3 rounded-2xl bg-surface-tool px-3.5 pb-3.5 pt-3.5 ring-1 ring-accent/10">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <h2 className="text-[13px] font-medium text-ink">Exact phrases</h2>
        <Marker kind="PHRASE" />
      </div>
      <ul className="space-y-2">
        {phrases.map((p) => (
          <li
            key={p.text}
            className="phrase-block phrase text-[17px] leading-snug text-ink"
          >
            {p.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
