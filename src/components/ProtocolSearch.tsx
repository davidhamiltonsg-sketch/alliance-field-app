"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "./icons";
import { IconTablet } from "./visuals/IconTablet";
import type { Protocol } from "@/data/types";

/** Client-side search + filter over the full protocol list. */
export function ProtocolSearch({ protocols }: { protocols: Protocol[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return protocols;
    return protocols.filter((p) => {
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
  }, [protocols, query]);

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

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-[15px] text-ink-muted">
          No cards match &ldquo;{query}&rdquo;. Try a different word, or
          browse the full list from the Situation Map.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((p) => {
            const tone = p.accentHint ?? "accent";
            return (
              <li key={p.slug}>
                <Link
                  href={`/protocols/${p.slug}`}
                  className="v2-card relative flex min-h-14 items-center gap-3.5 py-3.5 pl-6 pr-3"
                >
                  <span className={`v2-edge v2-edge--${tone}`} aria-hidden />
                  <IconTablet slug={p.slug} tone={tone} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="display block text-[17px] leading-snug">
                      {p.title}
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-[13px] leading-snug text-ink-muted">
                      {p.concept}
                    </span>
                  </span>
                  <ChevronRight size={20} className="shrink-0 text-ink-muted/50" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
