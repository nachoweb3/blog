/**
 * Optimized Lazy Loading and Performance Enhancement Script
 *
 * This script provides comprehensive performance optimizations:
 * - Native lazy loading with fallbacks
 * - Intersection Observer implementation
 * - Image optimization and WebP support
 * - Critical image preloading
 * - Progressive image loading
 * - Resource hints and prefetching
 * - Performance monitoring
 */

class NachoWeb3LazyLoader {
    constructor(options = {}) {
        this.config = {
            // Lazy loading options
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '50px',
            enableNative: options.enableNative !== false,

            // Image optimization
            enableWebP: options.enableWebP !== false,
            enableProgressive: options.enableProgressive !== false,
            placeholderQuality: options.placeholderQuality || 10,

            // Performance monitoring
            enablePerformanceMonitoring: options.enablePerformanceMonitoring !== false,

            // Preloading
            preloadCritical: options.preloadCritical !== false,
            preloadPriority: options.preloadPriority || ['above-the-fold', 'hero', 'thumbnail'],

            // Retry mechanism
            maxRetries: options.maxRetries || 3,
            retryDelay: options.retryDelay || 1000,

            ...options
        };

        // Support detection
        this.supportsNativeLazyLoading = 'loading' in HTMLImageElement.prototype;
        this.supportsIntersectionObserver = 'IntersectionObserver' in window;
        this.supportsWebP = this.checkWebPSupport();

        // State tracking
        this.observer = null;
        this.loadedImages = new Set();
        this.failedImages = new Set();
        this.retryQueue = new Map();
        this.performanceMetrics = {
            totalImages: 0,
            loadedImages: 0,
            failedImages: 0,
            lazyLoadedImages: 0,
            totalLoadTime: 0,
            averageLoadTime: 0
        };

        this.init();
    }

    init() {
        // Start performance monitoring
        if (this.config.enablePerformanceMonitoring) {
            this.startPerformanceMonitoring();
        }

        // Initialize lazy loading
        this.initializeLazyLoading();

        // Preload critical images
        if (this.config.preloadCritical) {
            this.preloadCriticalImages();
        }

        // Setup resource hints
        this.setupResourceHints();

        // Setup progressive enhancement
        if (this.config.enableProgressive) {
            this.setupProgressiveLoading();
        }

        console.log('🚀 NachoWeb3 Lazy Loader initialized');
    }

    // Check WebP support
    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Initialize lazy loading
    initializeLazyLoading() {
        // Find all images that need lazy loading
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');

        if (!lazyImages.length) {
            console.log('No lazy images found');
            return;
        }

        this.performanceMetrics.totalImages = lazyImages.length;

        // Use native lazy loading if supported and enabled
        if (this.config.enableNative && this.supportsNativeLazyLoading) {
            this.useNativeLazyLoading(lazyImages);
        } else if (this.supportsIntersectionObserver) {
            this.useIntersectionObserver(lazyImages);
        } else {
            // Fallback to scroll-based lazy loading
            this.useScrollBasedLoading(lazyImages);
        }
    }

    // Use native lazy loading
    useNativeLazyLoading(images) {
        images.forEach(img => {
            // Convert data-src to src for native loading
            if (img.dataset.src) {
                // Add loading="lazy" if not present
                if (!img.loading) {
                    img.loading = 'lazy';
                }

                // Set src from data-src
                const optimizedSrc = this.optimizeImageSrc(img.dataset.src);
                img.src = optimizedSrc;
                img.dataset.src = ''; // Clean up

                // Add loading event listeners
                this.addImageLoadListeners(img);
            }
        });

        console.log('✅ Using native lazy loading');
    }

    // Use Intersection Observer for lazy loading
    useIntersectionObserver(images) {
        const options = {
            root: null,
            rootMargin: this.config.rootMargin,
            threshold: this.config.threshold
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        images.forEach(img => {
            if (img.dataset.src || img.src) {
                this.observer.observe(img);
            }
        });

        console.log('✅ Using Intersection Observer lazy loading');
    }

    // Fallback scroll-based lazy loading
    useScrollBasedLoading(images) {
        this.lazyImages = Array.from(images);

        const checkImages = () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;

            this.lazyImages.forEach((img, index) => {
                if (this.isElementInViewport(img)) {
                    this.loadImage(img);
                    this.lazyImages.splice(index, 1);
                }
            });

            if (this.lazyImages.length === 0) {
                window.removeEventListener('scroll', throttledCheck);
                window.removeEventListener('resize', throttledCheck);
            }
        };

        const throttledCheck = this.throttle(checkImages, 100);

        window.addEventListener('scroll', throttledCheck);
        window.addEventListener('resize', throttledCheck);

        // Initial check
        checkImages();

        console.log('✅ Using scroll-based lazy loading');
    }

    // Check if element is in viewport
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const rootMargin = parseInt(this.config.rootMargin) || 50;

        return (
            rect.top >= -rootMargin &&
            rect.left >= -rootMargin &&
            rect.bottom <= window.innerHeight + rootMargin &&
            rect.right <= window.innerWidth + rootMargin
        );
    }

    // Load individual image
    async loadImage(img) {
        if (this.loadedImages.has(img)) {
            return;
        }

        const startTime = performance.now();
        const originalSrc = img.dataset.src || img.src;

        try {
            // Get optimized source
            const optimizedSrc = this.optimizeImageSrc(originalSrc);

            // Create new image to preload
            const tempImg = new Image();

            // Add loading indicator
            this.addLoadingIndicator(img);

            // Set up load event
            tempImg.onload = () => {
                // Apply image to element
                img.src = optimizedSrc;
                img.classList.add('loaded');
                img.classList.remove('loading');

                // Remove loading indicator
                this.removeLoadingIndicator(img);

                // Track metrics
                const loadTime = performance.now() - startTime;
                this.trackImageLoad(img, loadTime, true);

                // Cleanup
                delete img.dataset.src;
                this.loadedImages.add(img);
                this.performanceMetrics.lazyLoadedImages++;
            };

            // Set up error event
            tempImg.onerror = () => {
                this.handleImageError(img, originalSrc);
            };

            // Start loading
            tempImg.src = optimizedSrc;

        } catch (error) {
            console.error('Error loading image:', error);
            this.handleImageError(img, originalSrc);
        }
    }

    // Optimize image source
    optimizeImageSrc(src) {
        if (!src) return src;

        // Add WebP support if browser supports it
        if (this.config.enableWebP && this.supportsWebP) {
            src = this.convertToWebP(src);
        }

        // Add quality and size parameters if using CDN
        src = this.addOptimizationParams(src);

        return src;
    }

    // Convert image URL to WebP format
    convertToWebP(src) {
        // Skip external URLs that don't support WebP
        if (src.includes('http') && !src.includes(window.location.hostname)) {
            return src;
        }

        // Convert local images to WebP
        if (src.match(/\.(jpg|jpeg|png)$/i)) {
            return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }

        return src;
    }

    // Add optimization parameters for CDN images
    addOptimizationParams(src) {
        // GitHub Pages optimization (example)
        if (src.includes('github.io') || src.includes('githubusercontent.com')) {
            // Add quality parameter for supported services
            const separator = src.includes('?') ? '&' : '?';
            return `${src}${separator}quality=80&format=webp`;
        }

        return src;
    }

    // Handle image loading errors
    handleImageError(img, originalSrc) {
        const retryCount = (img.dataset.retryCount || 0) + 1;
        img.dataset.retryCount = retryCount;

        if (retryCount <= this.config.maxRetries) {
            console.log(`Retrying image load (${retryCount}/${this.config.maxRetries}):`, originalSrc);

            // Retry after delay
            setTimeout(() => {
                this.loadImage(img);
            }, this.config.retryDelay * retryCount);
        } else {
            // Final failure - show placeholder
            img.src = this.generatePlaceholder(originalSrc);
            img.classList.add('error');
            img.classList.remove('loading');
            this.removeLoadingIndicator(img);

            this.trackImageLoad(img, 0, false);
            this.failedImages.add(img);
        }
    }

    // Generate placeholder for failed images
    generatePlaceholder(originalSrc) {
        // Return SVG placeholder
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNTAgMTIwSDE4OVwxODUgMTUwSDE4OUgxODVWMTIwWk0xODUgMTYwSDE1MFYxMjBIMTg1VjE2MFoiIGZpbGw9IiNDNUM2NEYiLz4KPHN2ZyB4PSIxNTAiIHk9IjkwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMlM2LjQ4IDIyIDEyIDIyUzIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTIgMlpNMTIgMjBDNy41OSAyMCA0IDE2LjQxIDQgMTJTNy41OSA0IDEyIDRTMjAgNy41OSAyMCAxMlMxNi40MSAyMCAxMiAyMFoiIGZpbGw9IiNDNUM2NEYiLz4KPC9zdmc+Cjwvc3ZnPgo=';
    }

    // Add loading indicator
    addLoadingIndicator(img) {
        img.classList.add('loading');

        // Create or show spinner
        let spinner = img.parentNode.querySelector('.image-spinner');
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.className = 'image-spinner';
            spinner.innerHTML = `
                <div class="spinner"></div>
                <div class="loading-text">Cargando...</div>
            `;
            img.parentNode.appendChild(spinner);
        }
        spinner.style.display = 'block';
    }

    // Remove loading indicator
    removeLoadingIndicator(img) {
        const spinner = img.parentNode.querySelector('.image-spinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }

    // Add event listeners for image loading
    addImageLoadListeners(img) {
        img.addEventListener('load', () => {
            const loadTime = performance.now() - (img.loadStartTime || 0);
            this.trackImageLoad(img, loadTime, true);
            img.classList.add('loaded');
        });

        img.addEventListener('error', () => {
            this.trackImageLoad(img, 0, false);
            img.classList.add('error');
        });

        img.loadStartTime = performance.now();
    }

    // Track image loading performance
    trackImageLoad(img, loadTime, success) {
        if (success) {
            this.performanceMetrics.loadedImages++;
            this.performanceMetrics.totalLoadTime += loadTime;
        } else {
            this.performanceMetrics.failedImages++;
        }

        this.performanceMetrics.averageLoadTime =
            this.performanceMetrics.totalLoadTime / this.performanceMetrics.loadedImages;

        // Log to console for debugging
        if (this.config.enablePerformanceMonitoring) {
            console.log(`Image ${success ? 'loaded' : 'failed'}:`, img.src.substring(0, 50), `${loadTime.toFixed(2)}ms`);
        }
    }

    // Preload critical images
    preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('img[data-priority="critical"], .hero img, .thumbnail img');

        criticalImages.forEach(img => {
            const src = img.dataset.src || img.src;
            if (src && !this.loadedImages.has(img)) {
                this.preloadImage(src);
            }
        });

        console.log(`🎯 Preloading ${criticalImages.length} critical images`);
    }

    // Preload individual image
    preloadImage(src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = this.optimizeImageSrc(src);
        document.head.appendChild(link);
    }

    // Setup resource hints for better performance
    setupResourceHints() {
        // DNS prefetch for external domains
        const domains = ['fonts.googleapis.com', 'cdnjs.cloudflare.com', 'www.googletagmanager.com'];
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });

        // Preconnect for critical domains
        const preconnectDomains = ['fonts.gstatic.com', 'www.google-analytics.com'];
        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = `https://${domain}`;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    // Setup progressive image loading
    setupProgressiveLoading() {
        const progressiveImages = document.querySelectorAll('img[data-low-quality]');

        progressiveImages.forEach(img => {
            const lowQualitySrc = img.dataset.lowQuality;
            const highQualitySrc = img.dataset.src || img.src;

            // Load low quality version first
            img.src = this.addOptimizationParams(lowQualitySrc, 10);
            img.classList.add('progressive-loading');

            // Then load high quality version
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = highQualitySrc;
                img.classList.remove('progressive-loading');
                img.classList.add('progressive-loaded');
            };
            tempImg.src = highQualitySrc;
        });
    }

    // Start performance monitoring
    startPerformanceMonitoring() {
        // Monitor Web Vitals
        this.monitorWebVitals();

        // Create performance dashboard
        this.createPerformanceDashboard();
    }

    // Monitor Core Web Vitals
    monitorWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    // Create performance dashboard
    createPerformanceDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'performance-dashboard';
        dashboard.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000000;
            display: none;
        `;

        document.body.appendChild(dashboard);

        // Update dashboard periodically
        setInterval(() => {
            this.updatePerformanceDashboard(dashboard);
        }, 2000);

        // Toggle dashboard with keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                dashboard.style.display = dashboard.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    // Update performance dashboard
    updatePerformanceDashboard(dashboard) {
        const metrics = this.performanceMetrics;
        dashboard.innerHTML = `
            <div><strong>🚀 Performance Metrics</strong></div>
            <div>Total Images: ${metrics.totalImages}</div>
            <div>Loaded: ${metrics.loadedImages}</div>
            <div>Failed: ${metrics.failedImages}</div>
            <div>Lazy Loaded: ${metrics.lazyLoadedImages}</div>
            <div>Avg Load Time: ${metrics.averageLoadTime.toFixed(2)}ms</div>
            <div style="margin-top: 5px; font-size: 10px;">Ctrl+Shift+P to toggle</div>
        `;
    }

    // Utility: Throttle function
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

    // Public API methods
    forceLoadImage(img) {
        this.loadImage(img);
    }

    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }

    reset() {
        this.loadedImages.clear();
        this.failedImages.clear();
        this.retryQueue.clear();
        this.performanceMetrics = {
            totalImages: 0,
            loadedImages: 0,
            failedImages: 0,
            lazyLoadedImages: 0,
            totalLoadTime: 0,
            averageLoadTime: 0
        };
    }
}

// CSS for loading indicators and effects
const lazyLoadingStyles = `
<style>
/* Loading indicators */
.image-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 1;
}

.spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(138, 43, 226, 0.2);
    border-radius: 50%;
    border-top-color: #8a2be2;
    animation: spin 1s linear infinite;
    margin: 0 auto 5px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-text {
    font-size: 12px;
    color: #666;
}

/* Image loading states */
img.loading {
    opacity: 0.5;
    filter: blur(2px);
    transition: all 0.3s ease;
}

img.loaded {
    opacity: 1;
    filter: blur(0);
    transition: all 0.3s ease;
}

img.error {
    opacity: 0.7;
    filter: grayscale(100%);
}

/* Progressive loading */
img.progressive-loading {
    filter: blur(5px);
    transition: filter 0.3s ease;
}

img.progressive-loaded {
    filter: blur(0);
}

/* Container for relative positioning */
img[data-src], img[data-priority="critical"] {
    position: relative;
}
</style>
`;

// Inject styles
if (typeof document !== 'undefined') {
    document.head.insertAdjacentHTML('beforeend', lazyLoadingStyles);
}

// Initialize lazy loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Auto-initialize with default options
    window.lazyLoader = new NachoWeb3LazyLoader({
        threshold: 0.1,
        rootMargin: '50px',
        enableWebP: true,
        enableProgressive: true,
        enablePerformanceMonitoring: true
    });

    // Make available globally
    window.forceLoadImage = (img) => {
        window.lazyLoader.forceLoadImage(img);
    };

    console.log('🖼️ Optimized Lazy Loading loaded');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NachoWeb3LazyLoader;
}