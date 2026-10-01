import type { InstallDay } from "./types";

export const installDays: InstallDay[] = [
  {
    day: 1,
    title: "Safety + pause basics",
    bullets: [
      "Read the Situation Map (5 min).",
      "Agree together on your default pause length.",
      "Cards: Green Rule, Pause + Return.",
      "Say your safety sentences out loud once.",
    ],
    proof: "Phrases written down; defaults agreed.",
    cardSlugs: ["green-rule", "pause-and-return"],
  },
  {
    day: 2,
    title: "Daily check-ins",
    bullets: [
      "Card: Morning + Evening Rhythm.",
      "Run a morning check-in (5 min or less) and evening check-in (10 min).",
      "Check in, acknowledge, and appreciate each other daily.",
    ],
    proof: "Both check-ins done, noted where you both see it.",
    cardSlugs: ["morning-evening-rhythm"],
  },
  {
    day: 3,
    title: "Practise the full sequence",
    bullets: [
      "Card: System Overlay.",
      "A 12-minute practice run on something low-stakes, using all five steps.",
    ],
    proof: "One practice run completed.",
    cardSlugs: ["system-overlay"],
  },
  {
    day: 4,
    title: "Build the micro-repair habit",
    bullets: [
      "Card: Micro-Repair.",
      "Clear one thing from the last two days with a soft tone and owning your part.",
      "Get familiar with the 60-Second Reset while you’re calm.",
    ],
    proof: "One micro-repair done.",
    cardSlugs: ["micro-repair", "60-second-reset"],
  },
  {
    day: 5,
    title: "Your first Weekly Reset",
    bullets: [
      "Use the in-app Weekly Reset wizard (40-minute timer).",
      "One friction point each → one request; agree next steps.",
    ],
    proof: "Reset completed; next three weeks on the calendar.",
    cardSlugs: ["weekly-reset"],
  },
  {
    day: 6,
    title: "Proof and consistency",
    bullets: [
      "Cards: Proof Protocol, Consistency Pact.",
      "Write one shared proof item together.",
      "Each of you starts your own private Consistency Pact for week one.",
    ],
    proof: "Behaviour, evidence, time window, and check-in date all filled in.",
    cardSlugs: ["proof-protocol", "consistency-pact"],
  },
  {
    day: 7,
    title: "Apply it to your real life",
    bullets: [
      "Re-read the Situation Map with this week’s actual stress in mind.",
      "Pick one card to focus on next week.",
      "One specific appreciation, each.",
    ],
    proof: "Focus card chosen.",
  },
];
