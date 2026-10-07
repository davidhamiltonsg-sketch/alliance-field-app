"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProtocol } from "@/data/protocols";
import { readRecent } from "@/lib/storage";
import { IconChip, isIconId } from "./ApIcon";
import { TierBadge } from "./TierBadge";
import { SectionLabel } from "./SectionLabel";
import { ClockIcon } from "./icons";

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
              {isIconId(p.slug) && <IconChip id={p.slug} tone={tone} size="sm" />}
              <span className="display line-clamp-2 text-base leading-snug">
                {p.title}
              </span>
              <TierBadge tier={p.tier} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Home-screen quick access: recently used tools.
 * Renders nothing until there's something to show (fresh installs, or SSR).
 */
export function QuickAccess() {
  // Starts empty to match SSR, synced from localStorage after mount — so
  // this renders nothing until hydration confirms there's something to show.
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, not mirroring props/state
    setRecent(readRecent());
  }, []);

  if (recent.length === 0) return null;

  return (
    <section className="space-y-4">
      <Strip label="Recently used" icon={<ClockIcon size={16} />} slugs={recent} />
    </section>
  );
}
