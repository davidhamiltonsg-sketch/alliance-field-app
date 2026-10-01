"use client";

import { useState } from "react";
import { Marker } from "./Marker";

type Tab = "working" | "notWorking" | "activity";

const TABS: { key: Tab; label: string; tone: string }[] = [
  { key: "working", label: "Working", tone: "border-accent/30 bg-accent/10 text-accent" },
  { key: "notWorking", label: "Not working", tone: "border-failure/25 bg-failure/[0.08] text-failure" },
  { key: "activity", label: "Practise", tone: "border-accent/25 bg-accent/10 text-accent" },
];

const cardTone: Record<Tab, string> = {
  working: "border-accent/15 bg-accent/[0.04]",
  notWorking: "border-failure/15 bg-failure/[0.04]",
  activity: "border-rule/10 bg-surface-activity",
};

/** One paragraph at a time instead of three stacked cards — same content, less wall of text. */
export function PracticeTabs({
  working,
  notWorking,
  activity,
}: {
  working: string;
  notWorking: string;
  activity: string;
}) {
  const [tab, setTab] = useState<Tab>("working");
  const text = { working, notWorking, activity }[tab];
  const kind = tab === "working" ? "OK" : tab === "notWorking" ? "FAIL" : "DO";

  return (
    <div className="space-y-2.5">
      <div className="flex gap-1.5" role="tablist" aria-label="In practice">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`practice-tab-${t.key}`}
            aria-controls="practice-panel"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`min-h-11 flex-1 rounded-full border px-2 text-sm font-medium transition-colors ${
              tab === t.key ? t.tone : "border-rule/15 bg-white text-ink-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <section
        id="practice-panel"
        role="tabpanel"
        aria-labelledby={`practice-tab-${tab}`}
        className={`rounded-2xl border px-4 py-3.5 ${cardTone[tab]}`}
      >
        <Marker kind={kind} />
        <p className="mt-2 text-base leading-normal text-ink">{text}</p>
      </section>
    </div>
  );
}
