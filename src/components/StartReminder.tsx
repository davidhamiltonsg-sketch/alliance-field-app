"use client";

import { useId, useState } from "react";
import { buildStartPlanIcs } from "@/lib/ics";
import { PrimaryButton } from "./PrimaryButton";

/** Optional: download a daily 10-minute calendar reminder for the 7-day plan. */
export function StartReminder() {
  const [time, setTime] = useState("20:00");
  const [added, setAdded] = useState(false);
  const id = useId();

  const download = () => {
    const { url, filename } = buildStartPlanIcs(time);
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
    <div className="card space-y-3 px-4 py-4">
      <p className="text-[15px] font-medium text-ink">Want a daily nudge?</p>
      <p className="text-[13px] leading-snug text-ink-muted">
        Adds a 10-minute reminder to your calendar for the next seven days,
        starting tomorrow. The file is made on this device.
      </p>
      <div className="flex items-end gap-2">
        <label htmlFor={id} className="flex flex-col gap-1 text-[13px] font-medium text-ink">
          Time
          <input
            id={id}
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="field-input w-32"
          />
        </label>
        <PrimaryButton variant="secondary" fullWidth={false} className="flex-1" onClick={download}>
          Add daily reminder (.ics)
        </PrimaryButton>
      </div>
      <p role="status" className="text-[13px] font-medium text-safety-text empty:hidden">
        {added ? "Reminder downloaded — open it to add it to your calendar." : ""}
      </p>
    </div>
  );
}
