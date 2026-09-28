import Link from "next/link";
import type { Protocol } from "@/data/types";
import { Marker, type MarkerKind } from "./Marker";
import { PhraseBlock } from "./PhraseBlock";
import { SectionLabel } from "./SectionLabel";
import { StepList } from "./StepList";
import { StepDiagram } from "./visuals/StepDiagram";
import { ProtocolIcon } from "./visuals/ProtocolIcon";
import { protocolDiagrams } from "@/data/visuals/protocol-diagrams";
import { WarnBanner } from "./WarnBanner";
import { ArrowLeft, ArrowRight, ChevronRight } from "./icons";

const hintTile: Record<NonNullable<Protocol["accentHint"]>, string> = {
  accent: "bg-surface-tool text-accent ring-accent/15",
  safety: "bg-safety/[0.08] text-safety ring-safety/20",
  pause: "bg-surface-activity text-pause ring-pause/25",
  repair: "bg-repair/[0.07] text-repair ring-repair/20",
};

function ExampleCard({
  kind,
  children,
  tone,
}: {
  kind: MarkerKind;
  children: React.ReactNode;
  tone: string;
}) {
  return (
    <section className={`rounded-2xl border px-4 py-3.5 ${tone}`}>
      <Marker kind={kind} />
      <p className="mt-2 text-[15px] leading-normal text-ink">{children}</p>
    </section>
  );
}

export function ProtocolLayout({ protocol }: { protocol: Protocol }) {
  const tile = hintTile[protocol.accentHint ?? "accent"];
  const diagram = protocolDiagrams[protocol.slug];
  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <Link
          href="/protocols"
          className="-ml-1 inline-flex min-h-10 items-center gap-1.5 rounded-full px-1 text-[13px] font-medium text-ink-muted hover:text-accent"
        >
          <ArrowLeft size={16} />
          All protocols
        </Link>
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${tile}`}
          >
            <ProtocolIcon slug={protocol.slug} size={24} />
          </span>
          <Marker kind="TOOL" />
        </div>
        <h1 className="display text-[28px] leading-[1.08]">
          {protocol.title}
        </h1>
        <p className="text-[17px] leading-normal text-ink">{protocol.concept}</p>
      </header>

      {protocol.warn && <WarnBanner>{protocol.warn}</WarnBanner>}

      <section className="space-y-3">
        <SectionLabel>When to use</SectionLabel>
        <p className="text-[15px] leading-normal text-ink-muted">
          {protocol.whenToUse}
        </p>
      </section>

      {diagram && diagram.steps.length === protocol.steps.length ? (
        <StepDiagram diagram={diagram} cardSteps={protocol.steps} />
      ) : (
        <StepList steps={protocol.steps} />
      )}

      <PhraseBlock phrases={protocol.phrases} />

      <section className="space-y-3">
        <SectionLabel>In practice</SectionLabel>
        <div className="space-y-2.5">
          <ExampleCard kind="OK" tone="border-safety/20 bg-safety/[0.05]">
            {protocol.working}
          </ExampleCard>
          <ExampleCard kind="FAIL" tone="border-failure/15 bg-failure/[0.04]">
            {protocol.notWorking}
          </ExampleCard>
          <ExampleCard kind="DO" tone="border-rule/10 bg-surface-activity">
            {protocol.activity}
          </ExampleCard>
        </div>
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
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-pause px-4 text-[13px] font-medium text-white"
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
