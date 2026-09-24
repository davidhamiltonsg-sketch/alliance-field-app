import type { InstallDay } from "./types";

export const installDays: InstallDay[] = [
  {
    day: 1,
    title: "Safety + Pause defaults",
    bullets: [
      "Read Situation Map (5 min).",
      "Agree pause defaults together.",
      "Cards: green-rule, pause-and-return.",
      "Say safety sentences aloud once.",
    ],
    proof: "Phrases written; defaults initialled.",
    cardSlugs: ["green-rule", "pause-and-return"],
  },
  {
    day: 2,
    title: "Daily anchors",
    bullets: [
      "Card: morning-evening-rhythm.",
      "Run Morning Reset (≤5) and Evening Landing (10).",
      "Daily Floor: check-in, acknowledgement, appreciation.",
    ],
    proof: "Both anchors Y on shared note.",
    cardSlugs: ["morning-evening-rhythm"],
  },
  {
    day: 3,
    title: "Overlay drill",
    bullets: [
      "Card: system-overlay.",
      "12-minute low-stakes drill (five labelled lines).",
    ],
    proof: "One completed drill.",
    cardSlugs: ["system-overlay"],
  },
  {
    day: 4,
    title: "Micro-repair muscle",
    bullets: [
      "Card: micro-repair.",
      "Clear one <48h residue with softness + 2% ownership.",
      "Familiarize 60-second-reset while calm.",
    ],
    proof: "One micro-repair delivered.",
    cardSlugs: ["micro-repair", "60-second-reset"],
  },
  {
    day: 5,
    title: "Weekly Reset #1",
    bullets: [
      "Use in-app Weekly Reset wizard (30-minute timer).",
      "One friction each → one ask; Alignment.",
    ],
    proof: "Reset completed; next three weeks calendared.",
    cardSlugs: ["weekly-reset"],
  },
  {
    day: 6,
    title: "Proof + consistency",
    bullets: [
      "Cards: proof-protocol, consistency-pact.",
      "Write one shared Proof item.",
      "Each starts private Consistency Pact week-1.",
    ],
    proof: "Behaviour / Evidence / Window / Review filled.",
    cardSlugs: ["proof-protocol", "consistency-pact"],
  },
  {
    day: 7,
    title: "Route your real life",
    bullets: [
      "Re-read Situation Map with this week’s stresses.",
      "Pick next week’s single focus card.",
      "One specific appreciation each.",
    ],
    proof: "Focus card chosen.",
  },
];
