/**
 * Advanced A/B Testing Framework for NachoWeb3 Blog
 *
 * This framework provides comprehensive A/B testing capabilities:
 * - Multiple test types (headlines, CTAs, layouts, colors)
 * - Statistical significance calculation
 * - Conversion tracking
 * - Heatmap integration
 * - User segmentation
 * - Real-time results
 */

class ABTestingFramework {
    constructor(options = {}) {
        this.config = {
            // Test configuration
            enableTesting: options.enableTesting !== false,
            testMode: options.testMode || 'production', // 'development', 'staging', 'production'
            trafficSplit: options.trafficSplit || 50, // Percentage of users in test group
            significanceLevel: options.significanceLevel || 0.05, // 5%
            minimumSampleSize: options.minimumSampleSize || 100,

            // Storage
            storageKey: options.storageKey || 'ab_test_data',
            resultStorageKey: options.resultStorageKey || 'ab_test_results',

            // Analytics integration
            enableAnalytics: options.enableAnalytics !== false,
            analyticsProvider: options.analyticsProvider || 'google', // 'google', 'custom'

            // Security
            enableSecurity: options.enableSecurity !== false,
            allowAdminOverride: options.allowAdminOverride || false,

            // Advanced features
            enableHeatmap: options.enableHeatmap !== false,
            enableSessionRecording: options.enableSessionRecording !== false,
            enableUserSegmentation: options.enableUserSegmentation !== false,

            ...options
        };

        // Test data
        this.tests = new Map();
        this.userVariants = new Map();
        this.conversions = new Map();
        this.sessionData = {
            startTime: Date.now(),
            pageViews: 0,
            interactions: []
        };

        this.init();
    }

    init() {
        console.log('🧪 A/B Testing Framework initializing...');

        // Load existing test data
        this.loadTestData();

        // Determine user group
        this.determineUserGroup();

        // Setup analytics integration
        if (this.config.enableAnalytics) {
            this.setupAnalyticsIntegration();
        }

        // Setup user interaction tracking
        this.setupInteractionTracking();

        // Setup heatmap tracking
        if (this.config.enableHeatmap) {
            this.setupHeatmapTracking();
        }

        // Load active tests
        this.loadActiveTests();

        // Apply variants
        this.applyVariants();

        // Setup periodic sync
        this.setupPeriodicSync();

        console.log('✅ A/B Testing Framework initialized');
    }

    // Test management
    createTest(testConfig) {
        const test = {
            id: testConfig.id || this.generateTestId(),
            name: testConfig.name,
            description: testConfig.description,
            type: testConfig.type, // 'headline', 'cta', 'layout', 'color', 'content'
            status: testConfig.status || 'active', // 'draft', 'active', 'paused', 'completed'
            variants: testConfig.variants || [],
            control: testConfig.control || testConfig.variants[0],
            trafficAllocation: testConfig.trafficAllocation || 50,
            startDate: testConfig.startDate || new Date().toISOString(),
            endDate: testConfig.endDate || this.getDefaultEndDate(),
            targetElements: testConfig.targetElements || [],
            conversionGoals: testConfig.conversionGoals || [],
            userSegments: testConfig.userSegments || [],
            successMetrics: testConfig.successMetrics || ['conversion_rate'],
            significanceLevel: testConfig.significanceLevel || this.config.significanceLevel,
            minimumSampleSize: testConfig.minimumSampleSize || this.config.minimumSampleSize,
            metadata: testConfig.metadata || {}
        };

        // Validate test configuration
        this.validateTest(test);

        // Store test
        this.tests.set(test.id, test);

        // Save to storage
        this.saveTestData();

        console.log('🧪 Test created:', test.id, test.name);
        return test;
    }

    validateTest(test) {
        if (!test.name) {
            throw new Error('Test must have a name');
        }

        if (!test.variants || test.variants.length < 2) {
            throw new Error('Test must have at least 2 variants');
        }

        if (!test.type) {
            throw new Error('Test must specify a type');
        }

        // Validate variant structure
        test.variants.forEach((variant, index) => {
            if (!variant.id) {
                variant.id = `${test.id}_variant_${index}`;
            }

            if (!variant.name) {
                variant.name = `Variant ${index + 1}`;
            }

            if (!variant.changes) {
                throw new Error(`Variant ${variant.id} must specify changes`);
            }
        });

        // Validate dates
        const startDate = new Date(test.startDate);
        const endDate = new Date(test.endDate);

        if (endDate <= startDate) {
            throw new Error('End date must be after start date');
        }

        return true;
    }

    generateTestId() {
        return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getDefaultEndDate() {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30); // Default 30 days
        return endDate.toISOString();
    }

    // User group determination
    determineUserGroup() {
        const userId = this.getUserId();
        const userGroup = this.getUserGroup(userId);

        this.sessionData.userGroup = userGroup;
        this.sessionData.userId = userId;

        console.log('👤 User group determined:', userGroup, 'for user:', userId);
    }

    getUserId() {
        let userId = localStorage.getItem('ab_test_user_id');

        if (!userId) {
            userId = this.generateUserId();
            localStorage.setItem('ab_test_user_id', userId);
        }

        return userId;
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUserGroup(userId) {
        // Use consistent hashing for group assignment
        const hash = this.hashCode(userId);
        const group = hash % 100;

        return group < this.config.trafficSplit ? 'test' : 'control';
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // Variant assignment
    assignVariant(testId) {
        const test = this.tests.get(testId);
        if (!test) {
            console.warn('Test not found:', testId);
            return null;
        }

        // Check if user should be in this test
        if (!this.shouldIncludeUser(test)) {
            return null;
        }

        // Check if already assigned
        if (this.userVariants.has(testId)) {
            return this.userVariants.get(testId);
        }

        // Assign variant
        const variantIndex = this.selectVariant(test);
        const variant = test.variants[variantIndex];

        // Store assignment
        this.userVariants.set(testId, {
            testId,
            variantId: variant.id,
            variantIndex,
            assignedAt: Date.now()
        });

        // Save to storage
        this.saveTestData();

        // Track assignment
        this.trackVariantAssignment(testId, variant);

        return variant;
    }

    shouldIncludeUser(test) {
        // Check if test is active
        const now = new Date();
        const startDate = new Date(test.startDate);
        const endDate = new Date(test.endDate);

        if (now < startDate || now > endDate) {
            return false;
        }

        // Check user segments
        if (test.userSegments && test.userSegments.length > 0) {
            return this.userInSegments(test.userSegments);
        }

        // Check if user is in test group
        if (this.sessionData.userGroup !== 'test') {
            return false;
        }

        // Check traffic allocation
        const random = Math.random() * 100;
        return random < test.trafficAllocation;
    }

    userInSegments(segments) {
        // This would be implemented based on your user segmentation logic
        // For now, return true for all users
        return true;
    }

    selectVariant(test) {
        // Simple random selection for now
        // Could implement weighted selection or more sophisticated algorithms
        return Math.floor(Math.random() * test.variants.length);
    }

    // Apply variants to the page
    applyVariants() {
        this.tests.forEach((test, testId) => {
            if (test.status === 'active') {
                const variant = this.assignVariant(testId);
                if (variant) {
                    this.applyVariant(test, variant);
                }
            }
        });
    }

    applyVariant(test, variant) {
        console.log('🎨 Applying variant:', variant.id, 'for test:', test.id);

        switch (test.type) {
            case 'headline':
                this.applyHeadlineVariant(test, variant);
                break;
            case 'cta':
                this.applyCTAVariant(test, variant);
                break;
            case 'layout':
                this.applyLayoutVariant(test, variant);
                break;
            case 'color':
                this.applyColorVariant(test, variant);
                break;
            case 'content':
                this.applyContentVariant(test, variant);
                break;
            default:
                console.warn('Unknown test type:', test.type);
        }

        // Add variant class to body for styling
        document.body.classList.add(`ab-test-${test.id}`);
        document.body.classList.add(`ab-variant-${variant.id}`);
    }

    applyHeadlineVariant(test, variant) {
        variant.changes.forEach(change => {
            const element = document.querySelector(change.selector);
            if (element) {
                if (change.text) element.textContent = change.text;
                if (change.html) element.innerHTML = change.html;
                if (change.attribute) {
                    element.setAttribute(change.attribute.name, change.attribute.value);
                }
            }
        });
    }

    applyCTAVariant(test, variant) {
        variant.changes.forEach(change => {
            const elements = document.querySelectorAll(change.selector);
            elements.forEach(element => {
                if (change.text) element.textContent = change.text;
                if (change.href) element.href = change.href;
                if (change.class) element.className = change.class;
                if (change.style) {
                    Object.assign(element.style, change.style);
                }
            });
        });
    }

    applyLayoutVariant(test, variant) {
        variant.changes.forEach(change => {
            if (change.css) {
                this.injectCSS(`.ab-variant-${variant.id} ${change.css}`);
            }
            if (change.html) {
                const element = document.querySelector(change.selector);
                if (element) {
                    element.innerHTML = change.html;
                }
            }
            if (change.reorder) {
                this.reorderElements(change.reorder);
            }
        });
    }

    applyColorVariant(test, variant) {
        this.injectCSS(`
            .ab-variant-${variant.id} ${variant.changes.css}
        `);
    }

    applyContentVariant(test, variant) {
        variant.changes.forEach(change => {
            const element = document.querySelector(change.selector);
            if (element) {
                if (change.content) element.innerHTML = change.content;
                if (change.append) element.insertAdjacentHTML('beforeend', change.append);
                if (change.prepend) element.insertAdjacentHTML('afterbegin', change.prepend);
            }
        });
    }

    // Conversion tracking
    trackConversion(testId, conversionType, value = 1) {
        const userVariant = this.userVariants.get(testId);
        if (!userVariant) {
            console.warn('No variant assignment found for test:', testId);
            return false;
        }

        const conversion = {
            testId,
            variantId: userVariant.variantId,
            variantIndex: userVariant.variantIndex,
            conversionType,
            value,
            timestamp: Date.now(),
            sessionId: this.sessionData.startTime,
            userId: this.sessionData.userId,
            pageUrl: window.location.href,
            userAgent: navigator.userAgent
        };

        // Store conversion
        if (!this.conversions.has(testId)) {
            this.conversions.set(testId, []);
        }
        this.conversions.get(testId).push(conversion);

        // Save to storage
        this.saveTestData();

        // Track in analytics
        this.trackAnalyticsConversion(conversion);

        console.log('🎯 Conversion tracked:', conversion);
        return true;
    }

    // Analytics integration
    setupAnalyticsIntegration() {
        // Integration with Google Analytics
        if (typeof gtag !== 'undefined') {
            this.gtagIntegration();
        }

        // Custom analytics integration
        this.customAnalyticsIntegration();
    }

    gtagIntegration() {
        // Track test participation
        this.userVariants.forEach((assignment, testId) => {
            gtag('event', 'ab_test_participation', {
                test_id: testId,
                variant_id: assignment.variantId,
                custom_parameter_1: 'ab_testing'
            });
        });

        // Track conversions
        this.conversions.forEach((conversions, testId) => {
            conversions.forEach(conversion => {
                gtag('event', 'ab_test_conversion', {
                    test_id: testId,
                    variant_id: conversion.variantId,
                    conversion_type: conversion.conversionType,
                    value: conversion.value,
                    custom_parameter_1: 'ab_testing'
                });
            });
        });
    }

    customAnalyticsIntegration() {
        // Implementation for custom analytics
        console.log('📊 Custom analytics integration enabled');
    }

    trackAnalyticsConversion(conversion) {
        if (this.config.enableAnalytics && typeof gtag !== 'undefined') {
            gtag('event', 'ab_test_conversion', {
                test_id: conversion.testId,
                variant_id: conversion.variantId,
                conversion_type: conversion.conversionType,
                value: conversion.value
            });
        }
    }

    // Statistical analysis
    calculateSignificance(testId) {
        const test = this.tests.get(testId);
        const conversions = this.conversions.get(testId) || [];

        if (conversions.length < test.minimumSampleSize) {
            return {
                significant: false,
                reason: 'Insufficient sample size',
                sampleSize: conversions.length,
                requiredSampleSize: test.minimumSampleSize
            };
        }

        // Group conversions by variant
        const variantStats = {};
        test.variants.forEach(variant => {
            variantStats[variant.id] = {
                conversions: 0,
                participants: 0
            };
        });

        // Count participants and conversions
        this.userVariants.forEach((assignment, testAssignmentId) => {
            if (testAssignmentId === testId) {
                variantStats[assignment.variantId].participants++;
            }
        });

        conversions.forEach(conversion => {
            variantStats[conversion.variantId].conversions += conversion.value;
        });

        // Calculate statistical significance (simplified chi-square test)
        return this.calculateChiSquare(variantStats, test);
    }

    calculateChiSquare(variantStats, test) {
        const variants = Object.values(variantStats);
        const totalConversions = variants.reduce((sum, v) => sum + v.conversions, 0);
        const totalParticipants = variants.reduce((sum, v) => sum + v.participants, 0);

        if (totalParticipants === 0) {
            return { significant: false, reason: 'No participants' };
        }

        // Calculate expected values
        const expectedConversionRate = totalConversions / totalParticipants;
        let chiSquare = 0;

        variants.forEach(variant => {
            const expected = variant.participants * expectedConversionRate;
            const observed = variant.conversions;

            if (expected > 0) {
                chiSquare += Math.pow(observed - expected, 2) / expected;
            }
        });

        // Degrees of freedom
        const df = variants.length - 1;

        // Critical value for chi-square (simplified)
        const criticalValue = this.getCriticalChiSquare(df, test.significanceLevel);

        return {
            significant: chiSquare > criticalValue,
            chiSquare: chiSquare,
            criticalValue: criticalValue,
            degreesOfFreedom: df,
            significanceLevel: test.significanceLevel,
            variantStats: variantStats,
            totalConversions,
            totalParticipants
        };
    }

    getCriticalChiSquare(df, significanceLevel) {
        // Simplified critical values for common significance levels
        const criticalValues = {
            1: {
                0.05: 3.841,
                0.01: 6.635
            },
            2: {
                0.05: 5.991,
                0.01: 9.210
            },
            3: {
                0.05: 7.815,
                0.01: 11.345
            }
        };

        return criticalValues[df]?.[significanceLevel] || 5.991;
    }

    // Heatmap tracking
    setupHeatmapTracking() {
        const heatmapData = [];

        document.addEventListener('click', (e) => {
            heatmapData.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                type: 'click',
                target: e.target.tagName.toLowerCase(),
                url: window.location.href
            });
        });

        document.addEventListener('mousemove', this.throttle((e) => {
            heatmapData.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                type: 'move',
                url: window.location.href
            });
        }, 100));

        // Save heatmap data periodically
        setInterval(() => {
            if (heatmapData.length > 0) {
                this.saveHeatmapData(heatmapData.splice(0, heatmapData.length));
            }
        }, 10000);
    }

    saveHeatmapData(data) {
        const existingData = JSON.parse(localStorage.getItem('heatmap_data') || '[]');
        existingData.push(...data);
        localStorage.setItem('heatmap_data', JSON.stringify(existingData.slice(-10000))); // Keep last 10k events
    }

    // Interaction tracking
    setupInteractionTracking() {
        // Track page views
        this.sessionData.pageViews++;

        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', this.throttle(() => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
        }, 100));

        // Track time on page
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            this.sessionData.timeOnPage = Date.now() - startTime;
            this.sessionData.maxScrollDepth = maxScrollDepth;
            this.saveSessionData();
        });
    }

    // Data persistence
    saveTestData() {
        const data = {
            tests: Array.from(this.tests.entries()),
            userVariants: Array.from(this.userVariants.entries()),
            conversions: Array.from(this.conversions.entries()),
            timestamp: Date.now()
        };

        localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    }

    loadTestData() {
        const data = localStorage.getItem(this.config.storageKey);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.tests = new Map(parsed.tests || []);
                this.userVariants = new Map(parsed.userVariants || []);
                this.conversions = new Map(parsed.conversions || []);
            } catch (error) {
                console.error('Error loading test data:', error);
            }
        }
    }

    saveSessionData() {
        sessionStorage.setItem('ab_session_data', JSON.stringify(this.sessionData));
    }

    // Periodic sync with server
    setupPeriodicSync() {
        setInterval(() => {
            this.syncWithServer();
        }, 60000); // Sync every minute
    }

    syncWithServer() {
        // Implementation would depend on your backend
        console.log('🔄 Syncing test data with server...');
    }

    // Utility functions
    injectCSS(css) {
        const style = document.createElement('style');
        style.textContent = css;
        style.setAttribute('data-ab-test', 'true');
        document.head.appendChild(style);
    }

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

    // Public API
    trackEvent(eventName, properties = {}) {
        this.sessionData.interactions.push({
            eventName,
            properties,
            timestamp: Date.now()
        });
    }

    getTestResults(testId) {
        const test = this.tests.get(testId);
        if (!test) {
            return null;
        }

        const significance = this.calculateSignificance(testId);
        const conversions = this.conversions.get(testId) || [];

        return {
            test,
            significance,
            conversions,
            variantAssignments: Array.from(this.userVariants.entries())
                .filter(([id]) => id === testId)
                .length
        };
    }

    getAllTestResults() {
        const results = {};
        this.tests.forEach((test, testId) => {
            results[testId] = this.getTestResults(testId);
        });
        return results;
    }

    endTest(testId, winner = null) {
        const test = this.tests.get(testId);
        if (test) {
            test.status = 'completed';
            test.endDate = new Date().toISOString();
            test.winner = winner;
            this.saveTestData();
        }
    }
}

// Initialize A/B testing framework
document.addEventListener('DOMContentLoaded', () => {
    // Check if A/B testing should be enabled
    const shouldEnableABTesting = window.location.search.includes('ab_test=true') ||
                                  window.location.hostname === 'localhost' ||
                                  Math.random() < 0.1; // 10% of users

    if (shouldEnableABTesting) {
        window.abTesting = new ABTestingFramework({
            enableTesting: true,
            testMode: 'production',
            trafficSplit: 50,
            enableAnalytics: true,
            enableHeatmap: true
        });

        // Example: Create a newsletter CTA test
        if (window.location.pathname === '/blog/newsletter/') {
            window.abTesting.createTest({
                id: 'newsletter_cta_test',
                name: 'Newsletter CTA Button Color Test',
                description: 'Test different CTA button colors to improve conversion rate',
                type: 'cta',
                variants: [
                    {
                        id: 'control_blue',
                        name: 'Blue Button (Control)',
                        changes: [{
                            selector: '.subscribe-btn, .pricing-btn.primary',
                            style: {
                                background: '#007bff',
                                borderColor: '#007bff'
                            }
                        }]
                    },
                    {
                        id: 'variant_purple',
                        name: 'Purple Button (Matrix Theme)',
                        changes: [{
                            selector: '.subscribe-btn, .pricing-btn.primary',
                            style: {
                                background: 'linear-gradient(135deg, #8a2be2, #764ba2)',
                                borderColor: '#8a2be2'
                            }
                        }]
                    },
                    {
                        id: 'variant_green',
                        name: 'Green Button',
                        changes: [{
                            selector: '.subscribe-btn, .pricing-btn.primary',
                            style: {
                                background: '#28a745',
                                borderColor: '#28a745'
                            }
                        }]
                    }
                ],
                conversionGoals: ['newsletter_signup', 'pricing_click'],
                trafficAllocation: 100
            });
        }

        // Track newsletter signups
        const newsletterForm = document.querySelector('#main-subscription-form, .newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', () => {
                window.abTesting.trackConversion('newsletter_cta_test', 'newsletter_signup');
            });
        }

        console.log('🧪 A/B Testing Framework loaded');
    } else {
        console.log('A/B Testing disabled for this session');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ABTestingFramework;
}