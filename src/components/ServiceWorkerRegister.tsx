"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { swRegistrationPaused } from "@/lib/storage";

/** The pre-launch lock screen: the worker is withheld (404) from locked visitors. */
const UNLOCK_PATH = "/unlock";

/** Should the offline worker be registered on this page, now? */
export function shouldRegisterServiceWorker(pathname: string): boolean {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;
  // Locked visitors get a 404 for /sw.js (see src/proxy.ts); don't ask for it
  // from the lock screen, where it would only log a failed fetch.
  if (pathname === UNLOCK_PATH) return false;
  // "Delete all my data" just removed the worker and its caches: don't put
  // them straight back while this page is still open.
  if (swRegistrationPaused()) return false;
  return true;
}

/** Registers the offline service worker. Renders nothing. */
export function ServiceWorkerRegister() {
  const pathname = usePathname();
  useEffect(() => {
    if (!shouldRegisterServiceWorker(pathname)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline support is a progressive enhancement — ignore failures */
    });
  }, [pathname]);
  return null;
}
