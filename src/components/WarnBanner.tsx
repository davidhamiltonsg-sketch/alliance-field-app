import Link from "next/link";
import { Marker } from "./Marker";
import { ArrowRight } from "./icons";

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
      className="relative overflow-hidden rounded-2xl border border-pause/25 bg-surface-warn px-4 py-3.5 text-[15px] leading-normal"
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-pause" aria-hidden />
      <Marker kind="WARN" />
      <p className="mt-2 text-ink">{children}</p>
      {pauseLink && (
        <Link
          href="/pause"
          className="-mb-1.5 mt-1 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-[#9A5E10] hover:underline underline-offset-4"
        >
          Open Pause + Return timer
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
