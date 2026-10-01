"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link from "next/link";
import { PrimaryButton } from "./PrimaryButton";
import { TimerDisplay } from "./TimerDisplay";
import { WarnBanner } from "./WarnBanner";
import { Marker } from "./Marker";
import { ArrowLeft, ArrowRight } from "./icons";
import { ApIcon } from "./ApIcon";
import { formatRemaining } from "./TimerDisplay";
import { clearKey, PAUSE_KEY, readPause, writePause } from "@/lib/storage";
import { timerAnnouncement } from "@/lib/timer";
import { buildPauseReturnIcs } from "@/lib/ics";
import { KIT } from "@/data/kit";

const DURATIONS = [
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

type AudioCtor = typeof AudioContext;
let audioCtx: AudioContext | null = null;

/**
 * Creates (or resumes) the shared AudioContext. Must run inside a user
 * gesture (the Start/Set click): browsers keep contexts created later, e.g.
 * from a timer callback, suspended, so the chime would never sound.
 */
function primeAudio() {
  try {
    if (!audioCtx) {
      const Ctx: AudioCtor | undefined =
        window.AudioContext || (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
      if (!Ctx) return;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") void audioCtx.resume();
  } catch {
    /* audio not available */
  }
}

/** Plays a short, gentle three-tone chime using the Web Audio API — no audio file needed. */
function playChime() {
  try {
    const ctx = audioCtx;
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.22;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.55);
    });
  } catch {
    /* ignore — audio not available */
  }
}

const NOTIFY_TITLE = "Pause complete";
const NOTIFY_OPTIONS: NotificationOptions = {
  body: "Your return time has arrived. Read the restart cue before you speak.",
  tag: "alliance-pause-return",
  icon: "/icon-192.png",
};

/**
 * Fires a system notification if permission was already granted. Prefers the
 * service worker (the only way that works on Android and installed iOS apps),
 * falling back to the page-level Notification constructor.
 */
async function notifyExpired() {
  try {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    if ("serviceWorker" in navigator) {
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 1500)),
      ]);
      if (registration) {
        await registration.showNotification(NOTIFY_TITLE, NOTIFY_OPTIONS);
        return;
      }
    }
  } catch {
    /* fall through to the page-level notification */
  }
  try {
    new Notification(NOTIFY_TITLE, NOTIFY_OPTIONS);
  } catch {
    /* ignore — e.g. Android Chrome only allows notifications from a worker */
  }
}

function downloadReturnTime(returnAt: string) {
  const { url, filename } = buildPauseReturnIcs(new Date(returnAt));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const noopSubscribe = () => () => {};

const MIN_MINUTES = KIT.pauseMinMinutes;
const MAX_MINUTES = KIT.pauseMaxMinutes;

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
  const [shareCopied, setShareCopied] = useState(false);
  const [clockTimeError, setClockTimeError] = useState<string | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);
  const alarmFiredForRef = useRef<string | null>(null);
  // Full-screen calm view while a pause runs; "Exit full screen" drops back
  // to the regular page (the pause keeps running either way).
  const [calm, setCalm] = useState(true);
  const calmActive = calm && !!returnAt && !backMode;
  // Where focus should land after the view changes (the calm view, "I'm
  // back" and Cancel/Clear all unmount the control that had focus).
  const focusNextRef = useRef<string | null>(null);
  const exitCalm = useCallback(() => {
    focusNextRef.current = "calm-reopen";
    setCalm(false);
  }, []);
  useEffect(() => {
    const id = focusNextRef.current;
    if (!id) return;
    focusNextRef.current = null;
    document.getElementById(id)?.focus();
  });

  // Hide the app header and bottom nav while the calm view is up.
  useEffect(() => {
    if (!calmActive) return;
    const html = document.documentElement;
    html.setAttribute("data-calm", "");
    return () => html.removeAttribute("data-calm");
  }, [calmActive]);

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

  // Fire the alarm once per pause, the moment it crosses into expired.
  useEffect(() => {
    if (expired && returnAt && alarmFiredForRef.current !== returnAt) {
      alarmFiredForRef.current = returnAt;
      playChime();
      void notifyExpired();
    }
  }, [expired, returnAt]);

  const requestNotifyPermission = () => {
    try {
      if (typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission();
      }
    } catch {
      /* ignore */
    }
  };

  const startWithMs = useCallback((ms: number) => {
    primeAudio();
    const startedAt = new Date().toISOString();
    const at = new Date(Date.now() + ms).toISOString();
    writePause({ returnAt: at, startedAt });
    setReturnAt(at);
    setStartedAt(startedAt);
    setBackMode(false);
    setCalm(true);
    setNow(Date.now());
    requestNotifyPermission();
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
    if (delta < MIN_MINUTES * 60 * 1000) {
      setClockTimeError("That’s less than 20 minutes away — pick a later time.");
      return;
    }
    if (delta > MAX_MINUTES * 60 * 1000) {
      setClockTimeError("That’s more than 24 hours away — pick a sooner time.");
      return;
    }
    setClockTimeError(null);
    primeAudio();
    const started = new Date().toISOString();
    writePause({
      returnAt: target.toISOString(),
      startedAt: started,
    });
    setReturnAt(target.toISOString());
    setStartedAt(started);
    setBackMode(false);
    setCalm(true);
    setNow(Date.now());
    requestNotifyPermission();
  }, [clockTime]);

  const shareReturnTime = async () => {
    if (!returnAt) return;
    const text = `I’ll be ready at ${formatClock(new Date(returnAt))}.`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch {
      /* user cancelled or share unsupported — fall through to copy */
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      /* ignore — nothing more we can do */
    }
  };

  const cancel = () => {
    focusNextRef.current = "pause-duration";
    clearKey(PAUSE_KEY);
    setReturnAt(null);
    setStartedAt(null);
    setBackMode(false);
  };

  const [calendarAdded, setCalendarAdded] = useState(false);
  const addToCalendar = () => {
    if (!returnAt) return;
    downloadReturnTime(returnAt);
    setCalendarAdded(true);
  };

  const imBack = () => {
    focusNextRef.current = "restart-cue";
    setBackMode(true);
  };

  // One live region, kept mounted across the idle / running / back views
  // (always the first child of the same outer div), so changes are announced.
  const liveText =
    returnAt && !backMode
      ? timerAnnouncement({
          remainingMs,
          totalMs: startedAt ? new Date(returnAt).getTime() - new Date(startedAt).getTime() : undefined,
          expired,
          returnLabel: formatClock(new Date(returnAt)),
        })
      : "";
  const live = (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {liveText}
    </p>
  );

  const chip =
    "min-h-12 rounded-xl border border-rule/[0.12] bg-white text-base font-medium text-ink shadow-[0_1px_2px_rgb(26_26_26/0.04)] transition hover:border-pause/40 hover:bg-surface-warn active:scale-[0.98]";

  if (backMode) {
    return (
      <div className="space-y-4">
        {live}
        <WarnBanner pauseLink={false} safetyLink>
          You’re back. Do not restart “where you left off.” If you’re afraid,
          not just flooded, don’t return — get help.
        </WarnBanner>
        <section
          id="restart-cue"
          tabIndex={-1}
          aria-label="Restart cue"
          className="card space-y-3 px-4 py-4 focus:outline-none"
        >
          <Marker kind="DO" label="Restart cue" />
          <ol className="space-y-2 text-base leading-normal">
            <li className="flex gap-3">
              <span className="tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-paper">1</span>
              <span><strong>Warmth</strong> — one warm true sentence.</span>
            </li>
            <li className="flex gap-3">
              <span className="tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-paper">2</span>
              <span><strong>Safety</strong> — Alliance not threatened this moment.</span>
            </li>
            <li className="flex gap-3">
              <span className="tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-paper">3</span>
              <span>Only then: Expression → Request → Alignment.</span>
            </li>
          </ol>
          <ul className="space-y-2 pt-1">
            <li className="phrase-block phrase text-base leading-snug">I’m back. I’m on your team.</li>
            <li className="phrase-block phrase text-base leading-snug">This isn’t a breakup conversation.</li>
          </ul>
        </section>
        <Link
          href="/protocols/system-overlay"
          className="flex min-h-12 items-center justify-center gap-1.5 text-base font-medium text-repair"
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

  if (returnAt && calm) {
    return (
      <div className="space-y-4">
        <CalmPause
          live={live}
          returnLabel={formatClock(new Date(returnAt))}
          remainingMs={remainingMs}
          expired={expired}
          onBack={imBack}
          onExit={exitCalm}
        />
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
        {live}
        <PrimaryButton id="calm-reopen" variant="secondary" onClick={() => setCalm(true)}>
          Full-screen calm view
        </PrimaryButton>
        <div className="card flex flex-col items-center px-4 pb-5 pt-6">
          <TimerDisplay remainingMs={remainingMs} totalMs={totalMs} expired={expired} />
          <p className="mt-4 text-base text-ink-muted">
            Ready at{" "}
            <strong className="tabular font-medium text-ink">{formatClock(at)}</strong>
          </p>
        </div>
        <PrimaryButton variant="warn" onClick={imBack}>
          I’m back
        </PrimaryButton>
        <PrimaryButton variant="secondary" onClick={shareReturnTime}>
          {shareCopied ? "Copied ✓" : "Share my return time"}
        </PrimaryButton>
        <PrimaryButton variant="secondary" onClick={addToCalendar}>
          Add return time to calendar (.ics)
        </PrimaryButton>
        <p role="status" className="text-center text-sm font-medium text-accent empty:hidden">
          {calendarAdded ? "Calendar file downloaded — open it to add the alarm." : ""}
        </p>
        <p className="rounded-xl bg-surface-warn px-3.5 py-2.5 text-sm leading-snug text-ink">
          <strong className="font-medium">Keep this screen open</strong> —
          phones may silence alarms in the background. For a backup, add the
          return time to your calendar.
        </p>
        <PrimaryButton variant="ghost" onClick={cancel}>
          Cancel pause
        </PrimaryButton>
        <p className="text-center text-sm text-ink-muted">
          Separate · calm down · don’t rehearse the argument.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {live}
      <div className="card flex flex-col items-center px-4 pb-4 pt-5">
        <TimerDisplay
          remainingMs={0}
          expired={false}
          idleLabel="00:00"
          caption="Choose a return time"
        />
        <p className="mt-3 text-center text-base leading-normal text-ink-muted">
          Exact phrase:{" "}
          <span className="phrase text-base text-ink">“I’ll be ready at ___.”</span>
        </p>
      </div>

      <section className="space-y-2">
        <p id="pause-duration" tabIndex={-1} className="text-sm font-medium text-ink focus:outline-none">
          Duration
        </p>
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
          <label htmlFor="custom-minutes" className="block text-sm font-medium text-ink">
            Custom minutes
          </label>
          <div className="flex gap-2">
            <input
              id="custom-minutes"
              type="number"
              inputMode="numeric"
              min={MIN_MINUTES}
              max={MAX_MINUTES}
              value={customMinutes}
              onChange={(e) => {
                setCustomMinutes(e.target.value);
                setCustomError(null);
              }}
              aria-invalid={customError ? true : undefined}
              aria-describedby="custom-minutes-hint"
              className="field-input tabular"
            />
            <PrimaryButton
              fullWidth={false}
              className="shrink-0 px-5"
              onClick={() => {
                const n = Number(customMinutes);
                if (!customMinutes.trim() || !Number.isFinite(n)) {
                  setCustomError("Enter a number of minutes, 20 to 1440.");
                  return;
                }
                if (n < MIN_MINUTES) {
                  setCustomError("A pause needs at least 20 minutes to calm down. Pick 20 or more.");
                  return;
                }
                if (n > MAX_MINUTES) {
                  setCustomError("24 hours (1440 minutes) is the maximum. Pick a shorter pause.");
                  return;
                }
                setCustomError(null);
                startWithMs(n * 60 * 1000);
              }}
            >
              Start
            </PrimaryButton>
          </div>
          {customError ? (
            <p id="custom-minutes-hint" role="alert" className="text-sm text-failure">
              {customError}
            </p>
          ) : (
            <p id="custom-minutes-hint" className="text-sm text-ink-muted">
              Min 20 · Max 1440 (24h)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="clock-time" className="block text-sm font-medium text-ink">
            Or return at a clock time
          </label>
          <div className="flex gap-2">
            <input
              id="clock-time"
              type="time"
              value={clockTime}
              onChange={(e) => {
                setClockTime(e.target.value);
                setClockTimeError(null);
              }}
              aria-invalid={clockTimeError ? true : undefined}
              aria-describedby="clock-time-hint"
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
          {clockTimeError ? (
            <p id="clock-time-hint" role="alert" className="text-sm text-failure">
              {clockTimeError}
            </p>
          ) : (
            <p id="clock-time-hint" className="text-sm text-ink-muted">
              Min 20 min · Max 24h away
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Full-screen calm view for a running pause: the return time large, a slow
 * breathing ring (still under reduced motion), the keep-open note, a clear
 * way back to the regular page, and Help always visible.
 */
function CalmPause({
  returnLabel,
  remainingMs,
  expired,
  onBack,
  onExit,
  live,
}: {
  live: ReactNode;
  returnLabel: string;
  remainingMs: number;
  expired: boolean;
  onBack: () => void;
  onExit: () => void;
}) {
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    rootRef.current?.focus();
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
        return;
      }
      // Keep keyboard focus inside the full-screen view (it is modal).
      const root = rootRef.current;
      if (e.key !== "Tab" || !root) return;
      const items = [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (items.length === 0) return;
      const first = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === root || !root.contains(active))) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && (active === lastItem || !root.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  return (
    <section
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calm-heading"
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-surface-activity focus:outline-none"
    >
      {/* The timer's live region sits inside the modal so it is still announced. */}
      {live}
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-[calc(env(safe-area-inset-top)+8px)]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            className="-ml-2 inline-flex min-h-12 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-ink-muted hover:text-accent"
          >
            <ArrowLeft size={18} />
            Exit full screen
          </button>
          <Link
            href="/help"
            className="inline-flex min-h-12 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-failure hover:bg-failure/10"
          >
            <ApIcon id="help-safety" size={18} mono />
            Help
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
          <h2 id="calm-heading" className="flex items-center gap-1.5 text-sm font-medium text-pause-text">
            <ApIcon id="pause-and-return" size={18} />
            {expired ? "Return time" : "Pause + Return · ready at"}
          </h2>
          <div className="relative mt-5 flex h-[min(18rem,78vw)] w-[min(18rem,78vw)] items-center justify-center">
            <span className="calm-breath absolute inset-0 rounded-full bg-pause/[0.13]" aria-hidden />
            <span className="absolute inset-6 rounded-full border border-pause/40 bg-paper/70" aria-hidden />
            <div className="relative">
              <p className={`tabular text-2xl font-semibold ${expired ? "text-pause-text" : "text-ink"}`}>{returnLabel}</p>
              <p className="tabular mt-2 text-sm text-ink-muted">
                {expired ? "Time to reconnect" : `${formatRemaining(remainingMs)} to go`}
              </p>
            </div>
          </div>
          <p className="phrase mt-6 text-lg text-ink">
            {expired ? "Come back, even briefly. Warmth first." : "Breathe in as it grows, out as it settles."}
          </p>
          <p className="mt-1.5 text-sm text-ink-muted">Separate · calm down · don’t rehearse the argument.</p>
        </div>

        <div className="space-y-3">
          <p className="rounded-xl bg-paper px-3.5 py-2.5 text-sm leading-snug text-ink">
            <strong className="font-medium">Keep this screen open</strong> — phones may silence alarms in
            the background.
          </p>
          <PrimaryButton variant="warn" onClick={onBack}>
            I’m back
          </PrimaryButton>
          <p className="text-center text-sm text-ink-muted">
            Afraid, not just flooded? Don’t return at the set time —{" "}
            <Link href="/help" className="font-medium text-failure underline underline-offset-4">
              get help
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
