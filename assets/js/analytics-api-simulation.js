/**
 * Analytics API Simulation
 * Provides mock data for the analytics dashboard
 */

class AnalyticsAPI {
    constructor() {
        this.data = {
            realTime: this.generateRealTimeData(),
            historical: this.generateHistoricalData(),
            content: this.generateContentData(),
            performance: this.generatePerformanceData(),
            demographics: this.generateDemographicsData(),
            conversions: this.generateConversionsData(),
            userBehavior: this.generateUserBehaviorData(),
            seo: this.generateSEOData()
        };
    }

    generateRealTimeData() {
        return {
            activeUsers: Math.floor(Math.random() * 50) + 15,
            pageViews: Math.floor(Math.random() * 1000) + 500,
            bounceRate: Math.random() * 40 + 25,
            avgSessionDuration: Math.floor(Math.random() * 300) + 120,
            topPages: [
                { path: '/blockchain-intro', users: Math.floor(Math.random() * 30) + 10 },
                { path: '/ml-basics', users: Math.floor(Math.random() * 25) + 8 },
                { path: '/crypto-trading', users: Math.floor(Math.random() * 20) + 6 },
                { path: '/nft-guide', users: Math.floor(Math.random() * 18) + 5 },
                { path: '/defi-explained', users: Math.floor(Math.random() * 15) + 4 }
            ],
            trafficSources: [
                { name: 'Directo', percentage: Math.random() * 20 + 40 },
                { name: 'Google', percentage: Math.random() * 15 + 25 },
                { name: 'Twitter', percentage: Math.random() * 10 + 10 },
                { name: 'LinkedIn', percentage: Math.random() * 8 + 5 },
                { name: 'Reddit', percentage: Math.random() * 7 + 3 }
            ],
            deviceStats: {
                desktop: Math.random() * 20 + 45,
                mobile: Math.random() * 15 + 35,
                tablet: Math.random() * 10 + 10
            }
        };
    }

    generateHistoricalData() {
        const now = new Date();
        const pageViews = [];
        const uniqueVisitors = [];
        const bounceRate = [];
        const avgSessionDuration = [];

        for (let i = 90; i >= 0; i--) {
            const date = new Date(now - i * 24 * 60 * 60 * 1000);
            const baseViews = 800 + Math.sin(i / 7) * 200;
            const baseVisitors = 400 + Math.sin(i / 7) * 100;

            pageViews.push({
                date: date.toISOString(),
                value: Math.floor(baseViews + Math.random() * 400)
            });

            uniqueVisitors.push({
                date: date.toISOString(),
                value: Math.floor(baseVisitors + Math.random() * 200)
            });

            bounceRate.push({
                date: date.toISOString(),
                value: Math.random() * 30 + 30
            });

            avgSessionDuration.push({
                date: date.toISOString(),
                value: Math.floor(Math.random() * 180) + 120
            });
        }

        return {
            pageViews,
            uniqueVisitors,
            bounceRate,
            avgSessionDuration
        };
    }

    generateContentData() {
        const posts = [
            'Introducción a Blockchain',
            'Machine Learning para Principiantes',
            'Guía de Trading de Criptomonedas',
            'NFT: Todo lo que necesitas saber',
            'DeFi: Finanzas Descentralizadas',
            'Inteligencia Artificial en el 2024',
            'Smart Contracts con Solidity',
            'Python para Data Science',
            'Web3: La nueva internet',
            'Criptomonedas vs Acciones'
        ];

        const popularPosts = posts.map((title, index) => ({
            title,
            views: Math.floor(Math.random() * 600) + 200 - (index * 30),
            url: `/${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
            avgTimeOnPage: Math.floor(Math.random() * 300) + 120,
            bounceRate: Math.random() * 30 + 20,
            ctr: Math.random() * 8 + 2
        })).sort((a, b) => b.views - a.views);

        const searchQueries = [
            'blockchain tutorial',
            'machine learning basics',
            'bitcoin price prediction',
            'nft how to create',
            'defi platforms',
            'smart contract example',
            'python ai tutorial',
            'web3 development',
            'crypto trading strategies',
            'solidity programming'
        ].map(query => ({
            query,
            count: Math.floor(Math.random() * 100) + 10,
            ctr: Math.random() * 15 + 5
        })).sort((a, b) => b.count - a.count);

        return {
            popularPosts,
            searchQueries,
            recommendations: {
                ctr: Math.random() * 8 + 3,
                clickData: this.generateRecommendationData()
            }
        };
    }

    generateRecommendationData() {
        const data = [];
        for (let i = 0; i < 30; i++) {
            data.push({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
                shown: Math.floor(Math.random() * 1000) + 500,
                clicked: Math.floor(Math.random() * 100) + 20
            });
        }
        return data;
    }

    generatePerformanceData() {
        return {
            webVitals: {
                lcp: Math.random() * 2 + 1.5, // 1.5-3.5s
                fid: Math.random() * 100 + 50, // 50-150ms
                cls: Math.random() * 0.3, // 0-0.3
                fcp: Math.random() * 2 + 1, // 1-3s
                ttfb: Math.random() * 200 + 100 // 100-300ms
            },
            pageLoadTimes: this.generatePageLoadTimes(),
            resourceTiming: this.generateResourceTiming(),
            uptime: 99.9 + Math.random() * 0.09 // 99.9-99.99%
        };
    }

    generatePageLoadTimes() {
        const pages = [
            'Página principal',
            'Artículos',
            'Búsqueda',
            'Contacto',
            'Newsletter',
            'Analytics'
        ];

        return pages.map(page => ({
            page,
            averageTime: Math.random() * 2 + 1,
            p50: Math.random() * 1.5 + 0.8,
            p75: Math.random() * 2 + 1,
            p90: Math.random() * 3 + 2,
            p95: Math.random() * 4 + 2.5
        }));
    }

    generateResourceTiming() {
        return {
            images: Math.random() * 500 + 200,
            scripts: Math.random() * 300 + 100,
            styles: Math.random() * 200 + 50,
            fonts: Math.random() * 150 + 30,
            api: Math.random() * 100 + 20
        };
    }

    generateDemographicsData() {
        const countries = {
            'España': Math.floor(Math.random() * 1000) + 500,
            'México': Math.floor(Math.random() * 800) + 400,
            'Argentina': Math.floor(Math.random() * 600) + 300,
            'Colombia': Math.floor(Math.random() * 500) + 250,
            'Chile': Math.floor(Math.random() * 400) + 200,
            'Perú': Math.floor(Math.random() * 350) + 180,
            'Venezuela': Math.floor(Math.random() * 300) + 150,
            'Estados Unidos': Math.floor(Math.random() * 450) + 220,
            'Italia': Math.floor(Math.random() * 250) + 120,
            'Francia': Math.floor(Math.random() * 200) + 100
        };

        const cities = {
            'Madrid': Math.floor(Math.random() * 300) + 150,
            'Barcelona': Math.floor(Math.random() * 250) + 120,
            'México DF': Math.floor(Math.random() * 200) + 100,
            'Buenos Aires': Math.floor(Math.random() * 180) + 90,
            'Bogotá': Math.floor(Math.random() * 150) + 75,
            'Santiago': Math.floor(Math.random() * 120) + 60,
            'Lima': Math.floor(Math.random() * 100) + 50,
            'Valencia': Math.floor(Math.random() * 80) + 40,
            'Sevilla': Math.floor(Math.random() * 70) + 35,
            'Bilbao': Math.floor(Math.random() * 60) + 30
        };

        const languages = {
            'Español': 65 + Math.random() * 20,
            'Inglés': 15 + Math.random() * 10,
            'Portugués': 5 + Math.random() * 5,
            'Francés': 3 + Math.random() * 3,
            'Italiano': 2 + Math.random() * 2,
            'Alemán': 1 + Math.random() * 2,
            'Otro': 3 + Math.random() * 3
        };

        const ageGroups = {
            '18-24': 15 + Math.random() * 10,
            '25-34': 30 + Math.random() * 15,
            '35-44': 25 + Math.random() * 10,
            '45-54': 15 + Math.random() * 8,
            '55-64': 8 + Math.random() * 4,
            '65+': 2 + Math.random() * 3
        };

        const genders = {
            'Masculino': 60 + Math.random() * 10,
            'Femenino': 35 + Math.random() * 8,
            'Otro': 2 + Math.random() * 2,
            'No especificado': 3 + Math.random() * 3
        };

        return {
            countries,
            cities,
            languages,
            ageGroups,
            genders,
            devices: {
                desktop: 50 + Math.random() * 10,
                mobile: 35 + Math.random() * 10,
                tablet: 8 + Math.random() * 5,
                smart_tv: 2 + Math.random() * 2,
                console: 1 + Math.random() * 1
            },
            browsers: {
                chrome: 60 + Math.random() * 15,
                safari: 15 + Math.random() * 8,
                firefox: 8 + Math.random() * 5,
                edge: 8 + Math.random() * 4,
                opera: 3 + Math.random() * 2,
                other: 3 + Math.random() * 2
            }
        };
    }

    generateConversionsData() {
        return {
            newsletterSignups: Math.floor(Math.random() * 100) + 50,
            commentSubmissions: Math.floor(Math.random() * 80) + 30,
            socialShares: Math.floor(Math.random() * 120) + 80,
            goalCompletions: [
                {
                    goal: 'Newsletter Signup',
                    completed: Math.floor(Math.random() * 50) + 25,
                    rate: Math.random() * 10 + 5
                },
                {
                    goal: 'Comment Submitted',
                    completed: Math.floor(Math.random() * 40) + 20,
                    rate: Math.random() * 8 + 3
                },
                {
                    goal: 'Social Share',
                    completed: Math.floor(Math.random() * 60) + 30,
                    rate: Math.random() * 15 + 5
                },
                {
                    goal: 'Search Used',
                    completed: Math.floor(Math.random() * 200) + 100,
                    rate: Math.random() * 25 + 10
                },
                {
                    goal: 'Recommendation Click',
                    completed: Math.floor(Math.random() * 80) + 40,
                    rate: Math.random() * 12 + 4
                }
            ],
            funnel: {
                visitors: Math.floor(Math.random() * 5000) + 10000,
                article_readers: Math.floor(Math.random() * 3000) + 5000,
                engaged_users: Math.floor(Math.random() * 1500) + 2000,
                newsletter_signup: Math.floor(Math.random() * 500) + 800,
                comment_authors: Math.floor(Math.random() * 200) + 300
            }
        };
    }

    generateUserBehaviorData() {
        return {
            scrollDepth: this.generateScrollDepthData(),
            clickHeatmap: this.generateHeatmapData(),
            navigationFlow: this.generateNavigationFlow(),
            timeOnPage: this.generateTimeOnPageData(),
            interactions: {
                clicks: Math.floor(Math.random() * 10000) + 5000,
                scrolls: Math.floor(Math.random() * 5000) + 3000,
                hovers: Math.floor(Math.random() * 15000) + 8000,
                form_submissions: Math.floor(Math.random() * 200) + 100,
                video_plays: Math.floor(Math.random() * 500) + 200
            }
        };
    }

    generateScrollDepthData() {
        const data = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                percentage: Math.floor(Math.random() * 100),
                count: Math.floor(Math.random() * 100) + 10
            });
        }
        return data;
    }

    generateHeatmapData() {
        const data = [];
        for (let i = 0; i < 500; i++) {
            data.push({
                x: Math.floor(Math.random() * 1920),
                y: Math.floor(Math.random() * 3000),
                intensity: Math.random()
            });
        }
        return data;
    }

    generateNavigationFlow() {
        return [
            { from: 'home', to: 'blog', count: Math.floor(Math.random() * 500) + 200 },
            { from: 'blog', to: 'article', count: Math.floor(Math.random() * 400) + 150 },
            { from: 'article', to: 'recommendation', count: Math.floor(Math.random() * 100) + 50 },
            { from: 'article', to: 'comment', count: Math.floor(Math.random() * 80) + 30 },
            { from: 'search', to: 'article', count: Math.floor(Math.random() * 300) + 100 },
            { from: 'social', to: 'home', count: Math.floor(Math.random() * 200) + 80 }
        ];
    }

    generateTimeOnPageData() {
        const pages = ['home', 'blog', 'article', 'search', 'contact'];
        return pages.map(page => ({
            page,
            avgTime: Math.floor(Math.random() * 300) + 60,
            p25: Math.floor(Math.random() * 60) + 30,
            p50: Math.floor(Math.random() * 120) + 60,
            p75: Math.floor(Math.random() * 240) + 120,
            p90: Math.floor(Math.random() * 360) + 180
        }));
    }

    generateSEOData() {
        const keywords = [
            { keyword: 'blockchain tutorial', position: Math.floor(Math.random() * 10) + 1, traffic: Math.floor(Math.random() * 1000) + 200 },
            { keyword: 'machine learning basics', position: Math.floor(Math.random() * 15) + 1, traffic: Math.floor(Math.random() * 800) + 150 },
            { keyword: 'crypto trading guide', position: Math.floor(Math.random() * 20) + 1, traffic: Math.floor(Math.random() * 600) + 100 },
            { keyword: 'nft explained', position: Math.floor(Math.random() * 12) + 1, traffic: Math.floor(Math.random() * 400) + 80 },
            { keyword: 'defi tutorial', position: Math.floor(Math.random() * 18) + 1, traffic: Math.floor(Math.random() * 300) + 60 }
        ];

        return {
            organicTraffic: this.generateOrganicTrafficData(),
            keywordRankings: keywords,
            backlinks: Math.floor(Math.random() * 500) + 100,
            crawlErrors: Math.floor(Math.random() * 10) + 1,
            indexedPages: Math.floor(Math.random() * 50) + 100,
            coreWebVitals: {
                good: Math.floor(Math.random() * 30) + 70,
                needs_improvement: Math.floor(Math.random() * 20) + 20,
                poor: Math.floor(Math.random() * 10) + 5
            }
        };
    }

    generateOrganicTrafficData() {
        const data = [];
        for (let i = 90; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            data.push({
                date: date.toISOString(),
                value: Math.floor(Math.random() * 300) + 200 + Math.sin(i / 7) * 50
            });
        }
        return data;
    }

    // API Methods
    async getRealTimeData() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.generateRealTimeData();
    }

    async getHistoricalData(range = '30d') {
        await new Promise(resolve => setTimeout(resolve, 200));

        let days = 30;
        switch (range) {
            case '7d': days = 7; break;
            case '30d': days = 30; break;
            case '90d': days = 90; break;
            case '365d': days = 365; break;
        }

        return {
            pageViews: this.data.historical.pageViews.slice(-days),
            uniqueVisitors: this.data.historical.uniqueVisitors.slice(-days),
            bounceRate: this.data.historical.bounceRate.slice(-days),
            avgSessionDuration: this.data.historical.avgSessionDuration.slice(-days)
        };
    }

    async getContentData() {
        await new Promise(resolve => setTimeout(resolve, 150));
        return this.data.content;
    }

    async getPerformanceData() {
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.data.performance;
    }

    async getDemographicsData() {
        await new Promise(resolve => setTimeout(resolve, 150));
        return this.data.demographics;
    }

    async getConversionsData() {
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.data.conversions;
    }

    async getUserBehaviorData() {
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.data.userBehavior;
    }

    async getSEOData() {
        await new Promise(resolve => setTimeout(resolve, 150));
        return this.data.seo;
    }

    async exportData(format, dateRange, sections) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const exportData = {
            generated: new Date().toISOString(),
            dateRange,
            sections,
            data: this.data
        };

        switch (format) {
            case 'csv':
                return this.formatAsCSV(exportData);
            case 'json':
                return this.formatAsJSON(exportData);
            case 'pdf':
                return this.formatAsPDF(exportData);
            default:
                throw new Error('Unsupported format');
        }
    }

    formatAsCSV(data) {
        let csv = 'Category,Metric,Value,Date\n';

        // Add page views
        data.data.historical.pageViews.forEach(item => {
            csv += `Traffic,Page Views,${item.value},${item.date}\n`;
        });

        // Add unique visitors
        data.data.historical.uniqueVisitors.forEach(item => {
            csv += `Traffic,Unique Visitors,${item.value},${item.date}\n`;
        });

        return csv;
    }

    formatAsJSON(data) {
        return JSON.stringify(data, null, 2);
    }

    formatAsPDF(data) {
        // In a real implementation, this would use a PDF library
        return 'PDF export would be generated here';
    }
}

// Mock API router for demo purposes
class AnalyticsAPIRouter {
    constructor() {
        this.api = new AnalyticsAPI();
        this.setupRoutes();
    }

    setupRoutes() {
        // Intercept fetch calls to /api/analytics
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const [url, options] = args;

            if (url.toString().includes('/api/analytics')) {
                return this.handleAPIRequest(url, options);
            }

            return originalFetch(...args);
        };
    }

    async handleAPIRequest(url, options) {
        try {
            const urlObj = new URL(url.toString(), window.location.origin);
            const path = urlObj.pathname;
            const params = urlObj.searchParams;

            let data;

            if (path.includes('/realtime')) {
                data = await this.api.getRealTimeData();
            } else if (path.includes('/historical')) {
                const range = params.get('range') || '30d';
                data = await this.api.getHistoricalData(range);
            } else if (path.includes('/content')) {
                data = await this.api.getContentData();
            } else if (path.includes('/performance')) {
                data = await this.api.getPerformanceData();
            } else if (path.includes('/demographics')) {
                data = await this.api.getDemographicsData();
            } else if (path.includes('/conversions')) {
                data = await this.api.getConversionsData();
            } else if (path.includes('/user-behavior')) {
                data = await this.api.getUserBehaviorData();
            } else if (path.includes('/seo')) {
                data = await this.api.getSEOData();
            } else if (path.includes('/export')) {
                const format = params.get('format') || 'json';
                const dateRange = params.get('dateRange') || '30d';
                const sections = params.get('sections')?.split(',') || ['all'];
                data = await this.api.exportData(format, dateRange, sections);
            } else {
                // Default: return all data
                data = {
                    historical: await this.api.getHistoricalData(),
                    content: await this.api.getContentData(),
                    performance: await this.api.getPerformanceData(),
                    demographics: await this.api.getDemographicsData(),
                    conversions: await this.api.getConversionsData(),
                    userBehavior: await this.api.getUserBehaviorData(),
                    seo: await this.api.getSEOData()
                };
            }

            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

        } catch (error) {
            console.error('Analytics API Error:', error);

            return new Response(JSON.stringify({
                error: 'Internal Server Error',
                message: error.message
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    }
}

// Initialize the API router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('analytics')) {
        window.analyticsAPIRouter = new AnalyticsAPIRouter();
    }
});

// Export for global access
window.AnalyticsAPI = AnalyticsAPI;
window.AnalyticsAPIRouter = AnalyticsAPIRouter;