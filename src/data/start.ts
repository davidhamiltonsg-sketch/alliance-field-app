/**
 * /start — a 7-day start plan built on the Core 5. About 10 minutes a day;
 * day 7 is the first Weekly Reset (five parts, about 40 minutes).
 */
export interface StartDay {
  day: number;
  title: string;
  /** What to do today, in one or two sentences. */
  task: string;
  minutes: number;
  /** Protocol card this day is built on (must exist in src/data/cards). */
  slug: string;
  /** Optional in-app tool for the day (a route, e.g. the Weekly Reset wizard). */
  tool?: { label: string; href: string };
}

export const START_PLAN_DAYS = 7;

export const startDays: StartDay[] = [
  {
    day: 1,
    title: "Safety first: the Green Rule",
    task: "Read the Green Rule together. Agree one sentence either of you can say when something feels unsafe, and find the help lines in the app.",
    minutes: 10,
    slug: "green-rule",
    tool: { label: "Help lines", href: "/help" },
  },
  {
    day: 2,
    title: "Agree how you pause",
    task: "Read Pause + Return. Agree your pause phrase and that every pause gets an exact return time — 20 minutes minimum, 24 hours max.",
    minutes: 10,
    slug: "pause-and-return",
    tool: { label: "Pause timer", href: "/pause" },
  },
  {
    day: 3,
    title: "Rehearse the 60-Second Reset",
    task: "Practise the five steps three times on a fake topic (“dishes”) while you’re both calm. Pick the phrase you’ll actually use.",
    minutes: 10,
    slug: "60-second-reset",
  },
  {
    day: 4,
    title: "One small repair",
    task: "Pick one small thing from the last few days. Soften your tone, own 2% of it, and name the impact — one sentence, no “but”.",
    minutes: 10,
    slug: "micro-repair",
  },
  {
    day: 5,
    title: "Walk the Situation Map",
    task: "Read the Situation Map top to bottom. Notice the safety row comes first, and that “flooded, but safe” routes to Pause + Return. Each name the row you hit most often.",
    minutes: 10,
    slug: "pause-and-return",
    tool: { label: "Situation Map", href: "/" },
  },
  {
    day: 6,
    title: "Book your first Weekly Reset",
    task: "Read the Weekly Reset card. Put a 40-minute slot in both calendars for tomorrow, and each note one appreciation to bring.",
    minutes: 10,
    slug: "weekly-reset",
  },
  {
    day: 7,
    title: "Your first Weekly Reset",
    task: "Run it with the in-app wizard: Appreciation (5 min) · Check the load (15 min) · One friction point (15 min) · Requests + Next steps (5 min). Run a 40-minute timer.",
    minutes: 40,
    slug: "weekly-reset",
    tool: { label: "Weekly Reset wizard", href: "/weekly-reset" },
  },
];
