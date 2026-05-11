const CACHE = 'travel-d6640830';
const ORIGIN = self.location.origin;

// Strip version query params (?v=...) so cache hits survive hash changes
function cacheKey(url) {
  const u = new URL(url, ORIGIN);
  u.search = '';
  return u.toString();
}

// Extract all same-origin CSS and JS URLs from an HTML string
function extractAssets(html, baseUrl) {
  const urls = [];
  for (const [, href] of html.matchAll(/href="([^"]+\.css)[^"]*"/g)) {
    try { urls.push(cacheKey(new URL(href, baseUrl).href)); } catch {}
  }
  for (const [, src] of html.matchAll(/src="([^"]+\.js)[^"]*"/g)) {
    try { urls.push(cacheKey(new URL(src, baseUrl).href)); } catch {}
  }
  return [...new Set(urls)].filter(u => u.startsWith(ORIGIN));
}

// On install: crawl the homepage, discover all linked pages, cache everything
async function precacheAll(cache) {
  const homeUrl = self.registration.scope;

  const homeRes = await fetch(homeUrl);
  if (!homeRes.ok) return;
  const homeHtml = await homeRes.clone().text();
  await cache.put(homeUrl, homeRes);

  // Find all internal .html links from the homepage
  const pageUrls = [...homeHtml.matchAll(/href="([^"]+\.html)"/g)].flatMap(([, href]) => {
    try {
      const u = new URL(href, homeUrl);
      return u.href.startsWith(ORIGIN) ? [u.href] : [];
    } catch { return []; }
  });

  // Fetch each linked page, cache it, and collect its assets
  const homeAssets = extractAssets(homeHtml, homeUrl);
  const tripAssets = (await Promise.all(pageUrls.map(async pageUrl => {
    try {
      const res = await fetch(pageUrl);
      if (!res.ok) return [];
      const html = await res.clone().text();
      await cache.put(cacheKey(pageUrl), res);
      return extractAssets(html, pageUrl);
    } catch { return []; }
  }))).flat();

  // Cache all discovered CSS/JS assets
  const allAssets = [...new Set([...homeAssets, ...tripAssets])];
  await Promise.all(allAssets.map(async assetUrl => {
    try {
      const res = await fetch(assetUrl);
      if (res.ok) await cache.put(assetUrl, res);
    } catch {}
  }));
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(precacheAll));
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
  if (!e.request.url.startsWith(ORIGIN)) return;

  const isDoc = e.request.destination === 'document';
  const key = cacheKey(e.request.url);

  if (isDoc) {
    // Network-first for HTML: always try fresh, fall back to cache when offline
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(key, copy));
          return res;
        })
        .catch(() => caches.match(key))
    );
  } else {
    // Cache-first for CSS/assets: fast load, update cache in background
    e.respondWith(
      caches.match(key).then(cached => {
        const network = fetch(e.request).then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(key, res.clone()));
          return res;
        });
        return cached || network;
      })
    );
  }
});
