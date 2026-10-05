"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readStartProgress } from "@/lib/storage";
import { ArrowRight } from "./icons";

/** Shown above the three routes until Day 1 of the first week is ticked. Stays hidden on SSR and when storage is unavailable. */
export function FirstRunBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, not mirroring props/state
    setShow(!readStartProgress().includes(1));
  }, []);
  if (!show) return null;
  return (
    <div className="space-y-1">
    <Link
      href="/start"
      className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-accent/30 bg-surface-tool px-4 py-2.5 text-base font-semibold text-accent"
    >
      <span>
        New here? Start your first week
        <span className="mt-0.5 block text-sm font-normal text-ink-muted">Tonight is 20 minutes. Free, no account.</span>
      </span>
      <ArrowRight size={18} className="shrink-0" />
    </Link>
    <Link href="/intro" className="inline-flex min-h-11 items-center px-1 text-base font-medium text-accent underline underline-offset-4">
      Take the 60-second tour
    </Link>
    </div>
  );
}
