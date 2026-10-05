"use client";

import { useId, useRef, useState } from "react";
import { buildStartPlanIcs, isValidTime } from "@/lib/ics";
import { downloadObjectUrl } from "@/lib/download";
import { PrimaryButton } from "./PrimaryButton";

/** Optional: download a daily 10-minute calendar reminder for your first week. */
export function StartReminder() {
  const [time, setTime] = useState("20:00");
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
    const { url, filename } = buildStartPlanIcs(time);
    downloadObjectUrl(url, filename);
    setAdded(true);
  };

  return (
    <div className="card space-y-3 px-4 py-4">
      <p className="text-base font-medium text-ink">Want a daily nudge?</p>
      <p className="text-sm leading-snug text-ink-muted">
        Adds a 10-minute reminder to your calendar for the next seven days,
        starting tomorrow. The file is made on this device.
      </p>
      <div className="flex items-end gap-2">
        <label htmlFor={id} className="flex flex-col gap-1 text-sm font-medium text-ink">
          Time
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
          Add reminder (.ics)
        </PrimaryButton>
      </div>
      {timeError && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-failure">
          Choose a time first, for example 20:00.
        </p>
      )}
      <p role="status" className="text-sm font-medium text-accent empty:hidden">
        {added ? "Saved. Open the file to add it to your calendar." : ""}
      </p>
    </div>
  );
}
