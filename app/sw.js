let cacheName = '$APP_NAME-v1.0';

self.addEventListener('install', e => {
  let timeStamp = Date.now();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        `/`,
        `/index.html?timestamp=${timeStamp}`,
      ])
      .then(() => self.skipWaiting());
    })
  )
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // try network, then try cache, store and return result
  event.respondWith(
    fetch(event.request)
    // on network error, try cache
    .catch(function(e) {
      console.warn('[service-worker] network error, try cache');
      return caches.match(event.request);
    })
    // cache and return response
    .then(function(response){
      return caches.open(cacheName).then(function(cache) {
        if (response && response.clone) cache.put(event.request, response.clone());
        return response;
      });
    })
    .catch(function(e) {
      console.error('[service-worker] network error and cache miss. failed to get.',e);
      return null;
    })
  );
});
