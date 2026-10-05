import type { Situation } from "./types";

/**
 * The Situation Map: the one canonical 12-row list, word for word and in the
 * same order as the Manual and the Field Kit (scratchpad spec/situation-map.json,
 * version 1.2-r15): label = question, description, firstMove = answer,
 * primaryHref = tools[0], then the second tools in order. App-only action
 * links (a timer, a route) follow the tools. Take the first row that fits,
 * top to bottom; safety routing always comes first and never routes to Pause.
 */
export const SITUATION_MAP_RULE = "Read from the top and take the first row that matches. Several at once? Safety comes first.";
export const SITUATION_MAP_FOOTER = "Flooded part-way through any row? Back to Pause + Return. Afraid at any point? Back to the first row: Pause + Return is for flooding, never for fear.";

export const situations: Situation[] = [
  {
    id: "unsafe",
    label: "I’m afraid, being threatened, or not free to say no",
    description: "You’re afraid of your partner, or being threatened, pressured or controlled, and it’s more than a hard conversation.",
    note: "This includes jealousy that leads to checking, restricting or accusing.",
    firstMove: "Stop. These tools are not for this. Get outside help (see Help Lines). Immediate danger: your local emergency number.",
    primaryHref: "/help",
    danger: true,
  },
  {
    id: "flooded",
    label: "I’m flooded or shut down (but safe)",
    description: "Racing heart, tunnel vision, can’t think straight, urge to flee or win.",
    firstMove: "Pause + Return, with an exact return time. For flooding, never for fear. If you’re the one waiting: don’t follow or message.",
    primaryHref: "/protocols/pause-and-return",
    secondaryHrefs: [
      { label: "60-Second Reset", href: "/protocols/60-second-reset" },
      { label: "Start timer", href: "/pause" },
    ],
  },
  {
    id: "conflict-starting",
    label: "A fight is starting",
    description: "Voices are rising and you’re both building a case.",
    firstMove: "60-Second Reset. Say: “I want to connect, not fight. Can we talk at ___?” Too hot to stay in the room? Pause + Return. Next: the System Overlay, and start it with the Green Rule.",
    primaryHref: "/protocols/60-second-reset",
    secondaryHrefs: [
      { label: "Pause + Return", href: "/protocols/pause-and-return" },
      { label: "System Overlay", href: "/protocols/system-overlay" },
      { label: "Green Rule", href: "/protocols/green-rule" },
    ],
  },
  {
    id: "outside-pressure",
    label: "Outside pressure or disapproval from family, friends or strangers",
    description: "Family disapproval, discrimination or judgement from others is landing on the two of you.",
    firstMove: "Team Agreement: decide together how the two of you respond. Never limit a partner’s contact with anyone. Pressure coming from your partner? If they check, restrict or punish your contact with others: row 1 (Help Lines). Otherwise: the Green Rule.",
    primaryHref: "/protocols/team-agreement",
    secondaryHrefs: [
      { label: "Green Rule", href: "/protocols/green-rule" },
      { label: "Together", href: "/together" },
    ],
  },
  {
    id: "trust-breach",
    label: "Trust breach",
    description: "Lying, infidelity or a broken agreement that you both agree happened.",
    firstMove: "Safety first, then Trust Recovery. A breach is something you both agree happened. Seeing friends or family, privacy or a locked phone is never a breach. Skip Your First Week: start with Trust Recovery, then the Weekly Reset. Agree one change you’ll both see, and check it together at a set time.",
    primaryHref: "/protocols/trust-recovery",
  },
  {
    id: "detachment",
    label: "Pulling away",
    description: "Warmth missing, repairs on autopilot: several signs of pulling away, not just needing space.",
    firstMove: "Check-Up: each of you marks your own half of the sheet, privately. Contempt, fear or coercion: stop and get outside support first. A partner who has stopped sharing because they are afraid is not pulling away: use the Help Lines. Then, only if you both want one: Full Repair.",
    primaryHref: "/protocols/check-up",
    secondaryHrefs: [
      { label: "Full Repair", href: "/protocols/full-repair" },
    ],
  },
  {
    id: "after-fight",
    label: "After a fight, or something small stung",
    description: "Something sharp was said, or a small promise slipped, and it’s still sitting there.",
    firstMove: "Micro-Repair: start within minutes if you can; finish within 24 hours. Bigger hurts go to Full Repair.",
    primaryHref: "/protocols/micro-repair",
    secondaryHrefs: [
      { label: "Full Repair", href: "/protocols/full-repair" },
    ],
  },
  {
    id: "attachment-clash",
    label: "We keep clashing the same way",
    description: "Reach–Recoil (one reaches, the other pulls back), the same ask on repeat, or one of you always wanting to talk sooner than the other.",
    firstMove: "Name it out loud: “I think we’re doing the thing again.” Later, when you’re calm, find the pattern in the Manual’s Appendix A and try Profile Calibration together. Also: Check-Up.",
    goDeeper: "Appendix A: common patterns is in the Manual; for timing clashes, see Chapter 5, Hearing Each Other.",
    primaryHref: "/protocols/profile-calibration",
    icon: "profile-calibration",
    secondaryHrefs: [
      { label: "Check-Up", href: "/protocols/check-up" },
      { label: "Start Profile Calibration", href: "/calibrate" },
    ],
  },
  {
    id: "intimacy-stall",
    label: "Intimacy feels stuck",
    description: "Asking or saying no feels tense; things have gone cold.",
    firstMove: "Intimacy Pact. Pressure after a no: stop; don’t talk it through in the moment. The person pressured decides whether, when and with whom to talk. Force, threats, fear or a repeat: Help Lines.",
    primaryHref: "/protocols/intimacy-pact",
    secondaryHrefs: [
      { label: "Help Lines", href: "/help" },
    ],
  },
  {
    id: "say-do-gap",
    label: "Saying one thing, doing another",
    description: "Your own follow-through: promises that don’t match what happens.",
    firstMove: "Consistency Pact: a private weekly check. Broke a shared agreement? Tell your partner. After a breach you both agree happened? A Proof item only if you both agree.",
    primaryHref: "/protocols/consistency-pact",
  },
  {
    id: "daily-drift",
    label: "We feel like housemates",
    description: "Conversations are just logistics; the connection feels thin.",
    firstMove: "Daily Rhythm: a morning hello and an evening catch-up. Still thin after two weeks? A Check-Up. Feels like a chore? Take a night off fixing: a Sun Memory.",
    primaryHref: "/protocols/daily-rhythm",
    secondaryHrefs: [
      { label: "Check-Up", href: "/protocols/check-up" },
      { label: "Sun Memory", href: "/protocols/sun-memory" },
    ],
  },
  {
    id: "weekly-maintenance",
    label: "Time for our weekly check-in",
    description: "A short catch-up at a set time, to keep small things small.",
    firstMove: "Weekly Reset: about 40 minutes (15 is fine to start). The monthly part adds 10 minutes.",
    primaryHref: "/weekly-reset",
    secondaryHrefs: [
      { label: "Weekly Reset card", href: "/protocols/weekly-reset" },
    ],
  },
];
