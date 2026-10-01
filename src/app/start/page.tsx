import Link from "next/link";
import { KeepItGoing } from "@/components/KeepItGoing";
import { Marker } from "@/components/Marker";
import { PageHeader } from "@/components/PageHeader";
import { SoloStart } from "@/components/SoloStart";
import { StartReminder } from "@/components/StartReminder";
import { WarnBanner } from "@/components/WarnBanner";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { getProtocol } from "@/data/protocols";
import { startDays } from "@/data/start";

export const metadata = { title: "7-day start" };

export default function StartPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={<Marker kind="DO" label="Seven days" />} title="Your 7-day start">
        About 10 minutes a day with the Core 5. Day 7 is your first Weekly
        Reset. Miss a day? Just pick up where you left off.
      </PageHeader>

      <ol className="space-y-2.5">
        {startDays.map((d) => {
          const card = getProtocol(d.slug);
          return (
            <li key={d.day} className="card px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-paper">
                  {d.day}
                </span>
                <h2 className="display min-w-0 flex-1 text-lg leading-snug">
                  <span className="sr-only">Day {d.day}: </span>
                  {d.title}
                </h2>
                <span className="tabular shrink-0 text-sm text-ink-muted">~{d.minutes} min</span>
              </div>
              <p className="mt-2 pl-11 text-base leading-normal text-ink-muted">{d.task}</p>
              <div className="mt-1 flex flex-wrap gap-x-5 pl-11">
                {card && (
                  <Link
                    href={`/protocols/${d.slug}`}
                    className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-accent"
                  >
                    {card.title}
                    <ArrowRight size={16} />
                  </Link>
                )}
                {d.tool && (
                  <Link
                    href={d.tool.href}
                    className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-accent"
                  >
                    {d.tool.label}
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <StartReminder />

      <KeepItGoing lead="After day 7, keep the habit." />

      <SoloStart />

      <WarnBanner pauseLink safetyLink>
        If either of you gets flooded during a practice day, stop and use
        Pause + Return. If it&apos;s fear, threats or coercion — not just
        flooding — these tools are not for this. Get outside help.
      </WarnBanner>

      <p className="text-sm leading-normal text-ink-muted">
        Want the longer, Kit-based version? See the{" "}
        <Link href="/install" className="font-medium text-accent underline underline-offset-4">
          7-Day Install
        </Link>
        .
      </p>

      <Link href="/" className="inline-flex min-h-12 items-center gap-1.5 text-base font-medium text-accent">
        <ArrowLeft size={16} />
        Situation Map
      </Link>
    </div>
  );
}
