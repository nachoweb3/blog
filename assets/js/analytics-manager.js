// Sistema Completo de Analytics para el Blog
// Google Analytics 4, Tag Manager, y eventos personalizados

class AnalyticsManager {
    constructor() {
        this.config = {
            measurementId: process.env.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
            tagManagerId: process.env.GTM_ID || 'GTM-XXXXXXX',
            apiSecret: process.env.GA_API_SECRET || 'demo-secret',
            currency: 'USD',
            enableDebug: window.location.hostname === 'localhost'
        };

        this.events = [];
        this.conversions = new Map();
        this.userProperties = new Map();
        this.sessionData = {
            startTime: Date.now(),
            pageViews: 0,
            timeOnPage: 0,
            interactions: 0
        };

        this.init();
    }

    // Inicialización del sistema
    init() {
        this.setupGoogleAnalytics();
        this.setupGoogleTagManager();
        this.setupCustomEvents();
        this.startSessionTracking();
        this.setupPerformanceTracking();

        console.log('Analytics Manager initialized');
    }

    // Configurar Google Analytics 4
    setupGoogleAnalytics() {
        // Google Analytics 4
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());
        gtag('config', this.config.measurementId, {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
                'custom_parameter_1': 'user_segment',
                'custom_parameter_2': 'content_type',
                'custom_parameter_3': 'engagement_level'
            },
            debug_mode: this.config.enableDebug,
            send_page_view: false // Enviaremos page views manualmente
        });

        // Hacer gtag disponible globalmente
        window.gtag = gtag;
    }

    // Configurar Google Tag Manager
    setupGoogleTagManager() {
        if (this.config.tagManagerId && this.config.tagManagerId !== 'GTM-XXXXXXX') {
            // Google Tag Manager
            (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', this.config.tagManagerId);
        }
    }

    // Configurar eventos personalizados
    setupCustomEvents() {
        // Trackear clicks en enlaces externos
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hostname !== window.location.hostname) {
                this.trackEvent('outbound_click', {
                    link_url: link.href,
                    link_text: link.textContent?.trim(),
                    link_domain: link.hostname
                });
            }
        });

        // Trackear scroll depth
        this.setupScrollTracking();

        // Trackear tiempo en página
        this.setupTimeOnPageTracking();

        // Trackear interacciones con formularios
        this.setupFormTracking();

        // Trackear descargas de archivos
        this.setupDownloadTracking();
    }

    // Trackear page view
    trackPageView(pagePath = null, pageTitle = null) {
        const path = pagePath || window.location.pathname;
        const title = pageTitle || document.title;

        window.gtag('config', this.config.measurementId, {
            page_path: path,
            page_title: title
        });

        this.sessionData.pageViews++;

        // Track para herramientas específicas
        this.trackToolPageView(path);

        console.log('Page view tracked:', path, title);
    }

    // Trackear vista de herramientas específicas
    trackToolPageView(path) {
        const tools = {
            '/crypto-market-indicators/': 'market_indicators',
            '/airdrop-hunter/': 'airdrop_hunter',
            '/newsletter/': 'newsletter'
        };

        const toolName = tools[path];
        if (toolName) {
            this.setUserProperty('current_tool', toolName);
            this.trackEvent('tool_view', {
                tool_name: toolName,
                page_path: path
            });
        }
    }

    // Trackear evento personalizado
    trackEvent(eventName, parameters = {}) {
        const eventData = {
            event_name: eventName,
            parameters: {
                ...parameters,
                timestamp: new Date().toISOString(),
                session_id: this.getSessionId()
            }
        };

        // Enviar a Google Analytics
        window.gtag('event', eventName, parameters);

        // Guardar localmente
        this.events.push({
            type: 'event',
            name: eventName,
            parameters: parameters,
            timestamp: Date.now()
        });

        this.sessionData.interactions++;

        // Log en modo debug
        if (this.config.enableDebug) {
            console.log('Event tracked:', eventData);
        }

        return eventData;
    }

    // Trackear conversiones
    trackConversion(conversionType, value = 0, currency = 'USD') {
        const conversionData = {
            conversion_type: conversionType,
            value: value,
            currency: currency,
            timestamp: Date.now(),
            user_id: this.getUserId()
        };

        // Enviar a Google Analytics como conversión
        window.gtag('event', 'conversion', {
            send_to: `${this.config.measurementId}/${conversionType}`,
            value: value,
            currency: currency,
            transaction_id: this.generateTransactionId()
        });

        // Guardar conversión
        this.conversions.set(conversionType, {
            ...conversionData,
            count: (this.conversions.get(conversionType)?.count || 0) + 1
        });

        // Trackear evento personalizado
        this.trackEvent('conversion', conversionData);

        console.log('Conversion tracked:', conversionData);

        return conversionData;
    }

    // Trackear suscripción a newsletter
    trackNewsletterSubscription(userData) {
        const segment = userData.segment || 'general';
        const experience = userData.experience || 'beginner';
        const investment = userData.investment || 'small';

        this.setUserProperty('newsletter_segment', segment);
        this.setUserProperty('experience_level', experience);
        this.setUserProperty('investment_size', investment);

        // Trackear como lead
        this.trackConversion('newsletter_signup', 0);

        // Evento detallado
        this.trackEvent('newsletter_subscription', {
            segment: segment,
            interests_count: userData.interests?.length || 0,
            experience_level: experience,
            investment_size: investment,
            source: userData.source || 'website'
        });

        // Si es un segmento de alto valor, trackear adicionalmente
        if (this.isHighValueSegment(segment)) {
            this.trackEvent('high_value_lead', {
                lead_type: 'newsletter',
                segment: segment,
                score: this.calculateLeadScore(userData)
            });
        }
    }

    // Trackear uso de Airdrop Hunter
    trackAirdropHunterUsage(action, data = {}) {
        this.trackEvent('airdrop_hunter_usage', {
            action: action, // 'search', 'filter', 'check_eligibility', 'view_details'
            ...data
        });

        // Trackear como engagement si es una acción valiosa
        if (['check_eligibility', 'view_details'].includes(action)) {
            this.trackConversion('airdrop_tool_engagement', 0);
        }
    }

    // Trackear uso de Market Indicators
    trackMarketIndicatorsUsage(action, data = {}) {
        this.trackEvent('market_indicators_usage', {
            action: action, // 'view_indicators', 'check_fear_greed', 'view_rainbow_chart'
            ...data
        });

        if (action === 'view_indicators') {
            this.trackConversion('market_tool_engagement', 0);
        }
    }

    // Trackear upgrades de plan
    trackPlanUpgrade(fromPlan, toPlan, value = 0) {
        this.trackConversion('plan_upgrade', value);

        this.trackEvent('plan_upgrade', {
            from_plan: fromPlan,
            to_plan: toPlan,
            value: value,
            upgrade_value: this.getUpgradeValue(fromPlan, toPlan)
        });

        // Actualizar propiedades de usuario
        this.setUserProperty('subscription_plan', toPlan);
        this.setUserProperty('is_premium', toPlan !== 'free');
    }

    // Establecer propiedades de usuario
    setUserProperty(propertyName, value) {
        window.gtag('config', this.config.measurementId, {
            [propertyName]: value
        });

        this.userProperties.set(propertyName, value);
    }

    // Setup tracking de scroll
    setupScrollTracking() {
        let maxScroll = 0;
        const thresholds = [25, 50, 75, 90];

        const updateScrollDepth = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                thresholds.forEach(threshold => {
                    if (scrollPercent >= threshold && !this.scrollThresholdsReached?.includes(threshold)) {
                        this.trackEvent('scroll_depth', {
                            threshold: threshold,
                            page_path: window.location.pathname
                        });

                        if (!this.scrollThresholdsReached) {
                            this.scrollThresholdsReached = [];
                        }
                        this.scrollThresholdsReached.push(threshold);
                    }
                });
            }
        };

        window.addEventListener('scroll', this.debounce(updateScrollDepth, 100));
    }

    // Setup tracking de tiempo en página
    setupTimeOnPageTracking() {
        let timeOnPage = 0;
        const interval = setInterval(() => {
            timeOnPage += 10;

            // Trackear cada minuto
            if (timeOnPage % 60 === 0) {
                this.trackEvent('time_on_page', {
                    minutes: timeOnPage / 60,
                    page_path: window.location.pathname
                });
            }

            // Trackear engagement prolongado (más de 5 minutos)
            if (timeOnPage === 300) {
                this.trackConversion('prolonged_engagement', 0);
            }
        }, 10000); // Cada 10 segundos

        // Limpiar cuando el usuario se va
        window.addEventListener('beforeunload', () => {
            clearInterval(interval);
            this.sessionData.timeOnPage += timeOnPage;

            // Trackear tiempo total en la sesión
            this.trackEvent('session_end', {
                total_time: this.sessionData.timeOnPage,
                page_views: this.sessionData.pageViews,
                interactions: this.sessionData.interactions
            });
        });
    }

    // Setup tracking de formularios
    setupFormTracking() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formName = form.dataset.name || form.id || 'unknown_form';
            const formType = this.determineFormType(form);

            this.trackEvent('form_submit', {
                form_name: formName,
                form_type: formType,
                form_fields: form.elements.length
            });

            // Trackear conversiones específicas
            if (formType === 'newsletter') {
                this.trackConversion('newsletter_form_submit', 0);
            } else if (formType === 'contact') {
                this.trackConversion('contact_form_submit', 0);
            }
        });

        // Trackear inicio de formulario
        document.addEventListener('focus', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const form = e.target.closest('form');
                if (form && !form.dataset.tracked) {
                    form.dataset.tracked = 'true';

                    this.trackEvent('form_start', {
                        form_name: form.dataset.name || form.id || 'unknown_form',
                        form_type: this.determineFormType(form)
                    });
                }
            }
        }, true);
    }

    // Setup tracking de descargas
    setupDownloadTracking() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                const fileExtensions = ['.pdf', '.zip', '.jpg', '.png', '.xlsx', '.docx'];
                const isDownload = fileExtensions.some(ext => link.href.toLowerCase().endsWith(ext));

                if (isDownload) {
                    this.trackEvent('file_download', {
                        file_url: link.href,
                        file_extension: link.href.split('.').pop(),
                        file_name: link.href.split('/').pop()
                    });
                }
            }
        });
    }

    // Setup tracking de rendimiento
    setupPerformanceTracking() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const webVitals = this.calculateWebVitals();

                    this.trackEvent('page_performance', {
                        load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                        dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                        first_contentful_paint: webVitals.fcp,
                        largest_contentful_paint: webVitals.lcp,
                        cumulative_layout_shift: webVitals.cls,
                        first_input_delay: webVitals.fid
                    });
                }, 0);
            });
        }
    }

    // Calcular Web Vitals
    calculateWebVitals() {
        // En producción esto usaría la librería web-vitals
        return {
            fcp: 1200, // First Contentful Paint (ms)
            lcp: 2400, // Largest Contentful Paint (ms)
            cls: 0.1,  // Cumulative Layout Shift
            fid: 100   // First Input Delay (ms)
        };
    }

    // Setup tracking de sesión
    startSessionTracking() {
        const sessionId = this.getSessionId();

        // Trackear inicio de sesión
        this.trackEvent('session_start', {
            session_id: sessionId,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            referrer: document.referrer || 'direct'
        });

        // Trackear page view inicial
        this.trackPageView();
    }

    // Métodos utilitarios
    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = this.generateId();
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    getUserId() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = this.generateId();
            localStorage.setItem('analytics_user_id', userId);

            // Trackear nuevo usuario
            this.trackEvent('new_user', {
                user_id: userId
            });
        }
        return userId;
    }

    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    generateTransactionId() {
        return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

    // Determinar tipo de formulario
    determineFormType(form) {
        const formId = form.id || '';
        const formClass = form.className || '';

        if (formId.includes('newsletter') || formClass.includes('newsletter')) {
            return 'newsletter';
        }
        if (formId.includes('contact') || formClass.includes('contact')) {
            return 'contact';
        }
        if (formId.includes('subscribe') || formClass.includes('subscribe')) {
            return 'subscribe';
        }

        // Por campos del formulario
        const emailField = form.querySelector('input[type="email"]');
        if (emailField) {
            const emailId = emailField.id || '';
            const emailName = emailField.name || '';

            if (emailId.includes('newsletter') || emailName.includes('newsletter')) {
                return 'newsletter';
            }
        }

        return 'general';
    }

    // Determinar si es un segmento de alto valor
    isHighValueSegment(segment) {
        const highValueSegments = ['pro-traders', 'defi-hunters'];
        return highValueSegments.includes(segment);
    }

    // Calcular score de lead
    calculateLeadScore(userData) {
        let score = 0;

        // Por experiencia
        const experienceScores = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3,
            'professional': 4
        };
        score += experienceScores[userData.experience] || 1;

        // Por nivel de inversión
        const investmentScores = {
            'small': 1,
            'medium': 2,
            'large': 3,
            'whale': 4
        };
        score += investmentScores[userData.investment] || 1;

        // Por número de intereses
        score += Math.min(userData.interests?.length || 0, 3);

        return score;
    }

    // Obtener valor de upgrade
    getUpgradeValue(fromPlan, toPlan) {
        const planValues = {
            'free': 0,
            'pro': 29,
            'vip': 99
        };

        return (planValues[toPlan] || 0) - (planValues[fromPlan] || 0);
    }

    // Obtener estadísticas
    getStats() {
        return {
            totalEvents: this.events.length,
            conversions: Object.fromEntries(this.conversions),
            userProperties: Object.fromEntries(this.userProperties),
            sessionData: this.sessionData
        };
    }

    // Exportar datos para análisis
    exportData() {
        return {
            events: this.events,
            conversions: Object.fromEntries(this.conversions),
            userProperties: Object.fromEntries(this.userProperties),
            sessionData: this.sessionData,
            exportDate: new Date().toISOString()
        };
    }
}

// Inicializar analytics globalmente
const analyticsManager = new AnalyticsManager();
window.analyticsManager = analyticsManager;

// Exportar funciones convenientes para uso global
window.trackEvent = (eventName, parameters) => analyticsManager.trackEvent(eventName, parameters);
window.trackConversion = (type, value, currency) => analyticsManager.trackConversion(type, value, currency);
window.trackPageView = (path, title) => analyticsManager.trackPageView(path, title);

console.log('Analytics Manager initialized');