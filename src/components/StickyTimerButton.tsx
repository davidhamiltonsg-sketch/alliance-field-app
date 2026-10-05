"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApIcon } from "./ApIcon";

/**
 * "Start timer", pinned above the tab bar on the Pause + Return card. Hidden
 * while the "Set a pause timer" button at the top is on screen, so the two
 * never show at once.
 */
export function StickyTimerButton({ watchId }: { watchId: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const top = document.getElementById(watchId);
    if (!top || typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- no observer: always show the shortcut
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(top);
    return () => io.disconnect();
  }, [watchId]);
  return (
    <div
      className={`sticky bottom-[calc(4rem+1px+env(safe-area-inset-bottom)+0.75rem)] z-30 transition-opacity ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}
      aria-hidden={!show}
    >
      <Link
        href="/pause"
        tabIndex={show ? undefined : -1}
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-pause px-4 text-base font-semibold text-ink shadow-[var(--shadow-amber)] transition active:scale-[0.99]"
      >
        <ApIcon id="pause-and-return" size={20} mono />
        Start timer
      </Link>
    </div>
  );
}
