"use client";

import { useEffect, useState } from "react";
import { isFavorite, recordRecent, toggleFavorite } from "@/lib/storage";
import { StarIcon } from "./icons";

/**
 * Star toggle for a protocol's favorite state. Pass `recordVisit` on the
 * protocol detail page (not in a list) to also log this as recently viewed,
 * so it surfaces in the home screen's "Recently used" strip.
 */
export function FavoriteButton({
  slug,
  recordVisit = false,
  size = 19,
  compact = false,
  onChange,
}: {
  slug: string;
  recordVisit?: boolean;
  size?: number;
  compact?: boolean;
  onChange?: (favorites: string[]) => void;
}) {
  // Starts false to match the server-rendered markup, then syncs from
  // localStorage after mount — reading it in the initializer would make the
  // client's first render disagree with the server's and fail hydration.
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, not mirroring props/state
    setFavorite(isFavorite(slug));
    if (recordVisit) recordRecent(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = toggleFavorite(slug);
        setFavorite(next.includes(slug));
        onChange?.(next);
      }}
      aria-pressed={favorite}
      aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
      className={`flex shrink-0 items-center justify-center rounded-full transition-colors ${
        compact
          ? "h-9 w-9"
          : `h-10 w-10 border ${
              favorite
                ? "border-pause/30 bg-pause/10"
                : "border-rule/15 bg-white"
            }`
      } ${favorite ? "text-pause" : "text-ink-muted"}`}
    >
      <StarIcon size={size} filled={favorite} />
    </button>
  );
}
