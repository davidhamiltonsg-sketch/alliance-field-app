"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { INTRO_SEEN_KEY, isNoSplashPath } from "./boot";

/**
 * Opening splash. Server-rendered so there is no flash of the page before it,
 * and fully CSS-driven so it plays (and leaves) even without JavaScript.
 * An inline script in <head> sets html[data-splash] to "full" on a first
 * visit or "short" once the intro has been seen, before first paint.
 * When JS is running this component takes over: tap to skip, first-visit
 * and unmounting once done.
 *
 * Never shown on /help, /pause or /unlock (not even server-rendered, so not
 * without JS either): those are opened in a hurry. Everywhere else it carries
 * a working Help link and a visible "Tap anywhere to skip".
 */

// Same geometry as <AllianceMark/>: the legs draw in first (sp-ribbon), the
// wave sweeps in after (sp-over) — reusing the two-phase draw-in timing the
// old weave mark used, just applied to the new peak-and-wave shape.
const LEG_LEFT = "M60 14L26 106";
const LEG_RIGHT = "M60 14L94 106";
const WAVE = "M40 74Q50 63 60 74Q70 63 80 74";

const FULL_MS = 700; // fade starts; gone by ~1.0 s (never more than 1.2 s)
const SHORT_MS = 260;
const REDUCED_MS = 600;
const FADE_MS = 300;

// First-time visitors get the serious tagline. Returning visitors (mode
// "short") get one of these instead — picked once per load, not a cycle.
const DEFAULT_TAGLINE = "Built for precision. Designed for connection.";
// Shown on its own line above the first-visit tagline.
const ALLIANCE_LINE = "We are an alliance.";
const RETURN_TAGLINES = [
  "Still here.",
  "On time, as promised.",
  "Back again. That’s the whole point.",
];

// Picked once per page load on the client; the server never needs it.
const RETURN_PICK = Math.floor(Math.random() * RETURN_TAGLINES.length);

const noopSubscribe = () => () => {};
/** html[data-splash] is set by the boot script before first paint and never changes. */
const readSplashMode = () => document.documentElement.dataset.splash ?? "full";
const serverSplashMode = () => "full";

type Phase = "css" | "js" | "leaving" | "done";

export const SPLASH_EVENT = "alliance:splash";

/** Tell the page (e.g. the intro) the splash is out of the way. */
function announce(state: "leaving" | "done") {
  const html = document.documentElement;
  if (html.dataset.splashState === "done") return;
  html.dataset.splashState = state;
  window.dispatchEvent(new Event(SPLASH_EVENT));
}

/** True once no splash is covering the page. */
export function splashCleared() {
  const s = document.documentElement.dataset.splashState;
  return s === "leaving" || s === "done" || !document.querySelector(".splash");
}

/**
 * Milliseconds the splash has been playing, read from its own CSS animation
 * clock. The CSS sequence starts when the HTML arrives, not at navigation
 * start, so performance.now() would cut the lockup short on slow networks.
 */
function splashElapsed() {
  const el = document.querySelector<HTMLElement>(".splash");
  const anim = el?.getAnimations?.()[0];
  const t = anim?.currentTime;
  return typeof t === "number" ? t : performance.now();
}

export function Splash() {
  const router = useRouter();
  const pathname = usePathname();
  // Decided once, from the page the app was opened on (a later client-side
  // move to "/" must not bring the splash back).
  const [suppressed] = useState(() => isNoSplashPath(pathname));
  const [phase, setPhase] = useState<Phase>("css");
  // Server render (and hydration) use the first-visit tagline; the client then
  // switches to a return tagline when the boot script marked this a return visit.
  const splashMode = useSyncExternalStore(noopSubscribe, readSplashMode, serverSplashMode);
  const tagline = splashMode === "full" ? DEFAULT_TAGLINE : RETURN_TAGLINES[RETURN_PICK];
  const plan = useRef<{ toIntro: boolean; leaveAt: number } | null>(null);
  const timers = useRef<number[]>([]);

  const leave = useCallback(() => {
    announce("leaving");
    setPhase((p) => (p === "leaving" || p === "done" ? p : "leaving"));
    timers.current.push(window.setTimeout(() => setPhase("done"), FADE_MS + 40));
  }, []);

  const handOff = useCallback(() => {
    if (plan.current?.toIntro) {
      plan.current.toIntro = false;
      router.replace("/intro");
    }
  }, [router]);

  useEffect(() => {
    if (suppressed) {
      announce("done");
      return;
    }
    const html = document.documentElement;
    const mode = html.dataset.splash ?? "full";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const first = mode === "full";
    // The full opening plays once: later visits get the short one.
    if (first) {
      try {
        window.localStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {
        /* storage unavailable: the full splash simply plays again */
      }
    }
    // First visits are no longer sent to /intro; the home page offers the tour.
    const toIntro = false;
    const leaveAt = mode === "off" ? 0 : first ? (reduced ? REDUCED_MS : FULL_MS) : SHORT_MS;
    plan.current = { toIntro, leaveAt };
    const list = timers.current;

    const now = splashElapsed();
    // Hydrated after the CSS fallback already finished: stay out of the way.
    const tooLate = now > leaveAt + FADE_MS;
    if (tooLate || mode === "off") {
      announce("done");
      if (toIntro) handOff();
      list.push(window.setTimeout(() => setPhase("done"), 0));
      return () => list.forEach(clearTimeout);
    }

    list.push(window.setTimeout(() => setPhase((p) => (p === "css" ? "js" : p)), 0));
    const remaining = Math.max(0, leaveAt - now);
    // Fallback for when the boot script couldn't redirect: move to the intro
    // straight away, underneath the splash, so it's ready when the splash lifts.
    if (toIntro) handOff();
    list.push(window.setTimeout(leave, remaining));
    return () => list.forEach(clearTimeout);
  }, [handOff, leave, router, suppressed]);

  const skip = useCallback(() => {
    handOff();
    leave();
  }, [handOff, leave]);

  // Escape (or Enter / Space) skips while the splash is up.
  const showing = !suppressed && phase !== "done" && phase !== "leaving";
  useEffect(() => {
    if (!showing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showing, skip]);

  if (suppressed || phase === "done") return null;

  return (
    <div
      className="splash"
      data-js={phase !== "css" ? "" : undefined}
      data-leaving={phase === "leaving" ? "" : undefined}
      onClick={skip}
    >
      {/* Help is one tap away even during the opening: a real link, so it works without JS too. */}
      <a
        href="/help"
        onClick={(e) => e.stopPropagation()}
        className="absolute right-2 top-[calc(env(safe-area-inset-top)+4px)] z-[1] inline-flex h-12 items-center rounded-full px-3 text-sm font-semibold text-failure"
        aria-label="Help and safety: Help Lines"
      >
        Help
      </a>
      <div
        className="splash-glow pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_42%,rgb(44_62_45/0.10),transparent_70%)]"
        aria-hidden
      />
      <div className="relative flex flex-col items-center px-8 text-center">
        <svg
          className="splash-mark text-accent"
          viewBox="0 0 120 120"
          width="104"
          height="104"
          aria-hidden
          focusable="false"
        >
          <g fill="none" strokeLinecap="round">
            <path className="sp-ribbon" pathLength={1} d={LEG_LEFT} stroke="currentColor" strokeWidth="10" />
            <path className="sp-ribbon" pathLength={1} d={LEG_RIGHT} stroke="currentColor" strokeWidth="10" />
            <path className="sp-over" pathLength={1} d={WAVE} stroke="#A8895A" strokeWidth="8.5" />
          </g>
        </svg>
        <p className="splash-word mt-7 text-base font-medium tracking-[0.14em] text-ink">
          ALLIANCE PROTOCOLS
        </p>
        {splashMode === "full" ? (
          <p className="splash-tag phrase mt-2 text-base leading-snug text-ink-muted">
            {ALLIANCE_LINE}
          </p>
        ) : null}
        <p
          className={`splash-tag phrase text-base leading-snug text-ink-muted ${
            splashMode === "full" ? "mt-0.5" : "mt-2"
          }`}
        >
          {tagline}
        </p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
        className="splash-skip absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+20px)] mx-auto inline-flex min-h-12 w-fit items-center rounded-full px-4 text-sm font-medium text-ink-muted"
      >
        Tap anywhere to skip
      </button>
    </div>
  );
}
