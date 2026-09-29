"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Opening splash. Server-rendered so there is no flash of the page before it,
 * and fully CSS-driven so it plays (and leaves) even without JavaScript.
 * An inline script in <head> sets html[data-splash] to "full" on a first
 * visit or "short" once the intro has been seen, before first paint.
 * When JS is running this component takes over: tap to skip, first-visit
 * hand-off to /intro, and unmounting once done.
 */

// Same geometry as <AllianceMark/>: the legs draw in first (sp-ribbon), the
// wave sweeps in after (sp-over) — reusing the two-phase draw-in timing the
// old weave mark used, just applied to the new peak-and-wave shape.
const LEG_LEFT = "M60 14L26 106";
const LEG_RIGHT = "M60 14L94 106";
const WAVE = "M40 74Q50 63 60 74Q70 63 80 74";

const FULL_MS = 1950; // fade starts; gone by ~2.37 s
const SHORT_MS = 260;
const REDUCED_MS = 700;
const FADE_MS = 420;
const BOT = /bot|crawler|spider|crawling|slurp|lighthouse|preview/i;

// First-time visitors get the serious tagline. Returning visitors (mode
// "short") get one of these instead — picked once per load, not a cycle.
const DEFAULT_TAGLINE = "Built for precision. Designed for connection.";
const RETURN_TAGLINES = [
  "Still precise. Still here.",
  "On time, as promised.",
  "Back again. That's the whole point.",
];

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
  const [phase, setPhase] = useState<Phase>("css");
  const [tagline, setTagline] = useState(DEFAULT_TAGLINE);
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
    const html = document.documentElement;
    const mode = html.dataset.splash ?? "full";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const first = mode === "full";
    if (!first) {
      setTagline(RETURN_TAGLINES[Math.floor(Math.random() * RETURN_TAGLINES.length)]);
    }
    const toIntro =
      first && window.location.pathname === "/" && !BOT.test(navigator.userAgent);
    const leaveAt = mode === "off" ? 0 : first ? (reduced ? REDUCED_MS : FULL_MS) : SHORT_MS;
    plan.current = { toIntro, leaveAt };
    const list = timers.current;

    if (toIntro) router.prefetch("/intro");

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
    if (toIntro) {
      list.push(window.setTimeout(handOff, Math.max(0, remaining - 260)));
    }
    list.push(window.setTimeout(leave, remaining));
    return () => list.forEach(clearTimeout);
  }, [handOff, leave, router]);

  // Once the intro has taken over, make sure we fade promptly.
  useEffect(() => {
    if (pathname === "/intro" && phase === "js" && plan.current && !plan.current.toIntro) {
      const t = window.setTimeout(leave, 120);
      return () => clearTimeout(t);
    }
  }, [pathname, phase, leave]);

  const skip = useCallback(() => {
    handOff();
    leave();
  }, [handOff, leave]);

  if (phase === "done") return null;

  return (
    <div
      className="splash"
      data-js={phase !== "css" ? "" : undefined}
      data-leaving={phase === "leaving" ? "" : undefined}
      onClick={skip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Escape") skip();
      }}
      role="button"
      tabIndex={-1}
      aria-label="Skip opening"
    >
      <div
        className="splash-glow pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_42%,rgb(61_90_76/0.10),transparent_70%)]"
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
        <p className="splash-word mt-7 text-[17px] font-medium tracking-[0.14em] text-ink">
          THE ALLIANCE
        </p>
        <p className="splash-tag phrase mt-2 text-[17px] leading-snug text-ink-muted">
          {tagline}
        </p>
      </div>
    </div>
  );
}
