self.addEventListener("install", () => {
  console.log("✅ Service Worker installed");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("e-ticket-cache").then((cache) =>
      cache.match(event.request).then((res) => {
        return (
          res ||
          fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      })
    )
  );
});
