import Link from "next/link";
import { Marker } from "./Marker";
import { ArrowRight } from "./icons";

/**
 * A caution or safety note. Help always comes first: on a safety note
 * (safetyLink) the Help link is listed before anything else, and the pause
 * timer is offered only when `pauseLink` is passed explicitly for flooding
 * (never on fear or coercion wording).
 */
export function WarnBanner({
  children,
  pauseLink = false,
  safetyLink = false,
}: {
  children: React.ReactNode;
  /** Offer the Pause + Return timer (for flooding cautions only). */
  pauseLink?: boolean;
  /** Adds the "Afraid, not just flooded?" route to Help & safety. */
  safetyLink?: boolean;
}) {
  // Safety content (anything that routes to Help) is safety-toned with the
  // safety glyph; a plain caution stays amber, with no glyph.
  const safety = safetyLink;
  return (
    <div
      role="alert"
      className={`v2-card relative px-4 py-3.5 text-base leading-normal shadow-none ${
        safety ? "v2-card--safety bg-surface-tool" : "v2-card--pause bg-surface-warn"
      }`}
    >
      {safety ? <Marker kind="SAFETY" /> : <Marker kind="WARN" />}
      <p className="mt-2 text-ink">{children}</p>
      {(pauseLink || safetyLink) && (
        <div className="-mb-1.5 mt-1 flex flex-wrap gap-x-5">
          {safetyLink && (
            <Link
              href="/help"
              className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-failure hover:underline underline-offset-4"
            >
              Afraid, not just flooded? Get help
              <ArrowRight size={16} />
            </Link>
          )}
          {pauseLink && (
            <Link
              href="/pause"
              className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-pause-text hover:underline underline-offset-4"
            >
              Open Pause + Return timer
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
