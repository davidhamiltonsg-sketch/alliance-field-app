import Link from "next/link";
import { AllianceMark } from "./AllianceMark";
import { ApIcon } from "./ApIcon";

export function AppHeader() {
  return (
    <header data-chrome className="sticky top-0 z-40 border-b border-rule/[0.08] bg-paper/95 backdrop-blur-md supports-[backdrop-filter]:bg-paper/90">
      <div className="flex h-14 items-center justify-between gap-2 pl-4 pr-2">
        <Link
          href="/"
          className="flex min-h-12 min-w-12 items-center gap-2.5"
          aria-label="Alliance Protocols Field App, home"
        >
          <AllianceMark size={28} className="text-accent" waveColor="#A8895A" />
          <span className="hidden whitespace-nowrap text-sm font-medium tracking-[0.1em] text-ink min-[360px]:inline">
            ALLIANCE PROTOCOLS
          </span>
          <span className="hidden rounded-full border border-accent/20 bg-surface-tool px-2 py-[3px] text-xs font-medium tracking-[0.08em] text-accent min-[480px]:inline">
            FIELD
          </span>
        </Link>
        <div className="flex items-center">
          <Link
            href="/help"
            className="inline-flex h-12 items-center rounded-full px-3 text-sm font-semibold text-failure transition-colors hover:bg-failure/10"
            aria-label="Help and safety: help lines"
          >
            Help
          </Link>
          <Link
            href="/pause"
            className="inline-flex h-12 items-center gap-1 rounded-full px-2.5 text-sm font-semibold text-pause-text transition-colors hover:bg-pause/10"
            aria-label="Pause + Return timer"
          >
            <ApIcon id="pause-and-return" size={20} className="text-pause" />
            Pause
          </Link>
        </div>
      </div>
    </header>
  );
}
