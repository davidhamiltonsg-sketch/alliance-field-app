/**
 * /start: Your First Week (SPEC section 5), the same plan, day for day, as
 * the Field Kit's first-week plan and Manual Chapter 4. "Tonight" takes
 * 20 minutes; days 2 to 6 take 10 to 25; day 7 is your first Weekly Reset
 * (15 minutes is fine; 40 is the full version).
 */
export interface StartDay {
  day: number;
  title: string;
  /** What to do today, in one or two sentences. */
  task: string;
  /** Finishes the Kit's "Today’s done when …" line: how you know the day is done. */
  proof: string;
  minutes: number;
  /** Tool card this day is built on (must exist in src/data/cards). */
  slug: string;
  /** Optional in-app tool for the day (a route, e.g. the weekly-reset page). */
  tool?: { label: string; href: string };
}

export const START_TITLE = "Your First Week";

/** "Tonight (20 minutes)": three jobs, and day 1 is exactly these. */
export const TONIGHT = {
  title: "Tonight (20 minutes)",
  minutes: 20,
  steps: [
    "Read the red row of the Situation Map.",
    "Agree one pause phrase and a return time. Write them where you will both see them.",
    "Try the 60-Second Reset once, while you’re calm.",
  ],
} as const;

export const START_NOTES = {
  tightOnTime: "Tight on time? Do the Weekly Reset in two 20-minute halves.",
  trustBreach:
    "If there has been a breach of trust, skip the plan: start with Trust Recovery, then the Weekly Reset.",
  onlyOneReading: "Only one of you reading? Invite, don’t assign.",
  longDistance: "Long distance: everything works on a call. See Adapting in the Manual.",
  sceptical: "Sceptical partner? Hand them Volume A.",
} as const;

export const START_PLAN_DAYS = 7;

export const startDays: StartDay[] = [
  {
    day: 1,
    title: "Tonight’s job",
    task: "Do the Tonight list (20 minutes): read the red row of the Situation Map, agree one pause phrase and a return time and write them where you’ll both see them, then try the 60-Second Reset once, while you’re calm.",
    proof: "you’ve agreed your pause phrase and return time and written them down.",
    minutes: 20,
    slug: "60-second-reset",
    tool: { label: "Situation Map", href: "/#situation-map" },
  },
  {
    day: 2,
    title: "Say the Green Rule lines aloud",
    task: "Open the Green Rule and read its Say This lines aloud, once each. Agree the repair line you’ll use if one of you reacts badly.",
    proof: "you’ve each said the lines out loud.",
    minutes: 10,
    slug: "green-rule",
  },
  {
    day: 3,
    title: "A first Micro-Repair",
    task: "Clear up one small thing that stung: soften your tone and own your part of it. No “but”. Start within minutes if you can; finish within 24 hours.",
    proof: "one of you has made a small repair.",
    minutes: 10,
    slug: "micro-repair",
  },
  {
    day: 4,
    title: "Practise Pause + Return",
    task: "Practise it once, calm: “I need a pause. I’ll be ready at [exact time].” Take 20 minutes apart; come back on the minute.",
    proof: "you’re back at the time you said.",
    minutes: 25,
    slug: "pause-and-return",
    tool: { label: "Pause timer", href: "/pause" },
  },
  {
    day: 5,
    title: "One evening catch-up",
    task: "Try one Daily Rhythm moment: the evening catch-up only (about 10 minutes). Talk about how the day went, and each name one thing you appreciated.",
    proof: "you’ve had one evening catch-up.",
    minutes: 10,
    slug: "daily-rhythm",
  },
  {
    day: 6,
    title: "Try the quick System Overlay",
    task: "Try the System Overlay’s quick version (about 90 seconds) on one small thing: “Restart: same team.” Then book your first Weekly Reset for tomorrow.",
    proof: "you’ve tried the quick version once and booked the time.",
    minutes: 10,
    slug: "system-overlay",
  },
  {
    day: 7,
    title: "Your first Weekly Reset",
    task: "Hold your first Weekly Reset: 15 minutes is fine to start; 40 is the full version, with a 40-minute timer. One friction point and one request each; agree one next step. Book the next three weeks before you get up.",
    proof: "you’ve had your first Reset and booked the next three.",
    minutes: 40,
    slug: "weekly-reset",
    tool: { label: "Do this week’s Reset", href: "/weekly-reset" },
  },
];
