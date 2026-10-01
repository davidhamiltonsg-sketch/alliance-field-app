"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** The pre-launch lock screen: the worker is withheld (404) from locked visitors. */
const UNLOCK_PATH = "/unlock";

/** Registers the offline service worker. Renders nothing. */
export function ServiceWorkerRegister() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Locked visitors get a 404 for /sw.js (see src/proxy.ts); don't ask for it
    // from the lock screen, where it would only log a failed fetch.
    if (pathname === UNLOCK_PATH) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline support is a progressive enhancement — ignore failures */
    });
  }, [pathname]);
  return null;
}
