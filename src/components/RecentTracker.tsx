"use client";

import { useEffect } from "react";
import { recordRecent } from "@/lib/storage";

/** Logs this tool as recently used (shown on the home screen). Renders nothing. */
export function RecentTracker({ slug }: { slug: string }) {
  useEffect(() => {
    recordRecent(slug);
  }, [slug]);
  return null;
}
