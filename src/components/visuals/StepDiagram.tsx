import type { DiagramStep, ProtocolDiagram, StepKind } from "@/data/visuals/protocol-diagrams";
import { MarkedText } from "../MarkedText";
import { SectionLabel } from "../SectionLabel";

/**
 * Protocol step diagram, ported from the printed Kit's step diagrams:
 * a numbered rail where colour and line style carry meaning together
 * (pause: dashed amber, repair: double blue, safety: heavy green,
 * stop: dotted red). Step titles and timings come from the visuals
 * library; step wording comes from the card itself.
 */

const node: Record<StepKind, string> = {
  step: "bg-accent text-paper",
  pause: "bg-pause text-white",
  repair: "bg-repair text-white",
  safety: "bg-safety text-white",
  failure: "bg-failure text-white",
  note: "bg-ink-muted text-white",
};

const box: Record<StepKind, string> = {
  step: "border border-rule/[0.12] bg-white",
  pause: "border-[1.5px] border-dashed border-pause/70 bg-surface-activity",
  repair: "border-[3px] border-double border-repair/60 bg-white",
  safety: "border-2 border-safety/70 bg-white",
  failure: "border-2 border-dotted border-failure/60 bg-surface-warn",
  note: "border border-dashed border-ink-muted/40 bg-white",
};

const badgeTone: Record<StepKind, string> = {
  step: "border-rule/15 text-accent",
  pause: "border-pause/40 text-[#9A5E10]",
  repair: "border-repair/35 text-repair",
  safety: "border-safety/40 text-safety",
  failure: "border-failure/35 text-failure",
  note: "border-ink-muted/30 text-ink-muted",
};

const legendLabel: Partial<Record<StepKind, string>> = {
  safety: "Safety",
  pause: "Pause",
  repair: "Repair",
  failure: "Stop",
};

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Card wording without a repeated lead word ("Signal: …" → "…"). */
function detailFor(step: DiagramStep, cardText: string | undefined) {
  if (!cardText) return step.detail;
  const lead = new RegExp(
    `^${escapeRe(step.title.replace(/,.*$/, ""))}\\s*(\\([^)]*\\))?\\s*(:|—|–)\\s*`,
    "i",
  );
  const m = cardText.match(lead);
  if (!m) return cardText;
  const rest = cardText.slice(m[0].length);
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

function Swatch({ kind }: { kind: StepKind }) {
  return <span className={`inline-block h-2.5 w-4 rounded-[3px] ${box[kind]}`} aria-hidden />;
}

export function StepDiagram({
  diagram,
  cardSteps,
}: {
  diagram: ProtocolDiagram;
  cardSteps: string[];
}) {
  const kinds = Array.from(new Set(diagram.steps.map((s) => s.kind))).filter(
    (k) => legendLabel[k],
  );
  return (
    <section className="space-y-3" aria-label="Steps">
      <SectionLabel>Steps</SectionLabel>
      <ol className="relative space-y-2.5">
        <span
          className="absolute bottom-6 left-[15px] top-4 w-0.5 rounded-full bg-[#B8C2BB]/70"
          aria-hidden
        />
        {diagram.steps.map((s, i) => (
          <li key={i} className="relative flex gap-3">
            <span
              className={`tabular relative z-10 mt-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ring-4 ring-paper ${node[s.kind]}`}
              aria-hidden
            >
              {i + 1}
            </span>
            <div className={`min-w-0 flex-1 rounded-xl px-3.5 py-2.5 ${box[s.kind]}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[15px] font-semibold leading-snug text-ink">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </p>
                {s.badge && (
                  <span
                    className={`tabular mt-px shrink-0 rounded-full border bg-white px-2 py-0.5 text-[11px] font-medium leading-4 ${badgeTone[s.kind]}`}
                  >
                    {s.badge}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[15px] leading-normal text-ink-muted">
                <MarkedText text={detailFor(s, cardSteps[i])} />
              </p>
            </div>
          </li>
        ))}
        <li className="relative flex gap-3">
          <span
            className="relative z-10 mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper ring-4 ring-paper"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-safety">
              <circle cx="12" cy="12" r="9" />
              <path d="M8.2 12.3l2.6 2.6 5-5.3" />
            </svg>
          </span>
          <div className="min-w-0 flex-1 rounded-xl bg-safety/[0.07] px-3.5 py-2.5">
            <p className="eyebrow text-safety">Outcome</p>
            <p className="mt-1 text-[15px] leading-normal text-ink">{diagram.outcome}</p>
          </div>
        </li>
      </ol>
      {kinds.length > 1 && (
        <p className="flex flex-wrap items-center gap-x-3.5 gap-y-1 pl-11 text-[11px] text-ink-muted">
          {kinds.map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <Swatch kind={k} />
              {legendLabel[k]}
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
