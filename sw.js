const CACHE = 'travel-v1';

// Only the bare minimum needed offline before a first visit.
// Everything else gets cached automatically on first fetch (see fetch handler below).
const PRECACHE = [
  '/travel/',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // Cache OSM map tiles (cross-origin) with cache-first strategy
  if (e.request.url.startsWith('https://tile.openstreetmap.org/')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Skip other cross-origin (Google Fonts etc) — let them load normally or fail gracefully
  if (!e.request.url.startsWith(self.location.origin)) return;

  const isDoc = e.request.destination === 'document';

  if (isDoc) {
    // Network-first for HTML: always try fresh, fall back to cache when offline
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first for CSS/assets: fast load, update cache in background
    e.respondWith(
      caches.match(e.request).then(cached => {
        const network = fetch(e.request).then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        });
        return cached || network;
      })
    );
  }
});
