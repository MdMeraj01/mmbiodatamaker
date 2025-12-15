const CACHE_NAME = "biodata-app-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./css/format.css",
  "./js/app.js",
  "./js/pdf.js",
  "./images/favicon 2.png"
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch Event (Offline Support)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});