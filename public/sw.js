const CACHE_NAME = "fenya-e-ticket-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/offline.html",
];

// 🔹 Saat service worker diinstal → simpan aset statis
self.addEventListener("install", (event) => {
  console.log("✅ Service Worker installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// 🔹 Saat SW aktif → hapus cache lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  console.log("🔥 Service Worker aktif & cache lama dihapus");
  self.clients.claim();
});

// 🔹 Intercept semua request
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // ⚠️ Jangan cache request ke API
  if (request.url.includes("/api/")) {
    event.respondWith(fetch(request).catch(() => offlineFallback()));
    return;
  }

  // 🔹 Coba ambil dari cache dulu, kalau tidak ada fetch ke server
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(request)
          .then((response) => {
            // Simpan response baru ke cache
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
              return response;
            });
          })
          .catch(() => offlineFallback())
      );
    })
  );
});

// 🔹 Fallback jika offline dan tidak ada cache
function offlineFallback() {
  return caches.match("/offline.html");
}
