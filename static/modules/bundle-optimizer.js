/**
 * Bundle Optimizer
 * Optimizes script loading, implements code splitting, and manages resource loading
 */

class BundleOptimizer {
    constructor() {
        this.loadedModules = new Set();
        this.loadingPromises = new Map();
        this.preloadedResources = new Set();
        this.lazyModules = new Map();
        this.performanceMetrics = {
            scriptsLoaded: 0,
            totalLoadTime: 0,
            averageLoadTime: 0,
            cacheHits: 0,
            networkRequests: 0
        };
        
        // Initialize optimization features
        this.initializePreloading();
        this.initializeCodeSplitting();
        this.initializeResourceHints();
    }
    
    initializePreloading() {
        // Preload critical resources
        const criticalResources = [
            'static/design-system.css',
            'static/modules/error-handler.js',
            'static/modules/timer-manager.js'
        ];
        
        criticalResources.forEach(resource => {
            this.preloadResource(resource, this.getResourceType(resource));
        });
    }
    
    initializeCodeSplitting() {
        // Define lazy-loadable modules
        this.lazyModules.set('voice-integration', {
            modules: ['static/shared/smart-prd-voice.js'],
            condition: () => this.isVoiceFeatureNeeded(),
            priority: 'low'
        });
        
        this.lazyModules.set('advanced-features', {
            modules: [
                'static/features/parallel-agents-modal.js',
                'static/features/coder1-special-views.js'
            ],
            condition: () => this.isAdvancedFeaturesNeeded(),
            priority: 'medium'
        });
    }
    
    initializeResourceHints() {
        // Add resource hints to document head
        this.addResourceHint('preconnect', 'https://fonts.googleapis.com');
        this.addResourceHint('preconnect', 'https://cdnjs.cloudflare.com');
        this.addResourceHint('dns-prefetch', 'https://fonts.gstatic.com');
    }
    
    preloadResource(url, type) {
        if (this.preloadedResources.has(url)) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = type;
        
        if (type === 'script') {
            link.crossOrigin = 'anonymous';
        }
        
        document.head.appendChild(link);
        this.preloadedResources.add(url);
    }
    
    addResourceHint(rel, href) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        document.head.appendChild(link);
    }
    
    getResourceType(url) {
        if (url.endsWith('.css')) return 'style';
        if (url.endsWith('.js')) return 'script';
        if (url.endsWith('.woff2') || url.endsWith('.woff')) return 'font';
        if (url.match(/\.(jpg|jpeg|png|svg|webp)$/)) return 'image';
        return 'fetch';
    }
    
    async loadModuleWithOptimization(url, options = {}) {
        const startTime = performance.now();
        
        try {
            // Check if already loaded
            if (this.loadedModules.has(url)) {
                this.performanceMetrics.cacheHits++;
                return true;
            }
            
            // Check if already loading
            if (this.loadingPromises.has(url)) {
                return this.loadingPromises.get(url);
            }
            
            // Create optimized loading promise
            const loadPromise = this.createOptimizedLoader(url, options);
            this.loadingPromises.set(url, loadPromise);
            
            const result = await loadPromise;
            
            // Update metrics
            const loadTime = performance.now() - startTime;
            this.updateMetrics(loadTime);
            
            this.loadedModules.add(url);
            this.loadingPromises.delete(url);
            
            return result;
            
        } catch (error) {
            this.loadingPromises.delete(url);
            if (window.ErrorHandler) {
                window.ErrorHandler.handleError(error, {
                    type: 'network',
                    context: 'bundle_optimization',
                    metadata: { url, loadTime: performance.now() - startTime }
                });
            }
            throw error;
        }
    }
    
    createOptimizedLoader(url, options) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            
            // Optimization attributes
            script.src = url + (options.cacheBust ? `?v=${Date.now()}` : '');
            script.async = options.async !== false;
            script.defer = options.defer === true;
            
            // Performance optimizations
            if (options.crossOrigin) {
                script.crossOrigin = options.crossOrigin;
            }
            
            // Priority hints (if supported)
            if (options.priority && 'fetchPriority' in script) {
                script.fetchPriority = options.priority;
            }
            
            script.onload = () => {
                this.performanceMetrics.scriptsLoaded++;
                resolve(true);
            };
            
            script.onerror = () => {
                reject(new Error(`Failed to load script: ${url}`));
            };
            
            document.head.appendChild(script);
            this.performanceMetrics.networkRequests++;
        });
    }
    
    updateMetrics(loadTime) {
        this.performanceMetrics.totalLoadTime += loadTime;
        this.performanceMetrics.averageLoadTime = 
            this.performanceMetrics.totalLoadTime / this.performanceMetrics.scriptsLoaded;
    }
    
    // Lazy loading conditions
    isVoiceFeatureNeeded() {
        return document.querySelector('.voice-toggle-btn') || 
               document.querySelector('.mic-prompt');
    }
    
    isAdvancedFeaturesNeeded() {
        return document.querySelector('[data-special-view]') ||
               window.location.search.includes('advanced=true');
    }
    
    // Load modules based on conditions
    async loadConditionalModules() {
        const loadPromises = [];
        
        for (const [name, config] of this.lazyModules) {
            if (config.condition()) {
                const modulePromises = config.modules.map(module => 
                    this.loadModuleWithOptimization(module, {
                        priority: config.priority,
                        async: true
                    })
                );
                loadPromises.push(...modulePromises);
            }
        }
        
        if (loadPromises.length > 0) {
            try {
                await Promise.all(loadPromises);
            } catch (error) {
                // Log but don't fail - these are enhancements
                if (window.ErrorHandler) {
                    window.ErrorHandler.handleError(error, {
                        type: 'network',
                        context: 'conditional_module_loading',
                        silent: true
                    });
                }
            }
        }
    }
    
    // Critical path optimization
    async loadCriticalPath(modules) {
        const criticalPromises = modules.map(module => 
            this.loadModuleWithOptimization(module, {
                priority: 'high',
                async: false,
                defer: false
            })
        );
        
        return Promise.all(criticalPromises);
    }
    
    // Intersection Observer for lazy loading
    createLazyLoader(selector, moduleUrl) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadModuleWithOptimization(moduleUrl, {
                        priority: 'low',
                        async: true
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        document.querySelectorAll(selector).forEach(element => {
            observer.observe(element);
        });
        
        return observer;
    }
    
    // Service Worker integration for caching
    async initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker?.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content available
                            this.notifyContentUpdate();
                        }
                    });
                });
                
            } catch (error) {
                // Service worker not critical
                if (window.ErrorHandler) {
                    window.ErrorHandler.handleError(error, {
                        type: 'network',
                        context: 'service_worker_init',
                        silent: true
                    });
                }
            }
        }
    }
    
    notifyContentUpdate() {
        if (window.UIComponents) {
            window.UIComponents.showToast(
                'New content available. Refresh to update.',
                'info'
            );
        }
    }
    
    // Bundle analysis and optimization suggestions
    analyzeBundle() {
        const recommendations = [];
        
        // Check for unused modules
        const allScripts = Array.from(document.scripts);
        const unusedScripts = allScripts.filter(script => {
            // Basic heuristic for unused scripts
            return script.src && !this.loadedModules.has(script.src);
        });
        
        if (unusedScripts.length > 0) {
            recommendations.push({
                type: 'unused_scripts',
                count: unusedScripts.length,
                suggestion: 'Consider removing unused scripts or implementing lazy loading'
            });
        }
        
        // Check load times
        if (this.performanceMetrics.averageLoadTime > 500) {
            recommendations.push({
                type: 'slow_loading',
                averageTime: this.performanceMetrics.averageLoadTime,
                suggestion: 'Consider code splitting or preloading critical resources'
            });
        }
        
        // Check cache efficiency
        const cacheHitRate = this.performanceMetrics.cacheHits / 
                            (this.performanceMetrics.networkRequests || 1);
        
        if (cacheHitRate < 0.7) {
            recommendations.push({
                type: 'low_cache_hits',
                rate: Math.round(cacheHitRate * 100),
                suggestion: 'Implement better caching strategies'
            });
        }
        
        return {
            metrics: this.performanceMetrics,
            recommendations
        };
    }
    
    // Resource loading priority management
    setPriority(url, priority) {
        const existingScript = document.querySelector(`script[src*="${url}"]`);
        if (existingScript && 'fetchPriority' in existingScript) {
            existingScript.fetchPriority = priority;
        }
    }
    
    // Memory management
    cleanupUnusedResources() {
        // Remove unused preload links
        const preloadLinks = document.querySelectorAll('link[rel="preload"]');
        preloadLinks.forEach(link => {
            if (link.href && !this.loadedModules.has(link.href)) {
                // Resource was preloaded but never used
                setTimeout(() => {
                    if (!this.loadedModules.has(link.href)) {
                        link.remove();
                    }
                }, 30000); // Clean up after 30 seconds
            }
        });
    }
    
    // Performance monitoring
    getPerformanceReport() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        
        return {
            bundleMetrics: this.performanceMetrics,
            navigation: {
                domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.navigationStart,
                loadComplete: navigation?.loadEventEnd - navigation?.navigationStart,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
            },
            resources: resources.map(resource => ({
                name: resource.name.split('/').pop(),
                duration: resource.duration,
                size: resource.transferSize,
                cached: resource.transferSize === 0
            }))
        };
    }
}

// Initialize bundle optimizer
window.BundleOptimizer = new BundleOptimizer();

// Auto-load conditional modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.BundleOptimizer.loadConditionalModules();
    
    // Clean up after initial load
    setTimeout(() => {
        window.BundleOptimizer.cleanupUnusedResources();
    }, 5000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BundleOptimizer;
}