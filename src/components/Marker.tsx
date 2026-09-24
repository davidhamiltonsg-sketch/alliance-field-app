type MarkerKind = "TOOL" | "RULE" | "WARN" | "DO" | "NOTE" | "PHRASE" | "OK" | "FAIL";

const styles: Record<MarkerKind, string> = {
  TOOL: "text-accent",
  RULE: "text-rule",
  WARN: "text-pause",
  DO: "text-accent",
  NOTE: "text-ink-muted",
  PHRASE: "text-ink",
  OK: "text-safety",
  FAIL: "text-failure",
};

const labels: Record<MarkerKind, string> = {
  TOOL: "[TOOL]",
  RULE: "[RULE]",
  WARN: "[WARN]",
  DO: "[DO]",
  NOTE: "[NOTE]",
  PHRASE: "[PHRASE]",
  OK: "[✓]",
  FAIL: "[✗]",
};

export function Marker({ kind }: { kind: MarkerKind }) {
  return (
    <span
      className={`text-xs font-bold tracking-widest ${styles[kind]}`}
    >
      {labels[kind]}
    </span>
  );
}
