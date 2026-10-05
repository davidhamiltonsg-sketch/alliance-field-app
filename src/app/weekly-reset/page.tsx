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
        Anything bigger waits: the monthly part of your Weekly Reset adds 10 minutes
        for planning something fun, and the yearly part (1 to 2 hours) looks at where you’re heading.
      </p>
      <KeepItGoing />
      <Link
        href="/protocols/weekly-reset"
        className="flex min-h-12 items-center justify-between rounded-xl border border-rule/40 bg-surface-raised px-4 text-base font-medium text-accent"
      >
        Read the whole card
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
