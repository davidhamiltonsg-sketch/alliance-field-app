"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "./icons";
import { IconChip, isIconId } from "./ApIcon";
import { SectionLabel } from "./SectionLabel";
import { PLAIN_SUBTITLE, TIER_LABEL, TIER_MEANING, TIER_ORDER } from "./tierLabels";
import { isSafetyQuery, searchTools } from "@/lib/toolSearch";
import type { Protocol } from "@/data/types";

/** Client-side search over the tools, in three plain-word tiers. Title and synonym hits rank above body text. */
export function ProtocolSearch({ protocols }: { protocols: Protocol[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => searchTools(protocols, query), [protocols, query]);
  const safety = isSafetyQuery(query);

  const searching = query.trim() !== "";

  const renderList = (list: Protocol[], ranked = false) => (
    <ul className="space-y-2.5">
      {list.map((p, i) => {
        const tone = p.accentHint ?? "accent";
        const plain = PLAIN_SUBTITLE[p.slug];
        return (
          <li key={p.slug}>
            <Link
              href={`/protocols/${p.slug}`}
              className="v2-card relative flex min-h-14 items-center gap-3 py-3.5 pl-6 pr-3"
            >
              <span className={`v2-edge v2-edge--${tone}`} aria-hidden />
              {isIconId(p.slug) && <IconChip id={p.slug} tone={tone} size="md" />}
              <span className="min-w-0 flex-1">
                {ranked && i === 0 && (
                  <span className="mb-0.5 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-paper">
                    Best match
                  </span>
                )}
                <span className="display block text-lg leading-snug">{p.title}</span>
                {plain && <span className="block text-sm font-medium leading-snug text-ink">{plain}</span>}
                <span className="mt-0.5 line-clamp-2 text-sm leading-snug text-ink-muted">{p.concept}</span>
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
        placeholder="Search, e.g. “lied” or “housemates”"
        aria-label="Search tools"
        className="field-input w-full"
      />

      {safety && (
        <Link
          href="/help"
          role="note"
          className="v2-card v2-card--failure flex min-h-14 items-center gap-3 px-4 py-3.5"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold leading-snug text-failure">
              Is this fear or being controlled?
            </span>
            <span className="mt-0.5 block text-base leading-snug text-ink">
              These tools are not for that. <span className="font-semibold underline underline-offset-4">Help Lines</span>
            </span>
          </span>
          <ChevronRight size={20} className="shrink-0 text-failure" />
        </Link>
      )}

      {filtered.length === 0 ? (
        <div className="space-y-3 py-6 text-center">
          <p className="text-base text-ink-muted">No tools match &ldquo;{query}&rdquo;.</p>
          <Link
            href="/#situation-map"
            className="inline-flex min-h-12 items-center gap-1.5 rounded-xl bg-accent px-4 text-base font-semibold text-paper"
          >
            Open the Situation Map
            <ChevronRight size={18} />
          </Link>
        </div>
      ) : searching ? (
        <div className="space-y-2.5">
          <p role="status" className="px-1 text-sm text-ink-muted">
            {filtered.length === 1 ? "1 tool matches" : `${filtered.length} tools match`}
          </p>
          {renderList(filtered, true)}
        </div>
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
