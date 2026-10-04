import Link from "next/link";
import { KeepItGoing } from "@/components/KeepItGoing";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { WeeklyResetWizard } from "@/components/WeeklyResetWizard";
import { ArrowRight } from "@/components/icons";

export const metadata = { title: "Weekly Reset" };

export default function WeeklyResetPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="DO" label="Weekly" icon="weekly-reset" />} title="Weekly Reset">
        Five parts, about 40 minutes: maintenance, not a trial. What you type stays on this phone.
      </PageHeader>
      <WeeklyResetWizard />
      <p className="px-1 text-sm leading-normal text-ink-muted">
        Anything bigger waits: planning something fun for the Monthly Review, a 40-minute
        once-a-month look at how things are going, and where you’re heading for the Yearly Alignment.
      </p>
      <KeepItGoing />
      <Link
        href="/protocols/weekly-reset"
        className="flex min-h-12 items-center justify-between rounded-xl border border-rule/40 bg-white px-4 text-base font-medium text-accent"
      >
        Read the whole card
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
