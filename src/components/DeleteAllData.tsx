"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { wipeAll } from "@/lib/storage";

type Status = "idle" | "confirm" | "working" | "done";

/** Confirm-guarded "Delete all my data" for everything stored on this device. */
export function DeleteAllData() {
  const [status, setStatus] = useState<Status>("idle");
  const dialogRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  // Only move focus after the user acts, never on first render.
  const acted = useRef(false);

  useEffect(() => {
    if (!acted.current) return;
    if (status === "confirm") dialogRef.current?.focus();
    else if (status === "idle") openRef.current?.focus();
    else if (status === "done") statusRef.current?.focus();
  }, [status]);

  const go = (next: Status) => {
    acted.current = true;
    setStatus(next);
  };

  const wipe = async () => {
    go("working");
    await wipeAll();
    go("done");
  };

  return (
    <div className="card space-y-3 px-4 py-4">
      <p className="text-[15px] leading-normal text-ink">
        Everything you enter — pause return times, Weekly Reset answers and
        history, calibration answers, favourites — stays on this device. The
        app has no account. The only time any data leaves your device is if
        you choose to submit your email for updates. (While early access is
        on, one sign-in cookie remembers the access code; it holds nothing
        about you.){" "}
        <Link href="/privacy" className="font-medium text-accent underline underline-offset-4">
          Read the privacy notice
        </Link>
        .
      </p>
      {status === "idle" && (
        <button
          ref={openRef}
          type="button"
          onClick={() => go("confirm")}
          className="w-full min-h-12 rounded-xl border border-failure/40 text-[15px] font-semibold text-failure hover:bg-failure/[0.06]"
        >
          Delete all my data
        </button>
      )}
      {(status === "confirm" || status === "working") && (
        <div
          ref={dialogRef}
          role="alertdialog"
          aria-modal="false"
          aria-labelledby="wipe-q"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape" && status === "confirm") go("idle");
          }}
          className="space-y-3 rounded-xl bg-surface-warn px-3.5 py-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <p id="wipe-q" className="text-[15px] font-medium leading-normal text-ink">
            Delete everything this app has saved in this browser, including
            the offline copy? This can&apos;t be undone.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go("idle")}
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
      <p
        ref={statusRef}
        role="status"
        tabIndex={-1}
        className="text-[15px] font-medium text-safety-text outline-none empty:hidden"
      >
        {status === "done"
          ? "Deleted. Your saved answers and the offline copy are gone from this browser. If you open the app again, it starts fresh."
          : ""}
      </p>
    </div>
  );
}
