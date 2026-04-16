// Service Worker - CTC Robot PWA
const CACHE = 'ctc-robot-v1';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // No cachear las peticiones al robot (IPs locales)
  if (e.request.url.includes('State=')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
