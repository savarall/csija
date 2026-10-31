const CACHE_NAME = 'csija-v2';
// Add the URLs of assets you want to cache for offline use
const ASSETS = [
  './',
  './index.html',
  './site.webmanifest',
  './icon-512.png',
  './icon-maskable-512.png'
];

// 1. Install Event: Cache the essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Remove caches from previous versions so updates take effect
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 2. Fetch Event: Serve assets from cache if offline, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
