const CACHE_NAME = 'the-margin-v2';
const STATIC_ASSETS = [
  'https://themargineconomics.com/index.html',
  'https://themargineconomics.com/article-concert-tickets.html',
  'https://themargineconomics.com/article-bethesda-housing.html',
  'https://themargineconomics.com/article-montgomery-polarization.html',
  'https://themargineconomics.com/article-march-macro.html',
  'https://themargineconomics.com/article-unemployment.html',
  'https://themargineconomics.com/article-stocks.html',
  'https://themargineconomics.com/article-tariffs.html',
  'https://themargineconomics.com/article-roth-ira.html',
  'https://themargineconomics.com/article-college-affordability.html',
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
      }).catch(() => caches.match('https://themargineconomics.com/index.html'));
    })
  );
});
