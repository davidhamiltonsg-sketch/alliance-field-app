"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { PrimaryButton } from "./PrimaryButton";
import { TimerDisplay } from "./TimerDisplay";
import { WarnBanner } from "./WarnBanner";
import { Marker } from "./Marker";
import { ArrowRight } from "./icons";
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

const noopSubscribe = () => () => {};

/** Renders the timer only on the client, where the saved pause is readable. */
export function PauseTimer() {
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  if (!mounted) {
    return (
      <div className="card flex justify-center px-4 pb-4 pt-5">
        <TimerDisplay remainingMs={0} expired={false} idleLabel="--:--" caption="Loading" />
      </div>
    );
  }
  return <PauseTimerClient />;
}

function PauseTimerClient() {
  const [returnAt, setReturnAt] = useState<string | null>(() => readPause().returnAt);
  const [startedAt, setStartedAt] = useState<string | null>(() => readPause().startedAt);
  const [now, setNow] = useState(() => Date.now());
  const [customMinutes, setCustomMinutes] = useState("45");
  const [clockTime, setClockTime] = useState("");
  const [backMode, setBackMode] = useState(false);

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
    setStartedAt(startedAt);
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
    const delta = target.getTime() - Date.now();
    if (delta < 15 * 60 * 1000 || delta > 24 * 60 * 60 * 1000) {
      // still allow but clamp messaging — min 15m max 24h preferred
    }
    const started = new Date().toISOString();
    writePause({
      returnAt: target.toISOString(),
      startedAt: started,
    });
    setReturnAt(target.toISOString());
    setStartedAt(started);
    setBackMode(false);
    setNow(Date.now());
  }, [clockTime]);

  const cancel = () => {
    clearKey(PAUSE_KEY);
    setReturnAt(null);
    setStartedAt(null);
    setBackMode(false);
  };

  const imBack = () => {
    setBackMode(true);
  };

  const chip =
    "min-h-12 rounded-xl border border-rule/[0.12] bg-white text-[15px] font-medium text-ink shadow-[0_1px_2px_rgb(26_26_26/0.04)] transition hover:border-pause/40 hover:bg-surface-warn active:scale-[0.98]";

  if (backMode) {
    return (
      <div className="space-y-4">
        <WarnBanner pauseLink={false}>
          You’re back. Do not restart “where you left off.”
        </WarnBanner>
        <section className="card space-y-3 px-4 py-4">
          <Marker kind="OK" label="Restart cue" />
          <ol className="space-y-2 text-[15px] leading-normal">
            <li className="flex gap-3">
              <span className="tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-medium text-paper">1</span>
              <span><strong>Warmth</strong> — one warm true sentence.</span>
            </li>
            <li className="flex gap-3">
              <span className="tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-medium text-paper">2</span>
              <span><strong>Safety</strong> — Alliance not threatened this moment.</span>
            </li>
            <li className="flex gap-3">
              <span className="tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-medium text-paper">3</span>
              <span>Only then: Expression → Request → Alignment.</span>
            </li>
          </ol>
          <ul className="space-y-2 pt-1">
            <li className="phrase-block phrase text-[17px] leading-snug">I’m back. I’m on your team.</li>
            <li className="phrase-block phrase text-[17px] leading-snug">This isn’t a breakup conversation.</li>
          </ul>
        </section>
        <Link
          href="/protocols/system-overlay"
          className="flex min-h-12 items-center justify-center gap-1.5 text-[15px] font-medium text-repair"
        >
          Open System Overlay
          <ArrowRight size={16} />
        </Link>
        <PrimaryButton variant="secondary" onClick={cancel}>
          Clear pause
        </PrimaryButton>
      </div>
    );
  }

  if (returnAt) {
    const at = new Date(returnAt);
    const totalMs = startedAt
      ? at.getTime() - new Date(startedAt).getTime()
      : undefined;
    return (
      <div className="space-y-4">
        <div className="card flex flex-col items-center px-4 pb-5 pt-6">
          <TimerDisplay remainingMs={remainingMs} totalMs={totalMs} expired={expired} />
          <p className="mt-4 text-[15px] text-ink-muted">
            Ready at{" "}
            <strong className="tabular font-medium text-ink">{formatClock(at)}</strong>
          </p>
        </div>
        <PrimaryButton variant="warn" onClick={imBack}>
          I’m back
        </PrimaryButton>
        <PrimaryButton variant="ghost" onClick={cancel}>
          Cancel pause
        </PrimaryButton>
        <p className="text-center text-[13px] text-ink-muted">
          Separate · down-regulate · don’t rehearse the argument.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-col items-center px-4 pb-4 pt-5">
        <TimerDisplay
          remainingMs={0}
          expired={false}
          idleLabel="00:00"
          caption="Choose a return time"
        />
        <p className="mt-3 text-center text-[15px] leading-normal text-ink-muted">
          Exact phrase:{" "}
          <span className="phrase text-[15px] text-ink">“I’ll be ready at ___.”</span>
        </p>
      </div>

      <section className="space-y-2">
        <p className="text-[13px] font-medium text-ink">Duration</p>
        <div className="grid grid-cols-12 gap-2">
          {DURATIONS.map((d, i) => (
            <button
              key={d.label}
              type="button"
              onClick={() => startWithMs(d.ms)}
              className={`${chip} tabular ${i < 4 ? "col-span-3" : "col-span-4"}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="custom-minutes" className="block text-[13px] font-medium text-ink">
            Custom minutes
          </label>
          <div className="flex gap-2">
            <input
              id="custom-minutes"
              type="number"
              inputMode="numeric"
              min={15}
              max={1440}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="field-input tabular"
            />
            <PrimaryButton
              fullWidth={false}
              className="shrink-0 px-5"
              onClick={() => {
                const n = Number(customMinutes);
                if (!Number.isFinite(n) || n < 15 || n > 1440) return;
                startWithMs(n * 60 * 1000);
              }}
            >
              Start
            </PrimaryButton>
          </div>
          <p className="text-[13px] text-ink-muted">Min 15 · Max 1440 (24h)</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="clock-time" className="block text-[13px] font-medium text-ink">
            Or return at a clock time
          </label>
          <div className="flex gap-2">
            <input
              id="clock-time"
              type="time"
              value={clockTime}
              onChange={(e) => setClockTime(e.target.value)}
              className="field-input tabular"
            />
            <PrimaryButton
              fullWidth={false}
              className="shrink-0 px-5"
              variant="secondary"
              onClick={startWithClock}
              disabled={!clockTime}
            >
              Set
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
