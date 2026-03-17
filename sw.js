const CACHE = 'kob-v2';

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    // ຂ້າມ request ທີ່ cache ບໍ່ໄດ້
    if (!e.request.url.startsWith('http')) return;
    if (e.request.url.includes('supabase.co')) return;
    if (e.request.url.includes('googleapis.com')) return;
    if (e.request.url.includes('favicon.ico')) return;

    e.respondWith(
        fetch(e.request)
            .then(res => {
                // cache ສະເພາະ response ທີ່ OK
                if (res && res.status === 200 && res.type === 'basic') {
                    const clone = res.clone();
                    caches.open(CACHE).then(cache => cache.put(e.request, clone));
                }
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
