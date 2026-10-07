"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
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

// Connection Cards are connection content: every stage uses the brass
// family (brass rules on forest and white), never pause, safety or repair.

type Filter = "all" | ConnectionStage;

function buildDeck(filter: Filter, shuffled = true) {
  const pool =
    filter === "all"
      ? connectionCards
      : connectionCards.filter((c) => c.stage === filter);
  const ids = pool.map((c) => c.id);
  return shuffled ? shuffle(ids) : ids;
}

const noopSubscribe = () => () => {};

/**
 * The server (and hydration) render the deck in a fixed order so the HTML
 * matches; once on the client the deck remounts shuffled.
 */
export function ConnectionCards() {
  const onClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return <ConnectionDeck key={onClient ? "client" : "server"} shuffled={onClient} />;
}

function ConnectionDeck({ shuffled }: { shuffled: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [deck, setDeck] = useState<string[]>(() => buildDeck("all", shuffled));
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
      aria-pressed={filter === value}
      className={`min-h-11 shrink-0 rounded-full px-3.5 text-sm font-medium transition-colors ${
        filter === value
          ? "bg-accent text-paper"
          : "border border-rule/60 bg-surface-raised text-ink-muted"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Card category">
        {chip("All five", "all")}
        {STAGE_ORDER.map((s) => chip(STAGE_META[s].label, s))}
      </div>

      {current && meta ? (
        <>
          <div
            className="relative mx-auto h-[280px] w-full max-w-sm cursor-pointer select-none [perspective:1200px]"
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            aria-label={flipped ? "Card revealed. Tap to show the kind of question again." : "Tap to reveal the question."}
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
                className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl px-6 text-center shadow-[var(--shadow-lift)] ring-2 ring-inset ring-brass/70 [backface-visibility:hidden] bg-accent text-paper`}
              >
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-paper/90">
                  Connection Cards
                </span>
                <span className="display text-xl leading-tight !text-paper">{meta.label}</span>
                <span className="h-px w-12 bg-brass" aria-hidden />
                <span className="max-w-[220px] text-sm leading-snug text-paper/85">
                  {meta.caption}
                </span>
                <span className="mt-2 text-sm font-medium text-paper/90">
                  Tap to flip
                </span>
              </div>

              {/* Back — question */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border-t-4 border-brass bg-surface-raised px-6 text-center shadow-[var(--shadow-lift)] [backface-visibility:hidden]"
                style={{ transform: "rotateY(180deg)" }}
              >
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                  {meta.label}
                </span>
                <p className="phrase text-lg leading-snug text-ink">
                  {current.question}
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-ink-muted">
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
        <p className="py-10 text-center text-base text-ink-muted">
          No cards of this kind yet.
        </p>
      )}
    </div>
  );
}
