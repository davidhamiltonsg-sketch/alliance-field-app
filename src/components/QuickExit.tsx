"use client";

/** Where "Leave this page quickly" goes: a neutral page that gives nothing away. */
export const QUICK_EXIT_URL = "https://www.google.com/search?q=weather";

/**
 * "Leave this page quickly" for the Help page. With JavaScript it replaces
 * this page in the tab's history (so Back doesn't return here); without it,
 * it is still an ordinary link to the same neutral page.
 */
export function QuickExit() {
  return (
    <a
      href={QUICK_EXIT_URL}
      rel="noreferrer"
      onClick={(e) => {
        e.preventDefault();
        window.location.replace(QUICK_EXIT_URL);
      }}
      className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-ink/80 bg-white px-4 text-base font-semibold text-ink hover:bg-ink/[0.04]"
    >
      Leave this page quickly
    </a>
  );
}
