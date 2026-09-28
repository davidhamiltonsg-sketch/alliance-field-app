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

/**
 * Renders source copy that may contain print-kit markers (e.g. "[WARN]")
 * with those markers shown as styled pills instead of literal brackets.
 * The underlying content is unchanged.
 */
export function MarkedText({ text }: { text: string }) {
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
        return <Fragment key={i}>{cleaned}</Fragment>;
      })}
    </>
  );
}
