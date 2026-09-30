import Link from "next/link";
import type { Protocol } from "@/data/types";
import { Marker } from "./Marker";
import { PhraseBlock } from "./PhraseBlock";
import { PracticeTabs } from "./PracticeTabs";
import { SectionLabel } from "./SectionLabel";
import { StepList } from "./StepList";
import { StepDiagram, WhenStrip } from "./visuals/StepDiagram";
import { IconTablet } from "./visuals/IconTablet";
import { protocolDiagrams } from "@/data/visuals/protocol-diagrams";
import { WarnBanner } from "./WarnBanner";
import { FavoriteButton } from "./FavoriteButton";
import { ArrowLeft, ArrowRight, ChevronRight } from "./icons";

const headerWash: Record<string, string> = {
  safety: "border-safety/15 bg-safety/[0.05]",
  pause: "border-pause/15 bg-pause/[0.05]",
  repair: "border-repair/15 bg-repair/[0.05]",
  accent: "border-accent/15 bg-accent/[0.05]",
};

export function ProtocolLayout({ protocol }: { protocol: Protocol }) {
  const diagram = protocolDiagrams[protocol.slug];
  const tone = protocol.accentHint ?? "accent";
  return (
    <article className="space-y-6">
      <header className={`-mx-4 space-y-3 border-b px-4 pb-4 sm:mx-0 sm:rounded-2xl sm:border ${headerWash[tone]}`}>
        <Link
          href="/protocols"
          className="-ml-1 inline-flex min-h-10 items-center gap-1.5 rounded-full px-1 text-[13px] font-medium text-ink-muted hover:text-accent"
        >
          <ArrowLeft size={16} />
          All protocols
        </Link>
        <div className="flex items-center gap-3">
          <IconTablet slug={protocol.slug} tone={tone} size="lg" />
          <Marker kind="TOOL" />
          <span className="flex-1" />
          <FavoriteButton slug={protocol.slug} recordVisit />
        </div>
        <h1 className="display text-[28px] leading-[1.08]">
          {protocol.title}
        </h1>
        <p className="text-[17px] leading-normal text-ink">{protocol.concept}</p>
      </header>

      {protocol.warn && <WarnBanner safetyLink={protocol.safetyLink}>{protocol.warn}</WarnBanner>}

      <PhraseBlock phrases={protocol.phrases} />

      {diagram && diagram.steps.length === protocol.steps.length ? (
        <StepDiagram
          diagram={diagram}
          cardSteps={protocol.steps}
          whenToUse={protocol.whenToUse}
        />
      ) : (
        <>
          <WhenStrip text={protocol.whenToUse} />
          <StepList steps={protocol.steps} />
        </>
      )}

      {protocol.note && (
        <aside className="card space-y-2 px-4 py-3.5" aria-label="Note">
          <Marker kind="NOTE" />
          <p className="text-[15px] leading-normal text-ink">{protocol.note}</p>
        </aside>
      )}

      <section className="space-y-3">
        <SectionLabel>In practice</SectionLabel>
        <PracticeTabs working={protocol.working} notWorking={protocol.notWorking} activity={protocol.activity} />
      </section>

      {protocol.crossLinks.length > 0 && (
        <section className="space-y-3">
          <SectionLabel>Related</SectionLabel>
          <ul className="card divide-y divide-rule/[0.07] overflow-hidden">
            {protocol.crossLinks.map((c) => (
              <li key={c.label}>
                {c.href ? (
                  <Link
                    href={c.href}
                    className="flex min-h-12 items-center justify-between gap-3 px-4 text-[15px] font-medium text-ink transition-colors hover:bg-surface-tool"
                  >
                    {c.label}
                    <ChevronRight size={18} className="text-ink-muted/50" />
                  </Link>
                ) : (
                  <span className="flex min-h-12 items-center px-4 text-[15px] text-ink-muted">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="flex flex-wrap items-center gap-2 border-t border-rule/[0.08] pt-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-rule/15 bg-white px-4 text-[13px] font-medium text-accent"
        >
          <ArrowLeft size={16} />
          Situation Map
        </Link>
        {protocol.slug === "pause-and-return" && (
          <Link
            href="/pause"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-pause px-4 text-[13px] font-medium text-ink"
          >
            Start timer
            <ArrowRight size={16} />
          </Link>
        )}
        {protocol.slug === "weekly-reset" && (
          <Link
            href="/weekly-reset"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-4 text-[13px] font-medium text-paper"
          >
            Open Weekly Reset
            <ArrowRight size={16} />
          </Link>
        )}
      </nav>
    </article>
  );
}
