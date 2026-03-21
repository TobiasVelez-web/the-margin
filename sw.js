const CACHE_NAME = 'the-margin-v1';
const STATIC_ASSETS = [
  './index.html',
  './article-concert-tickets.html',
  './article-bethesda-housing.html',
  './article-montgomery-polarization.html',
  './article-march-macro.html',
  './article-unemployment.html',
  './article-stocks.html',
  './article-tariffs.html',
  './article-roth-ira.html',
  './article-college-affordability.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.ok && event.request.destination === 'document') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
