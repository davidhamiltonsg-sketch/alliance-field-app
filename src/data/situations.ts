import type { Situation } from "./types";

export const situations: Situation[] = [
  {
    id: "flooded",
    label: "I'm flooded",
    description: "Heart racing, can't think straight, want to flee or win the argument.",
    firstMove: "Take a pause first — then Pause + Return",
    primaryHref: "/protocols/pause-and-return",
    secondaryHrefs: [
      { label: "60-Second Reset", href: "/protocols/60-second-reset" },
      { label: "Start timer", href: "/pause" },
    ],
    warn: true,
  },
  {
    id: "conflict-starting",
    label: "A fight is starting",
    description: "Tone is rising, it's starting to feel like a courtroom, not a conversation.",
    firstMove: "Check it's safe to talk, then System Overlay or Conflict Protocol",
    primaryHref: "/protocols/green-rule",
    secondaryHrefs: [
      { label: "System Overlay", href: "/protocols/system-overlay" },
      { label: "Conflict Protocol", href: "/protocols/conflict-protocol" },
    ],
  },
  {
    id: "after-fight",
    label: "We just had a fight",
    description: "Still feeling the sting, need to repair before it hardens.",
    firstMove: "Micro-Repair now (or Full Recovery if it's a big one)",
    primaryHref: "/protocols/micro-repair",
    secondaryHrefs: [
      { label: "Proof Protocol", href: "/protocols/proof-protocol" },
      { label: "Full Recovery", href: "/protocols/full-recovery" },
    ],
  },
  {
    id: "daily-drift",
    label: "We feel like roommates",
    description: "Conversations are just logistics; the connection feels thin.",
    firstMove: "Morning Reset + Evening Landing",
    primaryHref: "/protocols/morning-evening-rhythm",
  },
  {
    id: "weekly-maintenance",
    label: "Time for our weekly check-in",
    description: "A short, scheduled catch-up — not a trial.",
    firstMove: "Run the Weekly Reset",
    primaryHref: "/weekly-reset",
    secondaryHrefs: [
      { label: "Weekly Reset card", href: "/protocols/weekly-reset" },
    ],
  },
  {
    id: "trust-breach",
    label: "Trust has been broken",
    description: "A betrayal, a lie, or a broken agreement.",
    firstMove: "Safety first, then Trust Recovery + Proof",
    primaryHref: "/protocols/trust-recovery",
    secondaryHrefs: [
      { label: "Proof Protocol", href: "/protocols/proof-protocol" },
      { label: "Pause", href: "/pause" },
    ],
    warn: true,
  },
  {
    id: "intimacy-stall",
    label: "Intimacy feels stuck",
    description: "Initiating or declining feels tense; things have gone cold.",
    firstMove: "Check in on safety, then the Intimacy Pact",
    primaryHref: "/protocols/intimacy-pact",
  },
  {
    id: "detachment",
    label: "I'm worried one of us is checking out",
    description: "Several signs of pulling away, not just needing space.",
    firstMove: "Run the Uninvestment Check, then Proof if you proceed",
    primaryHref: "/protocols/uninvestment-check",
    secondaryHrefs: [
      { label: "Full Recovery", href: "/protocols/full-recovery" },
      { label: "Proof Protocol", href: "/protocols/proof-protocol" },
    ],
    warn: true,
  },
  {
    id: "attachment-clash",
    label: "We keep clashing the same way",
    description: "One of you chases, one pulls back — or you're just out of sync on timing.",
    firstMove: "System Overlay, then translate what's underneath",
    primaryHref: "/protocols/system-overlay",
  },
  {
    id: "repair-needed",
    label: "Something small is still bugging me",
    description: "Leftover friction or a broken small agreement.",
    firstMove: "Micro-Repair → Conflict Protocol if it grows → Proof",
    primaryHref: "/protocols/micro-repair",
    secondaryHrefs: [
      { label: "Conflict Protocol", href: "/protocols/conflict-protocol" },
      { label: "Consistency Pact", href: "/protocols/consistency-pact" },
    ],
  },
];
