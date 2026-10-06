import Link from "next/link";
import { KeepItGoing } from "@/components/KeepItGoing";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { SoloStart } from "@/components/SoloStart";
import { StartPlan } from "@/components/StartPlan";
import { StartReminder } from "@/components/StartReminder";
import { WarnBanner } from "@/components/WarnBanner";
import { ArrowLeft } from "@/components/icons";

export const metadata = { title: "Your first week" };

export default function StartPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="DO" label="Seven days" />} title="Your first week">
        If you’re new, this is where we’d start. Tonight is 20 minutes; Day 7
        is your first Weekly Reset. Miss a day? Pick up where you left off.
        Only one of you reading? Invite, don’t assign.
      </PageHeader>

      <section aria-label="Before you start" className="card space-y-2 border-accent/30 px-4 py-3.5">
        <p className="text-base leading-normal text-ink">
          <span className="font-semibold text-accent">Tight on time? </span>
          A 15-minute Weekly Reset still counts, or split it into two shorter
          sittings in the week.
        </p>
        <p className="text-base leading-normal text-ink">
          <span className="font-semibold text-accent">Trust breach? </span>
          Skip the plan: start with{" "}
          <Link href="/protocols/trust-recovery" className="inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-4">
            Trust Recovery
          </Link>
          , then the Weekly Reset.
        </p>
        <p className="text-base leading-normal text-ink">
          <span className="font-semibold text-accent">Partner not keen? </span>
          Hand them the book (Volume A), or the{" "}
          <a
            href="/downloads/companion-sample.pdf"
            className="font-medium text-accent underline underline-offset-4"
          >
            free sample
          </a>{" "}
          (PDF).
        </p>
      </section>

      <StartPlan />

      <StartReminder />

      <KeepItGoing lead="After day 7, keep the habit." />

      <SoloStart />

      <WarnBanner pauseLink={false} safetyLink>
        If either of you gets flooded during a practice day, stop and use
        Pause + Return. If it’s fear, threats, coercion or violence — not just
        flooding — these tools are not for this. Get outside help.
      </WarnBanner>

      <p className="text-sm leading-normal text-ink-muted">
        In the books: the same plan, day for day, is “Your First Week” in the
        Field Kit and in Volume B, Chapter 4: Getting Started.
      </p>

      <Link href="/" className="inline-flex min-h-12 items-center gap-1.5 text-base font-medium text-accent">
        <ArrowLeft size={16} />
        Situation Map
      </Link>
    </div>
  );
}
