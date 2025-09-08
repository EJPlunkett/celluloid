const CACHE_NAME = 'celluloid-v1.2.0-no-cache';

// Install event - no caching
self.addEventListener('install', (event) => {
  console.log('Service worker installed - no caching enabled');
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up any existing caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  // Ensure the service worker takes control immediately
  self.clients.claim();
});

// Fetch event - always use network, no caching
self.addEventListener('fetch', (event) => {
  // Simply pass through all requests to the network
  event.respondWith(fetch(event.request));
});