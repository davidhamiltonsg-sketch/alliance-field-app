import Link from "next/link";
import { KeepItGoing } from "@/components/KeepItGoing";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { SoloStart } from "@/components/SoloStart";
import { StartPlan } from "@/components/StartPlan";
import { StartReminder } from "@/components/StartReminder";
import { WarnBanner } from "@/components/WarnBanner";
import { ArrowLeft } from "@/components/icons";

export const metadata = { title: "7-day start" };

export default function StartPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="DO" label="Seven days" />} title="Your 7-day start">
        About 10 minutes a day. Day 7 is your first Weekly Reset. Miss a day?
        Just pick up where you left off.
      </PageHeader>

      <StartPlan />

      <StartReminder />

      <KeepItGoing lead="After day 7, keep the habit." />

      <SoloStart />

      <WarnBanner pauseLink safetyLink>
        If either of you gets flooded during a practice day, stop and use
        Pause + Return. If it’s fear, threats or coercion — not just
        flooding — these tools are not for this. Get outside help.
      </WarnBanner>

      <p className="text-sm leading-normal text-ink-muted">
        Go deeper: the same plan, day for day, is “The First Week” in the Field
        Kit and “Your First 7 Days” in the Operating Manual.
      </p>

      <Link href="/" className="inline-flex min-h-12 items-center gap-1.5 text-base font-medium text-accent">
        <ArrowLeft size={16} />
        Situation Map
      </Link>
    </div>
  );
}
