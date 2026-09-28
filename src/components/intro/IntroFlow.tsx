"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { SPLASH_EVENT, splashCleared } from "../splash/Splash";
import { INTRO_SEEN_KEY } from "../splash/boot";
import { AllianceMark } from "../AllianceMark";
import { ArrowLeft, ArrowRight, PauseIcon } from "../icons";
import { ProtocolIcon } from "../visuals/ProtocolIcon";
import {
  ConnectionCardsDiagram,
  PatternLoopDiagram,
  PauseTimelineDiagram,
  SituationMapDiagram,
  SystemDiagram,
  WeeklyResetDiagram,
} from "./diagrams";

type Panel = {
  id: string;
  eyebrow: string;
  icon: string;
  title: string;
  body: string;
  diagram: ReactNode;
};

const panels: Panel[] = [
  {
    id: "system",
    eyebrow: "The system",
    icon: "section-concept",
    title: "One system, three parts.",
    body: "The Manual is the deep system, the Kit is the install layer, and this app routes you to the right card in the moment.",
    diagram: <SystemDiagram />,
  },
  {
    id: "situation-map",
    eyebrow: "Situation Map",
    icon: "section-when-to-use",
    title: "Find your row. Pull the card.",
    body: "When you don’t know which card to pull, follow the first match, top to bottom.",
    diagram: <SituationMapDiagram />,
  },
  {
    id: "pause-and-return",
    eyebrow: "Pause + Return",
    icon: "pause-and-return",
    title: "Pause, then return on time.",
    body: "Give a clock time, 20 minutes to 24 hours. The return is what proves pause, not disappearance.",
    diagram: <PauseTimelineDiagram />,
  },
  {
    id: "pattern-loop",
    eyebrow: "Pattern loop",
    icon: "conflict-protocol",
    title: "Interrupt the loop early.",
    body: "Best point: the pattern. Name the loop, give a holding signal, and use Pause + Return with a committed time.",
    diagram: <PatternLoopDiagram />,
  },
  {
    id: "weekly-reset",
    eyebrow: "Weekly Reset",
    icon: "weekly-reset",
    title: "Thirty minutes, once a week.",
    body: "Appreciation, care audit, one friction, requests, alignment. Maintenance, not a trial.",
    diagram: <WeeklyResetDiagram />,
  },
  {
    id: "connection-cards",
    eyebrow: "Connection Cards",
    icon: "connection-cards",
    title: "For when things are fine, too.",
    body: "Flip through 35 questions across five stages — Warmth, Curiosity, Care, Repair, Alliance. No protocol needed, just five minutes together.",
    diagram: <ConnectionCardsDiagram />,
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

  // Arm the diagrams (hidden until their panel is active) and remember the intro.
  useEffect(() => {
    rootRef.current?.classList.add("dg-armed");
    try {
      window.localStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* storage unavailable: the intro simply shows again next time */
    }
  }, []);

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
      <div className="relative flex h-dvh w-full max-w-lg flex-col bg-paper sm:border-x sm:border-rule/[0.07] sm:shadow-[0_0_60px_-20px_rgb(44_62_45/0.25)]">
        {/* soft brand wash */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(120%_80%_at_50%_0%,rgb(61_90_76/0.10),transparent_70%)]"
          aria-hidden
        />
        <header className="relative flex h-14 shrink-0 items-center justify-between pl-4 pr-2">
          <span className="flex items-center gap-2.5">
            <AllianceMark size={26} className="text-accent" />
            <span className="text-[13px] font-medium tracking-[0.14em] text-ink">
              THE ALLIANCE
            </span>
          </span>
          <Link
            href="/"
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-medium text-accent transition-opacity hover:bg-accent/[0.06] ${
              index === last ? "pointer-events-none opacity-0" : ""
            }`}
            aria-hidden={index === last}
            tabIndex={index === last ? -1 : undefined}
          >
            Skip
          </Link>
        </header>

        <div
          ref={trackRef}
          onScroll={onScroll}
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
            >
              <div className="mx-auto my-auto w-full max-w-[420px] pb-2">
                <div className="rounded-[26px_26px_6px_6px] border border-[#A8895A]/45 bg-white/90 p-2 shadow-[var(--shadow-card)]">
                  {/* equal-height stage so headlines line up across panels */}
                  <div className="flex aspect-[340/336] w-full items-center">{p.diagram}</div>
                </div>
                <div className="mt-5">
                  <p className="eyebrow flex items-center gap-1.5 text-accent">
                    <ProtocolIcon slug={p.icon} size={15} strokeWidth={2} />
                    {p.eyebrow}
                  </p>
                  <h2 className="display mt-2.5 text-[28px] leading-[1.12]">{p.title}</h2>
                  <p className="mt-2 text-[15px] leading-normal text-ink-muted">{p.body}</p>
                </div>
              </div>
            </section>
          ))}
        </div>

        <footer className="relative shrink-0 px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-2">
          <div className="flex items-center justify-center gap-2 pb-3" role="group" aria-label="Choose a panel">
            {panels.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => goTo(i)}
                className="flex h-6 items-center justify-center px-0.5"
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
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-rule/15 bg-white text-accent transition-opacity ${
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
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-accent text-[15px] font-semibold text-paper shadow-[0_8px_20px_-10px_rgb(61_90_76/0.7)] transition active:scale-[0.99]"
              >
                Next
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/"
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-accent text-[15px] font-semibold text-paper shadow-[0_8px_20px_-10px_rgb(61_90_76/0.7)] transition active:scale-[0.99]"
              >
                Start with the Situation Map
                <ArrowRight size={18} />
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/pause"
                  className="flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-pause/35 bg-surface-activity text-[14px] font-semibold text-[#9A5E10] transition active:scale-[0.99]"
                >
                  <PauseIcon size={17} />
                  Pause + Return
                </Link>
                <Link
                  href="/connect"
                  className="flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-repair/35 bg-repair/[0.08] text-[14px] font-semibold text-repair transition active:scale-[0.99]"
                >
                  <ProtocolIcon slug="connection-cards" size={17} />
                  Connection Cards
                </Link>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
