"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, StarIcon } from "./icons";
import { IconChip, isIconId } from "./ApIcon";
import { FavoriteButton } from "./FavoriteButton";
import { SectionLabel } from "./SectionLabel";
import { TierBadge } from "./TierBadge";
import { coreFiveSlugs } from "@/data/core5";
import { protocolSubtitle } from "@/data/glossary";
import { groupByTier, tierInfo } from "@/data/tiers";
import { readFavorites } from "@/lib/storage";
import type { Protocol } from "@/data/types";

/** Client-side search + filter over the full protocol list. */
export function ProtocolSearch({ protocols }: { protocols: Protocol[] }) {
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  // Starts empty to match SSR, synced from localStorage after mount.
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, not mirroring props/state
    setFavorites(readFavorites());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = protocols;
    if (q) {
      list = list.filter((p) => {
        const haystack = [
          p.title,
          p.concept,
          p.whenToUse,
          ...p.phrases.map((ph) => ph.text),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }
    if (favoritesOnly) {
      list = list.filter((p) => favorites.includes(p.slug));
    }
    return list;
  }, [protocols, query, favoritesOnly, favorites]);

  // No search or filter: group by tier (Core first, in Core 5 order).
  const grouped =
    !query.trim() && !favoritesOnly
      ? groupByTier([
          ...coreFiveSlugs
            .map((slug) => protocols.find((p) => p.slug === slug))
            .filter((p): p is Protocol => Boolean(p)),
          ...protocols.filter((p) => !coreFiveSlugs.includes(p.slug)),
        ])
      : null;

  const renderList = (list: Protocol[]) => (
    <ul className="space-y-2.5">
      {list.map((p) => {
        const tone = p.accentHint ?? "accent";
        const subtitle = protocolSubtitle(p.slug);
        return (
          <li key={p.slug}>
            <Link
              href={`/protocols/${p.slug}`}
              className="v2-card relative flex min-h-14 items-center gap-3 py-3.5 pl-6 pr-3"
            >
              <span className={`v2-edge v2-edge--${tone}`} aria-hidden />
              {isIconId(p.slug) && <IconChip id={p.slug} tone={tone} size="md" />}
              <span className="min-w-0 flex-1">
                <TierBadge tier={p.tier} />
                <span className="display mt-1 block text-lg leading-snug">
                  {p.title}
                </span>
                <span className="mt-0.5 line-clamp-2 text-sm leading-snug text-ink-muted">
                  {subtitle ? `${subtitle.charAt(0).toUpperCase()}${subtitle.slice(1)}. ` : ""}
                  {p.concept}
                </span>
              </span>
              <FavoriteButton
                slug={p.slug}
                size={17}
                compact
                onChange={setFavorites}
              />
              <ChevronRight size={20} className="shrink-0 text-ink-muted/50" />
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search protocols — try “phone” or “trust”…"
          aria-label="Search protocols"
          className="field-input w-full"
        />
      </div>

      {favorites.length > 0 && (
        <button
          type="button"
          onClick={() => setFavoritesOnly((v) => !v)}
          aria-pressed={favoritesOnly}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors ${
            favoritesOnly
              ? "bg-accent text-paper"
              : "border border-rule/60 bg-white text-ink-muted"
          }`}
        >
          <StarIcon size={14} filled={favoritesOnly} />
          Favourites only
        </button>
      )}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-base text-ink-muted">
          {favoritesOnly
            ? "No favourites yet. Tap the star on any card to save it here."
            : <>No cards match &ldquo;{query}&rdquo;. Try a different word, or browse the full list from the Situation Map.</>}
        </p>
      ) : grouped ? (
        <div className="space-y-6">
          {grouped.map((g) => (
            <section key={g.tier} className="space-y-2.5" aria-labelledby={`group-${g.tier}`}>
              <SectionLabel>
                <span id={`group-${g.tier}`}>
                  {tierInfo[g.tier].label} · {g.protocols.length}
                </span>
              </SectionLabel>
              <p className="px-1 text-sm text-ink-muted">{tierInfo[g.tier].meaning}</p>
              {renderList(g.protocols)}
            </section>
          ))}
        </div>
      ) : (
        renderList(filtered)
      )}
    </div>
  );
}
