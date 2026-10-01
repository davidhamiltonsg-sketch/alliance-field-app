import type { Phrase } from "@/data/types";
import { Marker } from "./Marker";

export function PhraseBlock({ phrases }: { phrases: Phrase[] }) {
  return (
    <section className="space-y-3 rounded-2xl bg-surface-tool px-3.5 pb-3.5 pt-3.5 ring-1 ring-accent/10">
      <h2 className="px-0.5">
        <Marker kind="PHRASE" />
      </h2>
      <ul className="space-y-2">
        {phrases.map((p) => (
          <li
            key={p.text}
            className="phrase-block phrase text-base leading-snug text-ink"
          >
            {p.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
