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

// Network First Strategy - Good for API calls
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('📶 Network failed, checking cache:', request.url)
    
    // Fall back to cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline')
    }
    
    throw error
  }
}

// Cache First Strategy - Good for static assets
async function cacheFirstStrategy(request) {
  // Check cache first
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    // Fall back to network
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache for future use
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('📶 Failed to fetch asset:', request.url)
    throw error
  }
}

// Stale While Revalidate Strategy - Good for HTML pages
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME)
  
  // Get from cache immediately (stale)
  const cachedResponse = await caches.match(request)
  
  // Update cache in background (revalidate)
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => {
    // Network failed, that's ok for this strategy
  })
  
  // Return cached version immediately, or wait for network if no cache
  return cachedResponse || networkResponsePromise
}

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