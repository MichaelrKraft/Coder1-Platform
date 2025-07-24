/**
 * Service Worker for Coder1 Platform
 * Implements intelligent caching and performance optimization
 */

const CACHE_NAME = 'coder1-platform-v1.0.0';
const DYNAMIC_CACHE = 'coder1-dynamic-v1.0.0';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
    '/',
    '/static/design-system.css',
    '/static/modules/error-handler.js',
    '/static/modules/timer-manager.js',
    '/static/modules/bundle-optimizer.js',
    '/static/apps/smart-prd-script-loader.js'
];

// Resources to cache on demand
const CACHEABLE_PATTERNS = [
    /\.css$/,
    /\.js$/,
    /\.woff2?$/,
    /\.png$/,
    /\.jpg$/,
    /\.svg$/
];

// Network-first patterns (always get fresh data)
const NETWORK_FIRST_PATTERNS = [
    /\/api\//,
    /analytics/,
    /health/
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(CRITICAL_RESOURCES);
            })
            .then(() => {
                // Skip waiting to activate immediately
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => 
                            cacheName !== CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE
                        )
                        .map(cacheName => caches.delete(cacheName))
                );
            })
            .then(() => {
                // Take control of all clients
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests (except fonts and CDN resources)
    if (url.origin !== location.origin && 
        !url.hostname.includes('googleapis.com') &&
        !url.hostname.includes('gstatic.com') &&
        !url.hostname.includes('cdnjs.cloudflare.com')) {
        return;
    }
    
    // Handle different caching strategies
    if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
        // Network first for API calls
        event.respondWith(networkFirst(request));
    } else if (CACHEABLE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
        // Cache first for static resources
        event.respondWith(cacheFirst(request));
    } else {
        // Stale while revalidate for HTML pages
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Caching strategies
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Fall back to cache if network fails
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page or error response
        return new Response('Offline', { 
            status: 503, 
            statusText: 'Service Unavailable' 
        });
    }
}

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Return cached version immediately
        // Optionally update cache in background
        updateCacheInBackground(request);
        return cachedResponse;
    }
    
    // Not in cache, fetch from network
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        return new Response('Resource not available', { 
            status: 404, 
            statusText: 'Not Found' 
        });
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Always try to fetch fresh version
    const fetchPromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => cachedResponse); // Fall back to cache on network error
    
    // Return cached version immediately if available
    return cachedResponse || fetchPromise;
}

async function updateCacheInBackground(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response);
        }
    } catch (error) {
        // Silent failure for background updates
    }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        const urls = event.data.urls;
        caches.open(DYNAMIC_CACHE)
            .then(cache => cache.addAll(urls));
    }
});

// Background sync for analytics and error reporting
self.addEventListener('sync', (event) => {
    if (event.tag === 'error-report') {
        event.waitUntil(syncErrorReports());
    }
    
    if (event.tag === 'analytics') {
        event.waitUntil(syncAnalytics());
    }
});

async function syncErrorReports() {
    // Send queued error reports when online
    const requests = await getQueuedRequests('error-reports');
    
    for (const request of requests) {
        try {
            await fetch(request);
            await removeFromQueue('error-reports', request);
        } catch (error) {
            // Keep in queue for next sync
        }
    }
}

async function syncAnalytics() {
    // Send queued analytics when online
    const requests = await getQueuedRequests('analytics');
    
    for (const request of requests) {
        try {
            await fetch(request);
            await removeFromQueue('analytics', request);
        } catch (error) {
            // Keep in queue for next sync
        }
    }
}

// Queue management for offline functionality
async function getQueuedRequests(queueName) {
    // Implementation would use IndexedDB or Cache API
    // Simplified for this example
    return [];
}

async function removeFromQueue(queueName, request) {
    // Implementation would remove from IndexedDB
    // Simplified for this example
}