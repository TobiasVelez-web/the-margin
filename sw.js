const CACHE_NAME = 'the-margin-v1';
const STATIC_ASSETS = [
  '/the-margin/',
  '/the-margin/index.html',
  '/the-margin/article-concert-tickets.html',
  '/the-margin/article-bethesda-housing.html',
  '/the-margin/article-montgomery-polarization.html',
  '/the-margin/article-march-macro.html',
  '/the-margin/article-unemployment.html',
  '/the-margin/article-stocks.html',
  '/the-margin/article-tariffs.html',
  '/the-margin/article-roth-ira.html',
  '/the-margin/article-college-affordability.html',
];

// Install — cache all pages
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        // Cache new pages as they're visited
        if (response.ok && event.request.destination === 'document') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('/the-margin/index.html'));
    })
  );
});
