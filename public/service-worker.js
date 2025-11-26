const CACHE_NAME = "fenya-cache-v2";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  console.log("✅ Service Worker: Terpasang");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        "/manifest.json",
        "/icon-192x192.png",
        "/icon-512x512.png",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("⚡ Service Worker: Aktif");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  // 🛑 Skip semua request POST, PUT, PATCH, DELETE
  if (event.request.method !== "GET") return;

  // 🔹 Untuk navigasi (SPA routes)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // 🔹 Untuk file lain (CSS, JS, Images)
  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(event.request)
          .then((networkRes) => {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return networkRes;
          })
          .catch(() => caches.match(OFFLINE_URL))
      );
    })
  );
});
