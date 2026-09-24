"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PrimaryButton } from "./PrimaryButton";
import { TimerDisplay } from "./TimerDisplay";
import { WarnBanner } from "./WarnBanner";
import { clearKey, PAUSE_KEY, readPause, writePause } from "@/lib/storage";

const DURATIONS = [
  { label: "15m", ms: 15 * 60 * 1000 },
  { label: "20m", ms: 20 * 60 * 1000 },
  { label: "30m", ms: 30 * 60 * 1000 },
  { label: "1h", ms: 60 * 60 * 1000 },
  { label: "2h", ms: 2 * 60 * 60 * 1000 },
  { label: "4h", ms: 4 * 60 * 60 * 1000 },
  { label: "24h", ms: 24 * 60 * 60 * 1000 },
];

function formatClock(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function PauseTimer() {
  const [returnAt, setReturnAt] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [customMinutes, setCustomMinutes] = useState("45");
  const [clockTime, setClockTime] = useState("");
  const [backMode, setBackMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = readPause();
    setReturnAt(s.returnAt);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!returnAt || backMode) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [returnAt, backMode]);

  const remainingMs = useMemo(() => {
    if (!returnAt) return 0;
    return new Date(returnAt).getTime() - now;
  }, [returnAt, now]);

  const expired = !!returnAt && remainingMs <= 0;

  const startWithMs = useCallback((ms: number) => {
    const startedAt = new Date().toISOString();
    const at = new Date(Date.now() + ms).toISOString();
    writePause({ returnAt: at, startedAt });
    setReturnAt(at);
    setBackMode(false);
    setNow(Date.now());
  }, []);

  const startWithClock = useCallback(() => {
    if (!clockTime) return;
    const [hh, mm] = clockTime.split(":").map(Number);
    const target = new Date();
    target.setHours(hh, mm, 0, 0);
    if (target.getTime() <= Date.now()) {
      target.setDate(target.getDate() + 1);
    }
    writePause({
      returnAt: target.toISOString(),
      startedAt: new Date().toISOString(),
    });
    setReturnAt(target.toISOString());
    setBackMode(false);
    setNow(Date.now());
  }, [clockTime]);

  const cancel = () => {
    clearKey(PAUSE_KEY);
    setReturnAt(null);
    setBackMode(false);
  };

  const imBack = () => {
    setBackMode(true);
  };

  if (!hydrated) {
    return (
      <div className="rounded-lg border border-pause/40 bg-surface-warn px-4 py-8 text-center text-ink-muted">
        Loading timer…
      </div>
    );
  }

  if (backMode) {
    return (
      <div className="space-y-6">
        <WarnBanner pauseLink={false}>
          You’re back. Do not restart “where you left off.”
        </WarnBanner>
        <div className="rounded-lg border border-safety/30 bg-surface-tool px-4 py-4 space-y-3">
          <p className="text-xs font-bold tracking-widest text-safety">RESTART CUE</p>
          <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
            <li><strong>Warmth</strong> — one warm true sentence.</li>
            <li><strong>Safety</strong> — Alliance not threatened this moment.</li>
            <li>Only then: Expression → Request → Alignment.</li>
          </ol>
          <p className="border-l-4 border-accent pl-3 text-lg font-semibold">“I’m back. I’m on your team.”</p>
          <p className="border-l-4 border-accent pl-3 text-lg font-semibold">“This isn’t a breakup conversation.”</p>
        </div>
        <Link href="/protocols/system-overlay" className="block text-center text-sm font-semibold text-repair">
          Open System Overlay →
        </Link>
        <PrimaryButton variant="secondary" onClick={cancel}>Clear pause</PrimaryButton>
      </div>
    );
  }

  if (returnAt) {
    const at = new Date(returnAt);
    return (
      <div className="space-y-4">
        <TimerDisplay remainingMs={remainingMs} expired={expired} />
        <p className="text-center text-sm text-ink-muted">
          Ready at <strong className="text-ink">{formatClock(at)}</strong>
        </p>
        <PrimaryButton variant="warn" onClick={imBack}>I’m back</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={cancel}>Cancel pause</PrimaryButton>
        <p className="text-xs text-ink-muted text-center">
          Separate · down-regulate · don’t rehearse the argument.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-ink">Duration</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.label}
              type="button"
              onClick={() => startWithMs(d.ms)}
              className="min-h-12 rounded-lg border border-rule/20 bg-surface-tool text-sm font-semibold text-ink active:bg-accent active:text-paper"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-ink">Custom minutes</p>
        <div className="flex gap-2">
          <input
            type="number"
            min={15}
            max={1440}
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            className="min-h-12 w-full rounded-lg border border-rule/25 bg-paper px-3 text-ink"
          />
          <PrimaryButton
            className="w-auto shrink-0 px-6"
            onClick={() => {
              const n = Number(customMinutes);
              if (!Number.isFinite(n) || n < 15 || n > 1440) return;
              startWithMs(n * 60 * 1000);
            }}
          >
            Start
          </PrimaryButton>
        </div>
        <p className="text-xs text-ink-muted">Min 15 · Max 1440 (24h)</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-ink">Or return clock time</p>
        <div className="flex gap-2">
          <input
            type="time"
            value={clockTime}
            onChange={(e) => setClockTime(e.target.value)}
            className="min-h-12 w-full rounded-lg border border-rule/25 bg-paper px-3 text-ink"
          />
          <PrimaryButton
            className="w-auto shrink-0 px-6"
            variant="secondary"
            onClick={startWithClock}
            disabled={!clockTime}
          >
            Set
          </PrimaryButton>
        </div>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">
        Exact phrase: <strong className="text-ink">“I’ll be ready at ___.”</strong>
      </p>
    </div>
  );
}
