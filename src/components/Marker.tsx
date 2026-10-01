import { ApIcon, type IconId } from "./ApIcon";

export type MarkerKind =
  | "TOOL"
  | "RULE"
  | "WARN"
  | "DO"
  | "NOTE"
  | "PHRASE"
  | "OK"
  | "FAIL"
  | "PAUSE"
  | "SAFETY"
  | "HELP";

const styles: Record<MarkerKind, string> = {
  TOOL: "bg-accent/10 text-accent",
  RULE: "bg-rule/10 text-rule",
  WARN: "bg-ink/[0.07] text-ink",
  PAUSE: "bg-pause/12 text-pause-text",
  DO: "bg-accent text-paper",
  NOTE: "bg-ink/[0.06] text-ink-muted",
  PHRASE: "bg-accent/10 text-accent",
  OK: "bg-accent/10 text-accent",
  FAIL: "bg-failure/10 text-failure",
  SAFETY: "bg-safety/12 text-safety-text",
  HELP: "bg-failure/10 text-failure",
};

const labels: Record<MarkerKind, string> = {
  TOOL: "The Tool",
  RULE: "Rule",
  WARN: "Caution",
  PAUSE: "Pause",
  DO: "Do This",
  NOTE: "Note",
  PHRASE: "Say This",
  OK: "Working",
  FAIL: "Not Working",
  SAFETY: "Safety",
  HELP: "Get help",
};

/**
 * Shared-set glyph for each marker (one glyph per concept). Kinds without a
 * concept of their own carry no glyph; pass `icon` to name the concept. The
 * safety glyph appears only on safety content (SAFETY and HELP).
 */
const iconFor: Partial<Record<MarkerKind, IconId>> = {
  PAUSE: "pause-and-return",
  DO: "section-steps",
  PHRASE: "section-say",
  OK: "section-working",
  FAIL: "section-not-working",
  SAFETY: "section-safety",
  HELP: "help-safety",
};

/** Styled label pill: a text label, with its concept glyph beside it. */
export function Marker({
  kind,
  label,
  icon,
  className = "",
}: {
  kind: MarkerKind;
  label?: string;
  /** Concept glyph to show instead of the kind's default (null for none). */
  icon?: IconId | null;
  className?: string;
}) {
  const id = icon === undefined ? iconFor[kind] : icon;
  return (
    <span className={`marker-pill ${styles[kind]} ${className}`}>
      {id && <ApIcon id={id} size={16} mono className="-my-1" />}
      {label ?? labels[kind]}
    </span>
  );
}
