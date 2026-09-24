import type { Situation } from "./types";

export const situations: Situation[] = [
  {
    id: "flooded",
    label: "Flooded",
    description: "Racing heart, tunnel vision, urge to flee or win.",
    firstMove: "[WARN] → Pause + Return",
    primaryHref: "/protocols/pause-and-return",
    secondaryHrefs: [
      { label: "60-Second Reset", href: "/protocols/60-second-reset" },
      { label: "Start timer", href: "/pause" },
    ],
    warn: true,
  },
  {
    id: "conflict-starting",
    label: "Conflict starting",
    description: "Tone rising, courtroom energy.",
    firstMove: "Green Rule check → Overlay / Conflict",
    primaryHref: "/protocols/green-rule",
    secondaryHrefs: [
      { label: "System Overlay", href: "/protocols/system-overlay" },
      { label: "Conflict Protocol", href: "/protocols/conflict-protocol" },
    ],
  },
  {
    id: "after-fight",
    label: "After a fight",
    description: "Residue, need repair within a window.",
    firstMove: "Micro-Repair (or Full Recovery if large)",
    primaryHref: "/protocols/micro-repair",
    secondaryHrefs: [
      { label: "Proof Protocol", href: "/protocols/proof-protocol" },
    ],
  },
  {
    id: "daily-drift",
    label: "Daily drift",
    description: "Logistics-only, roommate feel.",
    firstMove: "Morning / Evening Rhythm",
    primaryHref: "/protocols/morning-evening-rhythm",
  },
  {
    id: "weekly-maintenance",
    label: "Weekly maintenance",
    description: "Scheduled governance, not a trial.",
    firstMove: "Weekly Reset wizard",
    primaryHref: "/weekly-reset",
    secondaryHrefs: [
      { label: "Weekly Reset card", href: "/protocols/weekly-reset" },
    ],
  },
  {
    id: "trust-breach",
    label: "Trust breach",
    description: "Betrayal, deception, broken agreements.",
    firstMove: "[WARN] safety first → Trust Recovery + Proof",
    primaryHref: "/protocols/trust-recovery",
    secondaryHrefs: [
      { label: "Proof Protocol", href: "/protocols/proof-protocol" },
      { label: "Pause", href: "/pause" },
    ],
    warn: true,
  },
  {
    id: "intimacy-stall",
    label: "Intimacy stall",
    description: "Initiating/declining tense; atmosphere cold.",
    firstMove: "Check Safety → Intimacy Pact",
    primaryHref: "/protocols/intimacy-pact",
  },
  {
    id: "detachment",
    label: "Detachment / uninvestment",
    description: "Multiple uninvestment signs — not hope.",
    firstMove: "Manual XIII-D; Proof if proceeding",
    primaryHref: "/about#detachment",
    secondaryHrefs: [
      { label: "Proof Protocol", href: "/protocols/proof-protocol" },
    ],
    warn: true,
  },
  {
    id: "attachment-clash",
    label: "Attachment clash",
    description: "Pursue-withdraw, reassurance treadmill, tempo clash.",
    firstMove: "System Overlay + Translation",
    primaryHref: "/protocols/system-overlay",
  },
  {
    id: "repair-needed",
    label: "Repair needed",
    description: "Residue or broken agreement.",
    firstMove: "Micro-Repair → Conflict → Proof",
    primaryHref: "/protocols/micro-repair",
    secondaryHrefs: [
      { label: "Conflict Protocol", href: "/protocols/conflict-protocol" },
      { label: "Consistency Pact", href: "/protocols/consistency-pact" },
    ],
  },
];
