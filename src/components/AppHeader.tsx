import Link from "next/link";
import { AllianceMark } from "./AllianceMark";
import { TimerIcon } from "./icons";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule/[0.08] bg-paper/80 backdrop-blur-md supports-[backdrop-filter]:bg-paper/70">
      <div className="flex h-14 items-center justify-between gap-2 pl-4 pr-2">
        <Link
          href="/"
          className="flex min-h-12 items-center gap-2.5"
          aria-label="Alliance Protocols Field App, home"
        >
          <AllianceMark size={28} className="text-accent" waveColor="#A8895A" />
          <span className="whitespace-nowrap text-[11px] font-medium tracking-[0.06em] text-ink min-[360px]:text-[13px] min-[360px]:tracking-[0.1em]">
            ALLIANCE PROTOCOLS
          </span>
          <span className="hidden rounded-full border border-accent/20 bg-surface-tool px-2 py-[3px] text-[11px] font-medium tracking-[0.08em] text-accent min-[400px]:inline">
            FIELD
          </span>
        </Link>
        <div className="flex items-center">
          <Link
            href="/help"
            className="inline-flex h-12 items-center rounded-full px-3 text-[13px] font-semibold text-failure transition-colors hover:bg-failure/10"
            aria-label="Help and safety: help lines"
          >
            Help
          </Link>
          <Link
            href="/pause"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full text-pause transition-colors hover:bg-pause/10"
            aria-label="Open Pause + Return timer"
          >
            <TimerIcon size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}
