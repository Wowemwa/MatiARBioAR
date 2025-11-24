// Service Worker for Mati ARBio - Offline Support & Caching
const CACHE_NAME = 'mati-arbio-v2.1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/site.webmanifest',
  // Add other static assets here
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully')
        return self.skipWaiting() // Force activation
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker activated')
        // Notify clients that cache has been cleared
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'CACHE_CLEARED' })
          })
        })
      })
      .then(() => {
        return self.clients.claim() // Take control immediately
      })
  )
})

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip ALL external requests (including Supabase API calls) - never cache them
  if (url.origin !== location.origin) {
    console.log('🔄 Skipping cache for external request:', url.href)
    return
  }
  
  // Skip API routes entirely - let them go directly to network
  if (url.pathname.startsWith('/api/') || url.pathname.includes('supabase')) {
    console.log('🔄 Skipping cache for API request:', url.href)
    return
  }

  // Use appropriate caching strategy based on resource type
  if (request.destination === 'document') {
    // HTML pages - Stale While Revalidate
    event.respondWith(staleWhileRevalidateStrategy(request))
  } else if (request.destination === 'script' || request.destination === 'style' || request.destination === 'image' || request.destination === 'font') {
    // Static assets - Cache First
    event.respondWith(cacheFirstStrategy(request))
  } else {
    // Other requests - Network First
    event.respondWith(networkFirstStrategy(request))
  }
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag)
  
  if (event.tag === 'offline-actions') {
    event.waitUntil(processOfflineActions())
  }
})

async function processOfflineActions() {
  // Process any queued offline actions
  console.log('📤 Processing offline actions...')
  // Implementation depends on specific offline functionality needed
}

// Push notification support (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    console.log('📱 Push notification received:', data)
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Mati ARBio', {
        body: data.body || 'New update available',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        data: data.url || '/'
      })
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked')
  
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  )
})