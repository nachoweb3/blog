/**
 * Advanced Content Recommendation Engine for NachoWeb3 Blog
 *
 * Features:
 * - AI-powered content recommendations
 * Collaborative filtering
 * Content-based filtering
 * Hybrid recommendation algorithms
 * Real-time personalization
 * User behavior tracking
 * A/B testing integration
 * Performance optimization
 */

class ContentRecommendationEngine {
    constructor(options = {}) {
        this.options = {
            // Algorithm weights
            algorithmWeights: {
                collaborative: options.algorithmWeights?.collaborative || 0.4,
                contentBased: options.algorithmWeights?.contentBased || 0.3,
                popularity: options.algorithmWeights?.popularity || 0.2,
                hybrid: options.algorithmWeights?.hybrid || 0.1
            },

            // Recommendation settings
            maxRecommendations: options.maxRecommendations || 6,
            minScore: options.minScore || 0.3,
            enablePersonalization: options.enablePersonalization !== false,
            enableCollaborative: options.enableCollaborative !== false,

            // Content weighting
            contentWeights: {
                title: options.contentWeights?.title || 3.0,
                tags: options.contentWeights?.tags || 2.0,
                category: options.contentWeights?.category || 1.5,
                readTime: options.contentWeights?.readTime || 1.0,
                date: options.contentWeights?.date || 0.8,
                userEngagement: options.contentWeights?.userEngagement || 2.5
            },

            // Analytics
            enableAnalytics: options.enableAnalytics !== false,
            trackRecommendations: options.trackRecommendations !== false,

            // Caching
            enableCaching: options.enableCaching !== false,
            cacheTimeout: options.cacheTimeout || 10 * 60 * 1000, // 10 minutes

            ...options
        };

        // Data structures
        this.contentIndex = new Map();
        this.userProfile = {
            interests: new Map(),
            readingHistory: [],
            interactions: new Map(),
            preferences: {
                categories: [],
                tags: [],
                readingTime: 'medium',
                contentLength: 'medium'
            }
        };

        this.collaborativeMatrix = new Map();
        this.popularityScores = new Map();
        this.recommendationCache = new Map();

        // User behavior tracking
        this.sessionStartTime = Date.now();
        this.userActions = [];
        this.recommendationHistory = [];

        this.init();
    }

    init() {
        console.log('🤖 Content Recommendation Engine initializing...');

        // Load content index
        this.loadContentIndex();

        // Load user profile
        this.loadUserProfile();

        // Setup behavior tracking
        this.setupBehaviorTracking();

        // Load collaborative data
        this.loadCollaborativeData();

        // Load popularity data
        this.loadPopularityData();

        // Setup real-time updates
        this.setupRealTimeUpdates();

        // Initialize recommendation algorithms
        this.initializeAlgorithms();

        console.log('✅ Content Recommendation Engine initialized');
    }

    async loadContentIndex() {
        console.log('📚 Loading content index...');

        try {
            // Fetch content from the blog
            const posts = await this.fetchContentFromAPI();

            // Index content for recommendations
            posts.forEach(post => {
                this.indexContent(post);
            });

            console.log(`✅ Indexed ${posts.length} pieces of content`);

        } catch (error) {
            console.error('Error loading content index:', error);
            this.createMockContentIndex();
        }
    }

    async fetchContentFromAPI() {
        // In a real implementation, this would fetch from your CMS or API
        // For demo purposes, we'll simulate content data

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'post-1',
                        title: 'ChatGPT vs GPT-4: La Nueva Era de la IA',
                        url: '/blog/chatgpt-vs-gpt4',
                        categories: ['ia'],
                        tags: ['ChatGPT', 'GPT-4', 'Machine Learning', 'IA Generativa'],
                        excerpt: 'Análisis comparativo entre ChatGPT y GPT-4',
                        author: 'NachoWeb3',
                        date: '2024-11-17',
                        readingTime: 8,
                        wordCount: 2400,
                        views: 15234,
                        likes: 892,
                        shares: 234,
                        engagement: 0.085,
                        content: 'Comparativa detallada entre ChatGPT y GPT-4. Ventajas y desventajas de cada modelo de IA. Casos de uso recomendados para desarrolladores y empresas.',
                        difficulty: 'intermediate',
                        type: 'tutorial'
                    },
                    {
                        id: 'post-2',
                        title: 'Ethereum 2.0: Todo lo que necesitas saber',
                        url: '/blog/ethereum-2.0-guia',
                        categories: ['blockchain'],
                        tags: ['Ethereum', 'Proof of Stake', 'Staking', 'ETH2'],
                        excerpt: 'Guía completa sobre la actualización de Ethereum',
                        author: 'NachoWeb3',
                        date: '2024-11-16',
                        readingTime: 12,
                        wordCount: 3600,
                        views: 18956,
                        likes: 1234,
                        shares: 456,
                        engagement: 0.091,
                        content: 'Guía completa sobre la actualización de Ethereum a Proof of Stake. Cambios técnicos, ventajas y cómo prepararse.',
                        difficulty: 'intermediate',
                        type: 'guide'
                    },
                    {
                        id: 'post-3',
                        title: 'Python para Blockchain: Smart Contracts',
                        url: '/blog/python-blockchain-smart-contracts',
                        categories: ['tutoriales', 'blockchain'],
                        tags: ['Python', 'Smart Contracts', 'Solidity', 'dApps'],
                        excerpt: 'Tutorial completo de Python aplicado al desarrollo de blockchain',
                        author: 'NachoWeb3',
                        date: '2024-11-14',
                        readingTime: 20,
                        wordCount: 6000,
                        views: 22345,
                        likes: 1567,
                        shares: 678,
                        engagement: 0.103,
                        content: 'Tutorial completo sobre cómo integrar React con blockchain. Conexión a wallets y contratos inteligentes.',
                        difficulty: 'advanced',
                        type: 'tutorial'
                    },
                    {
                        id: 'post-4',
                        title: 'DeFi: Yield Farming Estrategias Profesionales',
                        url: '/blog/def-yield-farming-estrategias',
                        categories: ['blockchain'],
                        tags: ['DeFi', 'Yield Farming', 'Liquidity Mining', 'APY'],
                        excerpt: 'Estrategias avanzadas para maximizar rendimientos en DeFi',
                        author: 'NachoWeb3',
                        date: '2024-11-11',
                        readingTime: 14,
                        wordCount: 4200,
                        views: 14567,
                        likes: 987,
                        shares: 345,
                        engagement: 0.092,
                        content: 'Estrategias profesionales para yield farming y maximizar retornos en protocolos DeFi.',
                        difficulty: 'advanced',
                        type: 'guide'
                    },
                    {
                        id: 'post-5',
                        title: 'Machine Learning: Guía para Principiantes',
                        url: '/blog/machine-learning-guia-principiantes',
                        categories: ['ia', 'tutoriales'],
                        tags: ['Machine Learning', 'Python', 'IA', 'Data Science'],
                        excerpt: 'Introducción completa a Machine Learning para principiantes',
                        author: 'NachoWeb3',
                        date: '2024-11-10',
                        readingTime: 25,
                        wordCount: 7500,
                        views: 34567,
                        likes: 2134,
                        shares: 890,
                        engagement: 0.089,
                        content: 'Guía completa de Machine Learning desde los conceptos básicos hasta implementación práctica.',
                        difficulty: 'beginner',
                        type: 'tutorial'
                    }
                ]);
            }, 800);
        });
    }

    createMockContentIndex() {
        console.log('🔧 Creating mock content index...');

        const mockContent = [
            {
                id: 'post-mock-1',
                title: 'Trending: El Futuro de la IA en 2024',
                url: '/blog/futuro-ia-2024',
                categories: ['ia'],
                tags: ['IA', 'Futuro', 'Tendencias', '2024'],
                excerpt: 'Predicciones sobre el futuro de la inteligencia artificial',
                author: 'NachoWeb3',
                date: '2024-11-17',
                readingTime: 10,
                wordCount: 3000,
                views: 5000,
                likes: 250,
                shares: 75,
                engagement: 0.065,
                content: 'Análisis de las tendencias actuales en IA y predicciones para el futuro',
                difficulty: 'intermediate',
                type: 'trends'
            },
            {
                id: 'post-mock-2',
                title: 'Solana vs Ethereum: Comparativa de Blockchains',
                url: '/blog/solana-vs-ethereum',
                categories: ['blockchain'],
                tags: ['Solana', 'Ethereum', 'Blockchain', 'Comparativa'],
                excerpt: 'Análisis detallado entre Solana y Ethereum',
                author: 'NachoWeb3',
                date: '2024-11-16',
                readingTime: 15,
                wordCount: 4500,
                views: 7500,
                likes: 425,
                shares: 180,
                engagement: 0.081,
                content: 'Comparativa completa entre Solana y Ethereum con sus respectivas ventajas.',
                difficulty: 'intermediate',
                type: 'comparison'
            }
        ];

        mockContent.forEach(post => {
            this.indexContent(post);
        });
    }

    indexContent(content) {
        // Create content vector for similarity calculations
        const contentVector = this.createContentVector(content);

        // Store content with vector
        this.contentIndex.set(content.id, {
            ...content,
            vector: contentVector,
            metadata: this.extractMetadata(content)
        });

        // Initialize popularity score
        this.popularityScores.set(content.id, this.calculatePopularityScore(content));
    }

    createContentVector(content) {
        // Create feature vector for content similarity
        const features = [];

        // Title features (bag of words)
        const titleWords = this.extractWords(content.title);
        titleWords.forEach(word => features.push(`title:${word}`));

        // Tag features
        content.tags.forEach(tag => {
            features.push(`tag:${tag}`);
        });

        // Category features
        content.categories.forEach(category => {
            features.push(`category:${category}`);
        });

        // Content type features
        features.push(`type:${content.type}`);
        features.push(`difficulty:${content.difficulty}`);

        // Reading time features
        const readingTimeCategory = this.categorizeReadingTime(content.readingTime);
        features.push(`readingTime:${readingTimeCategory}`);

        // Content length features
        const lengthCategory = this.categorizeLength(content.wordCount);
        features.push(`length:${lengthCategory}`);

        // Date features
        const dateRecency = this.categorizeDate(content.date);
        features.push(`recency:${dateRecency}`);

        return features;
    }

    extractMetadata(content) {
        return {
            wordCount: content.wordCount || 0,
            readingTime: content.readingTime || 0,
            engagement: content.engagement || 0,
            views: content.views || 0,
            likes: content.likes || 0,
            shares: content.shares || 0,
            categories: content.categories || [],
            tags: content.tags || [],
            author: content.author,
            type: content.type,
            difficulty: content.difficulty
        };
    }

    extractWords(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2)
            .filter(word => !this.isStopWord(word));
    }

    isStopWord(word) {
        const stopWords = ['el', 'la', 'de', 'y', 'en', 'para', 'con', 'por', 'que', 'como', 'los', 'las', 'un', 'una', 'del', 'se', 'sus', 'les', 'mis', 'misma', 'sin', 'esta', 'este', 'ser', 'será', 'han', 'hemos'];
        return stopWords.includes(word);
    }

    categorizeReadingTime(minutes) {
        if (minutes <= 5) return 'short';
        if (minutes <= 10) return 'medium';
        if (minutes <= 20) return 'long';
        return 'very-long';
    }

    categorizeLength(wordCount) {
        if (wordCount <= 1000) return 'short';
        if (wordCount <= 3000) return 'medium';
        if (wordCount <= 6000) return 'long';
        return 'very-long';
    }

    categorizeDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const daysOld = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (daysOld <= 7) return 'very-recent';
        if (daysOld <= 30) return 'recent';
        if (daysOld <= 90) return 'moderately-old';
        return 'old';
    }

    calculatePopularityScore(content) {
        const views = content.views || 0;
        const likes = content.likes || 0;
        const shares = content.shares || 0;
        const engagement = content.engagement || 0;

        // Weighted combination
        return (views * 0.3) + (likes * 2) + (shares * 5) + (engagement * 100);
    }

    loadUserProfile() {
        try {
            const saved = localStorage.getItem('user_profile');
            if (saved) {
                const profile = JSON.parse(saved);
                this.userProfile = {
                    ...this.userProfile,
                    ...profile,
                    interests: new Map(profile.interests || []),
                    interactions: new Map(profile.interactions || {})
                };
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    saveUserProfile() {
        try {
            const profileToSave = {
                interests: Array.from(this.userProfile.interests.entries()),
                readingHistory: this.userProfile.readingHistory,
                interactions: Array.from(this.userProfile.interactions.entries()),
                preferences: this.userProfile.preferences
            };
            localStorage.setItem('user_profile', JSON.stringify(profileToSave));
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    }

    setupBehaviorTracking() {
        // Track page views
        this.trackPageView();

        // Track reading time
        this.setupReadingTimeTracking();

        // Track interactions
        this.setupInteractionTracking();

        // Track scroll behavior
        this.setupScrollTracking();
    }

    trackPageView() {
        const pageId = this.getCurrentPageId();
        if (!pageId) return;

        // Update reading history
        this.userProfile.readingHistory.unshift({
            pageId,
            timestamp: Date.now(),
            duration: 0
        });

        // Keep only last 100 items
        this.userProfile.readingHistory = this.userProfile.updateReadingHistory.slice(0, 100);

        // Update interests
        const content = this.contentIndex.get(pageId);
        if (content) {
            content.categories.forEach(category => {
                this.userProfile.interests.set(category, (this.userProfile.interests.get(category) || 0) + 1);
            });

            content.tags.forEach(tag => {
                this.userProfile.interests.set(tag, (this.userProfile.interests.get(tag) || 0) + 1);
            });
        }

        this.saveUserProfile();
    }

    setupReadingTimeTracking() {
        let readingStartTime = Date.now();
        let currentArticle = null;

        // Track when user stays on article
        const checkReading = () => {
            const pageId = this.getCurrentPageId();

            if (pageId && pageId !== currentArticle) {
                if (currentArticle) {
                    // Save reading duration for previous article
                    const duration = Date.now() - readingStartTime;
                    const historyItem = this.userProfile.readingHistory.find(item => item.pageId === currentArticle);
                    if (historyItem) {
                        historyItem.duration = duration;
                    }
                }

                currentArticle = pageId;
                readingStartTime = Date.now();
            }
        };

        setInterval(checkReading, 5000);
    }

    setupInteractionTracking() {
        // Track clicks, shares, likes, comments
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a');
            if (target && target.href.includes('/blog/')) {
                const pageId = this.extractPageIdFromUrl(target.href);
                this.trackInteraction('click', pageId);
            }
        });

        // Track social sharing
        document.addEventListener('click', (e) => {
            const shareButton = e.target.closest('[data-share]');
            if (shareButton) {
                const pageId = this.getCurrentPageId();
                this.trackInteraction('share', pageId);
            }
        });
    }

    setupScrollTracking() {
        let maxScrollDepth = 0;
        let startTime = Date.now();

        const updateScrollDepth = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            const scrollPercentage = Math.round((currentScroll / scrollHeight) * 100);

            maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage);
        };

        window.addEventListener('scroll', this.throttle(updateScrollDepth, 100));

        // Record scroll depth when user leaves
        window.addEventListener('beforeunload', () => {
            if (maxScrollDepth > 0) {
                const pageId = this.getCurrentPageId();
                const duration = Date.now() - startTime;
                this.trackInteraction('scroll_depth', pageId, {
                    depth: maxScrollDepth,
                    duration
                });
            }
        });
    }

    trackInteraction(type, pageId, additionalData = {}) {
        const interaction = {
            type,
            pageId,
            timestamp: Date.now(),
            ...additionalData
        };

        this.userActions.push(interaction);

        // Update user preferences
        this.updateUserPreferences(type, pageId);

        // Save interaction data
        const content = this.contentIndex.get(pageId);
        if (content) {
            const existingInteractions = this.userProfile.interactions.get(pageId) || [];
            existingInteractions.push(interaction);
            this.userProfile.interactions.set(pageId, existingInteractions);
        }

        this.saveUserProfile();
    }

    updateUserPreferences(type, pageId) {
        const content = this.contentIndex.get(pageId);
        if (!content) return;

        // Update category preferences
        content.categories.forEach(category => {
            if (type === 'click' || type === 'share') {
                this.userProfile.preferences.categories = [...new Set([...this.userProfile.preferences.categories, category])];
            }
        });

        // Update reading time preference based on actual reading behavior
        if (type === 'click' && content.readingTime) {
            const readingTimeCategory = this.categorizeReadingTime(content.readingTime);
            this.userProfile.preferences.readingTime = readingTimeCategory;
        }

        this.saveUserProfile();
    }

    getCurrentPageId() {
        return this.extractPageIdFromUrl(window.location.pathname);
    }

    extractPageIdFromUrl(url) {
        const match = url.match(/\/blog\/([^\/\?]+)/);
        return match ? match[1] : null;
    }

    loadCollaborativeData() {
        try {
            const saved = localStorage.getItem('collaborative_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.collaborativeMatrix = new Map(data);
            }
        } catch (error) {
            console.error('Error loading collaborative data:', error);
        }
    }

    saveCollaborativeData() {
        try {
            const data = Array.from(this.collaborativeMatrix.entries());
            localStorage.setItem('collaborative_data', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving collaborative data:', error);
        }
    }

    loadPopularityData() {
        try {
            const saved = localStorage.getItem('popularity_scores');
            if (saved) {
                const data = JSON.parse(saved);
                this.popularityScores = new Map(data);
            }
        } catch (error) {
            console.error('Error loading popularity data:', error);
        }
    }

    savePopularityData() {
        try {
            const data = Array.from(this.popularityScores.entries());
            localStorage.setItem('popularity_scores', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving popularity data:', error);
        }
    }

    setupRealTimeUpdates() {
        // Update scores periodically
        setInterval(() => {
            this.updateScores();
        }, 60000); // Every minute

        // Clean old interaction data
        setInterval(() => {
            this.cleanupOldData();
        }, 300000); // Every 5 minutes
    }

    updateScores() {
        // Update popularity scores based on recent activity
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;

        this.contentIndex.forEach((content, id) => {
            const daysOld = (now - new Date(content.date).getTime()) / dayInMs;
            const timeDecay = Math.pow(0.95, Math.min(daysOld / 7, 30)); // Decay over weeks

            const currentScore = this.popularityScores.get(id) || 0;
            const adjustedScore = currentScore * timeDecay;

            this.popularityScores.set(id, adjustedScore);
        });

        this.savePopularityData();
    }

    cleanupOldData() {
        // Clean old interaction data (keep last 30 days)
        const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);

        this.userActions = this.userActions.filter(action => action.timestamp > cutoff);

        // Clean old reading history (keep last 50 items)
        this.userProfile.readingHistory = this.userProfile.readingHistory.slice(0, 50);

        // Clean old interactions
        this.userProfile.interactions.forEach((interactions, pageId) => {
            const recentInteractions = interactions.filter(interaction => interaction.timestamp > cutoff);
            this.userProfile.interactions.set(pageId, recentInteractions);
        });

        this.saveUserProfile();
    }

    initializeAlgorithms() {
        // Initialize algorithm-specific data structures
        this.algorithms = {
            collaborative: {
                userSimilarity: new Map(),
                itemSimilarity: new Map()
            },
            contentBased: {
                contentSimilarity: new Map()
            },
            popularity: {
                trending: new Map(),
                personalized: new Map()
            }
        };
    }

    // Main recommendation method
    getRecommendations(userContext = {}) {
        const {
            currentPageId = this.getCurrentPageId(),
            maxRecommendations = this.options.maxRecommendations,
            excludeViewed = true,
            algorithm = 'hybrid'
        } = userContext;

        // Get content to exclude
        const excludeIds = excludeViewed ? this.getViewedContent() : [currentPageId].filter(Boolean);

        // Generate recommendations using specified algorithm
        let recommendations = [];

        switch (algorithm) {
            case 'collaborative':
                recommendations = this.getCollaborativeRecommendations(excludeIds);
                break;
            case 'content':
                recommendations = this.getContentBasedRecommendations(excludeIds);
                break;
            case 'popularity':
                recommendations = this.getPopularityBasedRecommendations(excludeIds);
                break;
            case 'hybrid':
            default:
                recommendations = this.getHybridRecommendations(excludeIds);
                break;
        }

        // Apply filters and final ranking
        recommendations = this.applyRecommendationFilters(recommendations);
        recommendations = this.rankRecommendations(recommendations);

        // Limit results
        return recommendations.slice(0, maxRecommendations);
    }

    getCollaborativeRecommendations(excludeIds = []) {
        if (!this.options.enableCollaborative || this.userActions.length < 5) {
            return this.getContentBasedRecommendations(excludeIds);
        }

        const recommendations = [];
        const userInteractions = this.getUserInteractionVector();

        this.contentIndex.forEach((content, id) => {
            if (excludeIds.includes(id)) return;

            const itemInteractions = this.getItemInteractionVector(id);
            const similarity = this.calculateCosineSimilarity(userInteractions, itemInteractions);

            if (similarity > this.options.minScore) {
                recommendations.push({
                    content,
                    score: similarity * this.options.algorithmWeights.collaborative,
                    algorithm: 'collaborative',
                    reason: 'Users with similar interests liked this'
                });
            }
        });

        return recommendations.sort((a, b) => b.score - a.score);
    }

    getContentBasedRecommendations(excludeIds = []) {
        const recommendations = [];
        const userProfile = this.createUserProfileVector();

        this.contentIndex.forEach((content, id) => {
            if (excludeIds.includes(id)) return;

            const contentVector = this.createContentVector(content);
            const similarity = this.calculateCosineSimilarity(userProfile, contentVector);

            if (similarity > this.options.minScore) {
                recommendations.push({
                    content,
                    score: similarity * this.options.algorithmWeights.contentBased,
                    algorithm: 'content',
                    reason: 'Similar to your interests'
                });
            }
        });

        return recommendations.sort((a, b) => b.score - a.score);
    }

    getPopularityBasedRecommendations(excludeIds = []) {
        const recommendations = [];

        this.contentIndex.forEach((content, id) => {
            if (excludeIds.includes(id)) return;

            const popularityScore = this.popularityScores.get(id) || 0;
            const personalization = this.getPersonalizationScore(content);

            const totalScore = (popularityScore * 0.7) + (personalization * 0.3);

            if (totalScore > this.options.minScore) {
                recommendations.push({
                    content,
                    score: totalScore * this.options.algorithmWeights.popularity,
                    algorithm: 'popularity',
                    reason: 'Popular content'
                });
            }
        });

        return recommendations.sort((a, b) => b.score - a.score);
    }

    getHybridRecommendations(excludeIds = []) {
        // Get recommendations from all algorithms
        const collaborative = this.getCollaborativeRecommendations(excludeIds);
        const contentBased = this.getContentBasedRecommendations(excludeIds);
        const popularityBased = this.getPopularityBasedRecommendations(excludeIds);

        // Combine and weight recommendations
        const allRecommendations = new Map();

        // Add collaborative recommendations
        collaborative.forEach(rec => {
            const key = rec.content.id;
            const existing = allRecommendations.get(key);
            const score = (existing?.score || 0) + rec.score;

            allRecommendations.set(key, {
                content: rec.content,
                score: score,
                algorithms: [...(existing?.algorithms || []), rec.algorithm],
                reasons: [...(existing?.reasons || []), rec.reason]
            });
        });

        // Add content-based recommendations
        contentBased.forEach(rec => {
            const key = rec.content.id;
            const existing = allRecommendations.get(key);
            const score = (existing?.score || 0) + rec.score;

            allRecommendations.set(key, {
                content: rec.content,
                score: score,
                algorithms: [...(existing?.algorithms || []), rec.algorithm],
                reasons: [...(existing?.reasons || []), rec.reason]
            });
        });

        // Add popularity-based recommendations
        popularityBased.forEach(rec => {
            const key = rec.content.id;
            const existing = allRecommendations.get(key);
            const score = (existing?.score || 0) + rec.score;

            allRecommendations.set(key, {
                content: rec.content,
                score: score,
                algorithms: [...(existing?.algorithms || []), rec.algorithm],
                reasons: [...(existing?.reasons || []), rec.reason]
            });
        });

        // Convert to array and sort
        return Array.from(allRecommendations.values())
            .sort((a, b) => b.score - a.score);
    }

    applyRecommendationFilters(recommendations) {
        return recommendations.filter(rec => {
            // Filter out already viewed content
            const isViewed = this.isContentViewed(rec.content.id);

            // Filter by user preferences
            const matchesPreferences = this.matchesUserPreferences(rec.content);

            // Apply minimum score filter
            const meetsMinScore = rec.score >= this.options.minScore;

            return !isViewed && matchesPreferences && meetsMinScore;
        });
    }

    rankRecommendations(recommendations) {
        // Apply final ranking algorithm
        return recommendations.map(rec => {
            // Add freshness bonus
            const freshnessScore = this.calculateFreshnessScore(rec.content);
            rec.score += freshnessScore * 0.1;

            // Add diversity bonus
            const diversityScore = this.calculateDiversityScore(rec, recommendations);
            rec.score += diversityScore * 0.1;

            return rec;
        }).sort((a, b) => b.score - a.score);
    }

    getUserInteractionVector() {
        const vector = new Map();

        this.userActions.forEach(action => {
            const content = this.contentIndex.get(action.pageId);
            if (!content) return;

            const features = this.getContentFeatures(content);
            features.forEach(feature => {
                vector.set(feature, (vector.get(feature) || 0) + 1);
            });
        });

        return vector;
    }

    getItemInteractionVector(contentId) {
        const interactions = this.userProfile.interactions.get(contentId) || [];
        const vector = new Map();

        interactions.forEach(interaction => {
            const features = this.getContentFeatures(this.contentIndex.get(contentId));
            const weight = this.getInteractionWeight(interaction.type);

            features.forEach(feature => {
                vector.set(feature, (vector.get(feature) || 0) + weight);
            });
        });

        return vector;
    }

    createUserProfileVector() {
        const vector = new Map();

        // User interests
        this.userProfile.interests.forEach((count, interest) => {
            vector.set(`interest:${interest}`, Math.min(count, 10) / 10);
        });

        // User preferences
        this.userProfile.preferences.categories.forEach(category => {
            vector.set(`preference:category:${category}`, 1);
        });

        this.userProfile.preferences.tags.forEach(tag => {
            vector.set(`preference:tag:${tag}`, 1);
        });

        return vector;
    }

    getContentFeatures(content) {
        const features = [];

        // Title features
        const titleWords = this.extractWords(content.title);
        titleWords.forEach(word => {
            features.push(`title:${word}`);
        });

        // Tag features
        content.tags.forEach(tag => {
            features.push(`tag:${tag}`);
        });

        // Category features
        content.categories.forEach(category => {
            features.push(`category:${category}`);
        });

        // Type features
        features.push(`type:${content.type}`);
        features.push(`difficulty:${content.difficulty}`);

        // Reading time features
        features.push(`readingTime:${this.categorizeReadingTime(content.readingTime)}`);

        // Content length features
        features.push(`length:${this.categorizeLength(content.wordCount)}`);

        return features;
    }

    getInteractionWeight(interactionType) {
        const weights = {
            'click': 1,
            'share': 3,
            'like': 2,
            'comment': 5,
            'bookmark': 4,
            'scroll_depth': 0.5
        };

        return weights[interactionType] || 1;
    }

    calculateCosineSimilarity(vector1, vector2) {
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;

        // Calculate dot product
        vector1.forEach((value, key) => {
            const value2 = vector2.get(key) || 0;
            dotProduct += value * value2;
            magnitude1 += value * value;
        });

        // Calculate magnitudes
        vector2.forEach(value => {
            magnitude2 += value * value;
        });

        // Calculate cosine similarity
        if (magnitude1 === 0 || magnitude2 === 0) return 0;

        return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
    }

    calculateFreshnessScore(content) {
        const now = Date.now();
        const contentDate = new Date(content.date);
        const daysOld = Math.floor((now - contentDate.getTime()) / (1000 * 60 * 60 * 24));

        // Freshness bonus for recent content
        if (daysOld <= 7) return 0.2;
        if (daysOld <= 30) return 0.1;
        if (daysOld <= 90) return 0.05;
        return 0;
    }

    calculateDiversityScore(target, recommendations) {
        // Penalize similar content in recommendations
        let diversityPenalty = 0;

        recommendations.forEach(rec => {
            const similarity = this.calculateContentSimilarity(target.content, rec.content);
            if (similarity > 0.7) {
                diversityPenalty += similarity * 0.1;
            }
        });

        return Math.max(0, -diversityPenalty);
    }

    calculateContentSimilarity(content1, content2) {
        const features1 = new Set([...this.getContentFeatures(content1), ...content1.tags, ...content1.categories]);
        const features2 = new Set([...this.getContentFeatures(content2), ...content2.tags, ...content2.categories]);

        const intersection = new Set([...features1].filter(x => features2.has(x)));
        const union = new Set([...features1, ...features2]);

        if (union.size === 0) return 0;

        return intersection.size / union.size;
    }

    getPersonalizationScore(content) {
        let score = 0;

        // Interest alignment
        content.categories.forEach(category => {
            if (this.userProfile.interests.has(category)) {
                score += 0.3;
            }
        });

        content.tags.forEach(tag => {
            if (this.userProfile.interests.has(tag)) {
                score += 0.2;
            }
        });

        // Preference alignment
        if (this.userProfile.preferences.categories.includes(content.categories[0])) {
            score += 0.2;
        }

        return Math.min(score, 1);
    }

    isContentViewed(contentId) {
        return this.userProfile.readingHistory.some(item => item.pageId === contentId);
    }

    getViewedContent() {
        return this.userProfile.readingHistory.map(item => item.pageId);
    }

    matchesUserPreferences(content) {
        const categoriesMatch = content.categories.some(cat =>
            this.userProfile.preferences.categories.includes(cat)
        );

        const tagsMatch = content.tags.some(tag =>
            this.userProfile.preferences.tags.includes(tag)
        );

        return categoriesMatch || tagsMatch;
    }

    // Caching methods
    getCachedRecommendations(userContext = {}) {
        const cacheKey = this.generateCacheKey(userContext);
        const cached = this.recommendationCache.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp < this.options.cacheTimeout)) {
            return cached.recommendations;
        }

        return null;
    }

    cacheRecommendations(recommendations, userContext = {}) {
        const cacheKey = this.generateCacheKey(userContext);

        this.recommendationCache.set(cacheKey, {
            recommendations,
            timestamp: Date.now(),
            userContext
        });

        // Clean old cache entries
        this.cleanCache();
    }

    generateCacheKey(userContext) {
        const {
            currentPageId = this.getCurrentPageId(),
            algorithm = 'hybrid',
            maxRecommendations = this.options.maxRecommendations
        } = userContext;

        return `${currentPageId}:${algorithm}:${maxRecommendations}`;
    }

    cleanCache() {
        const now = Date.now();
        for (const [key, value] of this.recommendationCache.entries()) {
            if (now - value.timestamp > this.options.cacheTimeout) {
                this.recommendationCache.delete(key);
            }
        }
    }

    // Analytics methods
    trackRecommendationEvent(event, data) {
        if (!this.options.enableAnalytics) return;

        if (typeof gtag !== 'undefined') {
            gtag('event', event, {
                ...data,
                custom_parameter_1: 'recommendations'
            });
        }

        // Save to recommendation history
        this.recommendationHistory.push({
            event,
            data,
            timestamp: Date.now()
        });

        // Limit history size
        if (this.recommendationHistory.length > 100) {
            this.recommendationHistory = this.recommendationHistory.slice(-100);
        }
    }

    // Performance optimization
    precomputeSimilarityMatrices() {
        console.log('🔄 Precomputing similarity matrices...');

        const contentIds = Array.from(this.contentIndex.keys());

        // Precompute user similarity matrix
        const userVectors = this.getUserInteractionVectors();

        // Precompute item similarity matrix for frequently viewed content
        const viewedContent = this.getViewedContent().slice(0, 20);

        viewedContent.forEach(id => {
            viewedContent.forEach(otherId => {
                if (id !== otherId) {
                    const similarity = this.calculateCosineSimilarity(
                        this.getItemInteractionVector(id),
                        this.getItemInteractionVector(otherId)
                    );

                    if (!this.algorithms.collaborative.itemSimilarity.has(id)) {
                        this.algorithms.collaborative.itemSimilarity.set(id, new Map());
                    }

                    this.algorithms.collaborative.itemSimilarity.get(id).set(otherId, similarity);
                }
            });
        });

        console.log('✅ Precomputation completed');
    }

    getUserInteractionVectors() {
        // Return all user interaction vectors
        const vectors = new Map();

        this.userProfile.interactions.forEach((interactions, pageId) => {
            vectors.set(pageId, this.getItemInteractionVector(pageId));
        });

        return vectors;
    }

    // Real-time updates
    updateRecommendationsInRealTime() {
        // Set up WebSocket connection for real-time updates
        this.setupWebSocketConnection();
    }

    setupWebSocketConnection() {
        // Implementation would connect to real-time recommendation server
        console.log('🔗 Real-time recommendations feature would connect to WebSocket server');
    }

    // Utility functions
    throttle(func, wait) {
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

    // Public API
    recommendForUser(userId, options = {}) {
        // Override user context with specific user ID
        const userContext = {
            ...options,
            userId
        };

        return this.getRecommendations(userContext);
    }

    updateUserInteraction(contentId, interactionType, value = 1) {
        // Track interaction for collaborative filtering
        const weight = this.getInteractionWeight(interactionType);
        const currentScore = this.popularityScores.get(contentId) || 0;
        this.popularityScores.set(contentId, currentScore + weight);

        // Update user interactions
        const existingInteractions = this.userProfile.interactions.get(contentId) || [];
        existingInteractions.push({
            type: interactionType,
            timestamp: Date.now(),
            value
        });
        this.userProfile.interactions.set(contentId, existingInteractions);

        // Save changes
        this.saveUserProfile();
        this.savePopularityData();

        // Invalidate cache
        this.recommendationCache.clear();

        // Track analytics
        this.trackRecommendationEvent('content_interaction', {
            contentId,
            interactionType,
            value,
            currentScore: currentScore + weight
        });
    }

    getRecommendationInsights(recommendations = null) {
        const recs = recommendations || this.searchResults;

        return {
            total: recs.length,
            algorithmsUsed: [...new Set(recs.map(r => r.algorithm))],
            averageScore: recs.reduce((sum, r) => sum + r.score, 0) / recs.length,
            scoreDistribution: this.getScoreDistribution(recs),
            diversity: this.calculateDiversity(recs)
        };
    }

    getScoreDistribution(recommendations) {
        const distribution = {
            low: 0,
            medium: 0,
            high: 0
        };

        recommendations.forEach(rec => {
            if (rec.score < 0.3) distribution.low++;
            else if (rec.score < 0.7) distribution.medium++;
            else distribution.high++;
        });

        return distribution;
    }

    calculateDiversity(recommendations) {
        const categories = new Set();
        const tags = new Set();
        let diversityScore = 0;

        recommendations.forEach(rec => {
            // Category diversity
            rec.content.categories.forEach(cat => {
                if (!categories.has(cat)) {
                    categories.add(cat);
                    diversityScore += 0.1;
                }
            });

            // Tag diversity
            rec.content.tags.forEach(tag => {
                if (!tags.has(tag)) {
                    tags.add(tag);
                    diversityScore += 0.05;
                }
            });
        });

        return Math.min(diversityScore, 1);
    }

    // Export recommendation data for analysis
    exportRecommendationData() {
        return {
            userProfile: this.userProfile,
            collaborativeMatrix: Array.from(this.collaborativeMatrix.entries()),
            popularityScores: Array.from(this.popularityScores.entries()),
            recommendationHistory: this.recommendationHistory,
            contentIndex: Array.from(this.contentIndex.entries()).map(([id, content]) => ({
                id,
                ...content
            })),
            algorithms: this.algorithms,
            config: this.options
        };
    }
}

// Initialize recommendation engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.recommendationEngine = new ContentRecommendationEngine({
        algorithmWeights: {
            collaborative: 0.4,
            contentBased: 0.3,
            popularity: 0.2,
            hybrid: 0.1
        },
        maxRecommendations: 6,
        enablePersonalization: true,
        enableCollaborative: true,
        enableAnalytics: true
    });

    // Precompute similarity matrices after initialization
    setTimeout(() => {
        window.recommendationEngine.precomputeSimilarityMatrices();
    }, 2000);

    // Set up real-time updates
    setTimeout(() => {
        window.recommendationEngine.updateRecommendationsInRealTime();
    }, 5000);

    console.log('🤖 Content Recommendation Engine loaded');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentRecommendationEngine;
}