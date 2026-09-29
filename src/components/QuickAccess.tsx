"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProtocol } from "@/data/protocols";
import { readFavorites, readRecent } from "@/lib/storage";
import { IconTablet } from "./visuals/IconTablet";
import { SectionLabel } from "./SectionLabel";
import { StarIcon, ClockIcon } from "./icons";

function Strip({
  label,
  icon,
  slugs,
}: {
  label: string;
  icon: React.ReactNode;
  slugs: string[];
}) {
  const items = slugs
    .map((slug) => getProtocol(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (items.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 px-0.5 text-ink-muted">
        {icon}
        <SectionLabel>{label}</SectionLabel>
      </div>
      <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
        {items.map((p) => {
          const tone = p.accentHint ?? "accent";
          return (
            <Link
              key={p.slug}
              href={`/protocols/${p.slug}`}
              className="v2-card flex w-[152px] shrink-0 flex-col items-start gap-2 px-3.5 py-3"
            >
              <IconTablet slug={p.slug} tone={tone} size="sm" />
              <span className="display line-clamp-2 text-[14px] leading-snug">
                {p.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Home-screen quick access: favorited protocols and recently viewed ones.
 * Renders nothing until there's something to show (fresh installs, or SSR).
 */
export function QuickAccess() {
  // Starts empty to match SSR, synced from localStorage after mount — so
  // this renders nothing until hydration confirms there's something to show.
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, not mirroring props/state
    setFavorites(readFavorites());
    setRecent(readRecent());
  }, []);

  if (favorites.length === 0 && recent.length === 0) {
    return (
      <p className="px-1 text-[13px] leading-normal text-ink-muted">
        Nothing pinned yet. Star a protocol below and it&apos;ll wait for you
        here.
      </p>
    );
  }

  return (
    <section className="space-y-4">
      <Strip label="Favorites" icon={<StarIcon size={15} filled />} slugs={favorites} />
      <Strip
        label="Recently used"
        icon={<ClockIcon size={15} />}
        slugs={recent.filter((s) => !favorites.includes(s))}
      />
    </section>
  );
}
