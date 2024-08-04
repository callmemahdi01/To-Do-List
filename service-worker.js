const CACHE_NAME = "todo-list-cache-v1";
const urlsToCache = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./style/dark.css",
    "./style/toggle.css",
    "./img/icon-192x192.png",
    "./img/icon-512x512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // کپی پاسخ برای ذخیره در کش
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // در صورت عدم دسترسی به شبکه، از کش استفاده کن
                return caches.match(event.request).then((response) => {
                    if (response) {
                        return response;
                    } else if (event.request.mode === "navigate") {
                        // اگر درخواست برای صفحه‌ای است که در کش نیست، صفحه پیش‌فرض را باز کن
                        return caches.match("./index.html");
                    }
                });
            })
    );
});
