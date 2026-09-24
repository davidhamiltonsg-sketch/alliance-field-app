import Link from "next/link";
import { Marker } from "./Marker";

export function WarnBanner({
  children,
  pauseLink = true,
}: {
  children: React.ReactNode;
  pauseLink?: boolean;
}) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-pause/50 bg-surface-warn px-4 py-3 text-sm leading-relaxed"
    >
      <Marker kind="WARN" />{" "}
      <span className="text-ink">{children}</span>
      {pauseLink && (
        <Link
          href="/pause"
          className="mt-2 block font-semibold text-pause underline-offset-2 hover:underline"
        >
          Open Pause + Return timer →
        </Link>
      )}
    </div>
  );
}
