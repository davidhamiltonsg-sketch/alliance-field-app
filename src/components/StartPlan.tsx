"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProtocol } from "@/data/protocols";
import { START_PLAN_DAYS, TONIGHT, startDays } from "@/data/start";
import { readStartProgress, toggleStartDay } from "@/lib/storage";
import { ArrowRight, CheckIcon, ChevronRight } from "./icons";

/** The day to show open: the first one not ticked yet (Day 1 for someone new). */
export function currentStartDay(done: number[]): number {
  for (let day = 1; day <= START_PLAN_DAYS; day++) if (!done.includes(day)) return day;
  return START_PLAN_DAYS;
}

/**
 * The first-week plan with quiet progress dots. Ticks live only on this
 * device (alliance.* storage, removed by Delete all data). No streaks, no
 * scores: a day can be ticked in any order, or not at all. Only the current
 * day is open; the others fold to one line and open on tap.
 */
export function StartPlan() {
  // Starts empty to match SSR, synced from localStorage after mount.
  const [done, setDone] = useState<number[]>([]);
  // Day 1 is open on the server render and for someone new.
  const [open, setOpen] = useState<number[]>([1]);
  useEffect(() => {
    const saved = readStartProgress();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, not mirroring props/state
    setDone(saved);
    setOpen([currentStartDay(saved)]);
  }, []);
  const toggleOpen = (day: number) =>
    setOpen((o) => (o.includes(day) ? o.filter((d) => d !== day) : [...o, day]));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <ol className="flex items-center gap-1.5" aria-label="Days ticked">
          {Array.from({ length: START_PLAN_DAYS }, (_, i) => i + 1).map((day) => (
            <li
              key={day}
              className={`h-2.5 w-2.5 rounded-full ${done.includes(day) ? "bg-accent" : "border border-accent/35 bg-surface-raised"}`}
            >
              <span className="sr-only">
                Day {day}: {done.includes(day) ? "done" : "not yet"}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-ink-muted" aria-live="polite">
          {done.length === 0 ? "Tick a day when you’ve done it." : `${done.length} of ${START_PLAN_DAYS} done`}
        </p>
      </div>

      <ol className="space-y-2.5">
        {startDays.map((d) => {
          const card = getProtocol(d.slug);
          const isDone = done.includes(d.day);
          const isOpen = open.includes(d.day);
          return (
            <li key={d.day} className="card px-4 py-1.5">
              <h2>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`start-day-${d.day}`}
                onClick={() => toggleOpen(d.day)}
                className="flex min-h-12 w-full items-center gap-3 py-1.5 text-left"
              >
                <span
                  className={`tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                    isDone ? "bg-accent text-paper" : "border border-accent/30 text-accent"
                  }`}
                  aria-hidden
                >
                  {isDone ? <CheckIcon size={16} /> : d.day}
                </span>
                <span className="display min-w-0 flex-1 text-lg leading-snug">
                  <span className="sr-only">Day {d.day}: </span>
                  {d.title}
                </span>
                <span className="tabular shrink-0 text-sm text-ink-muted">~{d.minutes} min</span>
                <ChevronRight
                  size={18}
                  className={`shrink-0 text-ink-muted transition-transform ${isOpen ? "rotate-90" : ""}`}
                  aria-hidden
                />
              </button>
              </h2>
              <div id={`start-day-${d.day}`} hidden={!isOpen} className="pb-2">
              {d.day === 1 ? (
                // Day 1 is tonight: the three jobs, as a list (one card, not two).
                <ol className="mt-1 list-decimal space-y-1 pl-[3.75rem] text-base leading-normal text-ink">
                  {TONIGHT.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              ) : (
                <p className="mt-1 pl-11 text-base leading-normal text-ink-muted">{d.task}</p>
              )}
              <p className="mt-1.5 pl-11 text-sm leading-snug text-ink">
                <span className="font-medium text-accent">Today’s done when</span> {d.proof}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-5 pl-11">
                {card && (
                  <Link
                    href={`/protocols/${d.slug}`}
                    className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-accent"
                  >
                    {card.title}
                    <ArrowRight size={16} />
                  </Link>
                )}
                {d.tool && (
                  <Link
                    href={d.tool.href}
                    className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-accent"
                  >
                    {d.tool.label}
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
              <div className="mt-1 pl-11">
                <button
                  type="button"
                  aria-pressed={isDone}
                  onClick={() => setDone(toggleStartDay(d.day))}
                  className={`inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-full border px-4 text-base font-medium transition-colors ${
                    isDone ? "border-accent bg-accent/10 text-accent" : "border-rule/60 bg-surface-raised text-ink-muted"
                  }`}
                >
                  <CheckIcon size={16} className={isDone ? "" : "opacity-40"} />
                  <span className="sr-only">Day {d.day} </span>
                  Done
                </button>
              </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
