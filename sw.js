/**
 * Progressive Web App Service Worker
 * Advanced caching, offline support, and performance optimization
 */

const CACHE_NAME = 'nachoweb3-v1.0.0';
const STATIC_CACHE_NAME = 'nachoweb3-static-v1.0.0';
const CONTENT_CACHE_NAME = 'nachoweb3-content-v1.0.0';
const IMAGE_CACHE_NAME = 'nachoweb3-images-v1.0.0';

const OFFLINE_URL = '/blog/offline.html';
const FALLBACK_URL = '/blog/fallback.html';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/blog/',
  '/blog/assets/css/style.css',
  '/blog/assets/css/lazy-loading.css',
  '/blog/assets/css/breadcrumbs.css',
  '/blog/assets/css/enhancements.css',
  '/blog/assets/css/newsletter-popup.css',
  '/blog/assets/js/google-analytics-enhanced.js',
  '/blog/assets/js/lazy-loading-optimized.js',
  '/blog/assets/js/newsletter-system.js',
  '/blog/assets/js/matrix-rain.js',
  '/blog/assets/images/default-og.jpg',
  '/blog/assets/images/logo.png',
  '/blog/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Dynamic content patterns
const CONTENT_PATTERNS = [
  '/blog/',
  '/blog/ia/',
  '/blog/blockchain/',
  '/blog/tutoriales/',
  '/blog/newsletter/',
  '/blog/tag/',
  '/blog/category/',
  '/blog/search'
];

// Image patterns
const IMAGE_PATTERNS = [
  '/blog/assets/images/',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 SW: Install event');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE_NAME);
      await cache.addAll(STATIC_ASSETS);

      // Cache important pages
      const contentCache = await caches.open(CONTENT_CACHE_NAME);
      const importantPages = [
        '/blog/',
        '/blog/ia/',
        '/blog/blockchain/',
        '/blog/tutoriales/',
        '/blog/newsletter/',
        '/blog/offline.html'
      ];

      try {
        await contentCache.addAll(importantPages.map(url => new Request(url, { cache: 'reload' })));
      } catch (error) {
        console.log('⚠️ SW: Some pages failed to cache:', error);
      }

      console.log('✅ SW: Static assets cached');
      self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 SW: Activate event');

  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const deletions = cacheNames
        .filter(name => name !== STATIC_CACHE_NAME &&
                        name !== CONTENT_CACHE_NAME &&
                        name !== IMAGE_CACHE_NAME)
        .map(name => caches.delete(name));

      await Promise.all(deletions);

      // Take control of all pages
      await clients.claim();

      console.log('✅ SW: Activation complete');
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests except for CDNs
  if (url.origin !== location.origin && !isCDN(url)) {
    return;
  }

  // Route to appropriate strategy
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
  } else if (isImage(request)) {
    event.respondWith(imageCacheStrategy(request, IMAGE_CACHE_NAME));
  } else if (isContentPage(request)) {
    event.respondWith(networkFirstStrategy(request, CONTENT_CACHE_NAME));
  } else {
    event.respondWith(networkOnlyStrategy(request));
  }
});

// Check if URL is a CDN
function isCDN(url) {
  const cdnHosts = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com',
    'www.googletagmanager.com',
    'www.google-analytics.com',
    'connect.facebook.net',
    'platform.twitter.com'
  ];

  return cdnHosts.some(host => url.hostname.includes(host));
}

// Check if request is for static asset
function isStaticAsset(request) {
  return STATIC_ASSETS.some(asset => request.url.includes(asset)) ||
         request.url.includes('/assets/') ||
         request.url.includes('/css/') ||
         request.url.includes('/js/') ||
         request.url.includes('manifest.json');
}

// Check if request is for image
function isImage(request) {
  return IMAGE_PATTERNS.some(pattern => request.url.includes(pattern)) ||
         request.url.match(/\.(jpg|jpeg|png|webp|gif|svg|ico)(\?.*)?$/i);
}

// Check if request is for content page
function isContentPage(request) {
  return CONTENT_PATTERNS.some(pattern => request.url.includes(pattern)) ||
         request.url.includes('/blog/') ||
         request.headers.get('accept')?.includes('text/html');
}

// Cache First Strategy - for static assets
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    console.log('📦 SW: Serving from cache:', request.url);
    return cached;
  }

  try {
    console.log('🌐 SW: Fetching from network:', request.url);
    const response = await fetch(request);

    if (response.ok) {
      // Cache the new response
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('❌ SW: Network failed, serving fallback:', request.url);
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network First Strategy - for content pages
async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    console.log('🌐 SW: Network first for:', request.url);
    const response = await fetch(request);

    if (response.ok) {
      // Cache the new response
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('📦 SW: Network failed, checking cache:', request.url);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // Return offline page for navigation requests
    if (request.headers.get('accept')?.includes('text/html')) {
      const offlineResponse = await cache.match(OFFLINE_URL);
      if (offlineResponse) {
        return offlineResponse;
      }
    }

    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Image Cache Strategy - stale-while-revalidate
async function imageCacheStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Always fetch in background to update cache
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    console.log('⚠️ SW: Background image fetch failed');
  });

  if (cached) {
    console.log('📦 SW: Serving stale image:', request.url);
    return cached;
  }

  console.log('🌐 SW: Fetching fresh image:', request.url);
  return fetchPromise;
}

// Network Only Strategy - for external APIs
async function networkOnlyStrategy(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log('❌ SW: Network request failed:', request.url);
    throw error;
  }
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 SW: Background sync event:', event.tag);

  if (event.tag === 'newsletter-subscription') {
    event.waitUntil(syncNewsletterSubscriptions());
  }
});

// Sync newsletter subscriptions made offline
async function syncNewsletterSubscriptions() {
  const subscriptions = await getOfflineSubscriptions();

  for (const subscription of subscriptions) {
    try {
      const response = await fetch('/blog/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription.data)
      });

      if (response.ok) {
        await removeOfflineSubscription(subscription.id);
      }
    } catch (error) {
      console.log('⚠️ SW: Failed to sync subscription:', error);
    }
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📱 SW: Push event received');

  const options = {
    body: '¡Nuevo contenido disponible en NachoWeb3!',
    icon: '/blog/assets/images/icons/icon-192x192.png',
    badge: '/blog/assets/images/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/blog/',
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explorar',
        icon: '/blog/assets/images/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/blog/assets/images/icons/action-close.png'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'NachoWeb3';
    options.data = { ...options.data, ...data };
  }

  event.waitUntil(
    self.registration.showNotification('NachoWeb3', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 SW: Notification clicked');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/blog/')
    );
  } else if (event.action === 'close') {
    // Notification already closed
  } else {
    // Default action - open the URL
    event.waitUntil(
      clients.matchAll().then(clientList => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url || '/blog/');
        }
      })
    );
  }
});

// Periodic background sync for content updates
self.addEventListener('periodicsync', (event) => {
  console.log('🔄 SW: Periodic sync event:', event.tag);

  if (event.tag === 'content-update') {
    event.waitUntil(updateContentCache());
  }
});

// Update content cache periodically
async function updateContentCache() {
  const cache = await caches.open(CONTENT_CACHE_NAME);
  const importantPages = [
    '/blog/',
    '/blog/ia/',
    '/blog/blockchain/',
    '/blog/tutoriales/'
  ];

  for (const url of importantPages) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
        console.log('🔄 SW: Updated cache for:', url);
      }
    } catch (error) {
      console.log('⚠️ SW: Failed to update cache for:', url, error);
    }
  }
}

// Cache management utilities
async function getOfflineSubscriptions() {
  // Implementation depends on storage strategy (IndexedDB recommended)
  return [];
}

async function removeOfflineSubscription(id) {
  // Implementation depends on storage strategy
}

// Message handling from client
self.addEventListener('message', (event) => {
  console.log('💬 SW: Message received:', event.data);

  if (event.data.type === 'CACHE_UPDATED') {
    // Handle cache update messages from client
    console.log('🔄 SW: Client notified of cache update');
  } else if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Cleanup old caches periodically
self.addEventListener('message', (event) => {
  if (event.data.type === 'CLEANUP_CACHE') {
    event.waitUntil(cleanupOldCaches());
  }
});

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentTime = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      const date = response.headers.get('date');

      if (date && (currentTime - new Date(date).getTime()) > maxAge) {
        await cache.delete(request);
      }
    }
  }
}

console.log('🚀 NachoWeb3 Service Worker loaded');