"use client";

import { useState } from "react";
import { wipeAll } from "@/lib/storage";

type Status = "idle" | "confirm" | "working" | "done";

/** Confirm-guarded "Delete all my data" for everything stored on this device. */
export function DeleteAllData() {
  const [status, setStatus] = useState<Status>("idle");

  const wipe = async () => {
    setStatus("working");
    await wipeAll();
    setStatus("done");
  };

  return (
    <div className="card space-y-3 px-4 py-4">
      <p className="text-[15px] leading-normal text-ink">
        Everything you enter — pause return times, Weekly Reset answers and
        history, calibration answers, favourites — stays on this device. The
        app has no account. The only time any data leaves your device is if
        you choose to submit your email for updates.
      </p>
      {status === "idle" && (
        <button
          type="button"
          onClick={() => setStatus("confirm")}
          className="w-full min-h-12 rounded-xl border border-failure/40 text-[15px] font-semibold text-failure hover:bg-failure/[0.06]"
        >
          Delete all my data
        </button>
      )}
      {(status === "confirm" || status === "working") && (
        <div role="alertdialog" aria-labelledby="wipe-q" className="space-y-3 rounded-xl bg-surface-warn px-3.5 py-3">
          <p id="wipe-q" className="text-[15px] font-medium leading-normal text-ink">
            Delete everything this app has saved on this device, including the
            offline copy? This can&apos;t be undone.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="min-h-12 flex-1 rounded-xl border border-rule/15 bg-white text-[15px] font-medium text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={wipe}
              disabled={status === "working"}
              className="min-h-12 flex-1 rounded-xl bg-failure text-[15px] font-semibold text-white disabled:opacity-60"
            >
              Delete everything
            </button>
          </div>
        </div>
      )}
      <p role="status" className="text-[15px] font-medium text-safety-text empty:hidden">
        {status === "done" ? "Deleted. Nothing from this app is left on this device." : ""}
      </p>
    </div>
  );
}
