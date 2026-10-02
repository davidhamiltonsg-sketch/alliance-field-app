"use client";

import { useId, useRef, useState } from "react";
import { buildKeepGoingIcs, isValidTime } from "@/lib/ics";
import { downloadObjectUrl } from "@/lib/download";
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

  const [timeError, setTimeError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const download = () => {
    // An empty time field would otherwise become a reminder at midnight.
    if (!isValidTime(time)) {
      setTimeError(true);
      setAdded(false);
      inputRef.current?.focus();
      return;
    }
    const { url, filename } = buildKeepGoingIcs(time);
    downloadObjectUrl(url, filename);
    setAdded(true);
  };

  return (
    <section className="space-y-3" aria-labelledby={`${id}-heading`}>
      <SectionLabel>
        <span id={`${id}-heading`}>Keep it going</span>
      </SectionLabel>
      <div className="card space-y-3 px-4 py-4">
        <p className="text-base leading-normal text-ink">
          {lead ?? "Put it in the calendar, so it doesn’t rely on remembering."} One file adds
          two repeating reminders:
        </p>
        <ul className="space-y-1.5 pl-4 text-sm leading-snug text-ink-muted">
          <li className="list-disc">
            <strong className="font-medium text-ink">Weekly Reset</strong> —
            every Sunday, about 40 minutes.
          </li>
          <li className="list-disc">
            <strong className="font-medium text-ink">Care Check-in</strong> —
            once a month, inside the Weekly Reset (first Sunday).
          </li>
        </ul>
        <div className="flex items-end gap-2">
          <label htmlFor={id} className="flex flex-col gap-1 text-sm font-medium text-ink">
            Sunday at
            <input
              id={id}
              type="time"
              ref={inputRef}
              value={time}
              required
              aria-invalid={timeError || undefined}
              aria-describedby={timeError ? `${id}-error` : undefined}
              onChange={(e) => {
                setTime(e.target.value);
                setTimeError(false);
              }}
              className="field-input tabular w-[9.5rem] shrink-0 px-3"
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
        {timeError && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-failure">
          Choose a time first, for example 19:00.
        </p>
      )}
      <p role="status" className="text-sm font-medium text-accent empty:hidden">
          {added ? "Calendar file downloaded — open it to add both reminders." : ""}
        </p>
      </div>
    </section>
  );
}
