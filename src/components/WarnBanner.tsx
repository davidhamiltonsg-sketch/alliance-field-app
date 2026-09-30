import Link from "next/link";
import { Marker } from "./Marker";
import { ArrowRight } from "./icons";

export function WarnBanner({
  children,
  pauseLink = true,
  safetyLink = false,
}: {
  children: React.ReactNode;
  pauseLink?: boolean;
  /** Adds the "Afraid, not just flooded?" route to Help & safety. */
  safetyLink?: boolean;
}) {
  return (
    <div
      role="alert"
      className="v2-card v2-card--pause relative bg-surface-warn px-4 py-3.5 text-[15px] leading-normal shadow-none"
    >
      <Marker kind="WARN" />
      <p className="mt-2 text-ink">{children}</p>
      {(pauseLink || safetyLink) && (
        <div className="-mb-1.5 mt-1 flex flex-wrap gap-x-5">
          {pauseLink && (
            <Link
              href="/pause"
              className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-pause-text hover:underline underline-offset-4"
            >
              Open Pause + Return timer
              <ArrowRight size={16} />
            </Link>
          )}
          {safetyLink && (
            <Link
              href="/help"
              className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-failure hover:underline underline-offset-4"
            >
              Afraid, not just flooded? Get help
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
