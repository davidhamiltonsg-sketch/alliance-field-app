"use client";

import { useMemo, useState } from "react";
import {
  connectionCards,
  STAGE_META,
  STAGE_ORDER,
  type ConnectionStage,
} from "@/data/connectionCards";
import { PrimaryButton } from "./PrimaryButton";

function shuffle<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

const accentClasses: Record<string, { bg: string; text: string; ring: string }> = {
  accent: { bg: "bg-accent", text: "text-accent", ring: "ring-accent/25" },
  pause: { bg: "bg-pause", text: "text-[#9A5E10]", ring: "ring-pause/25" },
  repair: { bg: "bg-repair", text: "text-repair", ring: "ring-repair/25" },
  safety: { bg: "bg-safety", text: "text-safety", ring: "ring-safety/25" },
};

type Filter = "all" | ConnectionStage;

function buildDeck(filter: Filter) {
  const pool =
    filter === "all"
      ? connectionCards
      : connectionCards.filter((c) => c.stage === filter);
  return shuffle(pool.map((c) => c.id));
}

export function ConnectionCards() {
  const [filter, setFilter] = useState<Filter>("all");
  const [deck, setDeck] = useState<string[]>(() => buildDeck("all"));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [round, setRound] = useState(1);

  const cardsById = useMemo(
    () => Object.fromEntries(connectionCards.map((c) => [c.id, c])),
    []
  );

  const currentId = deck[index];
  const current = currentId ? cardsById[currentId] : undefined;
  const meta = current ? STAGE_META[current.stage] : undefined;
  const accent = meta ? accentClasses[meta.accentHint] : accentClasses.accent;

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setDeck(buildDeck(next));
    setIndex(0);
    setFlipped(false);
    setRound(1);
  };

  const nextCard = () => {
    setFlipped(false);
    if (index + 1 >= deck.length) {
      setDeck(buildDeck(filter));
      setIndex(0);
      setRound((r) => r + 1);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const shuffleDeck = () => {
    setDeck(buildDeck(filter));
    setIndex(0);
    setFlipped(false);
    setRound((r) => r + 1);
  };

  const chip = (label: string, value: Filter) => (
    <button
      key={value}
      type="button"
      onClick={() => changeFilter(value)}
      className={`min-h-9 shrink-0 rounded-full px-3.5 text-[13px] font-medium transition-colors ${
        filter === value
          ? "bg-accent text-paper"
          : "border border-rule/15 bg-white text-ink-muted"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {chip("All stages", "all")}
        {STAGE_ORDER.map((s) => chip(STAGE_META[s].label, s))}
      </div>

      {current && meta ? (
        <>
          <div
            className="relative mx-auto h-[280px] w-full max-w-sm cursor-pointer select-none [perspective:1200px]"
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            aria-label={flipped ? "Card revealed. Tap to show the stage again." : "Tap to reveal the question."}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setFlipped((f) => !f);
              }
            }}
          >
            <div
              className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
              style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              {/* Front — stage */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl px-6 text-center shadow-[var(--shadow-lift)] [backface-visibility:hidden] ${accent.bg} text-paper`}
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-paper/70">
                  Connection Cards
                </span>
                <span className="display text-[30px] leading-tight">{meta.label}</span>
                <span className="max-w-[220px] text-[13px] leading-snug text-paper/85">
                  {meta.caption}
                </span>
                <span className="mt-2 text-[13px] font-medium text-paper/70">
                  Tap to flip
                </span>
              </div>

              {/* Back — question */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border border-rule/[0.08] bg-white px-6 text-center shadow-[var(--shadow-lift)] [backface-visibility:hidden]"
                style={{ transform: "rotateY(180deg)" }}
              >
                <span className={`text-[11px] font-medium uppercase tracking-[0.14em] ${accent.text}`}>
                  {meta.label}
                </span>
                <p className="phrase text-[19px] leading-snug text-ink">
                  {current.question}
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-[13px] text-ink-muted">
            Card {index + 1} of {deck.length}
            {round > 1 ? ` · round ${round}` : ""}
          </p>

          <div className="flex gap-3">
            <PrimaryButton variant="secondary" onClick={shuffleDeck}>
              Shuffle
            </PrimaryButton>
            <PrimaryButton onClick={nextCard}>Next card</PrimaryButton>
          </div>
        </>
      ) : (
        <p className="py-10 text-center text-[15px] text-ink-muted">
          No cards in this stage yet.
        </p>
      )}
    </div>
  );
}
