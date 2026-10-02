import Link from "next/link";
import { PauseTimer } from "@/components/PauseTimer";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRight } from "@/components/icons";

export const metadata = { title: "Pause + Return" };

export default function PausePage() {
  return (
    <div className="space-y-5">
      <div data-calm-hide>
        <PageHeader eyebrow={<Marker kind="PAUSE" label="Timer" />} title="Pause + Return">
          Time apart to get calm, with an exact time to come back: a pause,
          not a disappearance.
        </PageHeader>
      </div>
      <PauseTimer />
      <Link
        data-calm-hide
        href="/help"
        className="flex min-h-12 items-center justify-between rounded-xl border border-failure/25 bg-surface-warn px-4 text-base font-medium text-failure"
      >
        Afraid, not just flooded? Get help
        <ArrowRight size={16} />
      </Link>
      <Link
        data-calm-hide
        href="/protocols/pause-and-return"
        className="flex min-h-12 items-center justify-between rounded-xl border border-rule/40 bg-white px-4 text-base font-medium text-accent"
      >
        Read the whole card
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
