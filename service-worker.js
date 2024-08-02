const CACHE_NAME = 'todo-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/img/cactus-192x192.png',
    '/img/cactus-512x512.png'
];

// نصب Service Worker و ذخیره کردن فایل‌های مورد نیاز در کش
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// گرفتن درخواست‌ها و پاسخ از کش یا شبکه
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // اگر درخواست در کش باشد، پاسخ از کش برگردانده می‌شود
                if (response) {
                    return response;
                }

                // اگر در کش نباشد، درخواست به شبکه ارسال می‌شود
                return fetch(event.request).then(
                    function(response) {
                        // اگر پاسخ درست نبود، آن را در کش ذخیره نمی‌کنیم
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // در غیر این صورت، پاسخ را در کش ذخیره می‌کنیم
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// حذف کش‌های قدیمی در صورت وجود نسخه جدید
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
