/**
 * /start — the one 7-day plan (CANON round 5): the same plan, day for day,
 * as the Field Kit's "The First Week" and the Manual's "Your First 7 Days".
 * About 10 minutes a day; day 7 is the first Weekly Reset (about 40 minutes).
 */
export interface StartDay {
  day: number;
  title: string;
  /** What to do today, in one or two sentences. */
  task: string;
  /** Finishes the Kit's "Today’s done when …" line: how you know the day is done. */
  proof: string;
  minutes: number;
  /** Protocol card this day is built on (must exist in src/data/cards). */
  slug: string;
  /** Optional in-app tool for the day (a route, e.g. the weekly-reset page). */
  tool?: { label: string; href: string };
}

export const START_PLAN_DAYS = 7;

export const startDays: StartDay[] = [
  {
    day: 1,
    title: "Safety + Pause defaults",
    task: "Read the Situation Map, safety row first. Open Green Rule and Pause + Return. Agree your defaults together and write them where you’ll both see them: your signal, a 20-minute minimum, 24 hours max, an exact return time. Then, on Green Rule, read the Say This lines aloud, once each.",
    proof: "you’ve agreed your defaults out loud and written them down.",
    minutes: 10,
    slug: "green-rule",
    tool: { label: "Situation Map", href: "/#situation-map" },
  },
  {
    day: 2,
    title: "Practise the 60-Second Alliance Reset",
    task: "Practise all five steps once, calm, so they’re familiar before you need them. Start the daily floor (four small things you do every day): a check-in, an “I see you”, an appreciation, and a repair within 24 hours if anything stings.",
    proof: "you’ve practised it once, calm, and started the daily floor.",
    minutes: 10,
    slug: "60-second-reset",
  },
  {
    day: 3,
    title: "A first Micro-Repair",
    task: "Clear up one small thing that stung: soften your tone and own your part of it. No “but”. Start within minutes if you can; complete within 24 hours.",
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
    title: "Morning and evening check-ins",
    task: "Start the Morning + Evening Rhythm: a morning check-in (5 minutes or less) and an evening check-in (about 10 minutes). Mark both on a shared note.",
    proof: "you’ve marked both check-ins on the note.",
    minutes: 15,
    slug: "morning-evening-rhythm",
  },
  {
    day: 6,
    title: "Set up the Reset",
    task: "Open Weekly Reset, book 40 minutes for tomorrow, and each of you note one appreciation and one friction point.",
    proof: "you’ve booked the time and drafted the agenda.",
    minutes: 10,
    slug: "weekly-reset",
  },
  {
    day: 7,
    title: "Weekly Reset #1",
    task: "All five parts, a 40-minute timer, one friction point and one request each; agree one next step. Book the next three weeks before you get up.",
    proof: "you’ve had your first Reset and booked the next three.",
    minutes: 40,
    slug: "weekly-reset",
    tool: { label: "Do this week’s Reset", href: "/weekly-reset" },
  },
];
