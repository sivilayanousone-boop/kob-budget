const CACHE = 'kob-v2';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co') || e.request.url.includes('googleapis.com') || e.request.url.includes('generativelanguage')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
