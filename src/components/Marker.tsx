import type { ReactNode } from "react";
import { ProtocolIcon } from "./visuals/ProtocolIcon";

export type MarkerKind =
  | "TOOL"
  | "RULE"
  | "WARN"
  | "DO"
  | "NOTE"
  | "PHRASE"
  | "OK"
  | "FAIL"
  | "PAUSE";

const styles: Record<MarkerKind, string> = {
  TOOL: "bg-accent/10 text-accent",
  RULE: "bg-rule/10 text-rule",
  WARN: "bg-pause/12 text-pause-text",
  PAUSE: "bg-pause/12 text-pause-text",
  DO: "bg-accent text-paper",
  NOTE: "bg-ink/[0.06] text-ink-muted",
  PHRASE: "bg-accent/10 text-accent",
  OK: "bg-safety/12 text-safety-text",
  FAIL: "bg-failure/10 text-failure",
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
};

/** v2 library section icons (24-grid, arch-built). */
const iconSlug: Record<MarkerKind, string> = {
  TOOL: "section-tool",
  RULE: "section-concept",
  WARN: "section-caution",
  PAUSE: "pause-and-return",
  DO: "section-activity",
  NOTE: "section-concept",
  PHRASE: "section-say-this",
  OK: "section-working",
  FAIL: "section-not-working",
};

const icons = Object.fromEntries(
  Object.entries(iconSlug).map(([k, slug]) => [
    k,
    <ProtocolIcon key={k} slug={slug} size={14} strokeWidth={2} className="-my-0.5 shrink-0" />,
  ]),
) as Record<MarkerKind, ReactNode>;

/** Styled label pill replacing print-style bracket markers. */
export function Marker({
  kind,
  label,
  className = "",
}: {
  kind: MarkerKind;
  label?: string;
  className?: string;
}) {
  return (
    <span className={`marker-pill ${styles[kind]} ${className}`}>
      {icons[kind]}
      {label ?? labels[kind]}
    </span>
  );
}
