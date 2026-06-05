/* ============================================================
   Europa Hub — Service Worker
   Cache-first per assets estàtics, network-first per API
   ============================================================ */

const CACHE_NAME = 'europa-hub-v1';
const OFFLINE_URL = '/';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/config.js',
  '/js/core.js',
  '/js/db.js',
  '/js/pages1.js',
  '/js/pages2.js',
  '/js/pages3.js',
  '/js/events.js',
  '/assets/escut.svg',
  '/assets/camp.jpg',
  '/assets/grada.jpg',
  '/fonts/GeneralSans-Regular.ttf',
  '/fonts/Escapulada.ttf',
];

/* ── Install: pre-cache assets estàtics ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

/* ── Activate: neteja caches antics ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── Fetch: estratègia híbrida ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Supabase i CDNs externes → sempre xarxa
  if (
    url.hostname.includes('supabase') ||
    url.hostname.includes('jsdelivr') ||
    url.hostname.includes('cdnjs') ||
    url.hostname.includes('resend') ||
    url.hostname.includes('api.open-meteo')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Assets estàtics → cache-first, fallback xarxa
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok && request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Offline: retorna la pàgina principal cacheada
        if (request.destination === 'document') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
