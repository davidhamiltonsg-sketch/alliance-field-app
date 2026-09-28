import type { ReactNode } from "react";
import {
  AlertIcon,
  CheckIcon,
  QuoteIcon,
  ToolIcon,
  XIcon,
  ArrowRight,
  InfoIcon,
  TimerIcon,
} from "./icons";

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
  WARN: "bg-pause/12 text-[#9A5E10]",
  PAUSE: "bg-pause/12 text-[#9A5E10]",
  DO: "bg-accent text-paper",
  NOTE: "bg-ink/[0.06] text-ink-muted",
  PHRASE: "bg-accent/10 text-accent",
  OK: "bg-safety/12 text-safety",
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

const icons: Record<MarkerKind, ReactNode> = {
  TOOL: <ToolIcon size={12} strokeWidth={2.25} />,
  RULE: <InfoIcon size={12} strokeWidth={2.25} />,
  WARN: <AlertIcon size={12} strokeWidth={2.25} />,
  PAUSE: <TimerIcon size={12} strokeWidth={2.25} />,
  DO: <ArrowRight size={12} strokeWidth={2.25} />,
  NOTE: <InfoIcon size={12} strokeWidth={2.25} />,
  PHRASE: <QuoteIcon size={12} strokeWidth={2.25} />,
  OK: <CheckIcon size={12} strokeWidth={2.5} />,
  FAIL: <XIcon size={12} strokeWidth={2.5} />,
};

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
