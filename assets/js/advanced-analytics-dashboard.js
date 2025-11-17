/**
 * Advanced Analytics Dashboard for NachoWeb3
 * Provides comprehensive analytics and insights
 */

class AdvancedAnalyticsDashboard {
    constructor() {
        this.config = {
            apiBaseUrl: '/api/analytics',
            refreshInterval: 30000, // 30 seconds
            chartColors: {
                primary: '#8a2be2',
                secondary: '#00ffff',
                success: '#00ff88',
                warning: '#ffaa00',
                danger: '#ff4444',
                info: '#4488ff'
            },
            maxDataPoints: 100,
            sessionTimeout: 30 * 60 * 1000 // 30 minutes
        };

        this.data = {
            realTime: {
                activeUsers: 0,
                pageViews: 0,
                bounceRate: 0,
                avgSessionDuration: 0,
                topPages: [],
                trafficSources: [],
                deviceStats: {}
            },
            historical: {
                pageViews: [],
                uniqueVisitors: [],
                bounceRate: [],
                avgSessionDuration: [],
                conversionRate: []
            },
            content: {
                popularPosts: [],
                searchQueries: [],
                recommendations: {
                    ctr: 0,
                    clickData: []
                }
            },
            performance: {
                webVitals: {
                    lcp: 0,
                    fid: 0,
                    cls: 0,
                    fcp: 0,
                    ttfb: 0
                },
                pageLoadTimes: []
            },
            userBehavior: {
                scrollDepth: [],
                clickHeatmap: [],
                navigationFlow: [],
                timeOnPage: []
            },
            seo: {
                organicTraffic: [],
                keywordRankings: [],
                backlinks: [],
                crawlErrors: []
            },
            conversions: {
                newsletterSignups: 0,
                commentSubmissions: 0,
                socialShares: 0,
                goalCompletions: []
            },
            demographics: {
                countries: {},
                cities: {},
                languages: {},
                ageGroups: {},
                genders: {}
            }
        };

        this.charts = {};
        this.isInitialized = false;
        this.realTimeInterval = null;

        this.init();
    }

    async init() {
        try {
            await this.setupEventListeners();
            await this.loadHistoricalData();
            await this.initializeCharts();
            await this.startRealTimeUpdates();
            await this.setupPerformanceMonitoring();
            await this.setupExportFunctionality();
            this.trackDashboardView();
            this.isInitialized = true;
            console.log('Advanced Analytics Dashboard initialized');
        } catch (error) {
            console.error('Failed to initialize analytics dashboard:', error);
        }
    }

    setupEventListeners() {
        // Tab navigation
        const tabs = document.querySelectorAll('.analytics-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(tab.dataset.tab);
            });
        });

        // Date range selector
        const dateRange = document.getElementById('date-range-selector');
        if (dateRange) {
            dateRange.addEventListener('change', (e) => {
                this.updateDateRange(e.target.value);
            });
        }

        // Export buttons
        const exportButtons = document.querySelectorAll('.export-btn');
        exportButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportData(btn.dataset.format);
            });
        });

        // Refresh button
        const refreshBtn = document.getElementById('refresh-analytics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshAllData();
            });
        }
    }

    switchTab(tabName) {
        // Update tab navigation
        document.querySelectorAll('.analytics-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content panels
        document.querySelectorAll('.analytics-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-panel`).classList.add('active');

        // Update charts for the active tab
        this.updateTabCharts(tabName);

        // Track tab switch
        this.trackEvent('analytics_tab_switch', { tab: tabName });
    }

    async loadHistoricalData() {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/historical`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.data.historical = data.historical;
                this.data.content = data.content;
                this.data.performance = data.performance;
                this.data.seo = data.seo;
                this.data.conversions = data.conversions;
                this.data.demographics = data.demographics;
            } else {
                // Fallback to local storage or demo data
                this.loadDemoData();
            }
        } catch (error) {
            console.warn('Failed to load historical data, using demo data:', error);
            this.loadDemoData();
        }
    }

    loadDemoData() {
        const now = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(now - i * 24 * 60 * 60 * 1000);
            this.data.historical.pageViews.push({
                date: date.toISOString(),
                value: Math.floor(Math.random() * 1000) + 500
            });
            this.data.historical.uniqueVisitors.push({
                date: date.toISOString(),
                value: Math.floor(Math.random() * 500) + 200
            });
            this.data.historical.bounceRate.push({
                date: date.toISOString(),
                value: Math.random() * 50 + 30
            });
        }

        this.data.content.popularPosts = [
            { title: "Introducción a Blockchain", views: 542, url: "/blockchain-intro" },
            { title: "Machine Learning para Principiantes", views: 423, url: "/ml-basics" },
            { title: "Guía de Trading de Criptomonedas", views: 389, url: "/crypto-trading" }
        ];

        this.data.performance.webVitals = {
            lcp: 2.3,
            fid: 85,
            cls: 0.15,
            fcp: 1.8,
            ttfb: 120
        };
    }

    async initializeCharts() {
        await this.createRealTimeChart();
        await this.createTrafficChart();
        await this.createPerformanceChart();
        await this.createContentChart();
        await this.createConversionChart();
        await this.createDemographicsChart();
    }

    async createRealTimeChart() {
        const ctx = document.getElementById('realtime-chart');
        if (!ctx) return;

        this.charts.realtime = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Usuarios Activos',
                    data: [],
                    borderColor: this.config.chartColors.primary,
                    backgroundColor: `${this.config.chartColors.primary}20`,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    async createTrafficChart() {
        const ctx = document.getElementById('traffic-chart');
        if (!ctx) return;

        this.charts.traffic = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.historical.pageViews.map(d => new Date(d.date).toLocaleDateString()),
                datasets: [{
                    label: 'Páginas Vistas',
                    data: this.data.historical.pageViews.map(d => d.value),
                    borderColor: this.config.chartColors.primary,
                    backgroundColor: `${this.config.chartColors.primary}20`,
                    tension: 0.4
                }, {
                    label: 'Visitantes Únicos',
                    data: this.data.historical.uniqueVisitors.map(d => d.value),
                    borderColor: this.config.chartColors.secondary,
                    backgroundColor: `${this.config.chartColors.secondary}20`,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    async createPerformanceChart() {
        const ctx = document.getElementById('performance-chart');
        if (!ctx) return;

        this.charts.performance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'],
                datasets: [{
                    label: 'Web Vitals',
                    data: [
                        this.data.performance.webVitals.lcp,
                        this.data.performance.webVitals.fid / 100,
                        this.data.performance.webVitals.cls * 100,
                        this.data.performance.webVitals.fcp,
                        this.data.performance.webVitals.ttfb / 100
                    ],
                    borderColor: this.config.chartColors.success,
                    backgroundColor: `${this.config.chartColors.success}20`
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    async createContentChart() {
        const ctx = document.getElementById('content-chart');
        if (!ctx) return;

        this.charts.content = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.data.content.popularPosts.map(post => post.title),
                datasets: [{
                    data: this.data.content.popularPosts.map(post => post.views),
                    backgroundColor: [
                        this.config.chartColors.primary,
                        this.config.chartColors.secondary,
                        this.config.chartColors.success,
                        this.config.chartColors.warning,
                        this.config.chartColors.info
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    async createConversionChart() {
        const ctx = document.getElementById('conversion-chart');
        if (!ctx) return;

        this.charts.conversion = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Newsletter', 'Comentarios', 'Social Shares', 'Recomendaciones'],
                datasets: [{
                    label: 'Conversiones',
                    data: [
                        this.data.conversions.newsletterSignups,
                        this.data.conversions.commentSubmissions,
                        this.data.conversions.socialShares,
                        this.data.content.recommendations.ctr * 100
                    ],
                    backgroundColor: this.config.chartColors.success
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    async createDemographicsChart() {
        const ctx = document.getElementById('demographics-chart');
        if (!ctx) return;

        const countries = Object.entries(this.data.demographics.countries).slice(0, 10);

        this.charts.demographics = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: countries.map(([country]) => country),
                datasets: [{
                    label: 'Visitantes por País',
                    data: countries.map(([, count]) => count),
                    backgroundColor: this.config.chartColors.info
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    async startRealTimeUpdates() {
        await this.fetchRealTimeData();
        this.realTimeInterval = setInterval(async () => {
            await this.fetchRealTimeData();
        }, this.config.refreshInterval);
    }

    async fetchRealTimeData() {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/realtime`);
            if (response.ok) {
                const data = await response.json();
                this.data.realTime = data;
                this.updateRealTimeMetrics();
                this.updateRealTimeChart();
            }
        } catch (error) {
            console.warn('Failed to fetch real-time data:', error);
            // Use simulated data for demo
            this.simulateRealTimeData();
        }
    }

    simulateRealTimeData() {
        this.data.realTime.activeUsers = Math.floor(Math.random() * 50) + 10;
        this.data.realTime.pageViews = Math.floor(Math.random() * 1000) + 500;
        this.data.realTime.bounceRate = Math.random() * 40 + 30;
        this.data.realTime.avgSessionDuration = Math.floor(Math.random() * 300) + 120;

        this.updateRealTimeMetrics();
        this.updateRealTimeChart();
    }

    updateRealTimeMetrics() {
        this.updateMetricCard('active-users', this.data.realTime.activeUsers);
        this.updateMetricCard('page-views', this.data.realTime.pageViews);
        this.updateMetricCard('bounce-rate', `${this.data.realTime.bounceRate.toFixed(1)}%`);
        this.updateMetricCard('avg-session', this.formatDuration(this.data.realTime.avgSessionDuration));
    }

    updateMetricCard(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            element.classList.add('updated');
            setTimeout(() => element.classList.remove('updated'), 1000);
        }
    }

    updateRealTimeChart() {
        if (!this.charts.realtime) return;

        const now = new Date();
        const label = now.toLocaleTimeString();

        this.charts.realtime.data.labels.push(label);
        this.charts.realtime.data.datasets[0].data.push(this.data.realTime.activeUsers);

        // Keep only last 20 data points
        if (this.charts.realtime.data.labels.length > 20) {
            this.charts.realtime.data.labels.shift();
            this.charts.realtime.data.datasets[0].data.shift();
        }

        this.charts.realtime.update('none');
    }

    updateTabCharts(tabName) {
        switch (tabName) {
            case 'realtime':
                if (this.charts.realtime) this.charts.realtime.update();
                break;
            case 'traffic':
                if (this.charts.traffic) this.charts.traffic.update();
                break;
            case 'content':
                if (this.charts.content) this.charts.content.update();
                break;
            case 'performance':
                if (this.charts.performance) this.charts.performance.update();
                break;
            case 'conversions':
                if (this.charts.conversion) this.charts.conversion.update();
                break;
            case 'demographics':
                if (this.charts.demographics) this.charts.demographics.update();
                break;
        }
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.observeWebVitals();

        // Track page load performance
        this.trackPagePerformance();

        // Monitor user interactions
        this.trackUserInteractions();
    }

    observeWebVitals() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    switch (entry.entryType) {
                        case 'largest-contentful-paint':
                            this.data.performance.webVitals.lcp = entry.startTime;
                            break;
                        case 'first-input':
                            this.data.performance.webVitals.fid = entry.processingStart - entry.startTime;
                            break;
                        case 'layout-shift':
                            if (!entry.hadRecentInput) {
                                this.data.performance.webVitals.cls += entry.value;
                            }
                            break;
                    }
                }
            });

            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        }
    }

    trackPagePerformance() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.fetchStart;

            this.data.performance.pageLoadTimes.push({
                timestamp: Date.now(),
                value: loadTime
            });

            // Keep only last 100 measurements
            if (this.data.performance.pageLoadTimes.length > 100) {
                this.data.performance.pageLoadTimes.shift();
            }
        });
    }

    trackUserInteractions() {
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            maxScroll = Math.max(maxScroll, scrollPercent);
        });

        window.addEventListener('beforeunload', () => {
            if (maxScroll > 0) {
                this.data.userBehavior.scrollDepth.push({
                    timestamp: Date.now(),
                    value: maxScroll
                });
            }
        });

        // Track click heatmap
        document.addEventListener('click', (e) => {
            const clickData = {
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                page: window.location.pathname
            };

            this.data.userBehavior.clickHeatmap.push(clickData);

            // Keep only last 1000 clicks
            if (this.data.userBehavior.clickHeatmap.length > 1000) {
                this.data.userBehavior.clickHeatmap.shift();
            }
        });
    }

    async exportData(format) {
        const exportData = {
            generated: new Date().toISOString(),
            dateRange: this.getCurrentDateRange(),
            data: this.data
        };

        switch (format) {
            case 'csv':
                this.exportToCSV(exportData);
                break;
            case 'json':
                this.exportToJSON(exportData);
                break;
            case 'pdf':
                this.exportToPDF(exportData);
                break;
        }

        this.trackEvent('analytics_export', { format });
    }

    exportToCSV(data) {
        let csv = 'Métrica,Valor,Fecha\n';

        data.data.historical.pageViews.forEach(item => {
            csv += `Page Views,${item.value},${item.date}\n`;
        });

        data.data.historical.uniqueVisitors.forEach(item => {
            csv += `Unique Visitors,${item.value},${item.date}\n`;
        });

        this.downloadFile(csv, 'analytics-export.csv', 'text/csv');
    }

    exportToJSON(data) {
        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, 'analytics-export.json', 'application/json');
    }

    exportToPDF(data) {
        // This would require a PDF library like jsPDF
        alert('Exportación a PDF estará disponible próximamente');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    getCurrentDateRange() {
        const selector = document.getElementById('date-range-selector');
        return selector ? selector.value : '30d';
    }

    async updateDateRange(range) {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/historical?range=${range}`);
            if (response.ok) {
                const data = await response.json();
                this.data.historical = data.historical;
                this.updateAllCharts();
            }
        } catch (error) {
            console.warn('Failed to update date range:', error);
        }

        this.trackEvent('analytics_date_range_change', { range });
    }

    async refreshAllData() {
        this.showLoadingState();

        try {
            await Promise.all([
                this.loadHistoricalData(),
                this.fetchRealTimeData()
            ]);

            this.updateAllCharts();
            this.showSuccessMessage('Datos actualizados correctamente');
        } catch (error) {
            console.error('Failed to refresh data:', error);
            this.showErrorMessage('Error al actualizar los datos');
        } finally {
            this.hideLoadingState();
        }
    }

    updateAllCharts() {
        Object.values(this.charts).forEach(chart => {
            chart.update();
        });
    }

    showLoadingState() {
        const refreshBtn = document.getElementById('refresh-analytics');
        if (refreshBtn) {
            refreshBtn.classList.add('loading');
            refreshBtn.disabled = true;
        }
    }

    hideLoadingState() {
        const refreshBtn = document.getElementById('refresh-analytics');
        if (refreshBtn) {
            refreshBtn.classList.remove('loading');
            refreshBtn.disabled = false;
        }
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `analytics-notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                ...parameters,
                custom_map: {
                    dimension1: 'dashboard_version',
                    dimension2: 'user_role'
                }
            });
        }
    }

    trackDashboardView() {
        this.trackEvent('analytics_dashboard_view', {
            page_title: 'Analytics Dashboard',
            location: window.location.href
        });
    }

    destroy() {
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
        }

        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Analytics utility functions
class AnalyticsUtils {
    static calculateGrowthRate(current, previous) {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous * 100).toFixed(1);
    }

    static calculatePercentile(data, percentile) {
        const sorted = data.slice().sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[index];
    }

    static calculateMedian(data) {
        return this.calculatePercentile(data, 50);
    }

    static movingAverage(data, windowSize) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - windowSize + 1);
            const subset = data.slice(start, i + 1);
            const average = subset.reduce((sum, val) => sum + val, 0) / subset.length;
            result.push(average);
        }
        return result;
    }

    static predictNextValue(data) {
        if (data.length < 2) return data[0] || 0;

        // Simple linear regression
        const n = data.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += data[i];
            sumXY += i * data[i];
            sumX2 += i * i;
        }

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return slope * n + intercept;
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('analytics-dashboard')) {
        window.analyticsDashboard = new AdvancedAnalyticsDashboard();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.analyticsDashboard) {
        window.analyticsDashboard.destroy();
    }
});

// Export for global access
window.AdvancedAnalyticsDashboard = AdvancedAnalyticsDashboard;
window.AnalyticsUtils = AnalyticsUtils;