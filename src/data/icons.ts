// Alliance Protocols icon set. Copied from the shared design foundation (design/icons.ts, generated
// by design/src/build_icons.py); keep in step with it rather than editing glyphs here.
// 24x24 grid, stroke 1.75, round caps/joins, fill none, stroke=currentColor.
// `accent` (optional, at most one path) is stroked in brass (#A8895A) with class "ap-accent".

export type IconGroup = "protocol" | "concept" | "section" | "tier";

export interface IconDef {
  paths: readonly string[];
  accent?: string;
  label: string;
  group: IconGroup;
}

export const ICON_VIEWBOX = "0 0 24 24";
export const ICON_STROKE = 1.75;
export const ICON_ACCENT = "#A8895A";

export const icons = {
  "pause-and-return": {
    paths: [
      "M6.5 3h11M6.5 21h11",
      "M8 3v2.6c0 2.8 3 4.1 3 6.4s-3 3.6-3 6.4V21",
      "M16 3v2.6c0 2.8-3 4.1-3 6.4s3 3.6 3 6.4V21",
      "M9.75 18.25c.6-.9 1.35-1.4 2.25-1.4s1.65.5 2.25 1.4",
    ],
    label: "Pause + Return",
    group: "protocol",
  },
  "60-second-reset": {
    paths: [
      "M4.75 13.75a7.25 7.25 0 1 0 14.5 0a7.25 7.25 0 1 0 -14.5 0Z",
      "M10 3h4M12 3v3.5",
      "M18.4 7.4l1.3-1.3",
      "M12 13.75V9.5a4.25 4.25 0 0 1 4.25 4.25Z",
    ],
    label: "60-Second Reset",
    group: "protocol",
  },
  "green-rule": {
    paths: [
      "M12 3l7.5 2.75v5.5c0 4.6-3.1 8-7.5 9.75-4.4-1.75-7.5-5.15-7.5-9.75v-5.5Z",
      "M8.75 12.25l2.25 2.25 4.25-4.5",
    ],
    label: "Green Rule",
    group: "protocol",
  },
  "system-overlay": {
    paths: [
      "M12 2.75l9.25 5.6-9.25 5.6-9.25-5.6Z",
      "M2.75 13.9l9.25 5.6 9.25-5.6",
      "M16.25 8.92A4.4 2.2 0 1 1 14.2 6.44",
      "M12.67 7.19L14.2 6.44L13.3 5",
    ],
    label: "System Overlay",
    group: "protocol",
  },
  "weekly-reset": {
    paths: [
      "M6.5 5H17.5A2.5 2.5 0 0 1 20 7.5V18.5A2.5 2.5 0 0 1 17.5 21H6.5A2.5 2.5 0 0 1 4 18.5V7.5A2.5 2.5 0 0 1 6.5 5Z",
      "M8.5 3v4M15.5 3v4",
      "M4 10h16",
      "M14.68 13.95A3.1 3.1 0 1 1 10.22 12.96",
      "M9.79 14.81L10.22 12.96L8.34 12.73",
    ],
    label: "Weekly Reset",
    group: "protocol",
  },
  "micro-repair": {
    paths: [
      "M3 12c3-2 6-2 9 0s6 2 9 0",
    ],
    accent: "M6.75 7.75l.75 7.5M11.6 8.25l.8 7.5M16.5 8.75l.75 7.5",
    label: "Micro-Repair",
    group: "protocol",
  },
  "daily-rhythm": {
    paths: [
      "M4.75 7a2.25 2.25 0 1 0 4.5 0a2.25 2.25 0 1 0 -4.5 0Z",
      "M10.75 7L11.9 7M7 10.75L7 11.9M4.35 9.65L3.54 10.46M3.25 7L2.1 7M4.35 4.35L3.54 3.54M7 3.25L7 2.1M9.65 4.35L10.46 3.54",
      "M20.5 16.4a4.6 4.6 0 1 1-5-5.9 3.6 3.6 0 0 0 5 5.9Z",
    ],
    label: "Daily Rhythm",
    group: "protocol",
  },
  "intimacy-pact": {
    paths: [
      "M13.72 9.17A5.5 5.5 0 1 1 9.68 6.54",
    ],
    accent: "M10.28 14.83A5.5 5.5 0 1 1 14.32 17.46",
    label: "Intimacy Pact",
    group: "protocol",
  },
  "trust-recovery": {
    paths: [
      "M3 8.5h18c0 5.6-4 10-9 10s-9-4.4-9-10Z",
      "M9 21h6",
    ],
    accent: "M13.25 8.5 11.1 12l2.4 2.6-1.6 3.9",
    label: "Trust Recovery",
    group: "protocol",
  },
  "consistency-pact": {
    paths: [
      "M3.5 9h10M3.5 15h10",
      "M15.5 12.4l2.1 2.1 3.9-4.5",
    ],
    label: "Consistency Pact",
    group: "protocol",
  },
  "full-repair": {
    paths: [
      "M18.01 5.99A8.5 8.5 0 1 1 9.8 3.79",
      "M8.49 5.8L9.8 3.79L7.66 2.7",
      "M7.75 15.75h2.85v-2.85h2.85v-2.85h2.8",
    ],
    label: "Full Repair",
    group: "protocol",
  },
  "check-up": {
    paths: [
      "M4.5 20.5V4.5",
      "M9.5 20.5V9",
      "M14.5 20.5v-7",
      "M19.5 20.5v-2.5",
    ],
    label: "Check-Up",
    group: "protocol",
  },
  "team-agreement": {
    paths: [
      "M10 6.5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0Z",
      "M12 8.5V21",
      "M8.5 11.5h7",
      "M5 15c.4 3.5 3.3 6 7 6s6.6-2.5 7-6",
      "M3.4 16.6 5 15l1.7 1.4M20.6 16.6 19 15l-1.7 1.4",
    ],
    accent: "M3.5 3c3 .1 5.3 .9 6.9 2.3M20.5 3c-3 .1-5.3 .9-6.9 2.3",
    label: "Team Agreement",
    group: "concept",
  },
  "sun-memory": {
    paths: [
      "M3 16.5h18",
      "M5.94 13L4.42 12.12M9.04 10.16L8.3 8.57M12 9.5L12 7.75M14.96 10.16L15.7 8.57M18.06 13L19.58 12.12",
      "M8.5 20.5h7",
    ],
    accent: "M7 16.5a5 5 0 0 1 10 0",
    label: "Sun Memory",
    group: "concept",
  },
  "connection-cards": {
    paths: [
      "M8.5 17H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2",
    ],
    accent: "M11 8H18A2 2 0 0 1 20 10V19A2 2 0 0 1 18 21H11A2 2 0 0 1 9 19V10A2 2 0 0 1 11 8Z",
    label: "Connection Cards",
    group: "concept",
  },
  "situation-map": {
    paths: [
      "M2.75 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0Z",
      "M6.75 12h3.5",
      "M10.25 12c2.6 0 2.4-6 5-6h2.15M10.25 12h7.15M10.25 12c2.6 0 2.4 6 5 6h2.15",
      "M18 6a1.4 1.4 0 1 0 2.8 0a1.4 1.4 0 1 0 -2.8 0ZM18 12a1.4 1.4 0 1 0 2.8 0a1.4 1.4 0 1 0 -2.8 0ZM18 18a1.4 1.4 0 1 0 2.8 0a1.4 1.4 0 1 0 -2.8 0Z",
    ],
    label: "Situation Map",
    group: "concept",
  },
  "profile-calibration": {
    paths: [
      "M3.5 4v16M20.5 4v16",
      "M3.5 9h4.75M12.25 9h8.25",
      "M8.25 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0Z",
      "M3.5 15h8.75M16.25 15h4.25",
      "M12.25 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0Z",
    ],
    label: "Profile Calibration",
    group: "concept",
  },
  "care-check-in": {
    paths: [
      "M12 20.25C6.6 17.1 3.25 13.7 3.25 9.9A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 8.75 2.5c0 3.8-3.35 7.2-8.75 10.35Z",
      "M8.9 12.4l2.1 2.1 4.1-4.2",
    ],
    label: "Monthly part of the Weekly Reset",
    group: "concept",
  },
  "help-safety": {
    paths: [
      "M3.25 12a8.75 8.75 0 1 0 17.5 0a8.75 8.75 0 1 0 -17.5 0Z",
      "M8.25 12a3.75 3.75 0 1 0 7.5 0a3.75 3.75 0 1 0 -7.5 0Z",
      "M14.65 14.65L18.19 18.19M9.35 14.65L5.81 18.19M9.35 9.35L5.81 5.81M14.65 9.35L18.19 5.81",
    ],
    label: "Help Lines / Safety",
    group: "concept",
  },
  "worksheet": {
    paths: [
      "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z",
      "M14 3v5h5",
      "M8.5 12.5h7M8.5 16.5h4.5",
    ],
    label: "Worksheet",
    group: "concept",
  },
  "manual": {
    paths: [
      "M5 18.5v-13A2.5 2.5 0 0 1 7.5 3H19v18H7.5A2.5 2.5 0 0 1 5 18.5a2.5 2.5 0 0 1 2.5-2.5H19",
      "M10 3v6.5l2-1.5 2 1.5V3",
    ],
    label: "Operating Manual",
    group: "concept",
  },
  "field-kit": {
    paths: [
      "M3.5 12h17v6.5a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5Z",
      "M6.5 12V5a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 13.5 5v7",
      "M13.5 7H16a1.5 1.5 0 0 1 1.5 1.5V12",
      "M10 16.25h4",
    ],
    label: "Field Kit",
    group: "concept",
  },
  "companion": {
    paths: [
      "M12 6.75C10 5.25 7 4.6 3 4.75v13.5c4-.15 7 .5 9 2 2-1.5 5-2.15 9-2v-13.5c-4-.15-7 .5-9 2Z",
      "M12 6.75v13.5",
    ],
    label: "Companion Book",
    group: "concept",
  },
  "section-when": {
    paths: [
      "M12 3v18",
      "M12 5h5.75l2.5 2.5-2.5 2.5H12",
      "M12 12.5H6.25l-2.5 2.5 2.5 2.5H12",
      "M9 21h6",
    ],
    label: "When to use",
    group: "section",
  },
  "section-steps": {
    paths: [
      "M3.5 20.5H8V16h4.5v-4.5H17V7h3.5",
      "M3.5 20.5h17",
    ],
    label: "Steps",
    group: "section",
  },
  "section-say": {
    paths: [
      "M6 4h12a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 18 17h-6.5L7 20.75V17H6a2.5 2.5 0 0 1-2.5-2.5v-8A2.5 2.5 0 0 1 6 4Z",
      "M8 9h8M8 12.5h5",
    ],
    label: "Say this",
    group: "section",
  },
  "section-working": {
    paths: [
      "M3.25 12a8.75 8.75 0 1 0 17.5 0a8.75 8.75 0 1 0 -17.5 0Z",
      "M8.25 12.25l2.5 2.5 5-5",
    ],
    label: "Working",
    group: "section",
  },
  "section-not-working": {
    paths: [
      "M20.41 15.48L15.48 20.41L8.52 20.41L3.59 15.48L3.59 8.52L8.52 3.59L15.48 3.59L20.41 8.52Z",
      "M9.25 9.25l5.5 5.5M14.75 9.25l-5.5 5.5",
    ],
    label: "Not working",
    group: "section",
  },
  "section-safety": {
    paths: [
      "M3.25 12a8.75 8.75 0 1 0 17.5 0a8.75 8.75 0 1 0 -17.5 0Z",
      "M8.25 12a3.75 3.75 0 1 0 7.5 0a3.75 3.75 0 1 0 -7.5 0Z",
      "M14.65 14.65L18.19 18.19M9.35 14.65L5.81 18.19M9.35 9.35L5.81 5.81M14.65 9.35L18.19 5.81",
    ],
    label: "Safety",
    group: "section",
  },
  "tier-core": {
    paths: [
      "M10.1 12a1.9 1.9 0 1 0 3.8 0a1.9 1.9 0 1 0 -3.8 0ZM11.05 12a0.95 0.95 0 1 0 1.9 0a0.95 0.95 0 1 0 -1.9 0ZM12 12h0.01",
    ],
    label: "Core",
    group: "tier",
  },
  "tier-situational": {
    paths: [
      "M6.6 12a1.9 1.9 0 1 0 3.8 0a1.9 1.9 0 1 0 -3.8 0ZM7.55 12a0.95 0.95 0 1 0 1.9 0a0.95 0.95 0 1 0 -1.9 0ZM8.5 12h0.01M13.6 12a1.9 1.9 0 1 0 3.8 0a1.9 1.9 0 1 0 -3.8 0ZM14.55 12a0.95 0.95 0 1 0 1.9 0a0.95 0.95 0 1 0 -1.9 0ZM15.5 12h0.01",
    ],
    label: "Situational",
    group: "tier",
  },
  "tier-build": {
    paths: [
      "M3.1 12a1.9 1.9 0 1 0 3.8 0a1.9 1.9 0 1 0 -3.8 0ZM4.05 12a0.95 0.95 0 1 0 1.9 0a0.95 0.95 0 1 0 -1.9 0ZM5 12h0.01M10.1 12a1.9 1.9 0 1 0 3.8 0a1.9 1.9 0 1 0 -3.8 0ZM11.05 12a0.95 0.95 0 1 0 1.9 0a0.95 0.95 0 1 0 -1.9 0ZM12 12h0.01M17.1 12a1.9 1.9 0 1 0 3.8 0a1.9 1.9 0 1 0 -3.8 0ZM18.05 12a0.95 0.95 0 1 0 1.9 0a0.95 0.95 0 1 0 -1.9 0ZM19 12h0.01",
    ],
    label: "Build",
    group: "tier",
  },
} as const satisfies Record<string, IconDef>;

export type IconId = keyof typeof icons;
export const iconIds = Object.keys(icons) as IconId[];
