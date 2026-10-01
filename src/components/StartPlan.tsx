"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProtocol } from "@/data/protocols";
import { START_PLAN_DAYS, startDays } from "@/data/start";
import { readStartProgress, toggleStartDay } from "@/lib/storage";
import { ArrowRight, CheckIcon } from "./icons";

/**
 * The 7-day start plan with quiet progress dots. Ticks live only on this
 * device (alliance.* storage, removed by Delete all data). No streaks, no
 * scores: a day can be ticked in any order, or not at all.
 */
export function StartPlan() {
  // Starts empty to match SSR, synced from localStorage after mount.
  const [done, setDone] = useState<number[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, not mirroring props/state
    setDone(readStartProgress());
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <ol className="flex items-center gap-1.5" aria-label="Days ticked">
          {Array.from({ length: START_PLAN_DAYS }, (_, i) => i + 1).map((day) => (
            <li
              key={day}
              className={`h-2.5 w-2.5 rounded-full ${done.includes(day) ? "bg-accent" : "border border-accent/35 bg-white"}`}
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
          return (
            <li key={d.day} className="card px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span
                  className={`tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                    isDone ? "bg-accent text-paper" : "border border-accent/30 text-accent"
                  }`}
                  aria-hidden
                >
                  {isDone ? <CheckIcon size={16} /> : d.day}
                </span>
                <h2 className="display min-w-0 flex-1 text-lg leading-snug">
                  <span className="sr-only">Day {d.day}: </span>
                  {d.title}
                </h2>
                <span className="tabular shrink-0 text-sm text-ink-muted">~{d.minutes} min</span>
              </div>
              <p className="mt-2 pl-11 text-base leading-normal text-ink-muted">{d.task}</p>
              <p className="mt-1.5 pl-11 text-sm leading-snug text-ink">
                <span className="font-medium text-accent">Proof:</span> {d.proof}
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
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                    isDone ? "border-accent bg-accent/10 text-accent" : "border-rule/60 bg-white text-ink-muted"
                  }`}
                >
                  <CheckIcon size={16} className={isDone ? "" : "opacity-40"} />
                  <span className="sr-only">Day {d.day} </span>
                  Done
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
