/**
 * Newsletter Backend Integration for NachoWeb3
 *
 * This module provides a backend integration for the newsletter subscription system
 * that works with static hosting (GitHub Pages) by integrating with external services.
 *
 * Supported integrations:
 * - Mailchimp (recommended)
 * - ConvertKit
 * - Sendinblue
 * - Custom API endpoints
 *
 * Configuration required:
 * 1. Set up your email service provider
 * 2. Add API keys to _config.yml (secure)
 * 3. Configure this file with your preferences
 */

class NewsletterBackend {
    constructor(config = {}) {
        this.config = {
            provider: config.provider || 'mailchimp', // mailchimp, convertkit, sendinblue, custom
            apiEndpoint: config.apiEndpoint || '',
            apiKey: config.apiKey || '',
            listId: config.listId || '',
            testMode: config.testMode || false,
            ...config
        };

        this.subscribers = this.loadSubscribers();
        this.segments = this.defineSegments();
    }

    // Load existing subscribers from localStorage (fallback)
    loadSubscribers() {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('newsletter_subscribers');
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    }

    // Define user segmentation
    defineSegments() {
        return {
            'crypto-beginners': {
                name: 'Crypto Beginners',
                criteria: { experience: 'beginner' },
                content: ['basics', 'safety', 'first-steps']
            },
            'trading-pro': {
                name: 'Professional Traders',
                criteria: { interests: ['trading'], experience: 'professional' },
                content: ['advanced-signals', 'market-analysis', 'risk-management']
            },
            'defi-hunters': {
                name: 'DeFi Yield Hunters',
                criteria: { interests: ['defi', 'airdrops'] },
                content: ['new-protocols', 'high-apy', 'security-reports']
            },
            'nft-collectors': {
                name: 'NFT Collectors',
                criteria: { interests: ['nfts', 'gaming'] },
                content: ['mint-alerts', 'rarity-analysis', 'market-trends']
            },
            'tech-innovators': {
                name: 'Tech Innovators',
                criteria: { interests: ['ai', 'layer2'] },
                content: ['ai-blockchain', 'scaling-solutions', 'research-reports']
            },
            'general': {
                name: 'General Interest',
                criteria: {},
                content: ['market-overview', 'weekly-highlights', 'educational']
            }
        };
    }

    // Main subscription handler
    async subscribe(subscriberData) {
        try {
            // Validate data
            const validation = this.validateSubscription(subscriberData);
            if (!validation.valid) {
                throw new Error(validation.message);
            }

            // Segment the user
            const segment = this.segmentUser(subscriberData);

            // Prepare subscription data
            const subscriptionData = {
                ...subscriberData,
                segment: segment,
                source: 'nachoweb3-blog',
                timestamp: new Date().toISOString(),
                status: 'pending_confirmation'
            };

            // Store locally (backup)
            this.storeSubscriber(subscriptionData);

            // Send to email service provider
            let result;
            if (this.config.testMode) {
                result = await this.testSubscription(subscriptionData);
            } else {
                result = await this.sendToProvider(subscriptionData);
            }

            // Send confirmation
            await this.sendConfirmationEmail(subscriptionData);

            // Track analytics
            this.trackSubscription(subscriptionData);

            return {
                success: true,
                message: 'Subscription successful! Please check your email.',
                subscriberId: this.generateSubscriberId(),
                segment: segment
            };

        } catch (error) {
            console.error('Newsletter subscription error:', error);
            return {
                success: false,
                message: error.message || 'Subscription failed. Please try again.',
                error: error.message
            };
        }
    }

    // Validate subscription data
    validateSubscription(data) {
        if (!data.email || !this.isValidEmail(data.email)) {
            return { valid: false, message: 'Invalid email address' };
        }

        if (!data.name || data.name.trim().length < 2) {
            return { valid: false, message: 'Name is required' };
        }

        if (!data.privacyConsent) {
            return { valid: false, message: 'Privacy consent is required' };
        }

        // Check for duplicates
        if (this.isDuplicate(data.email)) {
            return { valid: false, message: 'Email already subscribed' };
        }

        return { valid: true };
    }

    // Email validation
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Check for duplicate subscription
    isDuplicate(email) {
        return this.subscribers.some(sub => sub.email === email);
    }

    // Segment user based on interests and experience
    segmentUser(userData) {
        const { interests = [], experience = '', investment = '' } = userData;

        // Advanced segment matching
        for (const [segmentId, segment] of Object.entries(this.segments)) {
            if (segmentId === 'general') continue;

            const criteria = segment.criteria;

            // Check interests match
            const interestsMatch = criteria.interests
                ? criteria.interests.every(interest => interests.includes(interest))
                : true;

            // Check experience match
            const experienceMatch = criteria.experience
                ? criteria.experience === experience
                : true;

            if (interestsMatch && experienceMatch) {
                return segmentId;
            }
        }

        return 'general';
    }

    // Store subscriber locally (backup)
    storeSubscriber(data) {
        this.subscribers.push(data);
        if (typeof window !== 'undefined') {
            localStorage.setItem('newsletter_subscribers', JSON.stringify(this.subscribers));
        }
    }

    // Generate unique subscriber ID
    generateSubscriberId() {
        return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Send to email service provider
    async sendToProvider(subscriptionData) {
        switch (this.config.provider) {
            case 'mailchimp':
                return await this.sendToMailchimp(subscriptionData);
            case 'convertkit':
                return await this.sendToConvertKit(subscriptionData);
            case 'sendinblue':
                return await this.sendToSendinblue(subscriptionData);
            case 'custom':
                return await this.sendToCustomAPI(subscriptionData);
            default:
                throw new Error(`Provider ${this.config.provider} not supported`);
        }
    }

    // Mailchimp integration
    async sendToMailchimp(data) {
        const mailchimpData = {
            email_address: data.email,
            status: 'pending',
            merge_fields: {
                FNAME: data.name,
                INTERESTS: data.interests,
                EXPERIENCE: data.experience,
                INVESTMENT: data.investment,
                SEGMENT: data.segment
            }
        };

        const response = await fetch(`https://${this.config.apiKey.split('-')[1]}.api.mailchimp.com/3.0/lists/${this.config.listId}/members/`, {
            method: 'POST',
            headers: {
                'Authorization': `apikey ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mailchimpData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Mailchimp API error');
        }

        return await response.json();
    }

    // ConvertKit integration
    async sendToConvertKit(data) {
        const convertKitData = {
            email: data.email,
            name: data.name,
            tags: data.interests,
            fields: {
                experience: data.experience,
                investment: data.investment,
                segment: data.segment
            }
        };

        const response = await fetch(`${this.config.apiEndpoint}/forms/${this.config.listId}/subscribe`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(convertKitData)
        });

        if (!response.ok) {
            throw new Error('ConvertKit API error');
        }

        return await response.json();
    }

    // Sendinblue (Brevo) integration
    async sendToSendinblue(data) {
        const sendinblueData = {
            email: data.email,
            attributes: {
                FIRSTNAME: data.name,
                INTERESTS: data.interests,
                EXPERIENCE: data.experience,
                INVESTMENT: data.investment,
                SEGMENT: data.segment
            },
            listIds: [parseInt(this.config.listId)],
            updateEnabled: true
        };

        const response = await fetch('https://api.sendinblue.com/v3/contacts', {
            method: 'POST',
            headers: {
                'api-key': this.config.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendinblueData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Sendinblue API error');
        }

        return await response.json();
    }

    // Custom API integration
    async sendToCustomAPI(data) {
        const response = await fetch(this.config.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                event: 'newsletter_subscription',
                data: data
            })
        });

        if (!response.ok) {
            throw new Error('Custom API error');
        }

        return await response.json();
    }

    // Test subscription (for development)
    async testSubscription(data) {
        console.log('🧪 Test subscription data:', data);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            message: 'Test subscription successful',
            data: data
        };
    }

    // Send confirmation email (placeholder - would be handled by email provider)
    async sendConfirmationEmail(data) {
        console.log('📧 Confirmation email would be sent to:', data.email);

        // In production, this would be handled by the email service provider
        // Most providers automatically send confirmation emails
    }

    // Track subscription for analytics
    trackSubscription(data) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_subscribe', {
                event_category: 'engagement',
                event_label: data.segment,
                custom_parameters: {
                    interests: data.interests?.join(',') || '',
                    experience: data.experience || ''
                }
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Newsletter Subscription',
                content_category: 'Email Marketing'
            });
        }

        // Custom analytics
        console.log('📊 Subscription tracked:', {
            email: data.email,
            segment: data.segment,
            interests: data.interests,
            timestamp: data.timestamp
        });
    }

    // Get subscriber statistics
    getStatistics() {
        const stats = {
            total: this.subscribers.length,
            segments: {},
            interests: {},
            experience: {}
        };

        this.subscribers.forEach(sub => {
            // Count segments
            stats.segments[sub.segment] = (stats.segments[sub.segment] || 0) + 1;

            // Count interests
            (sub.interests || []).forEach(interest => {
                stats.interests[interest] = (stats.interests[interest] || 0) + 1;
            });

            // Count experience levels
            if (sub.experience) {
                stats.experience[sub.experience] = (stats.experience[sub.experience] || 0) + 1;
            }
        });

        return stats;
    }

    // Export subscribers (for backup/migration)
    exportSubscribers() {
        return {
            timestamp: new Date().toISOString(),
            total: this.subscribers.length,
            subscribers: this.subscribers,
            statistics: this.getStatistics()
        };
    }

    // Unsubscribe method
    async unsubscribe(email) {
        try {
            // Remove from local storage
            this.subscribers = this.subscribers.filter(sub => sub.email !== email);
            if (typeof window !== 'undefined') {
                localStorage.setItem('newsletter_subscribers', JSON.stringify(this.subscribers));
            }

            // Send to provider
            if (!this.config.testMode) {
                await this.sendUnsubscribeToProvider(email);
            }

            return {
                success: true,
                message: 'Successfully unsubscribed'
            };
        } catch (error) {
            console.error('Unsubscribe error:', error);
            return {
                success: false,
                message: 'Failed to unsubscribe. Please contact support.'
            };
        }
    }

    // Send unsubscribe to provider
    async sendUnsubscribeToProvider(email) {
        // Implementation depends on provider
        // This is a placeholder for provider-specific unsubscribe logic
        console.log('🚫 Unsubscribe request sent to provider:', email);
    }
}

// Initialize newsletter backend
const newsletterConfig = {
    provider: 'mailchimp', // Change to your provider
    testMode: true, // Set to false in production
    // Add your actual configuration here:
    // apiEndpoint: 'https://api.convertkit.com/v3',
    // apiKey: 'your-api-key',
    // listId: 'your-list-id'
};

// Create global instance
window.newsletterBackend = new NewsletterBackend(newsletterConfig);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsletterBackend;
}