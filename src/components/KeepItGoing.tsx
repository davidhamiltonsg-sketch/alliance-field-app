"use client";

import { useId, useState } from "react";
import { buildKeepGoingIcs } from "@/lib/ics";
import { PrimaryButton } from "./PrimaryButton";
import { SectionLabel } from "./SectionLabel";

/**
 * Retention loop after the 7-day plan: one downloadable calendar file with a
 * recurring Sunday Weekly Reset and a monthly "Care Check-in inside your
 * Weekly Reset" reminder (first Sunday of the month). Made on this device.
 */
export function KeepItGoing({ lead }: { lead?: string }) {
  const [time, setTime] = useState("19:00");
  const [added, setAdded] = useState(false);
  const id = useId();

  const download = () => {
    const { url, filename } = buildKeepGoingIcs(time);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setAdded(true);
  };

  return (
    <section className="space-y-3" aria-labelledby={`${id}-heading`}>
      <SectionLabel>
        <span id={`${id}-heading`}>Keep it going</span>
      </SectionLabel>
      <div className="card space-y-3 px-4 py-4">
        <p className="text-base leading-normal text-ink">
          {lead ?? "The system works when it's on the calendar."} One file adds
          two repeating reminders:
        </p>
        <ul className="space-y-1.5 pl-4 text-sm leading-snug text-ink-muted">
          <li className="list-disc">
            <strong className="font-medium text-ink">Weekly Reset</strong> —
            every Sunday, about 40 minutes.
          </li>
          <li className="list-disc">
            <strong className="font-medium text-ink">Care Check-in</strong> —
            on the first Sunday of each month, run it inside that week&apos;s
            Reset. Not an extra meeting.
          </li>
        </ul>
        <div className="flex items-end gap-2">
          <label htmlFor={id} className="flex flex-col gap-1 text-sm font-medium text-ink">
            Sunday at
            <input
              id={id}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="field-input w-32"
            />
          </label>
          <PrimaryButton variant="secondary" fullWidth={false} className="flex-1" onClick={download}>
            Add to calendar (.ics)
          </PrimaryButton>
        </div>
        <p className="text-sm leading-snug text-ink-muted">
          The file is made on this device. Prefer another day? Move the events
          in your calendar after adding them.
        </p>
        <p role="status" className="text-sm font-medium text-safety-text empty:hidden">
          {added ? "Calendar file downloaded — open it to add both reminders." : ""}
        </p>
      </div>
    </section>
  );
}
