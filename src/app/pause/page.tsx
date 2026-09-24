import Link from "next/link";
import { PauseTimer } from "@/components/PauseTimer";
import { Marker } from "@/components/Marker";

export const metadata = { title: "Pause + Return" };

export default function PausePage() {
  return (
    <div className="space-y-6">
      <div>
        <Marker kind="WARN" />
        <h1 className="mt-1 text-2xl font-semibold">Pause + Return</h1>
        <p className="mt-1 text-sm text-ink-muted leading-relaxed">
          Pair separation with a non-negotiable return time. Protection without
          disappearance.
        </p>
      </div>
      <PauseTimer />
      <Link
        href="/protocols/pause-and-return"
        className="block text-sm font-semibold text-accent"
      >
        Full Pause + Return protocol →
      </Link>
    </div>
  );
}
