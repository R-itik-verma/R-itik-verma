const CACHE_NAME = "simple-pwa-cache-v2"; // bump version on updates
const urlsToCache = [
  "/R-itik-verma/",
  "/R-itik-verma/index.html", 
  "/R-itik-verma/manifest.json", 
  "/R-itik-verma/sw.js",
  "/R-itik-verma/script.js", 
  "/R-itik-verma/style.css",
  "/R-itik-verma/assets/profile.jpeg",
  "/R-itik-verma/assets/Ritik_verma_resume.pdf",
  "/R-itik-verma/assets/screenshots/desktop.png",
  "/R-itik-verma/assets/icon-32x32.png", 
  "/R-itik-verma/assets/icon-48x48.png",
  "/R-itik-verma/assets/icon-72x72.png",
  "/R-itik-verma/assets/icon-96x96.png", 
  "/R-itik-verma/assets/icon-144x144.png",
  "/R-itik-verma/assets/icon-152x152.png",
  "/R-itik-verma/assets/icon-128x128.png",
  "/R-itik-verma/assets/icon-192x192.png",
];

// Install → cache assets
self.addEventListener("install", event => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // activate immediately
});

self.addEventListener("message", event => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});


// Activate → remove old caches
self.addEventListener("activate", event => {
  console.log("Service Worker activating...");
  event.waitUntil(
    self.clients.claim().then(() => {
      return self.clients.matchAll({ type: "window" }).then(clients => {
        clients.forEach(client => client.navigate(client.url));
      });
    }),
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  return self.clients.claim();
});

// Fetch → network-first for HTML, cache-first for others
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    // Always try network first for HTML
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/R-itik-verma/index.html"))
    );
  } else {
    // Cache-first for static files
    event.respondWith(
      caches.match(event.request).then(res => res || fetch(event.request))
    );
  }
});
