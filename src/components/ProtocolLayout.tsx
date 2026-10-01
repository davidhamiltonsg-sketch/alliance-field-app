import Link from "next/link";
import type { Protocol } from "@/data/types";
import { Marker } from "./Marker";
import { PhraseBlock } from "./PhraseBlock";
import { PracticeTabs } from "./PracticeTabs";
import { SectionLabel } from "./SectionLabel";
import { StepList } from "./StepList";
import { StepDiagram, WhenStrip } from "./visuals/StepDiagram";
import { ApIcon, IconChip, isIconId } from "./ApIcon";
import { TierBadge } from "./TierBadge";
import { protocolSubtitle } from "@/data/glossary";
import { worksheetsFor } from "@/data/worksheets";
import { chapterLabel, goDeeper } from "@/data/go-deeper";
import { protocolDiagrams } from "@/data/visuals/protocol-diagrams";
import { WarnBanner } from "./WarnBanner";
import { FavoriteButton } from "./FavoriteButton";
import { ArrowLeft, ChevronRight } from "./icons";

const headerWash: Record<string, string> = {
  safety: "border-safety/15 bg-safety/[0.05]",
  pause: "border-pause/15 bg-pause/[0.05]",
  repair: "border-repair/15 bg-repair/[0.05]",
  accent: "border-accent/15 bg-accent/[0.05]",
};

export function ProtocolLayout({ protocol }: { protocol: Protocol }) {
  const diagram = protocolDiagrams[protocol.slug];
  const tone = protocol.accentHint ?? "accent";
  const subtitle = protocolSubtitle(protocol.slug);
  const sheets = worksheetsFor(protocol.slug);
  const deeper = goDeeper[protocol.slug];
  return (
    <article className="space-y-6">
      <header className={`-mx-4 space-y-3 border-b px-4 pb-4 sm:mx-0 sm:rounded-2xl sm:border ${headerWash[tone]}`}>
        <Link
          href="/protocols"
          className="-ml-1 inline-flex min-h-11 items-center gap-1.5 rounded-full px-1 text-sm font-medium text-ink-muted hover:text-accent"
        >
          <ArrowLeft size={16} />
          All protocols
        </Link>
        <div className="flex items-center gap-3">
          {isIconId(protocol.slug) && <IconChip id={protocol.slug} tone={tone} size="lg" />}
          <TierBadge tier={protocol.tier} />
          <span className="flex-1" />
          <FavoriteButton slug={protocol.slug} recordVisit />
        </div>
        <div>
          <h1 className="display text-xl">{protocol.title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle.charAt(0).toUpperCase() + subtitle.slice(1)}</p>}
        </div>
        <p className="text-base leading-normal text-ink">{protocol.concept}</p>
      </header>

      {protocol.warn && (
        <WarnBanner safetyLink={protocol.safetyLink} pauseLink={!protocol.safetyLink}>
          {protocol.warn}
        </WarnBanner>
      )}

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
          {protocol.note.startsWith("Sun Memory") ? (
            <Marker kind="NOTE" label="Sun Memory" icon="sun-memory" />
          ) : (
            <Marker kind="NOTE" />
          )}
          <p className="text-base leading-normal text-ink">{protocol.note}</p>
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
                    className="flex min-h-12 items-center justify-between gap-3 px-4 text-base font-medium text-ink transition-colors hover:bg-surface-tool"
                  >
                    {c.label}
                    <ChevronRight size={18} className="text-ink-muted/50" />
                  </Link>
                ) : (
                  <span className="flex min-h-12 items-center px-4 text-base text-ink-muted">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2" aria-labelledby="go-deeper">
        <SectionLabel>
          <span id="go-deeper">Go deeper</span>
        </SectionLabel>
        <ul className="space-y-1.5 text-sm leading-snug text-ink-muted">
          {deeper && (
            <li className="flex items-center gap-2">
              <ApIcon id="manual" size={20} className="text-accent" />
              <span>
                Operating Manual: <span className="text-ink">{chapterLabel(deeper.chapter)}</span>, for the reasoning and edge cases.
              </span>
            </li>
          )}
          <li className="flex items-center gap-2">
            <ApIcon id="field-kit" size={20} className="text-accent" />
            <span>
              Field Kit: the <span className="text-ink">{protocol.title}</span> card
              {sheets.length > 0 ? (
                <>
                  {" "}and the <span className="text-ink">{sheets.map((w) => w.name).join(" and ")}</span>
                  {sheets.length === 1 && sheets[0].detail ? ` (${sheets[0].detail})` : ""}
                </>
              ) : null}
              , to keep on the fridge.
            </span>
          </li>
          {deeper?.companion && (
            <li className="flex items-center gap-2">
              <ApIcon id="companion" size={20} className="text-accent" />
              <span>
                <span className="text-ink">{deeper.companion}</span>, for why it works.
              </span>
            </li>
          )}
        </ul>
      </section>

      <nav className="flex flex-wrap items-center gap-2 border-t border-rule/[0.08] pt-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-rule/15 bg-white px-4 text-sm font-medium text-accent"
        >
          <ApIcon id="situation-map" size={18} />
          Situation Map
        </Link>
        {protocol.slug === "pause-and-return" && (
          <Link
            href="/pause"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-pause px-4 text-sm font-medium text-ink"
          >
            <ApIcon id="pause-and-return" size={18} />
            Start timer
          </Link>
        )}
        {protocol.slug === "weekly-reset" && (
          <Link
            href="/weekly-reset"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-paper"
          >
            <ApIcon id="weekly-reset" size={18} />
            Open Weekly Reset
          </Link>
        )}
      </nav>
    </article>
  );
}
