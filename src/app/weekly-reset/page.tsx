import Link from "next/link";
import { Marker } from "@/components/Marker";
import { WeeklyResetWizard } from "@/components/WeeklyResetWizard";

export const metadata = { title: "Weekly Reset" };

export default function WeeklyResetPage() {
  return (
    <div className="space-y-6">
      <div>
        <Marker kind="DO" />
        <h1 className="mt-1 text-2xl font-semibold">Weekly Reset</h1>
        <p className="mt-1 text-sm text-ink-muted leading-relaxed">
          20–45 minute maintenance meeting. Draft saves on this device.
        </p>
      </div>
      <WeeklyResetWizard />
      <Link
        href="/protocols/weekly-reset"
        className="block text-sm font-semibold text-accent"
      >
        Weekly Reset protocol card →
      </Link>
    </div>
  );
}
