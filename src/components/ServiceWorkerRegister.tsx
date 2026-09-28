"use client";

import { useEffect } from "react";

/** Registers the offline service worker. Renders nothing. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline support is a progressive enhancement — ignore failures */
    });
  }, []);
  return null;
}
