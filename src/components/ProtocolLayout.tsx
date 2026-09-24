import Link from "next/link";
import type { Protocol } from "@/data/types";
import { Marker } from "./Marker";
import { PhraseBlock } from "./PhraseBlock";
import { SectionLabel } from "./SectionLabel";
import { StepList } from "./StepList";
import { WarnBanner } from "./WarnBanner";

export function ProtocolLayout({ protocol }: { protocol: Protocol }) {
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <Marker kind="TOOL" />
        <h1 className="text-2xl font-semibold text-ink">{protocol.title}</h1>
      </header>

      {protocol.warn && <WarnBanner>{protocol.warn}</WarnBanner>}

      <section>
        <SectionLabel>Concept</SectionLabel>
        <p className="mt-2 leading-relaxed">{protocol.concept}</p>
      </section>

      <section>
        <SectionLabel>When to use</SectionLabel>
        <p className="mt-2 leading-relaxed text-ink-muted">
          {protocol.whenToUse}
        </p>
      </section>

      <StepList steps={protocol.steps} />

      <PhraseBlock phrases={protocol.phrases} />

      <section className="rounded-lg border border-safety/30 bg-paper px-4 py-3">
        <Marker kind="OK" />{" "}
        <span className="text-xs font-bold tracking-widest text-safety">
          WORKING EXAMPLE
        </span>
        <p className="mt-2 leading-relaxed text-sm">{protocol.working}</p>
      </section>

      <section className="rounded-lg border border-failure/30 bg-paper px-4 py-3">
        <Marker kind="FAIL" />{" "}
        <span className="text-xs font-bold tracking-widest text-failure">
          NOT WORKING
        </span>
        <p className="mt-2 leading-relaxed text-sm">{protocol.notWorking}</p>
      </section>

      <section className="rounded-lg border border-rule/15 bg-surface-activity px-4 py-3">
        <Marker kind="DO" />{" "}
        <span className="text-xs font-bold tracking-widest text-accent">
          ACTIVITY
        </span>
        <p className="mt-2 leading-relaxed text-sm">{protocol.activity}</p>
      </section>

      {protocol.crossLinks.length > 0 && (
        <section>
          <SectionLabel>Cross-links</SectionLabel>
          <ul className="mt-2 space-y-1 text-sm">
            {protocol.crossLinks.map((c) => (
              <li key={c.label}>
                {c.href ? (
                  <Link href={c.href} className="font-medium text-repair">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink-muted">{c.label}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-4 border-t border-rule/15 pt-4 text-sm font-semibold">
        <Link href="/" className="text-accent">
          ← Situation Map
        </Link>
        <Link href="/protocols" className="text-accent">
          All protocols
        </Link>
        {protocol.slug === "pause-and-return" && (
          <Link href="/pause" className="text-pause">
            Start timer →
          </Link>
        )}
        {protocol.slug === "weekly-reset" && (
          <Link href="/weekly-reset" className="text-accent">
            Open wizard →
          </Link>
        )}
      </div>
    </article>
  );
}
