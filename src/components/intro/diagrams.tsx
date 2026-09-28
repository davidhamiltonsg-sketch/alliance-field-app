import type { CSSProperties, ReactNode } from "react";
import { ProtocolIcon } from "../visuals/ProtocolIcon";

/**
 * Animated intro diagrams, re-laid out for a phone from the printed visuals
 * library (system-overview, situation-map-card, pause-return-timeline,
 * pattern-loop-cycle, weekly-reset-loop). Same palette, line semantics and
 * wording; sized so 13-unit text stays legible at 340 px.
 *
 * Motion is CSS only (see globals.css "dg-*"): each element's resting state
 * is its final state; the parent adds `.dg-armed` and `.is-active` to play.
 */

const C = {
  ink: "#1A1A1A",
  muted: "#4A4A4A",
  accent: "#3D5A4C",
  pause: "#C47A1A",
  repair: "#2F5F8A",
  failure: "#A33B2B",
  safety: "#2E7D4F",
  rail: "#B8C2BB",
  track: "#E4E9E5",
  tool: "#EEF2EF",
  activity: "#F3F0E8",
  warn: "#F7EDE6",
  white: "#FFFFFF",
};

type Vars = CSSProperties & Record<`--${string}`, string | number>;
const t = (d: number, dur?: number, extra: Vars = {}): Vars => ({
  "--d": `${d}ms`,
  ...(dur ? { "--dur": `${dur}ms` } : {}),
  ...extra,
});

function Frame({
  label,
  viewBox,
  children,
}: {
  label: string;
  viewBox: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      className="block h-auto w-full font-sans"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

function Icon({
  x,
  y,
  size = 20,
  color,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  color: string;
  children: ReactNode;
}) {
  const s = size / 24;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </g>
  );
}

/** Library protocol icon placed inside an SVG. */
function LibIcon({ slug, x, y, size = 18, color }: { slug: string; x: number; y: number; size?: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} style={{ color }}>
      <ProtocolIcon slug={slug} size={size} />
    </g>
  );
}

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

/* ------------------------------------------------------------------ */
/* 1. One system: Manual + Kit + App → Situation → Protocol → Practice  */
/* ------------------------------------------------------------------ */
export function SystemDiagram() {
  const cards = [
    {
      x: 4,
      title: "Manual",
      sub: ["26 chapters,", "three parts"],
      fill: C.white,
      icon: <path d="M3.5 5.5c2.8-1.2 5.6-1.2 8.5.8 2.9-2 5.7-2 8.5-.8v13c-2.8-1.2-5.6-1.2-8.5.8-2.9-2-5.7-2-8.5-.8zM12 6.3v13" />,
    },
    {
      x: 120,
      title: "Field Kit",
      sub: ["12 cards,", "8 worksheets"],
      fill: C.tool,
      icon: (
        <>
          <rect x="4.5" y="7" width="12" height="14" rx="2" />
          <path d="M8 4h9.5a2 2 0 0 1 2 2v12" />
        </>
      ),
    },
    {
      x: 236,
      title: "Field App",
      sub: ["Companion", "router"],
      fill: C.white,
      icon: (
        <>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
          <path d="M10.5 18h3" />
        </>
      ),
    },
  ];
  const flow = ["Situation", "Protocol", "Practice"];
  const chev = (x: number, w: number, first: boolean) => {
    const y = 186,
      h = 58,
      p = 12;
    return first
      ? `M${x} ${y}H${x + w - p}L${x + w} ${y + h / 2}L${x + w - p} ${y + h}H${x}Z`
      : `M${x} ${y}H${x + w - p}L${x + w} ${y + h / 2}L${x + w - p} ${y + h}H${x}L${x + p} ${y + h / 2}Z`;
  };
  return (
    <Frame
      viewBox="0 0 340 300"
      label="Manual, Field Kit and Field App work as one system: find the situation, pull the protocol, practise it."
    >
      {cards.map((c, i) => (
        <g key={c.title} className="dg-rise" style={t(80 + i * 140)}>
          <rect x={c.x} y={6} width={100} height={100} rx={14} fill={c.fill} stroke={C.accent} strokeOpacity={0.55} strokeWidth={1.25} />
          <Icon x={c.x + 12} y={18} size={22} color={C.accent}>
            {c.icon}
          </Icon>
          <text x={c.x + 12} y={66} fontSize={14} fontWeight={600} fill={C.ink}>
            {c.title}
          </text>
          {c.sub.map((s, j) => (
            <text key={s} x={c.x + 12} y={83 + j * 15} fontSize={12.5} fill={C.muted}>
              {s}
            </text>
          ))}
        </g>
      ))}
      {/* converge */}
      <g fill="none" stroke={C.rail} strokeWidth={2} strokeLinecap="round">
        <path className="dg-draw" style={t(620, 600)} pathLength={1} d="M54 108C54 136 120 132 170 150" />
        <path className="dg-draw" style={t(620, 600)} pathLength={1} d="M170 108V150" />
        <path className="dg-draw" style={t(620, 600)} pathLength={1} d="M286 108C286 136 220 132 170 150" />
        <path className="dg-draw" style={t(1120, 300)} pathLength={1} d="M170 150V172" />
      </g>
      <path className="dg-pop" style={t(1300, 300)} d="M164 170L170 178L176 170Z" fill={C.rail} />
      <circle className="dg-pop" style={t(1080, 360)} cx={170} cy={150} r={5} fill={C.accent} />
      {/* flow chevrons */}
      {flow.map((f, i) => {
        const x = 2 + i * 110;
        const hi = i === 1;
        return (
          <g key={f} className="dg-rise" style={t(1400 + i * 220)}>
            <path d={chev(x, 116, i === 0)} fill={hi ? C.tool : C.white} stroke={C.accent} strokeOpacity={0.7} strokeWidth={1.4} strokeLinejoin="round" />
            <text x={x + (i === 0 ? 52 : 58)} y={220} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ink}>
              {f}
            </text>
          </g>
        );
      })}
      {/* travelling marker along the flow */}
      <circle
        className="dg-move"
        style={t(2200, 2600, { "--move": "dg-sys-travel", "--iter": "infinite" })}
        cx={300}
        cy={254}
        r={4}
        fill={C.pause}
      />
      <path d="M20 254H318" stroke={C.track} strokeWidth={2} strokeLinecap="round" className="dg-fade" style={t(2000)} />
      {/* flood gate band */}
      <g className="dg-rise" style={t(2100)}>
        <rect x={2} y={268} width={336} height={30} rx={10} fill={C.activity} stroke={C.pause} strokeWidth={1.5} strokeDasharray="6 4" />
        <LibIcon slug="pause-and-return" x={12} y={274} size={18} color={C.pause} />
        <text x={38} y={288} fontSize={13} fill={C.ink}>
          Flooded? Pause + Return or Green Rule first.
        </text>
      </g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Situation Map: first-match flowchart, one route highlighted       */
/* ------------------------------------------------------------------ */
export function SituationMapDiagram() {
  const rows = [
    { q: ["Flooded, shut", "down, or unsafe", "to speak?"], a: ["Pause + Return"], icon: "pause-and-return" },
    { q: ["Trust breach or", "uninvestment?"], a: ["Trust Recovery", "+ Proof"], icon: "trust-recovery" },
    { q: ["Daily drift or", "weekly upkeep?"], a: ["Rhythm +", "Weekly Reset"], icon: "morning-evening-rhythm" },
    { q: ["Conflict starting?"], a: ["Green Rule, then", "Overlay or", "Conflict"], icon: "conflict-protocol" },
  ];
  const top = 26,
    pitch = 76,
    h = 60,
    hx = 2,
    hw = 158,
    bx = 180,
    bw = 158;
  const hex = (y: number) =>
    `M${hx + 12} ${y}H${hx + hw - 12}L${hx + hw} ${y + h / 2}L${hx + hw - 12} ${y + h}H${hx + 12}L${hx} ${y + h / 2}Z`;
  return (
    <Frame
      viewBox="0 0 340 330"
      label="Situation Map: answer yes or no from the top. Flooded, shut down, or unsafe to speak routes straight to Pause + Return."
    >
      <text x={2} y={13} fontSize={13} fill={C.muted} className="dg-fade" style={t(0)}>
        Follow the first match, top to bottom.
      </text>
      {rows.map((r, i) => {
        const y = top + i * pitch;
        const cy = y + h / 2;
        const lh = 15;
        const qy = cy - ((r.q.length - 1) * lh) / 2 + 4.5;
        const ay = cy - ((r.a.length - 1) * lh) / 2 + (i === 0 ? -3 : 4.5);
        const first = i === 0;
        return (
          <g key={i} className={first ? undefined : "dg-dim"} style={first ? undefined : t(1700 + i * 60, 600, { "--dim": 0.42 })}>
            <g className="dg-rise" style={t(150 + i * 230)}>
              <path d={hex(y)} fill={C.white} stroke={C.accent} strokeOpacity={0.55} strokeWidth={1.3} strokeLinejoin="round" />
              {r.q.map((l, j) => (
                <text key={l} x={hx + hw / 2} y={qy + j * lh} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.ink}>
                  {l}
                </text>
              ))}
            </g>
            <path
              className="dg-draw"
              style={t(350 + i * 230, 260)}
              pathLength={1}
              d={`M${hx + hw + 2} ${cy}H${bx - 7}`}
              stroke={C.rail}
              strokeWidth={1.6}
              fill="none"
            />
            <path className="dg-pop" style={t(560 + i * 230, 240)} d={`M${bx - 8} ${cy - 4}L${bx - 1} ${cy}L${bx - 8} ${cy + 4}Z`} fill={C.rail} />
            <g className="dg-rise" style={t(420 + i * 230)}>
              <rect
                x={bx}
                y={y}
                width={bw}
                height={h}
                rx={11}
                fill={C.white}
                stroke={i === 1 ? C.repair : C.accent}
                strokeOpacity={0.6}
                strokeWidth={1.3}
              />
              <LibIcon slug={r.icon} x={bx + 10} y={i === 0 ? cy - 16 : cy - 9} color={i === 1 ? C.repair : C.accent} />
              {r.a.map((l, j) => (
                <text key={l} x={bx + 36} y={ay + j * lh} fontSize={13} fontWeight={600} fill={C.ink}>
                  {l}
                </text>
              ))}
            </g>
            {i < rows.length - 1 && (
              <g className="dg-fade" style={t(300 + i * 230)}>
                <path d={`M${hx + hw / 2} ${y + h + 2}V${y + pitch - 6}`} stroke={C.rail} strokeWidth={1.6} />
                <path d={`M${hx + hw / 2 - 4} ${y + pitch - 8}L${hx + hw / 2} ${y + pitch - 2}L${hx + hw / 2 + 4} ${y + pitch - 8}Z`} fill={C.rail} />
                <text x={hx + hw / 2 + 9} y={y + h + 13} fontSize={12} fill={C.muted}>
                  no
                </text>
              </g>
            )}
          </g>
        );
      })}
      {/* highlighted route: Flooded → Pause + Return */}
      <g>
        <path className="dg-fade" style={t(1350, 400)} d={hex(top)} fill="none" stroke={C.pause} strokeWidth={2.4} strokeLinejoin="round" />
        <path
          className="dg-draw"
          style={t(1450, 380)}
          pathLength={1}
          d={`M${hx + hw + 2} ${top + h / 2}H${bx - 7}`}
          stroke={C.pause}
          strokeWidth={2.4}
          fill="none"
        />
        <path className="dg-pop" style={t(1700, 260)} d={`M${bx - 9} ${top + h / 2 - 5}L${bx} ${top + h / 2}L${bx - 9} ${top + h / 2 + 5}Z`} fill={C.pause} />
        <rect className="dg-pulse" style={t(2000)} x={bx} y={top} width={bw} height={h} rx={11} fill="none" stroke={C.safety} strokeWidth={2} />
        <rect className="dg-pop" style={t(1750, 420)} x={bx} y={top} width={bw} height={h} rx={11} fill="none" stroke={C.safety} strokeWidth={2.6} />
        <text className="dg-fade" style={t(1850)} x={bx + 36} y={top + h / 2 + 14} fontSize={12} fill={C.muted}>
          or 60-Second Reset
        </text>
      </g>
      <text x={2} y={326} fontSize={12.5} fill={C.muted} className="dg-fade" style={t(1300)}>
        Three more rows follow in the map.
      </text>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Pause + Return timeline with a travelling marker                  */
/* ------------------------------------------------------------------ */
export function PauseTimelineDiagram() {
  const rx = 22;
  const s = 0.82; // time scale for delays
  const stops = [
    { y: 22, title: "Flooded or shut down", detail: "Racing heart, tunnel vision.", at: 250 },
    { y: 82, title: "“I need a pause.”", detail: "“I’ll be ready at ___.”", at: 1300 },
    { y: 146, title: "Separate and down-regulate", detail: "Walk, shower, breathe, music.", at: 2200 },
    { y: 250, title: "“See you at ___.”", detail: "At the agreed time, even briefly.", at: 3850 },
    { y: 306, title: "Warmth → Safety", detail: "Not “where we left off”.", at: 4700 },
  ];
  return (
    <Frame
      viewBox="0 0 340 336"
      label="Pause + Return timeline: flooded, signal a pause with a return time, separate for 15 minutes to 24 hours, return at the agreed time, restart with warmth then safety."
    >
      <path d={`M${rx} 22V306`} stroke={C.track} strokeWidth={2} strokeLinecap="round" />
      <path className="dg-draw" style={t(200, 4700 * s)} pathLength={1} d={`M${rx} 22V306`} stroke={C.rail} strokeWidth={2} strokeLinecap="round" fill="none" />
      {/* pause window capsule */}
      <g className="dg-pop" style={t(2150 * s, 420)}>
        <rect x={rx - 8} y={140} width={16} height={86} rx={8} fill={C.activity} stroke={C.pause} strokeWidth={1.6} strokeDasharray="5 3.5" />
      </g>
      <path className="dg-draw" style={t(2300 * s, 1300 * s)} pathLength={1} d={`M${rx} 148V218`} stroke={C.pause} strokeOpacity={0.55} strokeWidth={6} strokeLinecap="round" fill="none" />
      {/* stop nodes */}
      <circle className="dg-pop" style={t(stops[0].at * s)} cx={rx} cy={22} r={5.5} fill={C.muted} />
      <circle className="dg-pop" style={t(stops[1].at * s)} cx={rx} cy={82} r={6.5} fill={C.pause} />
      <g className="dg-pop" style={t(stops[3].at * s)}>
        <circle cx={rx} cy={250} r={8} fill={C.white} stroke={C.repair} strokeWidth={2.4} />
        <circle cx={rx} cy={250} r={3.2} fill={C.repair} />
      </g>
      <rect className="dg-pop" style={t(stops[4].at * s)} x={rx - 5} y={296} width={10} height={20} rx={5} fill={C.repair} />
      {/* marker */}
      <circle
        className="dg-move"
        style={t(250 * s, 4700 * s, { "--move": "dg-pr-travel" })}
        cx={rx}
        cy={306}
        r={9}
        fill="none"
        stroke={C.pause}
        strokeWidth={2.4}
      />
      {stops.map((p) => (
        <g key={p.title} className="dg-rise" style={t(p.at * s)}>
          <text x={48} y={p.y + 5} fontSize={14.5} fontWeight={600} fill={C.ink}>
            {p.title}
          </text>
          <text x={48} y={p.y + 24} fontSize={13} fill={C.muted}>
            {p.detail}
          </text>
        </g>
      ))}
      {/* the window's range */}
      <g className="dg-pop" style={t(2600 * s)}>
        <rect x={48} y={188} width={104} height={26} rx={13} fill={C.white} stroke={C.pause} strokeOpacity={0.6} strokeWidth={1.3} />
        <text x={100} y={205.5} textAnchor="middle" fontSize={13} fontWeight={600} fill="#9A5E10" className="tabular">
          15 min – 24 h
        </text>
      </g>
      <text className="dg-fade" style={t(2750 * s)} x={162} y={205.5} fontSize={12.5} fill={C.muted}>
        No rehearsing arguments.
      </text>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Pattern loop with the interruption point                          */
/* ------------------------------------------------------------------ */
export function PatternLoopDiagram() {
  const cx = 170,
    cy = 144,
    r = 94;
  const stages = [
    { name: "Trigger", a: -90, color: C.pause, lx: 0, ly: -24 },
    { name: "Pattern", a: -18, color: C.pause, lx: 0, ly: 32 },
    { name: "Escalation", a: 54, color: C.pause, lx: 0, ly: 32 },
    { name: "Residue", a: 126, color: C.failure, lx: 0, ly: 32 },
    { name: "Reinforcement", a: 198, color: C.failure, lx: 2, ly: 32 },
  ];
  const gapDeg = 11;
  const breakAt = 18; // between Pattern and Escalation
  const [b0x, b0y] = polar(cx, cy, r - 13, breakAt);
  const [b1x, b1y] = polar(cx, cy, r + 13, breakAt);
  const [px, py] = polar(cx, cy, r, -18);
  return (
    <Frame
      viewBox="0 0 340 266"
      label="Pattern loop: trigger, pattern, escalation, residue, reinforcement, then back to trigger. Interrupt at the pattern stage to stop the loop."
    >
      {/* arcs */}
      {stages.map((s, i) => {
        const a0 = s.a + gapDeg;
        const a1 = s.a + 72 - gapDeg;
        const [hx, hy] = polar(cx, cy, r, a1);
        const ang = a1 + 90;
        const downstream = i >= 1;
        return (
          <g key={s.name} className={downstream ? "dg-dim" : undefined} style={downstream ? t(2750, 700, { "--dim": 0.26 }) : undefined}>
            <path className="dg-draw" style={t(1000 + i * 230, 260)} pathLength={1} d={arc(cx, cy, r, a0, a1)} fill="none" stroke={C.failure} strokeOpacity={0.75} strokeWidth={1.8} strokeLinecap="round" />
            <g transform={`translate(${hx.toFixed(2)} ${hy.toFixed(2)}) rotate(${ang})`}>
              <path className="dg-pop" style={t(1220 + i * 230, 200)} d="M-5 -4.5L4 0L-5 4.5Z" fill={C.failure} fillOpacity={0.85} />
            </g>
          </g>
        );
      })}
      {/* nodes */}
      {stages.map((s, i) => {
        const [x, y] = polar(cx, cy, r, s.a);
        const dim = i >= 2;
        return (
          <g key={s.name} className={dim ? "dg-dim" : undefined} style={dim ? t(2750, 700, { "--dim": 0.4 }) : undefined}>
            <g className="dg-pop" style={t(120 + i * 170)}>
              <circle cx={x} cy={y} r={15} fill={s.color} />
              <text x={x} y={y + 4.8} textAnchor="middle" fontSize={13.5} fontWeight={600} fill={C.white}>
                {i + 1}
              </text>
            </g>
            <text className="dg-fade" style={t(260 + i * 170)} x={x + s.lx} y={y + s.ly} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ink}>
              {s.name}
            </text>
          </g>
        );
      })}
      {/* centre */}
      <g className="dg-fade" style={t(900)}>
        <text x={cx} y={cy + 24} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ink}>
          Self-sustaining
        </text>
        <text x={cx} y={cy + 42} textAnchor="middle" fontSize={13} fill={C.muted}>
          until interrupted
        </text>
      </g>
      {/* interruption at Pattern */}
      <circle className="dg-pulse" style={t(2250)} cx={px} cy={py} r={15} fill="none" stroke={C.pause} strokeWidth={2.5} />
      <circle className="dg-pop" style={t(2200, 380)} cx={px} cy={py} r={20} fill="none" stroke={C.pause} strokeWidth={2} strokeDasharray="4 3" />
      <path className="dg-pop" style={t(2500, 360)} d={`M${b0x.toFixed(2)} ${b0y.toFixed(2)}L${b1x.toFixed(2)} ${b1y.toFixed(2)}`} stroke={C.pause} strokeWidth={4.5} strokeLinecap="round" />
      <g className="dg-pop" style={t(2300, 420)}>
        <rect x={262} y={56} width={76} height={26} rx={13} fill={C.activity} stroke={C.pause} strokeWidth={1.4} strokeDasharray="5 3" />
        <text x={300} y={73.5} textAnchor="middle" fontSize={13} fontWeight={600} fill="#9A5E10">
          Interrupt
        </text>
      </g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Weekly Reset: circular agenda that fills step by step             */
/* ------------------------------------------------------------------ */
export function WeeklyResetDiagram() {
  const cx = 86,
    cy = 124,
    r = 64;
  const steps = [
    { title: "Appreciation", sub: "5 min" },
    { title: "Care Audit", sub: "10–15 min" },
    { title: "Friction Review", sub: "10–15 min · 2% Rule" },
    { title: "Requests", sub: "One ask each" },
    { title: "Alignment", sub: "Next step + review" },
  ];
  const seg = 72,
    gap = 4;
  return (
    <Frame
      viewBox="0 0 340 280"
      label="Weekly Reset agenda: appreciation 5 minutes, care audit 10 to 15, friction review 10 to 15, requests, alignment. A 30-minute timer, same day and time each week."
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.track} strokeWidth={14} />
      {steps.map((s, i) => {
        const a0 = -90 + i * seg + gap;
        const a1 = -90 + (i + 1) * seg - gap;
        const [nx, ny] = polar(cx, cy, r, (a0 + a1) / 2);
        const at = 350 + i * 520;
        const y = 22 + i * 44;
        return (
          <g key={s.title}>
            <path className="dg-draw" style={t(at, 460)} pathLength={1} d={arc(cx, cy, r, a0, a1)} fill="none" stroke={C.accent} strokeWidth={14} strokeLinecap="butt" />
            <text className="dg-fade" style={t(at + 260)} x={nx} y={ny + 4.3} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={C.white}>
              {i + 1}
            </text>
            <g className="dg-rise" style={t(at + 120)}>
              <circle cx={184} cy={y + 8} r={11} fill={C.accent} />
              <text x={184} y={y + 12.6} textAnchor="middle" fontSize={12.5} fontWeight={600} fill={C.white}>
                {i + 1}
              </text>
              <text x={203} y={y + 7} fontSize={14} fontWeight={600} fill={C.ink}>
                {s.title}
              </text>
              <text x={203} y={y + 25} fontSize={12.5} fill={C.muted} className="tabular">
                {s.sub}
              </text>
            </g>
          </g>
        );
      })}
      <g className="dg-fade" style={t(200)}>
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={30} fontWeight={600} fill={C.accent} className="tabular">
          30
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fontSize={12.5} fill={C.muted}>
          minutes
        </text>
      </g>
      <path className="dg-fade" style={t(2900)} d={arc(cx, cy, r + 15, -120, -96)} fill="none" stroke={C.accent} strokeWidth={1.6} strokeDasharray="4 3" strokeLinecap="round" />
      <text className="dg-fade" style={t(2900)} x={8} y={36} fontSize={12} fontWeight={600} fill={C.accent}>
        next week
      </text>
      <g className="dg-rise" style={t(3000)}>
        <rect x={2} y={244} width={336} height={32} rx={10} fill={C.activity} stroke={C.pause} strokeWidth={1.5} strokeDasharray="6 4" />
        <LibIcon slug="pause-and-return" x={12} y={251} size={18} color={C.pause} />
        <text x={38} y={265} fontSize={13} fill={C.ink}>
          Either partner flooded? Pause + Return first.
        </text>
      </g>
    </Frame>
  );
}
