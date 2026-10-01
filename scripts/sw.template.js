// ALLIANCE PROTOCOLS · Field App — offline service worker.
//
// TEMPLATE: public/sw.js is generated from this file by
// scripts/generate-sw.mjs (runs in `predev` and `prebuild`). Edit this file,
// not public/sw.js. The generator injects:
//   cache version      git SHA (or build timestamp) — a new value per deploy,
//                      so the browser installs the new worker and old caches
//                      are dropped on activate.
//   precache list      every static route, every /protocols/[slug] page and
//                      the icons/manifest; after `next build` (postbuild)
//                      also every JS/CSS chunk and font the prerendered
//                      pages load, so each precached page works offline
//                      straight after the first install.
//
// Strategy: precache the app shell, all pages and their assets, then
// cache-as-you-go for anything else, so the app keeps working with no
// signal — which is exactly when a pause protocol is most needed.
//
// Never cached: the pre-launch lock screen (/unlock) and any redirected
// response (a locked page redirects to /unlock), so the lock screen can't be
// stored under another page's URL.

const CACHE_PREFIX = "alliance-field-";
const CACHE_NAME = CACHE_PREFIX + "__CACHE_VERSION__";
const PRECACHE_URLS = __PRECACHE_URLS__;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Per-URL so one missing file (e.g. an icon in dev) can't fail the rest.
      // fetch + put rather than cache.add, which would also store a redirect
      // to the lock screen under the page's own URL.
      Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          fetch(url).then((response) => {
            if (!cacheable(url, response)) throw new Error("not cacheable: " + url);
            return cache.put(url, response);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

const UNLOCK_PATH = "/unlock";

function isUnlock(url) {
  const path = new URL(url, self.location.origin).pathname;
  return path === UNLOCK_PATH || path.startsWith(UNLOCK_PATH + "/");
}

/**
 * Only successful, same-origin, non-redirected responses are worth keeping
 * offline — and never anything from the lock screen.
 */
function cacheable(requestUrl, response) {
  return Boolean(
    response &&
      response.ok &&
      response.type === "basic" &&
      !response.redirected &&
      !isUnlock(requestUrl) &&
      !(response.url && isUnlock(response.url))
  );
}

function store(request, response) {
  const copy = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // The lock screen always goes to the network and is never stored.
  if (isUnlock(request.url)) return;

  // Navigations: try the network first (fresh content), fall back to cache,
  // then to the cached home page so the app shell always loads offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (cacheable(request.url, response)) store(request, response);
          return response;
        })
        .catch(() =>
          caches
            .match(request, { ignoreSearch: true })
            .then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  // Everything else: cache-first, refresh in the background (stale-while-revalidate).
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (cacheable(request.url, response)) store(request, response);
          return response;
        })
        .catch(() => cached || Response.error());
      return cached || network;
    })
  );
});

// Tapping the Pause + Return notification brings the app back to the timer.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => new URL(w.url).pathname === "/pause");
      if (open) return open.focus();
      return self.clients.openWindow("/pause");
    })
  );
});
