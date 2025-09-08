// YardFlex Service Worker - Taking Jamaica to the Moon! 🚀🇯🇲

const CACHE_NAME = "yardflex-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/index.css",
  "/manifest.json"
];

// Install event - cache important files
self.addEventListener("install", (event) => {
  console.log("🚀 YardFlex Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Caching YardFlex files");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("✅ YardFlex cache ready!");
        return self.skipWaiting();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log("📱 Serving from cache:", event.request.url);
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("🔄 YardFlex Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑️ Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log("✅ YardFlex Service Worker activated!");
      return self.clients.claim();
    })
  );
});

// Push notification handler (for future notifications)
self.addEventListener("push", (event) => {
  if (event.data) {
    const notificationData = event.data.json();
    const options = {
      body: notificationData.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(notificationData.title, options)
    );
  }
});