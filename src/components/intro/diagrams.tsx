import type { CSSProperties, ReactNode } from "react";
import { KIT } from "@/data/kit";
import { ApIconG, type IconId } from "../ApIcon";
import {
  AdvisoryStrip,
  ArchPanel,
  Glyph,
  Lens,
  Medallion,
  SERIF,
  StatusOutline,
  Thread,
  Twist,
  V,
  archD,
  arcD,
  chevronD,
  lancetD,
  lensD,
  polar,
  tombD,
  type Kind,
} from "../visuals/v2";

/**
 * Animated intro diagrams in the v2 visual language of the printed library
 * (system-overview, situation-map-full / -card, pause-return-timeline,
 * pattern-loop-cycle, weekly-reset-loop), re-laid out for a phone: arch-topped
 * panels, forest arch medallions with fine rims and serif italic numerals,
 * decision lenses, threads with a bead start and a lancet end, woven
 * two-ply spines, status rules with their glyphs. Same wording as before;
 * text is at least 13.5 units, which renders at 13 px or more on a 390 px
 * phone.
 *
 * Motion is CSS only (see globals.css "dg-*"): each element's resting state
 * is its final state; the parent adds `.dg-armed` and `.is-active` to play.
 * Only transform, opacity and stroke-dashoffset animate.
 */

type Vars = CSSProperties & Record<`--${string}`, string | number>;
const t = (d: number, dur?: number, extra: Vars = {}): Vars => ({
  "--d": `${d}ms`,
  ...(dur ? { "--dur": `${dur}ms` } : {}),
  ...extra,
});
const a = (className: string, d: number, dur?: number, extra?: Vars) => ({ className, style: t(d, dur, extra) });

function Frame({ label, viewBox, children }: { label: string; viewBox: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} className="block h-auto w-full font-sans" role="img" aria-label={label}>
      <title>{label}</title>
      {children}
    </svg>
  );
}

/** Shared-set icon placed inside an SVG drawing. */
function LibIcon({ slug, x, y, size = 18, color }: { slug: IconId; x: number; y: number; size?: number; color: string }) {
  return <ApIconG id={slug} x={x} y={y} size={size} color={color} />;
}

/** Icon seated in a small arch medallion with a fine rim. */
function IconSeat({ slug, cx, cy, size = 22, color = V.accent }: { slug: IconId; cx: number; cy: number; size?: number; color?: string }) {
  const w = size,
    h = size * 1.12;
  const y = cy - h / 2;
  const isz = size * 0.66;
  return (
    <g>
      <path d={tombD(cx, y - 2.2, w + 4.4, h + 4.4)} fill="none" stroke={V.rim} strokeWidth={0.7} />
      <path d={tombD(cx, y, w, h)} fill={V.white} stroke={color} strokeWidth={0.85} />
      <LibIcon slug={slug} x={cx - isz / 2} y={y + h * 0.56 - isz / 2} size={isz} color={color} />
    </g>
  );
}

/** Small inline 24-grid line drawing (for the three system panels). */
function Sketch({ x, y, size = 22, color = V.accent, children }: { x: number; y: number; size?: number; color?: string; children: ReactNode }) {
  const s = size / 24;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={1.5 / Math.max(s, 0.9)} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 1. One system: Manual + Kit + App → Situation → Protocol → Practice  */
/* ------------------------------------------------------------------ */
export function SystemDiagram() {
  const cards = [
    {
      x: 0,
      title: "Manual",
      sub: [`${KIT.manualChapters} chapters,`, "three parts"],
      fill: V.white,
      iconId: "manual" as IconId,
    },
    {
      x: 116,
      title: "Field Kit",
      sub: [`${KIT.protocolCards} protocol`, "cards + Read", "This First,", `${KIT.worksheets} worksheets`],
      fill: V.tint,
      iconId: "field-kit" as IconId,
    },
    {
      x: 232,
      title: "Field App",
      sub: ["Act in the", "moment"],
      fill: V.white,
      icon: (
        <>
          <path d="M7 21.5V7.5A5 5 0 0 1 17 7.5V21.5Z" />
          <path d="M10.5 18.5H13.5" />
        </>
      ),
    },
  ];
  const flow = ["Situation", "Protocol", "Practice"];
  const fx = [0, 110, 222],
    fw = [118, 120, 118];
  const fy = 186,
    fh = 56;
  return (
    <Frame
      viewBox="0 0 340 338"
      label="Same tools, same words, wherever you are."
    >
      {cards.map((c, i) => (
        <g key={c.title} {...a("dg-rise", 80 + i * 140)}>
          <ArchPanel x={c.x} y={4} w={108} h={140} kind="step" fill={c.fill} rt={16} />
          <g style={{ color: V.accent }}>
            {"iconId" in c && c.iconId ? (
              <LibIcon slug={c.iconId} x={c.x + 10} y={16} size={22} color={V.accent} />
            ) : (
              <Sketch x={c.x + 10} y={16} size={22}>
                {"icon" in c ? c.icon : null}
              </Sketch>
            )}
          </g>
          <text x={c.x + 10} y={62} fontFamily={SERIF} fontSize={15} fontWeight={600} fill={V.ink}>
            {c.title}
          </text>
          <path d={`M${c.x + 10} ${70.5}H${c.x + 32}`} stroke={V.rim} strokeWidth={0.8} />
          {c.sub.map((s, j) => (
            <text key={s} x={c.x + 10} y={87 + j * 16} fontSize={13.5} fill={V.muted}>
              {s}
            </text>
          ))}
        </g>
      ))}
      {/* everything below the product cards sits 32 units lower (taller cards) */}
      <g transform="translate(0 32)">
        {/* three threads converge on a knot, then a woven twist into the flow */}
        <g fill="none" stroke={V.thread} strokeWidth={1} strokeLinecap="round">
          <path {...a("dg-draw", 620, 600)} pathLength={1} d="M54 115C54 140 140 134 163 146" />
          <path {...a("dg-draw", 620, 600)} pathLength={1} d="M170 115V141" />
          <path {...a("dg-draw", 620, 600)} pathLength={1} d="M286 115C286 140 200 134 177 146" />
        </g>
        <g {...a("dg-pop", 600, 300)}>
          <circle cx={54} cy={115} r={1.9} fill={V.thread} />
          <circle cx={170} cy={115} r={1.9} fill={V.thread} />
          <circle cx={286} cy={115} r={1.9} fill={V.thread} />
        </g>
        <g {...a("dg-pop", 1080, 360)}>
          <path d={lensD(170, 147, 22, 11)} fill={V.forest} stroke={V.rim} strokeWidth={0.8} />
        </g>
        <Twist x={170} y0={153} y1={176} amp={3.6} {...a("dg-draw", 1150, 320)} />
        <path {...a("dg-pop", 1400, 260)} d={lancetD(170, 184, Math.PI / 2, 8)} fill={V.thread} />
        {/* flow: lancet chevrons */}
        {flow.map((f, i) => {
          const x = fx[i],
            w = fw[i];
          return (
            <g key={f} {...a("dg-rise", 1400 + i * 220)}>
              <path d={chevronD(x, fy, w, fh, i === 0, 15)} fill={i === 1 ? V.tint : V.white} />
              <path d={chevronD(x, fy, w, fh, i === 0, 15)} fill="none" stroke={V.accent} strokeWidth={0.9} strokeLinejoin="round" />
              <text x={x + (i === 0 ? w / 2 - 6 : w / 2 + 2)} y={fy + 34} textAnchor="middle" fontFamily={SERIF} fontSize={15} fontWeight={600} fill={V.ink}>
                {f}
              </text>
            </g>
          );
        })}
        <g {...a("dg-fade", 2000)}>
          <Thread pts={[[16, 256], [326, 256]]} color={V.hair} size={7} />
        </g>
        {/* flood gate: pause advisory strip */}
        <AdvisoryStrip x={0} y={272} w={340} h={32} {...a("dg-rise", 2100)}>
          <text x={42} y={292.5} fontSize={13.5} fill={V.ink}>
            Flooded? Pause + Return or the 60-Second Reset.
          </text>
        </AdvisoryStrip>
      </g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Situation Map: lens questions, first match routes to a card        */
/* ------------------------------------------------------------------ */
export function SituationMapDiagram() {
  // Safety routing always comes first; "unsafe" never routes to Pause + Return.
  const rows: { q: string[]; a: string[]; icon: IconId; kind: Kind }[] = [
    { q: ["Afraid, threatened,", "not free to say no?"], a: ["Stop. Get", "outside help"], icon: "help-safety", kind: "failure" },
    { q: ["Flooded or shut", "down (but safe)?"], a: ["Pause + Return"], icon: "pause-and-return", kind: "step" },
    { q: ["Outside pressure", "or disapproval?"], a: ["Unity Anchor"], icon: "unity-anchor", kind: "step" },
    { q: ["Trust breach?"], a: ["Trust Recovery", "+ Proof"], icon: "trust-recovery", kind: "repair" },
    { q: ["Pulling away?"], a: ["Uninvestment", "Check"], icon: "uninvestment-check", kind: "repair" },
  ];
  const top = 24,
    pitch = 58,
    h = 48,
    lw = 160,
    lcx = 80,
    bx = 182,
    bw = 158;
  const lh = 15;
  const HI = 1; // highlighted route: Flooded (but safe) → Pause + Return
  const hy = top + HI * pitch;
  return (
    <Frame
      viewBox="0 0 340 336"
      label="Situation Map: answer yes or no from the top. Afraid, threatened, or not free to say no: stop and get outside help. Flooded or shut down but safe: Pause + Return. Outside pressure or disapproval from family, friends or strangers: Unity Anchor. Trust breach: Trust Recovery plus Proof. Pulling away: Uninvestment Check."
    >
      <text x={2} y={13} fontSize={13.5} fill={V.muted} {...a("dg-fade", 0)}>
        Follow the first match, top to bottom.
      </text>
      {rows.map((r, i) => {
        const y = top + i * pitch;
        const cy = y + h / 2;
        const qy = cy - ((r.q.length - 1) * lh) / 2 + 5;
        const hi = i === HI;
        const lit = i <= HI;
        const ay = hi ? cy - 3 : cy - ((r.a.length - 1) * lh) / 2 + 5;
        // The safety glyph is safety green on a light tile (CANON round 5); the label stays red.
        const color = r.kind === "repair" ? V.repair : r.icon === "help-safety" ? V.safety : r.kind === "failure" ? V.failure : V.accent;
        return (
          <g key={i} className={lit ? undefined : "dg-dim"} style={lit ? undefined : t(1700 + i * 60, 600, { "--dim": 0.42 })}>
            <Lens cx={lcx} cy={cy} w={lw} h={h} {...a("dg-rise", 150 + i * 230)} />
            <g {...a("dg-rise", 150 + i * 230)}>
              {r.q.map((l, j) => (
                <text key={l} x={lcx} y={qy + j * lh} textAnchor="middle" fontFamily={SERIF} fontSize={14} fontWeight={600} fill={V.ink}>
                  {l}
                </text>
              ))}
            </g>
            <Thread
              pts={[[lcx + lw / 2 + 1, cy], [bx - 1, cy]]}
              size={7}
              color={r.kind === "failure" ? V.failure : undefined}
              line={a("dg-draw", 350 + i * 230, 260)}
              ends={a("dg-pop", 340 + i * 230, 200)}
              tipAnim={a("dg-pop", 560 + i * 230, 240)}
            />
            <g {...a("dg-rise", 420 + i * 230)}>
              <ArchPanel x={bx} y={y} w={bw} h={h} kind={r.kind} rt={14} />
              <IconSeat slug={r.icon} cx={bx + 18} cy={hi ? cy - 8 : cy} size={20} color={color} />
              {r.a.map((l, j) => (
                <text key={l} x={bx + 36} y={ay + j * lh} fontFamily={SERIF} fontSize={14} fontWeight={600} fill={r.kind === "failure" ? V.failure : V.ink}>
                  {l}
                </text>
              ))}
            </g>
            {i < rows.length - 1 && (
              <g {...a("dg-fade", 300 + i * 230)}>
                <Twist x={lcx} y0={y + h - 1} y1={y + pitch + 1} amp={3.4} startOver={i} />
                <text x={lcx + 11} y={y + h + 9} fontFamily={SERIF} fontStyle="italic" fontSize={11.5} fill={V.muted}>
                  no
                </text>
              </g>
            )}
          </g>
        );
      })}
      {/* highlighted route: Flooded (but safe) → Pause + Return */}
      <g>
        <path {...a("dg-fade", 1350, 400)} d={lensD(lcx, hy + h / 2, lw, h)} fill="none" stroke={V.pause} strokeWidth={2.2} />
        <Thread
          pts={[[lcx + lw / 2 + 1, hy + h / 2], [bx - 1, hy + h / 2]]}
          color={V.pause}
          sw={1.8}
          size={8}
          line={a("dg-draw", 1450, 380)}
          ends={a("dg-pop", 1450, 200)}
          tipAnim={a("dg-pop", 1700, 260)}
        />
        <StatusOutline {...a("dg-pop", 1750, 420)} kind="pause" d={(i) => archD(bx + i, hy + i, bw - 2 * i, h - 2 * i, 14 - i)} />
        <text {...a("dg-fade", 1850)} x={bx + 36} y={hy + h / 2 + 14} fontSize={12} fill={V.muted}>
          or 60-Second Reset
        </text>
      </g>
      <text x={2} y={331} fontSize={13.5} fill={V.muted} {...a("dg-fade", 1300)}>
        More rows follow in the map.
      </text>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Pause + Return timeline on a woven spine with a travelling bead    */
/* ------------------------------------------------------------------ */
function Station({ cy, kind, glyph, className, style }: { cy: number; kind: Kind; glyph: "when" | "pause" | "say" | "outcome"; className?: string; style?: CSSProperties }) {
  const w = 22,
    h = 25,
    x = 22 - w / 2,
    y = cy - h / 2 - 1;
  const color = kind === "pause" ? V.pause : kind === "repair" ? V.repair : V.accent;
  return (
    <g className={className} style={style}>
      <path d={tombD(22, y - 2.4, w + 4.8, h + 4.8)} fill={V.paper} stroke={V.rim} strokeWidth={0.7} />
      <path d={tombD(22, y, w, h)} fill={kind === "pause" ? V.warm : V.white} />
      <StatusOutline kind={kind} inset={2.2} d={(i) => tombD(22, y + i, w - 2 * i, h - i)} />
      <Glyph kind={glyph} x={x + 4.5} y={y + 7} s={13} color={color} />
    </g>
  );
}

export function PauseTimelineDiagram() {
  const s = 0.82; // time scale for delays
  const stops = [
    { y: 22, title: "Flooded or shut down", detail: "Racing heart, tunnel vision.", at: 250 },
    { y: 82, title: "Say it, set a time", detail: "“I need a pause. I’ll be ready at ___.”", at: 1300 },
    { y: 146, title: "Step away", detail: "Walk, shower, breathe, music.", at: 2200 },
    { y: 250, title: "Come back", detail: "At the agreed time, even briefly.", at: 3850 },
    { y: 306, title: "Restart warm", detail: "Warm up and check it’s safe first.", at: 4700 },
  ];
  // woven spine between stations (window occupies 140–226)
  const spans: [number, number, number, number][] = [
    [22, 82, 200, 900],
    [82, 140, 1300, 800],
    [226, 250, 3500, 350],
    [250, 306, 3900, 700],
  ];
  const detail = (d: string) =>
    d.startsWith("“") ? (
      <tspan fontFamily={SERIF} fontStyle="italic" fontSize={14.5} fill={V.ink}>
        {d}
      </tspan>
    ) : d.includes("“") ? (
      <>
        {d.slice(0, d.indexOf("“"))}
        <tspan fontFamily={SERIF} fontStyle="italic" fontSize={14.5} fill={V.ink}>
          {d.slice(d.indexOf("“"), d.lastIndexOf("”") + 1)}
        </tspan>
        {d.slice(d.lastIndexOf("”") + 1)}
      </>
    ) : (
      d
    );
  return (
    <Frame
      viewBox="0 0 340 336"
      label="Pause + Return timeline: flooded, signal a pause with a return time, separate for 20 minutes to 24 hours, return at the agreed time, restart with warmth then safety."
    >
      {spans.map(([y0, y1, d, dur], i) => (
        <Twist key={y0} x={22} y0={y0} y1={y1} amp={4.6} startOver={i} {...a("dg-draw", d * s, dur * s)} />
      ))}
      {/* pause window: arch-topped slot, dashed double amber, fills over time */}
      <g {...a("dg-pop", 2150 * s, 420)}>
        <ArchPanel x={13} y={140} w={18} h={86} kind="pause" rt={9} />
      </g>
      <path {...a("dg-draw", 2300 * s, 1300 * s)} pathLength={1} d="M22 152V216" stroke={V.pause} strokeOpacity={0.55} strokeWidth={5} strokeLinecap="round" fill="none" />
      {/* stations */}
      <Station cy={22} kind="step" glyph="when" {...a("dg-pop", stops[0].at * s)} />
      <Station cy={82} kind="pause" glyph="pause" {...a("dg-pop", stops[1].at * s)} />
      <Station cy={250} kind="repair" glyph="say" {...a("dg-pop", stops[3].at * s)} />
      <Station cy={306} kind="repair" glyph="outcome" {...a("dg-pop", stops[4].at * s)} />
      {/* travelling bead */}
      <g {...a("dg-move", 250 * s, 4700 * s, { "--move": "dg-pr-travel" })}>
        <circle cx={22} cy={306} r={9.5} fill="none" stroke={V.pause} strokeWidth={2} />
        <circle cx={22} cy={306} r={12} fill="none" stroke={V.rim} strokeWidth={0.7} />
      </g>
      {stops.map((p) => (
        <g key={p.title} {...a("dg-rise", p.at * s)}>
          <text x={48} y={p.y + 5} fontFamily={SERIF} fontSize={15} fontWeight={600} fill={V.ink}>
            {p.title}
          </text>
          <text x={48} y={p.y + 24} fontSize={13.5} fill={V.muted}>
            {detail(p.detail)}
          </text>
        </g>
      ))}
      {/* the window's range: arch tab, dashed amber */}
      <g {...a("dg-pop", 2600 * s)}>
        <path d={archD(48, 188, 104, 26, 10, 1.5)} fill={V.white} />
        <StatusOutline kind="pause" inset={2.4} d={(i) => archD(48 + i, 188 + i, 104 - 2 * i, 26 - 2 * i, 10 - i, 1.5)} />
        <text x={100} y={205.5} textAnchor="middle" fontSize={13.5} fontWeight={600} fill={V.pauseInk} className="tabular">
          20 min – 24 h
        </text>
      </g>
      <text {...a("dg-fade", 2750 * s)} x={160} y={205.5} fontSize={13.5} fill={V.muted}>
        No rehearsing arguments.
      </text>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Connection Cards: woven ring, five kinds, 35 questions            */
/* ------------------------------------------------------------------ */
export function ConnectionCardsDiagram() {
  const cx = 78,
    cy = 124,
    r = 60;
  const steps = [
    { title: "Warmth", sub: "Reconnect, low stakes" },
    { title: "Curiosity", sub: "What’s changed lately" },
    { title: "Care", sub: "What they’re carrying" },
    { title: "Repair", sub: "No re-arguing it" },
    { title: "Alliance", sub: "Looking ahead, together" },
  ];
  const seg = 72,
    gapDeg = 15;
  const ply = Array.from({ length: 241 }, (_, i) => {
    const th2 = (i / 240) * Math.PI * 2;
    const rr = r + 2.6 * Math.sin(th2 * 9);
    return `${(cx + rr * Math.cos(th2)).toFixed(2)} ${(cy + rr * Math.sin(th2)).toFixed(2)}`;
  });
  const ros = Array.from({ length: 361 }, (_, i) => {
    const th2 = (i / 360) * Math.PI * 2;
    const rr = 41 + 2.6 * Math.cos(th2 * 30);
    return `${(cx + rr * Math.cos(th2)).toFixed(2)} ${(cy + rr * Math.sin(th2)).toFixed(2)}`;
  });
  return (
    <Frame
      viewBox="0 0 340 280"
      label="Connection Cards: five kinds of question, Warmth, Curiosity, Care, Repair, Alliance. Thirty-five questions to flip through, alone or together."
    >
      <g {...a("dg-fade", 150, 900)}>
        <path d={`M${ros.join("L")}Z`} fill="none" stroke={V.rim} strokeWidth={0.5} strokeOpacity={0.65} />
        <circle cx={cx} cy={cy} r={35.5} fill="none" stroke={V.rim} strokeWidth={0.5} strokeOpacity={0.65} />
        <circle cx={cx} cy={cy} r={46.5} fill="none" stroke={V.rim} strokeWidth={0.5} strokeOpacity={0.65} />
        <path d={`M${ply.join("L")}Z`} fill="none" stroke={V.rim} strokeWidth={0.8} strokeOpacity={0.8} />
      </g>
      {steps.map((s, i) => {
        const am = -90 + i * seg;
        const a0 = am + gapDeg;
        const a1 = am + seg - gapDeg;
        const [ex, ey] = polar(cx, cy, r, a1);
        const ang = ((a1 + 90) * Math.PI) / 180;
        const [mx, my] = polar(cx, cy, r, am);
        const at = 350 + i * 520;
        const y = 22 + i * 46;
        return (
          <g key={s.title}>
            <path {...a("dg-draw", at + 120, 420)} pathLength={1} d={arcD(cx, cy, r, a0, a1 - 3.5)} fill="none" stroke={V.brass} strokeWidth={1.6} strokeLinecap="round" />
            <path {...a("dg-pop", at + 480, 200)} d={lancetD(ex, ey, ang, 8)} fill={V.brass} />
            <Medallion cx={mx} cy={my} n={i + 1} w={19} h={23} size={14} ground={V.accent} numColor={V.white} {...a("dg-pop", at)} />
            <g {...a("dg-rise", at + 120)}>
              <Medallion cx={172} cy={y + 8} n={i + 1} w={17} h={20} size={13.5} ground={V.accent} numColor={V.white} />
              <text x={190} y={y + 9} fontFamily={SERIF} fontSize={14.5} fontWeight={600} fill={V.ink}>
                {s.title}
              </text>
              <text x={190} y={y + 27} fontSize={13} fill={V.muted}>
                {s.sub}
              </text>
            </g>
          </g>
        );
      })}
      <g {...a("dg-fade", 200)}>
        <text x={cx} y={cy + 5} textAnchor="middle" fontFamily={SERIF} fontSize={32} fontWeight={600} fill={V.accent} className="tabular">
          35
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fontSize={13.5} fill={V.muted}>
          questions
        </text>
      </g>
      <AdvisoryStrip kind="connection" x={0} y={246} w={340} h={32} {...a("dg-rise", 3000)}>
        <text x={42} y={266.5} fontSize={13.5} fill={V.ink}>
          No wrong answers — flip a card, go deeper.
        </text>
      </AdvisoryStrip>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 0. 60-Second Alliance Reset: five numbered steps, one minute         */
/* ------------------------------------------------------------------ */
export function ResetStepsDiagram() {
  const steps = [
    { title: "Stop", sub: "Quit trying to win or solve it." },
    { title: "Say it", sub: "“I want to connect, not fight.”" },
    { title: "Touch (only if welcome)", sub: "A brief touch, nothing more." },
    { title: "Breathe", sub: "Three slow breaths together." },
    { title: "Return", sub: "Pick an exact time to keep talking." },
  ];
  const pitch = 56,
    h = 48;
  return (
    <Frame
      viewBox="0 0 340 336"
      label="60-Second Alliance Reset: stop, say “I want to connect, not fight”, a brief touch only if it’s welcome, three slow breaths, then pick an exact time to keep talking. Afraid, not just flooded? Stop and get help."
    >
      {steps.map((s, i) => {
        const y = 4 + i * pitch;
        const at = 150 + i * 260;
        return (
          <g key={s.title} {...a("dg-rise", at)}>
            <ArchPanel x={0} y={y} w={340} h={h} kind={i === 4 ? "pause" : "step"} rt={12} fill={i === 4 ? V.warm : V.white} />
            <Medallion cx={24} cy={y + h / 2} n={i + 1} w={20} h={24} size={14} />
            <text x={48} y={y + 21} fontFamily={SERIF} fontSize={15} fontWeight={600} fill={V.ink}>
              {s.title}
            </text>
            <text x={48} y={y + 38} fontSize={13.5} fill={V.muted}>
              {s.sub}
            </text>
          </g>
        );
      })}
      <AdvisoryStrip kind="safety" x={0} y={292} w={340} h={40} {...a("dg-rise", 1600)}>
        <text x={42} y={316.5} fontSize={13.5} fill={V.ink}>
          Afraid, not just flooded? Stop. Get help.
        </text>
      </AdvisoryStrip>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 7. The Core 5: the five tools to learn first                         */
/* ------------------------------------------------------------------ */
export function CoreFiveDiagram() {
  const tools: { slug: IconId; title: string; sub: string; color: string }[] = [
    { slug: "green-rule", title: "Green Rule (Safety Gate)", sub: "Honesty is never punished.", color: V.safety },
    { slug: "pause-and-return", title: "Pause + Return", sub: "20 min – 24 h, exact return time.", color: V.pause },
    { slug: "60-second-reset", title: "60-Second Alliance Reset", sub: "When it’s become a fight to win.", color: V.pause },
    { slug: "micro-repair", title: "Micro-Repair", sub: "Small repairs, early.", color: V.repair },
    { slug: "weekly-reset", title: "Weekly Reset", sub: "Five parts, about 40 minutes.", color: V.accent },
  ];
  const pitch = 64,
    h = 56;
  return (
    <Frame
      viewBox="0 0 340 336"
      label="The Core 5, all in the Core tier: Green Rule (Safety Gate), Pause + Return, 60-Second Alliance Reset, Micro-Repair, Weekly Reset."
    >
      {tools.map((tl, i) => {
        const y = 8 + i * pitch;
        return (
          <g key={tl.slug} {...a("dg-rise", 150 + i * 220)}>
            <ArchPanel x={0} y={y} w={340} h={h} kind="step" rt={12} fill={V.white} />
            <IconSeat slug={tl.slug} cx={26} cy={y + h / 2} size={24} color={tl.color} />
            <text x={54} y={y + 24} fontFamily={SERIF} fontSize={15} fontWeight={600} fill={V.ink}>
              {tl.title}
            </text>
            <text x={54} y={y + 42} fontSize={13.5} fill={V.muted}>
              {tl.sub}
            </text>
            {/* tier badge: dot glyph beside its text label */}
            <ApIconG id="tier-core" x={276} y={y + 12} size={14} color={V.accent} />
            <text x={326} y={y + 23.5} textAnchor="end" fontSize={12} fontWeight={500} letterSpacing="0.08em" fill={V.accent}>
              CORE
            </text>
          </g>
        );
      })}
    </Frame>
  );
}
