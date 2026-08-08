/**
 * Noor-E-Haram PWA Service Worker
 * Implements Network-First with Cache Fallback for dynamic/HTML requests,
 * and Cache-First for static assets (CSS, JS, images, logos).
 */

const CACHE_NAME = 'nh-cache-v10';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/assets/css/core.css',
  '/assets/css/layout.css',
  '/assets/css/components.css',
  '/assets/css/utilities.css',
  '/assets/css/animations.css',
  '/assets/css/responsive.css',
  '/assets/css/print.css',
  '/assets/js/main.js',
  '/assets/js/config/translations.js',
  '/assets/js/config/branches.data.js',
  '/assets/js/services/i18n.js',
  '/assets/js/services/theme.js',
  '/assets/js/services/audio.js',
  '/assets/js/services/branches.js',
  '/assets/js/services/wizard.js',
  '/assets/js/services/forms.js',
  '/assets/js/services/analytics.js',
  '/assets/js/services/lazyload.js',
  '/assets/js/controllers/animations.js',
  '/assets/js/controllers/navigation.js',
  '/assets/js/controllers/drawer.js',
  '/assets/js/controllers/faq.js',
  '/assets/js/controllers/intersection.js',
  '/assets/images/logos/page-loader-logo.webp',
  '/assets/images/logos/header-logo.webp',
  '/assets/images/logos/footer-logo.webp',
  '/favicon-32x32.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;

  // Network-First for HTML/document requests to ensure fresh content
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache a copy of the fresh page
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          // Fall back to cached index.html or offline.html if completely offline
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) return cachedResponse;
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Cache-First for static assets
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Fetch new version in background to update cache for next load
          fetch(event.request).then(response => {
            if (response.status === 200) {
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, response));
            }
          }).catch(() => {/* Ignore network errors offline */});
          
          return cachedResponse;
        }

        return fetch(event.request).then(response => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        });
      })
  );
});
