import { Fragment } from "react";
import { Marker, type MarkerKind } from "./Marker";

const TOKENS: Record<string, MarkerKind> = {
  "[WARN]": "WARN",
  "[TOOL]": "TOOL",
  "[DO]": "DO",
  "[NOTE]": "NOTE",
  "[RULE]": "RULE",
  "[✓]": "OK",
  "[✗]": "FAIL",
};

const PATTERN = /(\[(?:WARN|TOOL|DO|NOTE|RULE|✓|✗)\])/g;

/** Quoted phrases (“…”) switch to serif italic, as in the printed diagrams. */
function withQuotes(s: string) {
  return s.split(/(“[^”]*”)/).map((q, j) =>
    q.startsWith("“") ? (
      <span key={j} className="phrase text-[1.06em] text-ink">
        {q}
      </span>
    ) : (
      <Fragment key={j}>{q}</Fragment>
    ),
  );
}

/**
 * Renders source copy that may contain print-kit markers (e.g. "[WARN]")
 * with those markers shown as styled pills instead of literal brackets.
 * The underlying content is unchanged. With `serifQuotes`, quoted phrases
 * are set in serif italic.
 */
export function MarkedText({ text, serifQuotes = false }: { text: string; serifQuotes?: boolean }) {
  const parts = text.split(PATTERN).filter((p) => p !== "");
  return (
    <>
      {parts.map((part, i) => {
        const kind = TOKENS[part];
        if (kind) {
          return (
            <Fragment key={i}>
              <Marker kind={kind} className="mr-1.5 align-[2px]" />
            </Fragment>
          );
        }
        // Tidy a leading arrow left behind after a marker ("[WARN] → X").
        const cleaned = i > 0 && TOKENS[parts[i - 1]] ? part.replace(/^\s*/, "") : part;
        return <Fragment key={i}>{serifQuotes ? withQuotes(cleaned) : cleaned}</Fragment>;
      })}
    </>
  );
}
