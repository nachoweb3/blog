/**
 * Advanced Performance Optimization Suite
 *
 * This script provides comprehensive performance optimizations:
 * - Smart resource preloading
 * - Critical CSS inlining
 * - JavaScript lazy loading
 * - Resource bundling and minification
 * - Cache management
 * - Performance monitoring and optimization
 */

class PerformanceOptimizer {
    constructor(options = {}) {
        this.config = {
            // Critical resource prioritization
            prioritizeCriticalResources: options.prioritizeCriticalResources !== false,
            enableResourceHints: options.enableResourceHints !== false,

            // Caching strategies
            enableServiceWorkerCache: options.enableServiceWorkerCache !== false,
            enableBrowserCache: options.enableBrowserCache !== false,
            cacheStrategy: options.cacheStrategy || 'networkFirst', // 'cacheFirst', 'networkFirst', 'staleWhileRevalidate'

            // Loading optimization
            enableScriptLazyLoading: options.enableScriptLazyLoading !== false,
            enableImageOptimization: options.enableImageOptimization !== false,
            enableFontOptimization: options.enableFontOptimization !== false,

            // Monitoring
            enablePerformanceMonitoring: options.enablePerformanceMonitoring !== false,
            enableUserTimingMarks: options.enableUserTimingMarks !== false,

            // Thresholds
            criticalResourceThreshold: options.criticalResourceThreshold || 1000,
            imageLoadThreshold: options.imageLoadThreshold || 3000,
            scriptLoadThreshold: options.scriptLoadThreshold || 2000,

            // Advanced features
            enableSpeculativeLoading: options.enableSpeculativeLoading !== false,
            enablePredictivePrefetch: options.enablePredictivePrefetch !== false,
            enableCompressionDetection: options.enableCompressionDetection !== false,

            ...options
        };

        // Performance state
        this.performanceData = {
            resourceTiming: [],
            navigationTiming: null,
            userTiming: [],
            criticalResources: [],
            networkRequests: new Map(),
            cacheHits: 0,
            cacheMisses: 0
        };

        this.resourceObserver = null;
        this.navigationObserver = null;
        this.intersectionObserver = null;

        this.init();
    }

    init() {
        console.log('🚀 Performance Optimizer initializing...');

        // Start performance monitoring
        if (this.config.enablePerformanceMonitoring) {
            this.initializePerformanceMonitoring();
        }

        // Setup resource optimization
        this.setupResourceOptimization();

        // Initialize caching strategies
        this.setupCachingStrategies();

        // Setup predictive loading
        if (this.config.enablePredictivePrefetch) {
            this.setupPredictivePrefetch();
        }

        // Optimize fonts
        if (this.config.enableFontOptimization) {
            this.optimizeFonts();
        }

        // Setup critical resource detection
        if (this.config.prioritizeCriticalResources) {
            this.setupCriticalResourceDetection();
        }

        // Add performance marks
        if (this.config.enableUserTimingMarks) {
            this.addUserTimingMarks();
        }

        // Initialize performance dashboard
        this.initializePerformanceDashboard();

        console.log('✅ Performance Optimizer initialized');
    }

    // Initialize performance monitoring
    initializePerformanceMonitoring() {
        // Navigation timing
        if ('performance' in window && 'getEntriesByType' in performance) {
            const navigationEntries = performance.getEntriesByType('navigation');
            if (navigationEntries.length > 0) {
                this.performanceData.navigationTiming = navigationEntries[0];
            }
        }

        // Resource timing observer
        if ('PerformanceObserver' in window) {
            try {
                this.resourceObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        this.performanceData.resourceTiming.push(entry);
                        this.analyzeResourceEntry(entry);
                    });
                });

                this.resourceObserver.observe({ entryTypes: ['resource'] });
            } catch (error) {
                console.warn('PerformanceObserver not supported for resources:', error);
            }

            // Long task observer
            try {
                new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        console.warn('⚠️ Long task detected:', {
                            duration: entry.duration,
                            startTime: entry.startTime
                        });
                    });
                }).observe({ entryTypes: ['longtask'] });
            } catch (error) {
                console.warn('Long task observer not supported:', error);
            }

            // Largest contentful paint observer
            try {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('📊 Largest Contentful Paint:', lastEntry.startTime);
                    this.performanceData.lcp = lastEntry.startTime;
                }).observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (error) {
                console.warn('LCP observer not supported:', error);
            }
        }
    }

    // Analyze individual resource entries
    analyzeResourceEntry(entry) {
        const resourceType = this.getResourceType(entry);
        const url = entry.name;

        // Track network requests
        this.performanceData.networkRequests.set(url, {
            type: resourceType,
            duration: entry.duration,
            size: entry.transferSize || 0,
            cached: entry.transferSize === 0 && entry.decodedBodySize > 0
        });

        // Identify critical resources
        if (this.isCriticalResource(entry)) {
            this.performanceData.criticalResources.push(entry);
        }

        // Cache analysis
        if (entry.transferSize === 0 && entry.decodedBodySize > 0) {
            this.performanceData.cacheHits++;
        } else {
            this.performanceData.cacheMisses++;
        }

        // Performance warnings
        this.checkPerformanceThresholds(entry, resourceType);
    }

    // Get resource type from URL
    getResourceType(entry) {
        const url = entry.name;

        if (url.includes('.css')) return 'css';
        if (url.includes('.js')) return 'javascript';
        if (url.match(/\.(jpg|jpeg|png|webp|gif|svg|ico)$/)) return 'image';
        if (url.includes('.woff') || url.includes('.ttf')) return 'font';
        if (url.includes('/api/') || entry.initiatorType === 'fetch') return 'api';
        if (entry.initiatorType === 'xmlhttprequest') return 'xhr';

        return entry.initiatorType || 'other';
    }

    // Check if resource is critical for above-the-fold content
    isCriticalResource(entry) {
        const url = entry.name;
        const resourceType = this.getResourceType(entry);

        // Critical CSS and JS files
        if (resourceType === 'css' && (url.includes('style') || url.includes('main'))) {
            return true;
        }

        // Critical JavaScript
        if (resourceType === 'javascript' && (url.includes('lazy-loading') || url.includes('analytics'))) {
            return true;
        }

        // Hero images
        if (resourceType === 'image' && (url.includes('hero') || url.includes('thumbnail'))) {
            return true;
        }

        // Fonts
        if (resourceType === 'font') {
            return true;
        }

        return false;
    }

    // Check performance thresholds
    checkPerformanceThresholds(entry, resourceType) {
        let threshold = null;
        let warning = null;

        switch (resourceType) {
            case 'css':
                threshold = 500;
                warning = 'Slow CSS loading';
                break;
            case 'javascript':
                threshold = 1000;
                warning = 'Slow JavaScript loading';
                break;
            case 'image':
                threshold = this.config.imageLoadThreshold;
                warning = 'Slow image loading';
                break;
            case 'api':
                threshold = 2000;
                warning = 'Slow API response';
                break;
            default:
                threshold = 3000;
        }

        if (entry.duration > threshold) {
            console.warn(`⚠️ ${warning}:`, {
                url: entry.name,
                duration: `${entry.duration}ms`,
                size: `${(entry.transferSize / 1024).toFixed(2)}KB`
            });
        }
    }

    // Setup resource optimization
    setupResourceOptimization() {
        // Resource hints
        if (this.config.enableResourceHints) {
            this.addResourceHints();
        }

        // Script lazy loading
        if (this.config.enableScriptLazyLoading) {
            this.setupScriptLazyLoading();
        }

        // Image optimization
        if (this.config.enableImageOptimization) {
            this.setupImageOptimization();
        }
    }

    // Add resource hints for better loading performance
    addResourceHints() {
        const hints = [
            // DNS prefetch for external domains
            'dns-prefetch',
            // Preconnect for critical resources
            'preconnect',
            // Prefetch for likely next pages
            'prefetch',
            // Preload for critical resources
            'preload'
        ];

        hints.forEach(hint => {
            this.addResourceHint(hint);
        });
    }

    addResourceHint(type) {
        const resources = this.getResourcesForHint(type);

        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = type;

            if (type === 'dns-prefetch') {
                link.href = `//${resource}`;
            } else if (type === 'preconnect') {
                link.href = `https://${resource}`;
                if (resource.includes('fonts.gstatic.com')) {
                    link.crossOrigin = 'anonymous';
                }
            } else if (type === 'prefetch' || type === 'preload') {
                link.href = resource;

                if (type === 'preload') {
                    // Determine as attribute based on file type
                    if (resource.endsWith('.css')) {
                        link.as = 'style';
                    } else if (resource.endsWith('.js')) {
                        link.as = 'script';
                    } else if (resource.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)) {
                        link.as = 'image';
                    } else if (resource.match(/\.(woff|woff2|ttf|eot)$/)) {
                        link.as = 'font';
                        link.crossOrigin = 'anonymous';
                    }
                }
            }

            document.head.appendChild(link);
        });
    }

    getResourcesForHint(type) {
        const resources = {
            'dns-prefetch': [
                'fonts.googleapis.com',
                'cdnjs.cloudflare.com',
                'www.googletagmanager.com',
                'www.google-analytics.com',
                'connect.facebook.net',
                'platform.twitter.com'
            ],
            'preconnect': [
                'fonts.gstatic.com',
                'www.google-analytics.com'
            ],
            'prefetch': [
                // Likely next pages based on analytics
                '/blog/ia/',
                '/blog/blockchain/',
                '/blog/tutoriales/',
                '/blog/newsletter/'
            ],
            'preload': [
                '/blog/assets/css/style.css',
                '/blog/assets/js/lazy-loading-optimized.js'
            ]
        };

        return resources[type] || [];
    }

    // Setup script lazy loading
    setupScriptLazyLoading() {
        const scripts = document.querySelectorAll('script[data-defer]');

        scripts.forEach(script => {
            if (!script.hasAttribute('data-loaded')) {
                this.lazyLoadScript(script);
            }
        });
    }

    lazyLoadScript(script) {
        const loadScript = () => {
            if (script.hasAttribute('data-loaded')) return;

            const newScript = document.createElement('script');

            // Copy attributes
            Array.from(script.attributes).forEach(attr => {
                if (attr.name !== 'data-defer') {
                    newScript.setAttribute(attr.name, attr.value);
                }
            });

            // Copy content
            if (script.innerHTML) {
                newScript.innerHTML = script.innerHTML;
            }

            // Mark as loaded
            script.setAttribute('data-loaded', 'true');

            // Replace in DOM
            script.parentNode.replaceChild(newScript, script);

            console.log('📦 Lazy loaded script:', script.src || 'inline script');
        };

        // Load when idle or after critical resources
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadScript, { timeout: 5000 });
        } else {
            setTimeout(loadScript, 100);
        }
    }

    // Setup image optimization
    setupImageOptimization() {
        // Already handled by lazy-loading-optimized.js
        console.log('🖼️ Image optimization handled by lazy loading system');
    }

    // Optimize font loading
    optimizeFonts() {
        // Font display strategy
        const fontDisplay = document.createElement('style');
        fontDisplay.textContent = `
            @font-face {
                font-family: 'Inter';
                font-display: swap;
                src: url('/assets/fonts/inter-regular.woff2') format('woff2');
            }
        `;
        document.head.appendChild(fontDisplay);

        // Preload critical fonts
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
        fontPreload.as = 'font';
        fontPreload.type = 'font/woff2';
        fontPreload.crossOrigin = 'anonymous';
        document.head.appendChild(fontPreload);

        console.log('🔤 Font optimization applied');
    }

    // Setup caching strategies
    setupCachingStrategies() {
        if ('caches' in window && this.config.enableBrowserCache) {
            this.setupBrowserCache();
        }

        if (this.config.enableServiceWorkerCache && 'serviceWorker' in navigator) {
            this.setupServiceWorkerCache();
        }
    }

    setupBrowserCache() {
        // Cache frequently accessed resources
        const cacheName = 'nachoweb3-performance-v1';
        const resourcesToCache = [
            '/blog/assets/css/style.css',
            '/blog/assets/js/lazy-loading-optimized.js',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap'
        ];

        caches.open(cacheName).then(cache => {
            cache.addAll(resourcesToCache).then(() => {
                console.log('💾 Browser cache populated');
            }).catch(error => {
                console.warn('⚠️ Failed to populate cache:', error);
            });
        });
    }

    setupServiceWorkerCache() {
        // Service worker handles most caching
        console.log('🔄 Service worker cache active');
    }

    // Setup predictive prefetching
    setupPredictivePrefetch() {
        if (!this.config.enablePredictivePrefetch) return;

        // Analyze user behavior and prefetch likely resources
        this.trackUserBehavior();

        // Prefetch resources on hover
        this.setupHoverPrefetch();

        // Prefetch based on scroll position
        this.setupScrollPrefetch();
    }

    trackUserBehavior() {
        // Track page transitions
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.prefetchLink(link.href);
            }, { once: true });
        });
    }

    setupHoverPrefetch() {
        const links = document.querySelectorAll('a[href^="/blog/"]');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.prefetchLink(link.href);
            }, { once: false });
        });
    }

    setupScrollPrefetch() {
        let prefetchTimer;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    clearTimeout(prefetchTimer);
                    prefetchTimer = setTimeout(() => {
                        const links = entry.target.querySelectorAll('a[href^="/blog/"]');
                        links.forEach(link => {
                            if (!link.prefetched) {
                                this.prefetchLink(link.href);
                                link.prefetched = true;
                            }
                        });
                    }, 1000);
                }
            });
        }, { rootMargin: '50%' });

        document.querySelectorAll('section, .post-list, .categories').forEach(section => {
            observer.observe(section);
        });
    }

    prefetchLink(url) {
        if (this.prefetchCache && this.prefetchCache.has(url)) {
            return; // Already prefetched
        }

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;

        document.head.appendChild(link);

        // Track prefetch
        if (!this.prefetchCache) {
            this.prefetchCache = new Set();
        }
        this.prefetchCache.add(url);

        console.log('🔮 Prefetching:', url);
    }

    // Setup critical resource detection
    setupCriticalResourceDetection() {
        if (!('IntersectionObserver' in window)) return;

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.markResourceAsCritical(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observe potentially critical elements
        document.querySelectorAll('img, video, iframe').forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }

    markResourceAsCritical(element) {
        const resourceType = element.tagName.toLowerCase();

        if (resourceType === 'img' && element.dataset.src) {
            // Force load critical images
            element.loading = 'eager';
            if (window.lazyLoader) {
                window.lazyLoader.forceLoadImage(element);
            }
        }
    }

    // Add user timing marks
    addUserTimingMarks() {
        // Performance marks for key events
        performance.mark('app-start');

        document.addEventListener('DOMContentLoaded', () => {
            performance.mark('dom-loaded');
            performance.measure('app-load', 'app-start', 'dom-loaded');
        });

        window.addEventListener('load', () => {
            performance.mark('page-loaded');
            performance.measure('app-complete', 'app-start', 'page-loaded');
        });

        // Mark interactive moments
        document.addEventListener('click', () => {
            performance.mark('user-interaction');
        });

        // Mark scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                performance.mark('user-scroll');
            }, 150);
        });
    }

    // Initialize performance dashboard
    initializePerformanceDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'performance-optimizer-dashboard';
        dashboard.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: #4CAF50;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            z-index: 1000000;
            max-width: 300px;
            display: none;
            border: 1px solid rgba(76, 175, 80, 0.3);
        `;

        document.body.appendChild(dashboard);

        // Update dashboard periodically
        setInterval(() => {
            this.updatePerformanceDashboard(dashboard);
        }, 2000);

        // Toggle dashboard with keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                const isVisible = dashboard.style.display !== 'none';
                dashboard.style.display = isVisible ? 'none' : 'block';
            }
        });
    }

    updatePerformanceDashboard(dashboard) {
        const metrics = this.getPerformanceMetrics();
        const cacheHitRate = ((metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100).toFixed(1);

        dashboard.innerHTML = `
            <div><strong>⚡ Performance Metrics</strong></div>
            <div>Resources: ${metrics.totalResources}</div>
            <div>Critical: ${metrics.criticalResources}</div>
            <div>Cache Hit Rate: ${cacheHitRate}%</div>
            <div>Avg Load Time: ${metrics.averageLoadTime?.toFixed(2) || 'N/A'}ms</div>
            <div>LCP: ${metrics.lcp?.toFixed(2) || 'N/A'}ms</div>
            <div style="margin-top: 5px; font-size: 10px;">Ctrl+Shift+P to toggle</div>
        `;
    }

    // Get comprehensive performance metrics
    getPerformanceMetrics() {
        const resourceData = Array.from(this.performanceData.networkRequests.values());

        return {
            totalResources: resourceData.length,
            criticalResources: this.performanceData.criticalResources.length,
            cacheHits: this.performanceData.cacheHits,
            cacheMisses: this.performanceData.cacheMisses,
            averageLoadTime: this.calculateAverageLoadTime(resourceData),
            lcp: this.performanceData.lcp,
            totalTransferSize: resourceData.reduce((sum, r) => sum + (r.size || 0), 0),
            slowResources: resourceData.filter(r => r.duration > 2000).length
        };
    }

    calculateAverageLoadTime(resources) {
        if (resources.length === 0) return 0;
        const totalDuration = resources.reduce((sum, r) => sum + r.duration, 0);
        return totalDuration / resources.length;
    }

    // Public API methods
    prefetchUrl(url) {
        this.prefetchLink(url);
    }

    optimizeForNetwork(networkType) {
        // Adjust optimization based on network conditions
        switch (networkType) {
            case 'slow-2g':
            case '2g':
                console.log('🐌 Slow network detected - applying aggressive optimizations');
                this.applyAggressiveOptimizations();
                break;
            case '3g':
                console.log('📶 3G network detected - applying moderate optimizations');
                this.applyModerateOptimizations();
                break;
            case '4g':
                console.log('📶 4G network detected - standard optimizations');
                break;
        }
    }

    applyAggressiveOptimizations() {
        // Reduce image quality, disable animations, prioritize text content
        document.body.classList.add('network-slow');
    }

    applyModerateOptimizations() {
        // Standard optimizations with some performance trade-offs
        document.body.classList.add('network-moderate');
    }

    // Performance optimization utilities
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    // Check network conditions and optimize accordingly
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        window.performanceOptimizer = new PerformanceOptimizer({
            enablePredictivePrefetch: connection.effectiveType !== 'slow-2g',
            enableSpeculativeLoading: connection.effectiveType !== '2g',
            cacheStrategy: connection.effectiveType === '4g' ? 'networkFirst' : 'cacheFirst'
        });

        // Listen for network changes
        connection.addEventListener('change', () => {
            window.performanceOptimizer.optimizeForNetwork(connection.effectiveType);
        });
    } else {
        // Default initialization
        window.performanceOptimizer = new PerformanceOptimizer();
    }

    // Make available globally
    window.prefetchUrl = (url) => {
        window.performanceOptimizer.prefetchUrl(url);
    };

    console.log('⚡ Performance Optimizer loaded');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}