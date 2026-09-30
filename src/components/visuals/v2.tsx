import type { CSSProperties, ReactNode } from "react";

/**
 * THE ALLIANCE visual language v2, ported from the visuals library
 * (/workspace/alliance-product/visuals/src/lib.py) for use inside React SVG.
 *
 * Motif: the interlocking-arch mark. Panels are arch-topped, numerals sit in
 * forest arch medallions with a brass rim, decisions are lenses, connectors
 * are threads with a bead start and a lancet (leaf-tip) end, and sequences
 * hang on a two-ply woven spine. Brass is for hairlines, rims, numerals and
 * ornament only, never body copy.
 */

export const V = {
  ink: "#1A1A1A",
  muted: "#4A4A4A",
  paper: "#FAFAF8",
  white: "#FFFFFF",
  forest: "#2C3E2D",
  accent: "#2C3E2D",
  thread: "#6F8177",
  hair: "#9FB2A6",
  brass: "#A8895A",
  brassL: "#D8C69F",
  safety: "#2E7D4F",
  pause: "#C47A1A",
  pauseInk: "#8F5610",
  repair: "#2F5F8A",
  failure: "#A33B2B",
  tint: "#EEF2EF",
  warm: "#F3F0E8",
  warn: "#F7EDE6",
} as const;

export const SERIF = "var(--font-source-serif), Georgia, 'Times New Roman', serif";

export type Kind = "step" | "pause" | "repair" | "safety" | "failure" | "note" | "plain";

export const kindColor: Record<Kind, string> = {
  step: V.accent,
  plain: V.accent,
  pause: V.pause,
  repair: V.repair,
  safety: V.safety,
  failure: V.failure,
  note: V.muted,
};

export const kindFill: Record<Kind, string> = {
  step: V.white,
  plain: V.white,
  pause: V.warm,
  repair: V.white,
  safety: V.tint,
  failure: V.warn,
  note: "none",
};

const n = (v: number) => Number(v.toFixed(2));

/* ---------------------------------------------------------------- geometry */

/** Arch-topped panel: generous shoulders on top, near-square foot. Closed path. */
export function archD(x: number, y: number, w: number, h: number, rt?: number, rb = 2.5) {
  const r = Math.min(w / 2, h, rt ?? Math.min(15, h * 0.42));
  const b = Math.min(rb, h / 4, w / 4);
  return (
    `M${n(x)} ${n(y + h - b)}V${n(y + r)}A${n(r)} ${n(r)} 0 0 1 ${n(x + r)} ${n(y)}H${n(x + w - r)}` +
    `A${n(r)} ${n(r)} 0 0 1 ${n(x + w)} ${n(y + r)}V${n(y + h - b)}Q${n(x + w)} ${n(y + h)} ${n(x + w - b)} ${n(y + h)}` +
    `H${n(x + b)}Q${n(x)} ${n(y + h)} ${n(x)} ${n(y + h - b)}Z`
  );
}

/** Closed arch medallion: semicircular top, flat foot. */
export function tombD(cx: number, y: number, w: number, h: number) {
  const r = w / 2;
  return `M${n(cx - r)} ${n(y + h)}V${n(y + r)}A${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${n(y + r)}V${n(y + h)}Z`;
}

/** Horizontal vesica (the mark's leaf laid on its side): the decision shape. */
export function lensD(cx: number, cy: number, w: number, h: number) {
  const hw = w / 2,
    hh = h / 2;
  const R = (hw * hw + hh * hh) / (2 * hh);
  return `M${n(cx - hw)} ${n(cy)}A${n(R)} ${n(R)} 0 0 1 ${n(cx + hw)} ${n(cy)}A${n(R)} ${n(R)} 0 0 1 ${n(cx - hw)} ${n(cy)}Z`;
}

/** Lancet chevron: leaf-tip point on the right, matching concave seat on the left. */
export function chevronD(x: number, y: number, w: number, h: number, first = false, tip = 14) {
  const head =
    `H${n(x + w - tip)}Q${n(x + w - tip * 0.2)} ${n(y + h * 0.2)} ${n(x + w)} ${n(y + h / 2)}` +
    `Q${n(x + w - tip * 0.2)} ${n(y + h * 0.8)} ${n(x + w - tip)} ${n(y + h)}`;
  if (first) {
    const r = Math.min(10, h / 2);
    return (
      `M${n(x + r)} ${n(y)}${head}H${n(x + r)}Q${n(x)} ${n(y + h)} ${n(x)} ${n(y + h - r)}V${n(y + r)}` +
      `Q${n(x)} ${n(y)} ${n(x + r)} ${n(y)}Z`
    );
  }
  return (
    `M${n(x)} ${n(y)}${head}H${n(x)}Q${n(x + tip * 0.8)} ${n(y + h * 0.8)} ${n(x + tip)} ${n(y + h / 2)}` +
    `Q${n(x + tip * 0.8)} ${n(y + h * 0.2)} ${n(x)} ${n(y)}Z`
  );
}

export const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};

export const arcD = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M${n(x0)} ${n(y0)}A${r} ${r} 0 ${large} ${sweep} ${n(x1)} ${n(y1)}`;
};

/* ---------------------------------------------------------------- threads */

/** Slim lancet (leaf-tip) terminal pointing along `ang` (radians), tip on (x, y). */
export function lancetD(x: number, y: number, ang: number, size = 7.5) {
  const ca = Math.cos(ang),
    sa = Math.sin(ang);
  const L = size,
    W = size * 0.42;
  const bx = x - L * ca,
    by = y - L * sa;
  const nx = -sa,
    ny = ca;
  const p1 = [bx + nx * W, by + ny * W];
  const p2 = [bx - nx * W, by - ny * W];
  const c1 = [x - L * 0.45 * ca + nx * W * 0.75, y - L * 0.45 * sa + ny * W * 0.75];
  const c2 = [x - L * 0.45 * ca - nx * W * 0.75, y - L * 0.45 * sa - ny * W * 0.75];
  const nb = [x - L * 0.72 * ca, y - L * 0.72 * sa];
  return (
    `M${n(x)} ${n(y)}Q${n(c1[0])} ${n(c1[1])} ${n(p1[0])} ${n(p1[1])}Q${n(nb[0])} ${n(nb[1])} ${n(p2[0])} ${n(p2[1])}` +
    `Q${n(c2[0])} ${n(c2[1])} ${n(x)} ${n(y)}Z`
  );
}

/** Continuous thread path through pts with rounded corners, shortened for the lancet. */
export function threadD(pts: [number, number][], roundR = 10, size = 7.5, head = true) {
  const [x1, y1] = pts[pts.length - 2];
  const [x2, y2] = pts[pts.length - 1];
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const short = head ? size * 0.62 : 0;
  const P = [...pts.slice(0, -1), [x2 - short * Math.cos(ang), y2 - short * Math.sin(ang)] as [number, number]];
  let d = `M${n(P[0][0])} ${n(P[0][1])}`;
  for (let i = 1; i < P.length - 1; i++) {
    const [ax, ay] = P[i - 1],
      [bx, by] = P[i],
      [cx, cy] = P[i + 1];
    const l1 = Math.hypot(bx - ax, by - ay),
      l2 = Math.hypot(cx - bx, cy - by);
    const r = Math.min(roundR, l1 / 2, l2 / 2);
    if (r < 0.5) {
      d += `L${n(bx)} ${n(by)}`;
      continue;
    }
    const p = [bx - ((bx - ax) / l1) * r, by - ((by - ay) / l1) * r];
    const q = [bx + ((cx - bx) / l2) * r, by + ((cy - by) / l2) * r];
    d += `L${n(p[0])} ${n(p[1])}Q${n(bx)} ${n(by)} ${n(q[0])} ${n(q[1])}`;
  }
  d += `L${n(P[P.length - 1][0])} ${n(P[P.length - 1][1])}`;
  return { d, tip: [x2, y2] as const, ang };
}

type Anim = { className?: string; style?: CSSProperties };

/**
 * Thread connector: bead at the start, lancet at the end, no arrowheads.
 * `line` animates the thread (e.g. dg-draw), `ends` animates bead and tip.
 */
export function Thread({
  pts,
  color = V.thread,
  sw = 1,
  size = 7.5,
  roundR = 10,
  bead = true,
  head = true,
  line,
  ends,
  tipAnim,
}: {
  pts: [number, number][];
  color?: string;
  sw?: number;
  size?: number;
  roundR?: number;
  bead?: boolean;
  head?: boolean;
  line?: Anim;
  ends?: Anim;
  tipAnim?: Anim;
}) {
  const t = threadD(pts, roundR, size, head);
  return (
    <g>
      <path
        d={t.d}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={line?.className?.includes("dg-draw") ? 1 : undefined}
        className={line?.className}
        style={line?.style}
      />
      {bead && <circle cx={pts[0][0]} cy={pts[0][1]} r={1.9} fill={color} className={ends?.className} style={ends?.style} />}
      {head && (
        <path
          d={lancetD(t.tip[0], t.tip[1], t.ang, size)}
          fill={color}
          className={(tipAnim ?? ends)?.className}
          style={(tipAnim ?? ends)?.style}
        />
      )}
    </g>
  );
}

/** Points of the two plies of a twist from y0 to y1 (cross once at the midpoint). */
export function twistPlies(x: number, y0: number, y1: number, amp = 4.2, steps?: number) {
  const k = steps ?? Math.max(12, Math.round(Math.abs(y1 - y0) / 2.5));
  const A: [number, number][] = [],
    B: [number, number][] = [];
  for (let i = 0; i <= k; i++) {
    const t = i / k;
    const yy = y0 + (y1 - y0) * t;
    const dx = amp * Math.cos(Math.PI * t);
    A.push([x + dx, yy]);
    B.push([x - dx, yy]);
  }
  return { A, B };
}

const polyD = (pts: [number, number][]) => "M" + pts.map(([a, b]) => `${n(a)} ${n(b)}`).join("L");

/**
 * One woven twist between two stations: the under ply breaks at the crossing.
 * Returns path data for [over, underTop, underBottom] with colours.
 */
export function twistPaths(x: number, y0: number, y1: number, amp = 4.2, startOver = 0, gapFrac = 0.09) {
  const { A, B } = twistPlies(x, y0, y1, amp);
  const k = A.length - 1;
  const under = startOver % 2 === 0 ? A : B;
  const over = startOver % 2 === 0 ? B : A;
  const g0 = Math.floor(k * (0.5 - gapFrac)),
    g1 = Math.ceil(k * (0.5 + gapFrac));
  return {
    over: polyD(over),
    underA: polyD(under.slice(0, g0 + 1)),
    underB: polyD(under.slice(g1)),
    overColor: startOver % 2 === 0 ? V.brass : V.accent,
    underColor: startOver % 2 === 0 ? V.accent : V.brass,
  };
}

/** Woven spine segment (two plies, forest and brass, crossing over/under). */
export function Twist({
  x,
  y0,
  y1,
  amp = 4.2,
  startOver = 0,
  className,
  style,
  nonScaling,
}: {
  x: number;
  y0: number;
  y1: number;
  amp?: number;
  startOver?: number;
  className?: string;
  style?: CSSProperties;
  nonScaling?: boolean;
}) {
  const t = twistPaths(x, y0, y1, amp, startOver);
  const ve = nonScaling ? ("non-scaling-stroke" as const) : undefined;
  const draw = className?.includes("dg-draw");
  const common = {
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: ve,
    pathLength: draw ? 1 : undefined,
    className,
    style,
  };
  return (
    <g>
      <path d={t.underA} stroke={t.underColor} strokeWidth={t.underColor === V.brass ? 1 : 1.1} {...common} />
      <path d={t.underB} stroke={t.underColor} strokeWidth={t.underColor === V.brass ? 1 : 1.1} {...common} />
      <path d={t.over} stroke={t.overColor} strokeWidth={t.overColor === V.brass ? 1 : 1.1} {...common} />
    </g>
  );
}

/* ---------------------------------------------------------------- medallions */

/** Forest arch medallion, brass hairline rim set off by a paper gap, serif italic numeral. */
export function Medallion({
  cx,
  cy,
  n: num,
  w = 22,
  h = 26,
  size = 15,
  ground = V.forest,
  numColor = V.brassL,
  rim = V.brass,
  gap = V.paper,
  className,
  style,
}: {
  cx: number;
  cy: number;
  n: number | string;
  w?: number;
  h?: number;
  size?: number;
  ground?: string;
  numColor?: string;
  rim?: string;
  gap?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const y = cy - h / 2;
  return (
    <g className={className} style={style}>
      <path d={tombD(cx, y - 2.4, w + 4.8, h + 4.8)} fill={gap} stroke={rim} strokeWidth={0.8} />
      <path d={tombD(cx, y, w, h)} fill={ground} />
      <text
        x={cx}
        y={y + h * 0.5 + size * 0.36 + 2.2}
        textAnchor="middle"
        fontFamily={SERIF}
        fontStyle="italic"
        fontSize={size}
        fill={numColor}
      >
        {num}
      </text>
    </g>
  );
}

/* ---------------------------------------------------------------- glyphs */

/** Status glyphs drawn from the mark geometry, on a 16 grid. */
const GLYPHS: Record<string, ReactNode> = {
  // safety: shield-arch with the mark's leaf
  safety: (
    <>
      <path d="M3 5.6A5 5 0 0 1 13 5.6V8.4C13 11.6 10.7 13.9 8 15.2 5.3 13.9 3 11.6 3 8.4Z" />
      <path d="M8 5.2C9.4 6.6 9.9 7.9 9.9 9 9.9 10.3 9 11.2 8 11.9 7 11.2 6.1 10.3 6.1 9 6.1 7.9 6.6 6.6 8 5.2Z" fill="currentColor" stroke="none" />
    </>
  ),
  // pause: hourglass-arch
  pause: (
    <>
      <path d="M3.2 1.6H12.8M3.2 14.4H12.8" />
      <path d="M4.6 1.6V3.8A3.4 3.4 0 0 0 11.4 3.8V1.6" />
      <path d="M4.6 14.4V12.2A3.4 3.4 0 0 1 11.4 12.2V14.4" />
      <path d="M8 7.2V8.8" />
      <path d="M8 11.1C8.9 11.9 9.2 12.6 9.2 13.2H6.8C6.8 12.6 7.1 11.9 8 11.1Z" fill="currentColor" stroke="none" />
    </>
  ),
  // repair: joined arches with an over/under pass
  repair: (
    <>
      <path d="M1.8 13.8V6.4A3.6 3.6 0 0 1 9 6.4V8.6" />
      <path d="M9 11.4V13.8" />
      <path d="M14.2 2.2V9.6A3.6 3.6 0 0 1 7 9.6V2.2" />
    </>
  ),
  // stop: broken arch
  failure: (
    <>
      <path d="M2.8 14.6V7.4A5.2 5.2 0 0 1 6.6 2.4" />
      <path d="M9.6 3.4A5.2 5.2 0 0 1 13.2 8.4V14.6" />
      <path d="M7.2 5.6L8.4 7.6L7.4 9.4" strokeWidth={1} />
    </>
  ),
  // when: keystone arch doorway on a threshold
  when: (
    <>
      <path d="M1.8 14.6H14.2" />
      <path d="M3.6 14.6V7.6A4.4 4.4 0 0 1 12.4 7.6V14.6" />
      <path d="M6.9 1.4H9.1L8.6 3.4H7.4Z" fill="currentColor" />
      <path d="M8 8.2C9 9.2 9.4 10.2 9.4 11 9.4 12 8.7 12.6 8 13 7.3 12.6 6.6 12 6.6 11 6.6 10.2 7 9.2 8 8.2Z" fill="currentColor" stroke="none" />
    </>
  ),
  // note: open arch tablet
  note: (
    <>
      <path d="M3.4 14.6V6.4A4.6 4.6 0 0 1 12.6 6.4V14.6Z" />
      <path d="M6 9.4H10M6 11.9H9" />
    </>
  ),
  outcome: (
    <>
      <path d="M2.8 14.8V7.2A5.2 5.2 0 0 1 13.2 7.2V14.8Z" />
      <path d="M8 6.2C9.5 7.7 10 9 10 10.1 10 11.4 9.1 12.3 8 13 6.9 12.3 6 11.4 6 10.1 6 9 6.5 7.7 8 6.2Z" fill="currentColor" stroke="none" />
    </>
  ),
};

export type GlyphKind = "safety" | "pause" | "repair" | "failure" | "when" | "note" | "outcome";

/** Status glyph inside an SVG at (x, y), s units square. */
export function Glyph({
  kind,
  x,
  y,
  s = 15,
  color,
  sw = 1.25,
  className,
  style,
}: {
  kind: GlyphKind;
  x: number;
  y: number;
  s?: number;
  color?: string;
  sw?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const sc = s / 16;
  const c = color ?? (kind in kindColor ? kindColor[kind as Kind] : V.accent);
  return (
    <g className={className} style={style}>
      <g
        transform={`translate(${n(x)} ${n(y)}) scale(${n(sc)})`}
        fill="none"
        stroke={c}
        color={c}
        strokeWidth={sw / sc}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {GLYPHS[kind]}
      </g>
    </g>
  );
}

/** Standalone glyph as an inline <svg> for HTML contexts. */
export function GlyphIcon({
  kind,
  size = 16,
  className = "",
  sw = 1.3,
}: {
  kind: GlyphKind;
  size?: number;
  className?: string;
  sw?: number;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {GLYPHS[kind]}
    </svg>
  );
}

/* ---------------------------------------------------------------- outlines */

/**
 * Status rule treatment for any closed shape. d(inset) returns the shape
 * inset by `inset` units. Colour, line style and glyph carry meaning together:
 * safety heavy rule, pause fine dashed double hairline, repair double rule,
 * stop dotted, standard step single forest hairline.
 */
export function StatusOutline({
  d,
  kind,
  inset = 2.8,
  className,
  style,
}: {
  d: (inset: number) => string;
  kind: Kind;
  inset?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const p = (dd: string, stroke: string, sw: number, dash?: string) => (
    <path d={dd} fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" strokeLinejoin="round" />
  );
  let body: ReactNode;
  switch (kind) {
    case "safety":
      body = p(d(0), V.safety, 2.6);
      break;
    case "pause":
      body = (
        <>
          {p(d(0), V.pause, 0.9, "4 2.4")}
          {p(d(inset), V.pause, 0.6, "4 2.4")}
        </>
      );
      break;
    case "repair":
      body = (
        <>
          {p(d(0), V.repair, 0.95)}
          {p(d(inset), V.repair, 0.95)}
        </>
      );
      break;
    case "failure":
      body = p(d(0), V.failure, 1.6, "0.01 3.4");
      break;
    case "note":
      body = p(d(0), V.muted, 0.8, "2 2.4");
      break;
    case "plain":
      body = p(d(0), V.hair, 0.8);
      break;
    default:
      body = p(d(0), V.accent, 0.9);
  }
  return (
    <g className={className} style={style}>
      {body}
    </g>
  );
}

/** Arch-topped panel with fill and status rule treatment. */
export function ArchPanel({
  x,
  y,
  w,
  h,
  kind = "step",
  rt,
  fill,
  className,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  kind?: Kind;
  rt?: number;
  fill?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const r = rt ?? Math.min(15, h * 0.42);
  const fl = fill ?? kindFill[kind];
  return (
    <g className={className} style={style}>
      {fl !== "none" && <path d={archD(x, y, w, h, r)} fill={fl} />}
      <StatusOutline
        kind={kind}
        d={(i) => archD(x + i, y + i, w - 2 * i, h - 2 * i, Math.max(r - i, 1), Math.max(2.5 - i * 0.5, 1))}
      />
    </g>
  );
}

/** Decision lens with a brass inner hairline. */
export function Lens({
  cx,
  cy,
  w,
  h,
  stroke = V.accent,
  className,
  style,
}: {
  cx: number;
  cy: number;
  w: number;
  h: number;
  stroke?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <g className={className} style={style}>
      <path d={lensD(cx, cy, w, h)} fill={V.white} stroke={stroke} strokeWidth={0.95} />
      <path d={lensD(cx, cy, w - 12, h - 9)} fill="none" stroke={V.brass} strokeWidth={0.6} />
    </g>
  );
}

/** Pause advisory strip: warm paper, amber dashed double hairlines, hourglass-arch. */
export function AdvisoryStrip({
  x,
  y,
  w,
  h,
  children,
  className,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <g className={className} style={style}>
      <rect x={x} y={y} width={w} height={h} fill={V.warm} />
      {[0.5, 3.2].map((o, i) => (
        <g key={o} stroke={V.pause} strokeWidth={i ? 0.6 : 0.9} strokeDasharray="4 2.4">
          <path d={`M${x} ${y + o}H${x + w}`} />
          <path d={`M${x} ${y + h - o}H${x + w}`} />
        </g>
      ))}
      <Glyph kind="pause" x={x + 9} y={y + h / 2 - 8} s={16} />
      <path d={`M${x + 33} ${y + 8}V${y + h - 8}`} stroke={V.brass} strokeWidth={0.6} />
      {children}
    </g>
  );
}
