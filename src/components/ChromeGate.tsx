"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Pages that bring their own full-screen chrome (the intro has its own header
 * with Help and Skip): the app header and bottom nav aren't rendered there at
 * all, so they can't be tabbed to or read out behind the overlay.
 */
export const OWN_CHROME_PATHS = ["/intro"];

export function hidesAppChrome(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return OWN_CHROME_PATHS.includes(path);
}

/** Renders the app header / nav except on pages with their own chrome. */
export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return hidesAppChrome(pathname) ? null : <>{children}</>;
}
