// THE ALLIANCE · Field App — offline service worker.
//
// TEMPLATE: public/sw.js is generated from this file by
// scripts/generate-sw.mjs (runs in `predev` and `prebuild`). Edit this file,
// not public/sw.js. The generator injects:
//   cache version      git SHA (or build timestamp) — a new value per deploy,
//                      so the browser installs the new worker and old caches
//                      are dropped on activate.
//   precache list      every static route, every /protocols/[slug] page and
//                      the icons/manifest.
//
// Strategy: precache the app shell and all pages, then cache-as-you-go for
// everything else (JS/CSS chunks, fonts), so the app keeps working with no
// signal — which is exactly when a pause protocol is most needed.

const CACHE_PREFIX = "alliance-field-";
const CACHE_NAME = CACHE_PREFIX + "__CACHE_VERSION__";
const PRECACHE_URLS = __PRECACHE_URLS__;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Per-URL so one missing file (e.g. an icon in dev) can't fail the rest.
      Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)))
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

/** Only successful, same-origin responses are worth keeping offline. */
function cacheable(response) {
  return Boolean(response && response.ok && response.type === "basic");
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

  // Navigations: try the network first (fresh content), fall back to cache,
  // then to the cached home page so the app shell always loads offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (cacheable(response)) store(request, response);
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
          if (cacheable(response)) store(request, response);
          return response;
        })
        .catch(() => cached || Response.error());
      return cached || network;
    })
  );
});
