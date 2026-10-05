"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { SPLASH_EVENT, splashCleared } from "../splash/Splash";
import { INTRO_SEEN_KEY } from "../splash/boot";
import { AllianceMark } from "../AllianceMark";
import { ArrowLeft, ArrowRight } from "../icons";
import { ApIcon, type IconId } from "../ApIcon";
import {
  ConnectionCardsDiagram,
  CoreFiveDiagram,
  PauseTimelineDiagram,
  ResetStepsDiagram,
  SituationMapDiagram,
  SystemDiagram,
} from "./diagrams";

type Panel = {
  id: string;
  eyebrow: string;
  icon: IconId;
  title: string;
  body: string;
  aside?: string;
  /** Adds the "afraid, not just flooded?" line with a link to Help & safety. */
  safety?: boolean;
  diagram: ReactNode;
};

// Value first: something usable tonight, then how to choose, then what to
// learn. The product system comes last, and only as an offer.
const panels: Panel[] = [
  {
    id: "reset",
    eyebrow: "Use it tonight",
    icon: "60-second-reset",
    title: "If it’s getting heated: the 60-Second Reset.",
    body: "Stop, say it, a touch only if it’s welcome, three breaths, then an exact time to keep talking. About a minute.",
    safety: true,
    diagram: <ResetStepsDiagram />,
  },
  {
    id: "situation-map",
    eyebrow: "Situation Map",
    icon: "situation-map",
    title: "Not sure what to do? Take the first row that fits.",
    body: "Safety comes first: if you’re afraid, threatened, or not free to say no, stop and get outside help. Otherwise, start at the top and read down.",
    diagram: <SituationMapDiagram />,
  },
  {
    id: "core-5",
    eyebrow: "Learn first",
    icon: "tier-core",
    title: "Start with six tools.",
    body: "Learn these six first; the rest can wait. Your first week sets them up in 10–20 minutes a day.",
    diagram: <CoreFiveDiagram />,
  },
  {
    id: "pause-and-return",
    eyebrow: "Pause + Return",
    icon: "pause-and-return",
    title: "Pause, then come back on time.",
    body: "Give a clock time, 20 minutes to 24 hours. Coming back on time is what makes it a pause, not a walk-out.",
    diagram: <PauseTimelineDiagram />,
  },
  {
    id: "connection-cards",
    eyebrow: "Connection Cards",
    icon: "connection-cards",
    title: "For when things are fine, too.",
    body: "Thirty-five questions to flip through together, light to deep. Nothing to fix. Five minutes.",
    diagram: <ConnectionCardsDiagram />,
  },
  {
    id: "system",
    eyebrow: "Optional",
    icon: "manual",
    title: "The app, and the books.",
    body: "We made this app for when it’s actually happening and there’s no time to look anything up. Free, and complete on its own. Open each tool once on wifi or Add to Home Screen, then it works offline. The books go further if you want them.",
    diagram: <SystemDiagram />,
  },
];

function subscribeSplash(cb: () => void) {
  window.addEventListener(SPLASH_EVENT, cb);
  return () => window.removeEventListener(SPLASH_EVENT, cb);
}

export function IntroFlow() {
  // Hold the first diagram until the opening splash has cleared.
  const ready = useSyncExternalStore(subscribeSplash, splashCleared, () => true);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = panels.length - 1;
  // Only the first panels' diagrams render up front; later ones mount as you
  // get near them (and stay mounted), keeping the first paint light.
  const [reached, setReached] = useState(1);
  const want = Math.min(last, index + 1);
  if (want > reached) setReached(want);

  // Arm the diagrams (hidden until their panel is active) and remember the intro.
  useEffect(() => {
    rootRef.current?.classList.add("dg-armed");
    try {
      window.localStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* storage unavailable: the intro simply shows again next time */
    }
  }, []);

  // Scroll cue: on short screens the active panel's text can run below the
  // fold; say so instead of letting it look finished.
  const [moreBelow, setMoreBelow] = useState(false);
  const checkMore = useCallback(() => {
    const panel = document.getElementById(`intro-${panels[index].id}`);
    setMoreBelow(!!panel && panel.scrollHeight - panel.clientHeight - panel.scrollTop > 8);
  }, [index]);
  useEffect(() => {
    const raf = window.requestAnimationFrame(checkMore);
    window.addEventListener("resize", checkMore);
    // Diagrams mount lazily and fonts swap in: check again once they have.
    const t = window.setTimeout(checkMore, 600);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", checkMore);
      window.clearTimeout(t);
    };
  }, [checkMore, reached]);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    setIndex((prev) => (prev === i ? prev : Math.min(last, Math.max(0, i))));
  }, [last]);

  const goTo = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(Math.min(last, index + 1));
      if (e.key === "ArrowLeft") goTo(Math.max(0, index - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index, last]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex justify-center"
      aria-label="Introduction"
      role="region"
    >
      <div className="relative flex h-dvh w-full max-w-lg flex-col bg-paper sm:border-x sm:border-rule/30 sm:shadow-[0_0_60px_-20px_rgb(44_62_45/0.25)]">
        {/* soft brand wash */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(120%_80%_at_50%_0%,rgb(44_62_45/0.10),transparent_70%)]"
          aria-hidden
        />
        <h1 className="sr-only">Welcome to the Alliance Protocols Field App</h1>
        <header className="relative flex h-14 shrink-0 items-center justify-between pl-4 pr-2">
          <span className="flex items-center gap-2.5">
            <AllianceMark size={26} className="text-accent" />
            <span className="hidden whitespace-nowrap text-sm font-medium tracking-[0.1em] text-ink min-[360px]:inline">
              ALLIANCE PROTOCOLS
            </span>
          </span>
          <span className="flex items-center">
          {/* Help is one tap away on every screen, the intro included. */}
          <Link
            href="/help"
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-failure transition-colors hover:bg-failure/10"
            aria-label="Help and safety: Help Lines"
          >
            Help
          </Link>
          <Link
            href="/"
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-base font-medium text-accent transition-opacity hover:bg-accent/[0.06] ${
              index === last ? "pointer-events-none opacity-0" : ""
            }`}
            aria-hidden={index === last}
            tabIndex={index === last ? -1 : undefined}
          >
            Skip
          </Link>
          </span>
        </header>

        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={0}
          role="region"
          aria-label="Introduction panels — use the arrow keys or swipe"
          className="intro-track relative flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto"
        >
          {panels.map((p, i) => (
            <section
              key={p.id}
              id={`intro-${p.id}`}
              className={`flex w-full shrink-0 snap-center snap-always flex-col overflow-y-auto px-5 pb-4 pt-2 ${
                ready && i === index ? "is-active" : ""
              }`}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${panels.length}: ${p.eyebrow}`}
              aria-hidden={i !== index ? true : undefined}
              // Scrollable on short screens: keep the active panel reachable by keyboard.
              tabIndex={i === index ? 0 : -1}
              onScroll={i === index ? checkMore : undefined}
            >
              <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center pb-2">
                {/* The safety line comes first, above the diagram, so it is on
                    screen even on the smallest phones (320×568). */}
                {p.safety && (
                  <p className="mb-3 shrink-0 rounded-xl border border-failure/20 bg-surface-warn px-3 py-2 text-sm leading-snug text-ink">
                    Afraid of your partner, being threatened, or not free to
                    say no? These tools are not for this.{" "}
                    <Link
                      href="/help"
                      tabIndex={i === index ? undefined : -1}
                      className="font-medium text-failure underline underline-offset-4"
                    >
                      Get outside help
                    </Link>
                  </p>
                )}
                {/* The stage takes the height that's left (equal across panels, so
                    headlines line up) and shrinks on short screens so the text
                    stays in view. */}
                <div className="flex min-h-[200px] max-h-[436px] max-w-full flex-1 basis-0 [@media(max-height:600px)]:min-h-[112px] items-center justify-center self-center rounded-[26px_26px_6px_6px] border border-rule/60 bg-surface-raised/90 p-2 shadow-[var(--shadow-card)]">
                  <div className="flex aspect-[340/336] h-full max-w-full items-center">{i <= reached ? p.diagram : null}</div>
                </div>
                <div className="mt-5 shrink-0">
                  <p className="eyebrow flex items-center gap-1.5 text-accent">
                    <ApIcon id={p.icon} size={18} />
                    {p.eyebrow}
                  </p>
                  <h2 className="display mt-2.5 text-xl leading-[1.12]">{p.title}</h2>
                  <p className="mt-2 text-base leading-normal text-ink-muted">{p.body}</p>
                  {p.id === "system" && (
                    <Link
                      href="/about#product-line"
                      tabIndex={i === index ? undefined : -1}
                      className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-accent underline-offset-4 hover:underline"
                    >
                      See the Manual and Kit
                      <ArrowRight size={16} />
                    </Link>
                  )}
                  {p.aside && (
                    <p className="mt-1.5 text-sm italic leading-snug text-ink-muted">
                      {p.aside}
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <footer className="relative shrink-0 px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-2">
          {moreBelow && (
            <p
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-9 flex h-9 items-end justify-center bg-gradient-to-t from-paper via-paper/90 to-transparent pb-1 text-xs font-medium text-ink-muted"
            >
              Scroll for more ↓
            </p>
          )}
          <div className="flex items-center justify-center pb-1" role="group" aria-label="Choose a panel">
            {panels.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => goTo(i)}
                className="flex h-11 min-w-11 items-center justify-center"
                aria-label={`Go to ${i + 1}: ${p.eyebrow}`}
                aria-current={i === index ? "step" : undefined}
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-accent" : "w-1.5 bg-accent/25"
                  }`}
                />
              </button>
            ))}
          </div>

          {index < last ? (
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <button
                type="button"
                onClick={() => goTo(Math.max(0, index - 1))}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-rule/60 bg-surface-raised text-accent transition-opacity ${
                  index === 0 ? "pointer-events-none opacity-0" : ""
                }`}
                aria-label="Back"
                tabIndex={index === 0 ? -1 : undefined}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-accent text-base font-semibold text-paper shadow-[0_8px_20px_-10px_rgb(44_62_45/0.7)] transition active:scale-[0.99]"
              >
                Next
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/start"
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-accent text-base font-semibold text-paper shadow-[0_8px_20px_-10px_rgb(44_62_45/0.7)] transition active:scale-[0.99]"
              >
                Start your first week
                <ArrowRight size={18} />
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  className="flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-accent/30 bg-surface-raised text-sm font-semibold text-accent transition active:scale-[0.99]"
                >
                  Situation Map
                </Link>
                <Link
                  href="/pause"
                  className="flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-pause/35 bg-surface-activity text-sm font-semibold text-pause-text transition active:scale-[0.99]"
                >
                  <ApIcon id="pause-and-return" size={18} />
                  Pause + Return
                </Link>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
