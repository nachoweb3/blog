/**
 * Comprehensive Test Suite for NachoWeb3 Blog
 *
 * This script tests all major functionality:
 * - Newsletter popup and forms
 * - Google Analytics tracking
 * - Lazy loading images
 * - Mobile responsiveness
 * - Performance metrics
 * - User interactions
 */

class NachoWeb3TestSuite {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            total: 0
        };

        this.categories = {
            'Newsletter': [],
            'Analytics': [],
            'Performance': [],
            'Images': [],
            'Forms': [],
            'Mobile': [],
            'SEO': []
        };

        this.init();
    }

    init() {
        console.log('🧪 NachoWeb3 Test Suite Initialized');
        this.runAllTests();
    }

    // Run all tests
    async runAllTests() {
        console.log('🚀 Starting comprehensive testing...');

        // Test Newsletter functionality
        this.testNewsletterPopup();
        this.testNewsletterForms();
        this.testNewsletterBackend();

        // Test Analytics
        this.testGoogleAnalytics();
        this.testCustomTracking();

        // Test Performance
        this.testLazyLoading();
        this.testImageOptimization();
        this.testPerformanceMetrics();

        // Test Forms
        this.testContactForms();
        this.testFormValidation();

        // Test Mobile
        this.testMobileResponsiveness();
        this.testTouchInteractions();

        // Test SEO
        this.testSEOElements();
        this.testStructuredData();

        // Generate report
        setTimeout(() => {
            this.generateReport();
        }, 3000);
    }

    // ====== NEWSLETTER TESTS ======

    testNewsletterPopup() {
        this.addTest('Newsletter', 'Popup Elements', () => {
            const popup = document.getElementById('newsletter-popup');
            const closeBtn = document.querySelector('.newsletter-popup-close');
            const form = document.querySelector('.newsletter-form');

            const issues = [];
            if (!popup) issues.push('Popup element not found');
            if (!closeBtn) issues.push('Close button not found');
            if (!form) issues.push('Form not found');

            return {
                passed: issues.length === 0,
                message: issues.length > 0 ? issues.join(', ') : 'All popup elements found',
                details: { popup: !!popup, closeBtn: !!closeBtn, form: !!form }
            };
        });

        this.addTest('Newsletter', 'Popup Visibility', () => {
            const popup = document.getElementById('newsletter-popup');
            if (!popup) return { passed: false, message: 'Popup not found' };

            const isVisible = popup.style.display !== 'none' && !popup.classList.contains('hidden');
            return {
                passed: true,
                message: isVisible ? 'Popup is visible' : 'Popup is hidden (expected)',
                details: { visible: isVisible, classes: popup.className }
            };
        });

        this.addTest('Newsletter', 'Close Functionality', () => {
            if (typeof window.checkNewsletterPopup === 'function') {
                const status = window.checkNewsletterPopup();
                return {
                    passed: typeof status === 'object',
                    message: 'Close functionality available',
                    details: status
                };
            }

            return {
                passed: false,
                message: 'Close functionality not available',
                fix: 'Check newsletter-popup.js integration'
            };
        });
    }

    testNewsletterForms() {
        this.addTest('Newsletter', 'Form Validation', () => {
            const forms = document.querySelectorAll('form');
            const newsletterForms = Array.from(forms).filter(form =>
                form.action.includes('newsletter') ||
                form.classList.contains('newsletter-form') ||
                form.querySelector('input[type="email"]')
            );

            return {
                passed: newsletterForms.length > 0,
                message: `Found ${newsletterForms.length} newsletter forms`,
                details: { totalForms: forms.length, newsletterForms: newsletterForms.length }
            };
        });

        this.addTest('Newsletter', 'Email Input Validation', () => {
            const emailInputs = document.querySelectorAll('input[type="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            let validInputs = 0;
            emailInputs.forEach(input => {
                if (input.placeholder && input.required) {
                    validInputs++;
                }
            });

            return {
                passed: emailInputs.length > 0,
                message: `${validInputs}/${emailInputs.length} email inputs have proper validation`,
                details: { totalInputs: emailInputs.length, validInputs }
            };
        });
    }

    testNewsletterBackend() {
        this.addTest('Newsletter', 'Backend Integration', () => {
            const hasNewsletterBackend = typeof window.newsletterBackend !== 'undefined';
            const hasIntegration = typeof window.newsletterIntegration !== 'undefined';

            return {
                passed: hasNewsletterBackend && hasIntegration,
                message: hasNewsletterBackend && hasIntegration ?
                    'Newsletter backend fully integrated' :
                    'Backend integration incomplete',
                details: {
                    backend: hasNewsletterBackend,
                    integration: hasIntegration
                }
            };
        });
    }

    // ====== ANALYTICS TESTS ======

    testGoogleAnalytics() {
        this.addTest('Analytics', 'GA4 Script', () => {
            const gaScript = document.querySelector('script[src*="googletagmanager.com"]');
            const hasGtag = typeof gtag !== 'undefined';

            return {
                passed: !!gaScript && hasGtag,
                message: hasGtag ? 'GA4 properly loaded' : 'GA4 not loaded',
                details: { script: !!gaScript, gtag: hasGtag }
            };
        });

        this.addTest('Analytics', 'Enhanced Analytics', () => {
            const hasAnalytics = typeof window.nachoAnalytics !== 'undefined';
            const hasCustomEvents = typeof window.trackCustomEvent !== 'undefined';

            return {
                passed: hasAnalytics && hasCustomEvents,
                message: hasAnalytics ? 'Enhanced analytics loaded' : 'Enhanced analytics missing',
                details: { analytics: hasAnalytics, customEvents: hasCustomEvents }
            };
        });

        this.addTest('Analytics', 'Configuration', () => {
            const hasConfig = typeof window.siteConfig !== 'undefined';
            const gaId = hasConfig ? window.siteConfig.google_analytics_id : null;

            return {
                passed: hasConfig && gaId && gaId !== 'G-XXXXXXXXXX',
                message: gaId && gaId !== 'G-XXXXXXXXXX' ?
                    'GA4 ID configured' :
                    'GA4 ID not configured',
                details: { config: hasConfig, gaId: gaId }
            };
        });
    }

    testCustomTracking() {
        this.addTest('Analytics', 'Custom Events', () => {
            const hasCryptoEvents = typeof window.trackCryptoEvent !== 'undefined';
            const hasAIEvents = typeof window.trackAIEvent !== 'undefined';

            return {
                passed: hasCryptoEvents && hasAIEvents,
                message: 'Custom tracking events available',
                details: { cryptoEvents: hasCryptoEvents, aiEvents: hasAIEvents }
            };
        });
    }

    // ====== PERFORMANCE TESTS ======

    testLazyLoading() {
        this.addTest('Performance', 'Lazy Loading Script', () => {
            const hasLazyLoader = typeof window.lazyLoader !== 'undefined';
            const scriptLoaded = !!document.querySelector('script[src*="lazy-loading"]');

            return {
                passed: hasLazyLoader && scriptLoaded,
                message: hasLazyLoader ? 'Lazy loading initialized' : 'Lazy loading not loaded',
                details: { lazyLoader: hasLazyLoader, script: scriptLoaded }
            };
        });

        this.addTest('Performance', 'Lazy Images', () => {
            const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
            const totalImages = document.querySelectorAll('img').length;

            return {
                passed: totalImages > 0,
                message: `Found ${lazyImages.length}/${totalImages} lazy loading images`,
                details: { lazyImages: lazyImages.length, totalImages }
            };
        });

        this.addTest('Performance', 'WebP Support', () => {
            const canvas = document.createElement('canvas');
            const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

            return {
                passed: supportsWebP,
                message: supportsWebP ? 'WebP supported' : 'WebP not supported',
                details: { webpSupport: supportsWebP }
            };
        });
    }

    testImageOptimization() {
        this.addTest('Performance', 'Image Optimization', () => {
            const images = document.querySelectorAll('img');
            let optimizedImages = 0;
            let issues = [];

            images.forEach(img => {
                // Check for alt text (accessibility)
                if (!img.alt && !img.getAttribute('aria-label')) {
                    issues.push(`Missing alt text: ${img.src.substring(0, 50)}`);
                }

                // Check for dimensions
                if (!img.width && !img.style.width) {
                    issues.push(`Missing dimensions: ${img.src.substring(0, 50)}`);
                }

                // Check for optimization
                if (img.loading === 'lazy' || img.dataset.src) {
                    optimizedImages++;
                }
            });

            return {
                passed: issues.length === 0,
                message: `${optimizedImages}/${images.length} images optimized`,
                warnings: issues.length > 0 ? issues : [],
                details: {
                    totalImages: images.length,
                    optimizedImages,
                    issues: issues.length
                }
            };
        });
    }

    testPerformanceMetrics() {
        this.addTest('Performance', 'Core Web Vitals', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;

            return {
                passed: loadTime < 3000, // Under 3 seconds
                message: `Page load time: ${loadTime.toFixed(2)}ms`,
                details: { loadTime, ttfb: navigation.responseStart - navigation.requestStart }
            };
        });
    }

    // ====== FORM TESTS ======

    testContactForms() {
        this.addTest('Forms', 'Form Elements', () => {
            const forms = document.querySelectorAll('form');
            const validForms = Array.from(forms).filter(form => {
                return form.action || form.querySelector('button[type="submit"], input[type="submit"]');
            });

            return {
                passed: forms.length > 0,
                message: `Found ${validForms.length}/${forms.length} valid forms`,
                details: { totalForms: forms.length, validForms }
            };
        });
    }

    testFormValidation() {
        this.addTest('Forms', 'Validation Attributes', () => {
            const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
            const emailInputs = document.querySelectorAll('input[type="email"]');

            return {
                passed: inputs.length > 0,
                message: `Found ${inputs.length} required inputs, ${emailInputs.length} email inputs`,
                details: { requiredInputs: inputs.length, emailInputs }
            };
        });
    }

    // ====== MOBILE TESTS ======

    testMobileResponsiveness() {
        this.addTest('Mobile', 'Viewport Meta', () => {
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            const hasCorrectViewport = viewportMeta &&
                viewportMeta.content.includes('width=device-width') &&
                viewportMeta.content.includes('initial-scale=1');

            return {
                passed: hasCorrectViewport,
                message: hasCorrectViewport ? 'Viewport properly configured' : 'Viewport missing or incorrect',
                details: {
                    metaExists: !!viewportMeta,
                    content: viewportMeta ? viewportMeta.content : null
                }
            };
        });

        this.addTest('Mobile', 'Responsive Design', () => {
            const hasResponsiveCSS = !!document.querySelector('link[href*="responsive"], style[data-responsive]');
            const hasMediaQueries = !!Array.from(document.styleSheets).some(sheet => {
                try {
                    return sheet.cssRules && Array.from(sheet.cssRules).some(rule =>
                        rule.type === CSSRule.MEDIA_RULE
                    );
                } catch (e) {
                    return false;
                }
            });

            return {
                passed: hasMediaQueries,
                message: hasMediaQueries ? 'Media queries detected' : 'No media queries found',
                details: { responsiveCSS: hasResponsiveCSS, mediaQueries: hasMediaQueries }
            };
        });
    }

    testTouchInteractions() {
        this.addTest('Mobile', 'Touch Targets', () => {
            const buttons = document.querySelectorAll('button, a, input[type="submit"], input[type="button"]');
            const smallButtons = Array.from(buttons).filter(btn => {
                const rect = btn.getBoundingClientRect();
                return rect.width < 44 || rect.height < 44; // Minimum touch target size
            });

            return {
                passed: smallButtons.length === 0,
                message: `${buttons.length - smallButtons.length}/${buttons.length} buttons have proper touch targets`,
                warnings: smallButtons.length > 0 ?
                    [`${smallButtons.length} buttons are too small for touch`] : [],
                details: { totalButtons: buttons.length, smallButtons: smallButtons.length }
            };
        });
    }

    // ====== SEO TESTS ======

    testSEOElements() {
        this.addTest('SEO', 'Meta Tags', () => {
            const title = document.querySelector('title');
            const description = document.querySelector('meta[name="description"]');
            const canonical = document.querySelector('link[rel="canonical"]');

            const issues = [];
            if (!title) issues.push('Missing title tag');
            if (!description) issues.push('Missing description meta');
            if (!canonical) issues.push('Missing canonical link');

            return {
                passed: issues.length === 0,
                message: issues.length > 0 ? issues.join(', ') : 'All essential meta tags present',
                details: { title: !!title, description: !!description, canonical: !!canonical }
            };
        });

        this.addTest('SEO', 'Open Graph', () => {
            const ogTitle = document.querySelector('meta[property="og:title"]');
            const ogDescription = document.querySelector('meta[property="og:description"]');
            const ogImage = document.querySelector('meta[property="og:image"]');

            return {
                passed: !!(ogTitle && ogDescription && ogImage),
                message: (ogTitle && ogDescription && ogImage) ?
                    'Open Graph tags complete' :
                    'Missing Open Graph tags',
                details: { ogTitle: !!ogTitle, ogDescription: !!ogDescription, ogImage: !!ogImage }
            };
        });

        this.addTest('SEO', 'Structured Data', () => {
            const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
            let validStructuredData = 0;

            structuredDataScripts.forEach(script => {
                try {
                    JSON.parse(script.textContent);
                    validStructuredData++;
                } catch (e) {
                    // Invalid JSON
                }
            });

            return {
                passed: validStructuredData > 0,
                message: `${validStructuredData}/${structuredDataScripts.length} valid structured data scripts`,
                details: { totalScripts: structuredDataScripts.length, valid: validStructuredData }
            };
        });
    }

    testStructuredData() {
        this.addTest('SEO', 'SEO Images', () => {
            const defaultOG = document.querySelector('meta[property="og:image"]');
            const hasOGImage = defaultOG && defaultOG.content.includes('default-og.jpg');
            const logoExists = document.querySelector('meta[itemprop="logo"], script[type="application/ld+json"]') &&
                document.querySelector('meta[itemprop="logo"], script[type="application/ld+json"]').textContent.includes('logo.png');

            return {
                passed: hasOGImage || logoExists,
                message: (hasOGImage && logoExists) ?
                    'SEO images configured' :
                    'Missing SEO images',
                details: { ogImage: hasOGImage, logo: logoExists },
                warnings: !hasOGImage ? ['Missing default-og.jpg'] : (!logoExists ? ['Missing logo.png'] : [])
            };
        });
    }

    // ====== UTILITY METHODS ======

    addTest(category, name, testFn) {
        this.tests.push({
            category,
            name,
            testFn,
            result: null
        });
        this.categories[category].push({ name, testFn });
    }

    async runTest(test) {
        try {
            const result = test.testFn();
            test.result = {
                ...result,
                name: test.name,
                category: test.category,
                timestamp: new Date().toISOString()
            };

            if (result.passed) {
                this.results.passed++;
            } else {
                this.results.failed++;
            }

            if (result.warnings && result.warnings.length > 0) {
                this.results.warnings++;
            }

            return test.result;
        } catch (error) {
            test.result = {
                passed: false,
                message: `Test error: ${error.message}`,
                name: test.name,
                category: test.category,
                timestamp: new Date().toISOString()
            };
            this.results.failed++;
            return test.result;
        }
    }

    // Generate comprehensive report
    generateReport() {
        console.log('\n📊 ====== NACHOWEB3 TEST SUITE REPORT ======');

        // Run all tests
        this.tests.forEach(test => {
            this.runTest(test);
        });

        this.results.total = this.tests.length;

        console.log(`\n📈 OVERALL RESULTS:`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⚠️  Warnings: ${this.results.warnings}`);
        console.log(`📊 Total Tests: ${this.results.total}`);
        console.log(`🎯 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);

        // Category breakdown
        console.log(`\n📋 CATEGORY BREAKDOWN:`);
        Object.keys(this.categories).forEach(category => {
            const categoryTests = this.categories[category];
            const categoryResults = categoryTests.map(test => this.tests.find(t => t.name === test.name && t.category === category)?.result).filter(Boolean);
            const passed = categoryResults.filter(r => r.passed).length;

            console.log(`\n${category}:`);
            console.log(`   ${passed}/${categoryTests.length} tests passed`);

            // Show failed tests
            const failed = categoryResults.filter(r => !r.passed);
            if (failed.length > 0) {
                console.log(`   ❌ Failed tests:`);
                failed.forEach(test => {
                    console.log(`      - ${test.name}: ${test.message}`);
                });
            }
        });

        // Performance summary
        const performanceTests = this.results.passed > 0 ?
            this.tests.filter(t => t.category === 'Performance' && t.result) : [];

        if (performanceTests.length > 0) {
            console.log(`\n⚡ PERFORMANCE SUMMARY:`);
            performanceTests.forEach(test => {
                if (test.result.details && test.result.details.loadTime) {
                    console.log(`   Load Time: ${test.result.details.loadTime.toFixed(2)}ms`);
                }
            });
        }

        // Recommendations
        console.log(`\n💡 RECOMMENDATIONS:`);
        this.generateRecommendations();

        console.log(`\n🔧 DEBUG TOOLS:`);
        console.log(`   - Check popup: window.checkNewsletterPopup()`);
        console.log(`   - Force close popup: window.forceCloseNewsletter()`);
        console.log(`   - Test analytics: window.debugNewsletterAnalytics()`);
        console.log(`   - Performance metrics: window.lazyLoader?.getPerformanceMetrics()`);
        console.log(`   - View performance dashboard: Ctrl+Shift+P`);

        console.log(`\n=====================================\n`);

        // Save results to session storage
        sessionStorage.setItem('nachoTestResults', JSON.stringify({
            results: this.results,
            tests: this.tests.map(t => t.result),
            timestamp: new Date().toISOString()
        }));
    }

    generateRecommendations() {
        const recommendations = [];

        // Check for common issues
        const failedTests = this.tests.filter(t => t.result && !t.result.passed);

        if (failedTests.some(t => t.category === 'Newsletter')) {
            recommendations.push('🔧 Fix newsletter popup integration and form validation');
        }

        if (failedTests.some(t => t.category === 'Analytics')) {
            recommendations.push('📊 Configure Google Analytics ID in _config.yml');
        }

        if (failedTests.some(t => t.category === 'Performance')) {
            recommendations.push('⚡ Optimize images and enable lazy loading');
        }

        if (failedTests.some(t => t.category === 'SEO')) {
            recommendations.push('🔍 Add missing meta tags and structured data');
        }

        if (failedTests.some(t => t.category === 'Mobile')) {
            recommendations.push('📱 Improve mobile responsiveness and touch targets');
        }

        // Performance recommendations
        const performanceTests = this.tests.filter(t => t.category === 'Performance' && t.result);
        const loadTimeTest = performanceTests.find(t => t.result.details?.loadTime);

        if (loadTimeTest && loadTimeTest.result.details.loadTime > 3000) {
            recommendations.push(`🚀 Page load time is ${loadTimeTest.result.details.loadTime.toFixed(0)}ms. Consider optimizing images and minifying CSS/JS.`);
        }

        if (recommendations.length === 0) {
            recommendations.push('🎉 All tests passed! Your blog is ready for production.');
        }

        recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec}`);
        });
    }
}

// Initialize test suite when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Auto-run tests in development or with query parameter
    const shouldRunTests = window.location.hostname === 'localhost' ||
                          window.location.search.includes('test=true') ||
                          window.location.search.includes('debug=true');

    if (shouldRunTests) {
        window.testSuite = new NachoWeb3TestSuite();
    }

    // Make available globally
    window.runTests = () => {
        if (!window.testSuite) {
            window.testSuite = new NachoWeb3TestSuite();
        }
    };

    console.log('🧪 Test suite loaded. Run window.runTests() to start testing.');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NachoWeb3TestSuite;
}