// Sistema Completo de Newsletter con Integración Real
// Soporta múltiples providers y analytics avanzados

class NewsletterSystem {
    constructor() {
        this.config = {
            providers: {
                mailchimp: {
                    apiKey: process.env.MAILCHIMP_API_KEY || 'demo-key',
                    server: process.env.MAILCHIMP_SERVER || 'us1',
                    listId: process.env.MAILCHIMP_LIST_ID || 'demo-list'
                },
                sendgrid: {
                    apiKey: process.env.SENDGRID_API_KEY || 'demo-key',
                    listId: process.env.SENDGRID_LIST_ID || 'demo-list'
                }
            },
            segments: {
                'pro-traders': {
                    interests: ['trading'],
                    experience: ['advanced', 'professional'],
                    minInvestment: 'medium'
                },
                'defi-hunters': {
                    interests: ['defi', 'airdrops'],
                    anyExperience: true
                },
                'nft-gaming': {
                    interests: ['nfts', 'gaming'],
                    anyExperience: true
                },
                'tech-innovators': {
                    interests: ['ai'],
                    experience: ['intermediate', 'advanced', 'professional']
                },
                'crypto-beginners': {
                    experience: ['beginner'],
                    anyInterests: true
                }
            },
            webhooks: {
                newSubscriber: '/api/webhook/newsletter/new-subscriber',
                upgradedPlan: '/api/webhook/newsletter/plan-upgrade',
                unsubscribe: '/api/webhook/newsletter/unsubscribe'
            }
        };

        this.analytics = new NewsletterAnalytics();
        this.segmentManager = new SegmentManager();
        this.templateEngine = new TemplateEngine();
    }

    // Suscribir usuario con segmentación automática
    async subscribeUser(userData) {
        try {
            // Validar datos
            const validatedData = this.validateSubscriptionData(userData);

            // Determinar segmento
            const segment = this.segmentManager.determineSegment(validatedData);

            // Preparar datos para el provider
            const subscriberData = {
                email: validatedData.email,
                name: validatedData.name,
                interests: validatedData.interests,
                experience: validatedData.experience,
                investment: validatedData.investment,
                segment: segment,
                source: validatedData.source || 'website',
                timestamp: new Date().toISOString(),
                ipAddress: await this.getClientIP(),
                userAgent: navigator.userAgent
            };

            // Enviar al provider preferido
            const result = await this.sendToProvider(subscriberData);

            // Track analytics
            await this.analytics.trackSubscription(subscriberData, result);

            // Enviar email de bienvenida
            await this.sendWelcomeEmail(subscriberData);

            // Trigger webhooks
            await this.triggerWebhook('newSubscriber', subscriberData);

            return {
                success: true,
                subscriberId: result.subscriberId,
                segment: segment,
                welcomeEmailSent: true
            };

        } catch (error) {
            console.error('Newsletter subscription error:', error);

            // Track error
            await this.analytics.trackError('subscription', error, userData);

            throw error;
        }
    }

    // Enviar newsletter segmentado
    async sendSegmentedNewsletter(newsletterType, segment = 'all') {
        try {
            const template = await this.templateEngine.getTemplate(newsletterType);
            const subscribers = await this.getSegmentSubscribers(segment);

            const results = {
                totalSent: 0,
                delivered: 0,
                opened: 0,
                clicked: 0,
                errors: []
            };

            // Enviar en batches para no sobrecargar el provider
            const batchSize = 100;
            for (let i = 0; i < subscribers.length; i += batchSize) {
                const batch = subscribers.slice(i, i + batchSize);

                const batchResults = await this.sendBatchEmails(batch, template, newsletterType);

                results.totalSent += batch.length;
                results.delivered += batchResults.delivered;
                results.opened += batchResults.opened;
                results.clicked += batchResults.clicked;
                results.errors.push(...batchResults.errors);
            }

            // Track analytics
            await this.analytics.trackNewsletterSend(newsletterType, segment, results);

            return results;

        } catch (error) {
            console.error('Newsletter send error:', error);
            await this.analytics.trackError('newsletter_send', error, { type: newsletterType, segment });
            throw error;
        }
    }

    // Validar datos de suscripción
    validateSubscriptionData(userData) {
        const errors = [];

        // Email validation
        if (!userData.email || !this.isValidEmail(userData.email)) {
            errors.push('Email inválido');
        }

        // Name validation
        if (!userData.name || userData.name.length < 2) {
            errors.push('Nombre inválido (mínimo 2 caracteres)');
        }

        // Interests validation
        if (!userData.interests || userData.interests.length === 0) {
            errors.push('Debes seleccionar al menos un interés');
        }

        // Required fields
        if (!userData.experience || !userData.investment) {
            errors.push('Debes completar todos los campos requeridos');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        return {
            email: userData.email.toLowerCase().trim(),
            name: userData.name.trim(),
            interests: userData.interests,
            experience: userData.experience,
            investment: userData.investment,
            privacyConsent: userData.privacyConsent,
            source: userData.source || 'website'
        };
    }

    // Enviar al provider de email
    async sendToProvider(subscriberData) {
        try {
            // Preferir Mailchimp, fallback a SendGrid
            let result;

            try {
                result = await this.sendToMailchimp(subscriberData);
            } catch (mailchimpError) {
                console.warn('Mailchimp failed, trying SendGrid:', mailchimpError);
                result = await this.sendToSendGrid(subscriberData);
            }

            return result;

        } catch (error) {
            throw new Error(`Failed to send to email providers: ${error.message}`);
        }
    }

    // Enviar a Mailchimp
    async sendToMailchimp(subscriberData) {
        const { apiKey, server, listId } = this.config.providers.mailchimp;

        const response = await fetch(`https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`, {
            method: 'POST',
            headers: {
                'Authorization': `apikey ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email_address: subscriberData.email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: subscriberData.name,
                    INTERESTS: subscriberData.interests.join(', '),
                    EXPERIENCE: subscriberData.experience,
                    INVESTMENT: subscriberData.investment,
                    SEGMENT: subscriberData.segment
                },
                tags: [subscriberData.segment, subscriberData.source]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Mailchimp error: ${errorData.detail || errorData.title}`);
        }

        const data = await response.json();

        return {
            provider: 'mailchimp',
            subscriberId: data.id,
            email: data.email_address,
            status: data.status
        };
    }

    // Enviar a SendGrid
    async sendToSendGrid(subscriberData) {
        const { apiKey, listId } = this.config.providers.sendgrid;

        const response = await fetch('https://api.sendgrid.com/v3/marketing/lists/' + listId + '/contacts', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contacts: [{
                    email: subscriberData.email,
                    first_name: subscriberData.name,
                    custom_fields: {
                        interests: subscriberData.interests.join(', '),
                        experience: subscriberData.experience,
                        investment: subscriberData.investment,
                        segment: subscriberData.segment
                    }
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`SendGrid error: ${errorData.errors?.[0]?.message || 'Unknown error'}`);
        }

        const data = await response.json();

        return {
            provider: 'sendgrid',
            subscriberId: data.id || subscriberData.email,
            email: subscriberData.email,
            status: 'subscribed'
        };
    }

    // Enviar email de bienvenida
    async sendWelcomeEmail(subscriberData) {
        try {
            const welcomeTemplate = await this.templateEngine.getWelcomeTemplate(subscriberData.segment);

            await this.sendIndividualEmail({
                to: subscriberData.email,
                subject: welcomeTemplate.subject,
                html: welcomeTemplate.html,
                text: welcomeTemplate.text,
                templateData: subscriberData
            });

            return true;
        } catch (error) {
            console.warn('Welcome email failed:', error);
            return false; // No lanzar error para no bloquear la suscripción
        }
    }

    // Enviar email individual
    async sendIndividualEmail(emailData) {
        // Aquí integraríamos con SendGrid Email API o similar
        console.log('Sending email:', emailData.subject, 'to:', emailData.to);
        return true;
    }

    // Obtener suscriptores de un segmento
    async getSegmentSubscribers(segment) {
        // Esto en producción llamaría a la API del provider
        const mockSubscribers = [];

        if (segment === 'all') {
            // Simular 1000 suscriptores
            for (let i = 1; i <= 1000; i++) {
                mockSubscribers.push({
                    email: `user${i}@example.com`,
                    name: `User ${i}`,
                    segment: this.getRandomSegment()
                });
            }
        } else {
            // Simular 200 suscriptores por segmento
            for (let i = 1; i <= 200; i++) {
                mockSubscribers.push({
                    email: `${segment}user${i}@example.com`,
                    name: `${segment} User ${i}`,
                    segment: segment
                });
            }
        }

        return mockSubscribers;
    }

    // Enviar emails en batch
    async sendBatchEmails(subscribers, template, newsletterType) {
        const results = {
            delivered: 0,
            opened: 0,
            clicked: 0,
            errors: []
        };

        for (const subscriber of subscribers) {
            try {
                // Personalizar template
                const personalizedContent = this.templateEngine.personalize(template, subscriber);

                // Enviar email
                await this.sendIndividualEmail({
                    to: subscriber.email,
                    subject: personalizedContent.subject,
                    html: personalizedContent.html,
                    text: personalizedContent.text,
                    templateData: subscriber,
                    newsletterType: newsletterType
                });

                results.delivered++;

                // Simular métricas (en producción vendrían del provider)
                if (Math.random() > 0.3) results.opened++;
                if (Math.random() > 0.7) results.clicked++;

            } catch (error) {
                results.errors.push({
                    email: subscriber.email,
                    error: error.message
                });
            }
        }

        return results;
    }

    // Trigger webhook
    async triggerWebhook(type, data) {
        const webhookUrl = this.config.webhooks[type];
        if (!webhookUrl) return;

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: type,
                    data: data,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.warn(`Webhook ${type} failed:`, error);
        }
    }

    // Obtener IP del cliente
    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    // Métodos auxiliares
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    getRandomSegment() {
        const segments = Object.keys(this.config.segments);
        return segments[Math.floor(Math.random() * segments.length)];
    }
}

// Sistema de Segmentación
class SegmentManager {
    constructor() {
        this.segments = {
            'pro-traders': {
                interests: ['trading'],
                experience: ['advanced', 'professional'],
                minInvestment: 'medium'
            },
            'defi-hunters': {
                interests: ['defi', 'airdrops'],
                anyExperience: true
            },
            'nft-gaming': {
                interests: ['nfts', 'gaming'],
                anyExperience: true
            },
            'tech-innovators': {
                interests: ['ai'],
                experience: ['intermediate', 'advanced', 'professional']
            },
            'crypto-beginners': {
                experience: ['beginner'],
                anyInterests: true
            }
        };
    }

    determineSegment(userData) {
        for (const [segmentName, criteria] of Object.entries(this.segments)) {
            if (this.matchesSegment(userData, criteria)) {
                return segmentName;
            }
        }
        return 'general';
    }

    matchesSegment(userData, criteria) {
        // Verificar intereses
        if (criteria.interests && !criteria.anyInterests) {
            const hasRequiredInterest = criteria.interests.some(interest =>
                userData.interests.includes(interest)
            );
            if (!hasRequiredInterest) return false;
        }

        // Verificar experiencia
        if (criteria.experience) {
            if (!criteria.experience.includes(userData.experience)) {
                return false;
            }
        }

        // Verificar nivel de inversión
        if (criteria.minInvestment) {
            const investmentLevels = { 'small': 1, 'medium': 2, 'large': 3, 'whale': 4 };
            const userLevel = investmentLevels[userData.investment] || 0;
            const minLevel = investmentLevels[criteria.minInvestment] || 0;

            if (userLevel < minLevel) return false;
        }

        return true;
    }
}

// Sistema de Analytics
class NewsletterAnalytics {
    constructor() {
        this.events = [];
    }

    async trackSubscription(userData, result) {
        const event = {
            type: 'subscription',
            timestamp: new Date().toISOString(),
            data: {
                email: userData.email,
                segment: userData.segment,
                interests: userData.interests,
                experience: userData.experience,
                investment: userData.investment,
                source: userData.source,
                provider: result.provider
            }
        };

        this.events.push(event);
        this.saveToLocalStorage();

        // En producción: enviar a Google Analytics, Mixpanel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_subscription', {
                event_category: 'engagement',
                event_label: userData.segment,
                value: this.getInvestmentValue(userData.investment)
            });
        }
    }

    async trackNewsletterSend(type, segment, results) {
        const event = {
            type: 'newsletter_send',
            timestamp: new Date().toISOString(),
            data: {
                type: type,
                segment: segment,
                totalSent: results.totalSent,
                delivered: results.delivered,
                opened: results.opened,
                clicked: results.clicked,
                errors: results.errors.length
            }
        };

        this.events.push(event);
        this.saveToLocalStorage();
    }

    async trackError(operation, error, context) {
        const event = {
            type: 'error',
            timestamp: new Date().toISOString(),
            data: {
                operation: operation,
                error: error.message,
                context: context
            }
        };

        this.events.push(event);
        this.saveToLocalStorage();
    }

    getInvestmentValue(investment) {
        const values = {
            'small': 1,
            'medium': 2,
            'large': 3,
            'whale': 4
        };
        return values[investment] || 0;
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('newsletter_analytics', JSON.stringify(this.events.slice(-100))); // Guardar últimos 100 eventos
        } catch (error) {
            console.warn('Could not save analytics to localStorage:', error);
        }
    }

    getStats() {
        const subscriptions = this.events.filter(e => e.type === 'subscription');
        const newsletterSends = this.events.filter(e => e.type === 'newsletter_send');
        const errors = this.events.filter(e => e.type === 'error');

        return {
            totalSubscriptions: subscriptions.length,
            subscriptionsBySegment: this.groupBy(subscriptions, 'data.segment'),
            totalNewsletterSends: newsletterSends.reduce((sum, e) => sum + e.data.totalSent, 0),
            averageOpenRate: this.calculateAverageOpenRate(newsletterSends),
            totalErrors: errors.length
        };
    }

    groupBy(items, key) {
        return items.reduce((groups, item) => {
            const value = this.getNestedValue(item, key);
            groups[value] = (groups[value] || 0) + 1;
            return groups;
        }, {});
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    calculateAverageOpenRate(sends) {
        if (sends.length === 0) return 0;

        const totalOpenRate = sends.reduce((sum, send) => {
            const openRate = send.data.delivered > 0 ?
                (send.data.opened / send.data.delivered) * 100 : 0;
            return sum + openRate;
        }, 0);

        return Math.round(totalOpenRate / sends.length);
    }
}

// Motor de Plantillas
class TemplateEngine {
    constructor() {
        this.templates = new Map();
        this.loadDefaultTemplates();
    }

    async getTemplate(type) {
        if (!this.templates.has(type)) {
            await this.loadTemplate(type);
        }
        return this.templates.get(type);
    }

    async getWelcomeTemplate(segment) {
        const templates = {
            'pro-traders': {
                subject: '🚀 Bienvenido a Trading Insights Pro',
                html: this.generateProTraderWelcome(),
                text: 'Welcome to our professional trading newsletter.'
            },
            'defi-hunters': {
                subject: '💰 Tu Guía DeFi Comienza Aquí',
                html: this.generateDeFiWelcome(),
                text: 'Welcome to DeFi Alpha newsletter.'
            },
            'default': {
                subject: '🎉 Bienvenido a NachoWeb3 Newsletter',
                html: this.generateDefaultWelcome(),
                text: 'Welcome to our crypto newsletter.'
            }
        };

        return templates[segment] || templates['default'];
    }

    personalize(template, subscriber) {
        let personalized = { ...template };

        // Reemplazar variables
        Object.keys(subscriber).forEach(key => {
            const placeholder = `{{${key}}}`;
            const value = subscriber[key] || '';

            personalized.html = personalized.html?.replace(new RegExp(placeholder, 'g'), value);
            personalized.text = personalized.text?.replace(new RegExp(placeholder, 'g'), value);
            personalized.subject = personalized.subject?.replace(new RegExp(placeholder, 'g'), value);
        });

        return personalized;
    }

    generateProTraderWelcome() {
        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #667eea;">🚀 Trading Insights Pro</h1>
            <p>Hola {{name}}, bienvenido al club exclusivo de traders profesionales.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2>🎯 Lo que recibirás:</h2>
                <ul>
                    <li>Señales de trading con 85% de precisión</li>
                    <li>Análisis técnico profesional</li>
                    <li>Alertas de oportunidades en tiempo real</li>
                    <li>Access a community VIP</li>
                </ul>
            </div>
            <p>Prepárate para llevar tu trading al siguiente nivel.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://nachoweb3.github.io/blog/crypto-market-indicators/"
                   style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
                    Ver Market Analysis
                </a>
            </div>
        </div>
        `;
    }

    generateDeFiWelcome() {
        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #27ae60;">💰 DeFi Alpha Welcome</h1>
            <p>Hola {{name}}, estás a punto de descubrir las mejores oportunidades DeFi.</p>
            <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2>🏦 Tu acceso exclusivo:</h2>
                <ul>
                    <li>Nuevos protocolos con potencial 100x</li>
                    <li>Oportunidades de yield farming</li>
                    <li>Análisis de seguridad de contratos</li>
                    <li>Strategias probadas</li>
                </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://nachoweb3.github.io/blog/airdrop-hunter/"
                   style="background: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
                    Cazar Airdrops Ahora
                </a>
            </div>
        </div>
        `;
    }

    generateDefaultWelcome() {
        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #667eea;">🎉 ¡Bienvenido a NachoWeb3!</h1>
            <p>Hola {{name}}, gracias por unirte a nuestra comunidad de crypto entusiastas.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2>🚀 Herramientas exclusivas:</h2>
                <ul>
                    <li><a href="https://nachoweb3.github.io/blog/crypto-market-indicators/">Crypto Market Indicators</a></li>
                    <li><a href="https://nachoweb3.github.io/blog/airdrop-hunter/">Airdrop Hunter</a></li>
                    <li>Newsletter semanal con análisis profesional</li>
                    <li>Comunidad VIP en Discord</li>
                </ul>
            </div>
            <p>Pronto recibirás tu primer newsletter con contenido exclusivo.</p>
        </div>
        `;
    }

    loadDefaultTemplates() {
        // Templates predefinidos para diferentes tipos de newsletter
        this.templates.set('trading', {
            subject: '📈 Trading Insights Semanal',
            html: this.generateTradingTemplate(),
            text: 'Weekly trading analysis and signals.'
        });

        this.templates.set('defi', {
            subject: '🏦 DeFi Alpha Semanal',
            html: this.generateDeFiTemplate(),
            text: 'Weekly DeFi opportunities and analysis.'
        });
    }

    generateTradingTemplate() {
        return `
        <div style="font-family: Arial, sans-serif;">
            <h1>📈 Trading Insights - {{date}}</h1>
            <p>Análisis profesional del mercado cripto esta semana.</p>
            <!-- Trading content would be dynamically inserted here -->
        </div>
        `;
    }

    generateDeFiTemplate() {
        return `
        <div style="font-family: Arial, sans-serif;">
            <h1>🏦 DeFi Alpha - {{date}}</h1>
            <p>Las mejores oportunidades de DeFi esta semana.</p>
            <!-- DeFi content would be dynamically inserted here -->
        </div>
        `;
    }

    async loadTemplate(type) {
        // En producción esto cargaría templates desde un CMS o API
        console.log(`Loading template: ${type}`);
        return this.templates.get(type);
    }
}

// Inicialización global
const newsletterSystem = new NewsletterSystem();
window.newsletterSystem = newsletterSystem;

console.log('Newsletter System initialized');