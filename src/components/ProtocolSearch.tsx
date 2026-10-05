"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "./icons";
import { IconChip, isIconId } from "./ApIcon";
import { SectionLabel } from "./SectionLabel";
import { SEARCH_HINTS, TIER_LABEL, TIER_MEANING, TIER_ORDER, TOOL_ORDER } from "./tierLabels";
import { protocolSubtitle } from "@/data/glossary";
import type { Protocol } from "@/data/types";

function synonymsOf(p: Protocol): string {
  const raw = (p as unknown as { synonyms?: unknown }).synonyms;
  const own = Array.isArray(raw) ? raw.join(" ") : typeof raw === "string" ? raw : "";
  return `${own} ${SEARCH_HINTS[p.slug] ?? ""}`;
}

function rank(slug: string): number {
  const i = TOOL_ORDER.indexOf(slug);
  return i === -1 ? TOOL_ORDER.length : i;
}

/** Client-side search over the tools, in three plain-word tiers. Matches the card's synonyms too. */
export function ProtocolSearch({ protocols }: { protocols: Protocol[] }) {
  const [query, setQuery] = useState("");

  const sorted = useMemo(() => [...protocols].sort((a, b) => rank(a.slug) - rank(b.slug)), [protocols]);

  const filtered = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return sorted;
    return sorted.filter((p) => {
      const haystack = [p.title, p.concept, p.whenToUse, ...p.phrases.map((ph) => ph.text), synonymsOf(p)]
        .join(" ")
        .toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }, [sorted, query]);

  const searching = query.trim() !== "";

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
                {searching && <span className="block text-sm font-medium text-accent">{TIER_LABEL[p.tier]}</span>}
                <span className="display block text-lg leading-snug">{p.title}</span>
                <span className="mt-0.5 line-clamp-2 text-sm leading-snug text-ink-muted">
                  {subtitle ? `${subtitle.charAt(0).toUpperCase()}${subtitle.slice(1)}. ` : ""}
                  {p.concept}
                </span>
              </span>
              <ChevronRight size={20} className="shrink-0 text-ink-muted/50" />
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search: try “jealous”, “lied” or “housemates”"
        aria-label="Search tools"
        className="field-input w-full"
      />

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-base text-ink-muted">
          No tools match &ldquo;{query}&rdquo;. Try a plainer word, or start from the Situation Map on the Now tab.
        </p>
      ) : searching ? (
        renderList(filtered)
      ) : (
        <div className="space-y-6">
          {TIER_ORDER.map((tier) => {
            const list = filtered.filter((p) => p.tier === tier);
            if (list.length === 0) return null;
            return (
              <section key={tier} className="space-y-2.5" aria-labelledby={`group-${tier}`}>
                <SectionLabel>
                  <span id={`group-${tier}`}>{TIER_LABEL[tier]}</span>
                </SectionLabel>
                <p className="px-1 text-sm text-ink-muted">{TIER_MEANING[tier]}</p>
                {renderList(list)}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
