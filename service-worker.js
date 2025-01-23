const CACHE_NAME = "todo-list-cache-v1.3";
const urlsToCache = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./style/dark.css",
    "./style/toggle.css",
    "./img/icon-192x192.png",
    "./img/icon-512x512.png"
].map(url => new Request(url, {credentials: 'same-origin'}));

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || networkFirst(request);
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response && response.status === 200 && response.type === 'basic') {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        return caches.match(request);
    }
}

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(cacheFirst(event.request));
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});