import type { DiagramStep, ProtocolDiagram, StepKind } from "@/data/visuals/protocol-diagrams";
import { MarkedText } from "../MarkedText";
import { SectionLabel } from "../SectionLabel";
import { GlyphIcon, V, tombD, twistPaths, type GlyphKind } from "./v2";

/**
 * Protocol step diagram in the v2 visual language (visuals library
 * `protocol-*.svg`): a warm-paper "When" strip, steps hung on a two-ply
 * woven spine (forest and brass, crossing over and under between stations),
 * forest arch medallions with a brass rim and serif italic numerals,
 * arch-topped panels whose rule treatment carries the status (pause dashed
 * double amber, repair double blue, safety heavy green, stop dotted red),
 * and a deep-forest outcome band with hatching, a brass double frame and
 * the mark seal. Step titles and timings come from the library; step
 * wording, the trigger and the outcome come from the card and library as
 * before.
 */

const glyphFor: Partial<Record<StepKind, GlyphKind>> = {
  safety: "safety",
  pause: "pause",
  repair: "repair",
  failure: "failure",
};

const glyphTone: Record<StepKind, string> = {
  step: "text-accent",
  pause: "text-pause",
  repair: "text-repair",
  safety: "text-safety",
  failure: "text-failure",
  note: "text-ink-muted",
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

/** Forest arch medallion with brass rim and serif italic numeral. */
function StepMedallion({ n }: { n: number }) {
  return (
    <svg viewBox="0 0 34 40" width="34" height="40" className="relative z-10 block" aria-hidden focusable="false">
      <path d={tombD(17, 2.6, 30.8, 35.8)} fill={V.paper} stroke={V.brass} strokeWidth={0.8} />
      <path d={tombD(17, 5, 26, 31)} fill={V.forest} />
      <text
        x={17}
        y={29}
        textAnchor="middle"
        className="font-display"
        fontStyle="italic"
        fontSize={17}
        fill={V.brassL}
      >
        {n}
      </text>
    </svg>
  );
}

/** Straight parallel plies (stretch freely: vertical lines do not distort). */
function Plies({ flip = false }: { flip?: boolean }) {
  const a = flip ? 4.8 : 15.2;
  const b = flip ? 15.2 : 4.8;
  return (
    <svg viewBox="0 0 20 10" preserveAspectRatio="none" overflow="visible" className="block min-h-0 w-5 flex-1" aria-hidden focusable="false">
      <path d={`M${a} -0.6V10.6`} stroke={V.accent} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
      <path d={`M${b} -0.6V10.6`} stroke={V.brass} strokeWidth={1} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** One crossing of the woven spine: the under ply breaks where the over ply passes. */
function Crossing({ i }: { i: number }) {
  const t = twistPaths(10, 0, 44, 5.2, i, 0.12);
  return (
    <svg viewBox="0 0 20 44" width="20" height="44" overflow="visible" className="block shrink-0" aria-hidden focusable="false">
      <path d="M15.2 -1V0.5M4.8 43.5V45" stroke={V.accent} strokeWidth={1.1} />
      <path d="M4.8 -1V0.5M15.2 43.5V45" stroke={V.brass} strokeWidth={1} />
      {[t.underA, t.underB].map((d) => (
        <path key={d} d={d} fill="none" stroke={t.underColor} strokeWidth={t.underColor === V.brass ? 1 : 1.1} strokeLinecap="round" />
      ))}
      <path d={t.over} fill="none" stroke={t.overColor} strokeWidth={t.overColor === V.brass ? 1 : 1.1} strokeLinecap="round" />
    </svg>
  );
}

/** Woven spine segment filling its box: plies, a crossing, plies. */
function SpineSegment({ i, className = "" }: { i: number; className?: string }) {
  return (
    <span className={`pointer-events-none absolute left-1/2 flex w-5 -translate-x-1/2 flex-col items-center ${className}`} aria-hidden>
      <Plies />
      <Crossing i={i} />
      <Plies flip />
    </span>
  );
}

function Swatch({ kind }: { kind: StepKind }) {
  const g = glyphFor[kind];
  return (
    <span className={`v2-panel v2-${kind} v2-swatch inline-flex h-[19px] w-7 items-center justify-center ${glyphTone[kind]}`} aria-hidden>
      {g && <GlyphIcon kind={g} size={11} sw={1.4} />}
    </span>
  );
}

export function WhenStrip({ text, label = "When to use" }: { text: string; label?: string }) {
  return (
    <div className="v2-when px-3.5 pb-3 pt-3">
      <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.03em] text-accent">
        <GlyphIcon kind="when" size={17} sw={1.2} className="shrink-0" />
        {label}
        <span className="h-px w-[22px] bg-[#A8895A]" aria-hidden />
      </p>
      <p className="phrase mt-1.5 text-[16px] leading-[1.45] text-ink">{text}</p>
    </div>
  );
}

export function OutcomeBand({ text }: { text: string }) {
  return (
    <div className="v2-outcome flex items-center gap-3 px-4 py-4">
      <svg viewBox="0 0 34 38" width="34" height="38" className="shrink-0" aria-hidden focusable="false">
        <path d={tombD(17, 1.5, 30, 35)} fill={V.forest} stroke={V.brassL} strokeWidth={0.8} />
        <g transform="translate(5.5 12) scale(0.19)" fill="none" stroke={V.brassL} strokeLinecap="round">
          <path d="M60 14L26 106" strokeWidth={10} />
          <path d="M60 14L94 106" strokeWidth={10} />
          <path d="M40 74Q50 63 60 74Q70 63 80 74" strokeWidth={8.5} />
        </g>
      </svg>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#D8C69F]">Outcome</p>
        <p className="font-display mt-1 text-[17px] leading-snug text-white">{text}</p>
      </div>
    </div>
  );
}

export function StepDiagram({
  diagram,
  cardSteps,
  whenToUse,
}: {
  diagram: ProtocolDiagram;
  cardSteps: string[];
  whenToUse?: string;
}) {
  const kinds = Array.from(new Set(diagram.steps.map((s) => s.kind))).filter(
    (k) => legendLabel[k],
  );
  return (
    <section className="space-y-3" aria-label="Steps">
      <SectionLabel>Steps</SectionLabel>
      {whenToUse && <WhenStrip text={whenToUse} />}
      <ol className="relative">
        {diagram.steps.map((s, i) => {
          const g = glyphFor[s.kind];
          return (
            <li key={i} className="relative flex gap-2.5 pb-2.5">
              <div className="relative w-[34px] shrink-0 pt-1.5">
                {i === 0 && whenToUse && <SpineSegment i={1} className="-top-3 h-[calc(0.75rem+26px)]" />}
                <SpineSegment
                  i={i}
                  className={i === diagram.steps.length - 1 ? "top-[26px] -bottom-3" : "top-[26px] -bottom-[26px]"}
                />
                <StepMedallion n={i + 1} />
              </div>
              <div className={`v2-panel v2-${s.kind} min-w-0 flex-1 px-3.5 pb-3 pt-2.5`}>
                <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-0.5">
                  <p className="min-w-0 break-words font-display text-[17px] font-semibold leading-snug text-ink">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </p>
                  {(s.badge || g) && (
                    <span className="mt-[3px] flex shrink-0 items-center gap-2">
                      {s.badge && (
                        <span className="tabular flex items-center gap-1.5 text-[13px] font-medium leading-4 text-accent">
                          <span className="h-px w-3 bg-[#A8895A]" aria-hidden />
                          {s.badge}
                        </span>
                      )}
                      {g && <GlyphIcon kind={g} size={16} className={glyphTone[s.kind]} />}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[15px] leading-normal text-ink-muted">
                  <MarkedText text={detailFor(s, cardSteps[i])} serifQuotes />
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      <OutcomeBand text={diagram.outcome} />
      {kinds.length > 1 && (
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-0.5 text-[13px] text-ink-muted">
          <span className="h-px w-[22px] bg-[#A8895A]" aria-hidden />
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
