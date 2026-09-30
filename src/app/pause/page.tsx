import Link from "next/link";
import { PauseTimer } from "@/components/PauseTimer";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRight } from "@/components/icons";

export const metadata = { title: "Pause + Return" };

export default function PausePage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="PAUSE" label="Timer" />} title="Pause + Return">
        Pair separation with a non-negotiable return time. Protection without
        disappearance.
      </PageHeader>
      <PauseTimer />
      <Link
        href="/help"
        className="flex min-h-12 items-center justify-between rounded-xl border border-failure/25 bg-surface-warn px-4 text-[15px] font-medium text-failure"
      >
        Afraid, not just flooded? Get help
        <ArrowRight size={16} />
      </Link>
      <Link
        href="/protocols/pause-and-return"
        className="flex min-h-12 items-center justify-between rounded-xl border border-rule/[0.1] bg-white px-4 text-[15px] font-medium text-accent"
      >
        Full Pause + Return protocol
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
