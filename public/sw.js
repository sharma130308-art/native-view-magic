// ZyraFit service worker.
// - Offline: shows a friendly page instead of a browser error when there is no connection.
// - Speed: the app's JavaScript and CSS files have content-hashed names (a new build = new names),
//   so they are safe to keep forever. After the first visit they load instantly from the device.
// Pages, API calls and data always go to the network, so users never see stale screens or stale data.
const CACHE = "zyrafit-v2";
const ASSET_CACHE = "zyrafit-assets-v1";
const MAX_ASSETS = 150;
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE && key !== ASSET_CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

async function trimAssets(cache) {
  const keys = await cache.keys();
  if (keys.length > MAX_ASSETS) {
    await Promise.all(keys.slice(0, keys.length - MAX_ASSETS).map((request) => cache.delete(request)));
  }
}

async function assetFirst(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    await cache.put(request, response.clone());
    void trimAssets(cache);
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(assetFirst(request));
    return;
  }

  if (PRECACHE.includes(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
  }
});
