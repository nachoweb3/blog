/**
 * Google Analytics 4 Enhanced Implementation for NachoWeb3 Blog
 *
 * This script provides comprehensive GA4 tracking including:
 * - Page views with custom dimensions
 * - User engagement metrics
 * - Newsletter subscription tracking
 * - Ad performance monitoring
 * - Content interaction analytics
 * - E-commerce event tracking (future)
 * - Custom event tracking for crypto/IA content
 */

class NachoWeb3Analytics {
    constructor() {
        this.config = {
            measurementId: this.getGA4Id(),
            debugMode: this.isDebugMode(),
            enableConsent: this.hasConsent(),
            trackPageViews: true,
            trackScroll: true,
            trackClicks: true,
            trackForms: true,
            trackNewsletter: true,
            trackAds: true
        };

        this.customDimensions = {
            // User properties
            user_type: 'user_type',                // new_visitor, returning_visitor, subscriber
            content_interest: 'content_interest',  // ia, blockchain, trading, tutorials
            engagement_level: 'engagement_level',  // low, medium, high
            device_type: 'device_type',            // mobile, tablet, desktop

            // Event parameters
            content_category: 'content_category',  // ia, blockchain, tutorials
            author: 'author',                      // post author
            reading_time: 'reading_time',          // estimated reading time
            content_format: 'content_format',      // blog_post, tutorial, news
            block_duration: 'block_duration',      // crypto block duration when relevant

            // Conversion parameters
            conversion_source: 'conversion_source', // newsletter_popup, sidebar_form, etc.
            subscription_plan: 'subscription_plan', // free, pro, vip

            // Ad parameters
            ad_type: 'ad_type',                    // display, auto_ads, sticky
            ad_position: 'ad_position'             // header, sidebar, footer, in_content
        };

        this.init();
    }

    // Get GA4 ID from config or fallback
    getGA4Id() {
        // Try to get from Jekyll config first
        if (typeof window.siteConfig !== 'undefined' && window.siteConfig.google_analytics_id) {
            return window.siteConfig.google_analytics_id;
        }

        // Fallback to hardcoded ID (update with real ID)
        return 'G-XXXXXXXXXX';
    }

    // Check if we're in debug mode
    isDebugMode() {
        return window.location.hostname === 'localhost' ||
               window.location.search.includes('ga_debug=true');
    }

    // Check for user consent (GDPR compliance)
    hasConsent() {
        // Check for existing consent
        if (localStorage.getItem('ga_consent') === 'granted') {
            return true;
        }

        // Auto-grant for development
        if (this.isDebugMode()) {
            return true;
        }

        return false;
    }

    // Initialize analytics
    init() {
        if (!this.config.measurementId || this.config.measurementId === 'G-XXXXXXXXXX') {
            console.warn('⚠️ Google Analytics ID not configured. Please update _config.yml with your GA4 ID.');
            return;
        }

        // Initialize gtag if not available
        this.initializeGtag();

        // Setup consent
        this.setupConsent();

        // Track page load
        if (this.config.trackPageViews) {
            this.trackPageView();
        }

        // Setup event tracking
        this.setupEventTracking();

        // Setup enhanced measurements
        this.setupEnhancedMeasurements();

        console.log('📊 NachoWeb3 Analytics initialized');
    }

    // Initialize gtag function
    initializeGtag() {
        if (typeof window.gtag === 'undefined') {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() {
                window.dataLayer.push(arguments);
            };
        }

        // Configure GA4
        gtag('js', new Date());
        gtag('config', this.config.measurementId, {
            debug_mode: this.config.debugMode,
            custom_map: this.customDimensions,
            anonymize_ip: true,
            cookie_flags: 'SameSite=Lax;Secure',
            page_title: document.title,
            page_location: window.location.href
        });

        // Set up debug mode
        if (this.config.debugMode) {
            gtag('config', this.config.measurementId, { debug_mode: true });
        }
    }

    // Setup consent management
    setupConsent() {
        if (!this.config.enableConsent) {
            gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
            });
        }

        // Check for existing consent
        if (this.hasConsent()) {
            this.grantConsent();
        }
    }

    // Grant consent for analytics
    grantConsent() {
        gtag('consent', 'update', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted'
        });
        localStorage.setItem('ga_consent', 'granted');
    }

    // Track page view with enhanced data
    trackPageView() {
        const pageData = this.getPageData();

        gtag('event', 'page_view', {
            page_title: pageData.title,
            page_location: pageData.url,
            content_category: pageData.category,
            content_format: pageData.format,
            author: pageData.author,
            reading_time: pageData.readingTime,
            user_type: this.getUserType(),
            device_type: this.getDeviceType()
        });

        // Set user properties
        this.setUserProperties();
    }

    // Get current page data
    getPageData() {
        const isBlogPost = document.body.classList.contains('layout-post');
        const isHomePage = window.location.pathname === '/' || window.location.pathname.includes('/index.html');

        let category = 'general';
        let author = 'NachoWeb3';
        let format = 'page';

        if (isBlogPost) {
            // Extract category from URL or meta tags
            const categoryMeta = document.querySelector('meta[name="category"]') ||
                                document.querySelector('meta[property="article:section"]');
            if (categoryMeta) {
                category = categoryMeta.content;
            }

            // Extract author
            const authorMeta = document.querySelector('meta[name="author"]');
            if (authorMeta) {
                author = authorMeta.content;
            }

            format = 'blog_post';
        } else if (isHomePage) {
            format = 'homepage';
        }

        // Calculate estimated reading time
        const textContent = document.body.textContent || '';
        const wordsPerMinute = 200;
        const wordCount = textContent.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);

        return {
            title: document.title,
            url: window.location.href,
            category: category.toLowerCase(),
            author: author,
            format: format,
            readingTime: readingTime
        };
    }

    // Get user type based on localStorage
    getUserType() {
        if (localStorage.getItem('newsletter_subscribed') === 'true') {
            return 'subscriber';
        }

        const visitCount = parseInt(localStorage.getItem('visit_count') || '0');
        if (visitCount > 5) {
            return 'returning_visitor';
        }

        return 'new_visitor';
    }

    // Get device type
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    // Set user properties
    setUserProperties() {
        gtag('config', this.config.measurementId, {
            custom_map: {
                [this.customDimensions.user_type]: this.getUserType(),
                [this.customDimensions.device_type]: this.getDeviceType(),
                [this.customDimensions.engagement_level]: this.getEngagementLevel()
            }
        });
    }

    // Calculate engagement level
    getEngagementLevel() {
        const timeOnSite = this.getTimeOnSite();
        const scrollDepth = this.getScrollDepth();

        if (timeOnSite > 300 && scrollDepth > 75) return 'high';
        if (timeOnSite > 60 && scrollDepth > 50) return 'medium';
        return 'low';
    }

    // Get time on site in seconds
    getTimeOnSite() {
        const entryTime = sessionStorage.getItem('entry_time');
        if (!entryTime) {
            sessionStorage.setItem('entry_time', Date.now());
            return 0;
        }
        return Math.floor((Date.now() - parseInt(entryTime)) / 1000);
    }

    // Get scroll depth percentage
    getScrollDepth() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.round((scrollTop / docHeight) * 100);
    }

    // Setup enhanced event tracking
    setupEventTracking() {
        if (this.config.trackClicks) {
            this.setupClickTracking();
        }

        if (this.config.trackForms) {
            this.setupFormTracking();
        }

        if (this.config.trackScroll) {
            this.setupScrollTracking();
        }

        if (this.config.trackNewsletter) {
            this.setupNewsletterTracking();
        }

        if (this.config.trackAds) {
            this.setupAdTracking();
        }
    }

    // Track clicks on important elements
    setupClickTracking() {
        // Track social media clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            // Social media links
            const socialPlatforms = ['twitter.com', 'instagram.com', 'tiktok.com', 'github.com'];
            const href = link.href || '';

            if (socialPlatforms.some(platform => href.includes(platform))) {
                const platform = socialPlatforms.find(p => href.includes(p));
                this.trackSocialMediaClick(platform, href);
            }

            // External links
            if (href.includes('http') && !href.includes(window.location.hostname)) {
                this.trackExternalLink(href, link.textContent);
            }

            // Download links
            if (link.download || href.includes('/download')) {
                this.trackDownload(href, link.textContent);
            }
        });
    }

    // Track form interactions
    setupFormTracking() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Track form starts
            form.addEventListener('focus', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    this.trackFormStart(form);
                }
            }, { once: true });

            // Track form submissions
            form.addEventListener('submit', () => {
                this.trackFormSubmit(form);
            });
        });
    }

    // Track scroll depth milestones
    setupScrollTracking() {
        let trackedMilestones = new Set();

        const trackMilestone = () => {
            const scrollDepth = this.getScrollDepth();
            const milestones = [25, 50, 75, 90, 100];

            milestones.forEach(milestone => {
                if (scrollDepth >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    this.trackScrollMilestone(milestone);
                }
            });
        };

        window.addEventListener('scroll', this.throttle(trackMilestone, 1000));
    }

    // Track newsletter interactions
    setupNewsletterTracking() {
        // Newsletter popup events
        if (typeof window.debugNewsletterAnalytics !== 'undefined') {
            // Hook into existing newsletter analytics
            const originalAnalytics = window.debugNewsletterAnalytics;
            window.debugNewsletterAnalytics = function() {
                const result = originalAnalytics();
                // Send data to GA4
                if (result && result.summary) {
                    gtag('event', 'newsletter_analytics', {
                        custom_parameters: result.summary
                    });
                }
                return result;
            };
        }

        // Track newsletter clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href.includes('newsletter')) {
                this.trackNewsletterClick('link_click', link.href);
            }
        });
    }

    // Track ad interactions
    setupAdTracking() {
        // Track ad impressions (simplified)
        document.addEventListener('DOMContentLoaded', () => {
            const ads = document.querySelectorAll('ins.adsbygoogle');
            ads.forEach((ad, index) => {
                this.trackAdImpression(index, ad);
            });
        });

        // Track ad clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('ins.adsbygoogle')) {
                this.trackAdClick(e.target.closest('ins.adsbygoogle'));
            }
        });
    }

    // Setup enhanced measurements
    setupEnhancedMeasurements() {
        // Track visit count
        const visitCount = parseInt(localStorage.getItem('visit_count') || '0');
        localStorage.setItem('visit_count', visitCount + 1);

        // Track session duration
        window.addEventListener('beforeunload', () => {
            const duration = this.getTimeOnSite();
            this.trackSessionEnd(duration);
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackPageHide();
            } else {
                this.trackPageShow();
            }
        });
    }

    // Event tracking methods
    trackSocialMediaClick(platform, url) {
        gtag('event', 'social_media_click', {
            platform: platform,
            url: url,
            content_category: this.getPageData().category
        });
    }

    trackExternalLink(url, text) {
        gtag('event', 'external_link_click', {
            url: url,
            link_text: text.trim(),
            content_category: this.getPageData().category
        });
    }

    trackDownload(url, filename) {
        gtag('event', 'download', {
            url: url,
            filename: filename.trim(),
            content_category: this.getPageData().category
        });
    }

    trackFormStart(form) {
        const formType = this.getFormType(form);
        gtag('event', 'form_start', {
            form_type: formType,
            content_category: this.getPageData().category
        });
    }

    trackFormSubmit(form) {
        const formType = this.getFormType(form);
        gtag('event', 'form_submit', {
            form_type: formType,
            content_category: this.getPageData().category
        });
    }

    trackFormType(form) {
        if (form.action.includes('formsubmit.co')) return 'newsletter';
        if (form.action.includes('contact')) return 'contact';
        return 'unknown';
    }

    trackScrollMilestone(depth) {
        gtag('event', 'scroll', {
            percent_scrolled: depth,
            content_category: this.getPageData().category,
            time_on_page: this.getTimeOnSite()
        });
    }

    trackNewsletterClick(action, url) {
        gtag('event', 'newsletter_interaction', {
            action: action,
            url: url,
            content_category: this.getPageData().category,
            user_type: this.getUserType()
        });
    }

    trackAdImpression(index, adElement) {
        gtag('event', 'ad_impression', {
            ad_position: index,
            ad_type: 'display_adsense',
            content_category: this.getPageData().category
        });
    }

    trackAdClick(adElement) {
        gtag('event', 'ad_click', {
            ad_type: 'display_adsense',
            content_category: this.getPageData().category
        });
    }

    trackSessionEnd(duration) {
        gtag('event', 'session_end', {
            session_duration: duration,
            engagement_level: this.getEngagementLevel(),
            pages_viewed: this.getPagesViewed()
        });
    }

    trackPageHide() {
        gtag('event', 'page_hide', {
            time_on_page: this.getTimeOnSite(),
            scroll_depth: this.getScrollDepth()
        });
    }

    trackPageShow() {
        gtag('event', 'page_show');
    }

    // Utility methods
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

    getPagesViewed() {
        return parseInt(sessionStorage.getItem('pages_viewed') || '1');
    }

    // Public API methods
    trackCustomEvent(eventName, parameters = {}) {
        gtag('event', eventName, {
            ...parameters,
            content_category: this.getPageData().category,
            user_type: this.getUserType(),
            device_type: this.getDeviceType()
        });
    }

    // Track crypto-specific events
    trackCryptoEvent(event, data) {
        this.trackCustomEvent('crypto_interaction', {
            crypto_event_type: event,
            crypto_ticker: data.ticker || '',
            crypto_category: data.category || '',
            ...data
        });
    }

    // Track AI-specific events
    trackAIEvent(event, data) {
        this.trackCustomEvent('ai_interaction', {
            ai_event_type: event,
            ai_tool: data.tool || '',
            ai_category: data.category || '',
            ...data
        });
    }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Store site config for analytics
    window.siteConfig = {
        google_analytics_id: 'G-XXXXXXXXXX' // Will be updated by Jekyll
    };

    // Initialize enhanced analytics
    window.nachoAnalytics = new NachoWeb3Analytics();

    // Make analytics available globally
    window.trackCustomEvent = (eventName, params) => {
        window.nachoAnalytics.trackCustomEvent(eventName, params);
    };

    window.trackCryptoEvent = (event, data) => {
        window.nachoAnalytics.trackCryptoEvent(event, data);
    };

    window.trackAIEvent = (event, data) => {
        window.nachoAnalytics.trackAIEvent(event, data);
    };

    console.log('📊 Enhanced Google Analytics 4 loaded');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NachoWeb3Analytics;
}