---
layout: default
title: "Dashboard de Administración - Estadísticas del Blog"
description: "Panel de control completo con estadísticas en tiempo real, analytics, y métricas de engagement"
---

<style>
/* Estilos del Dashboard */
.dashboard-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    min-height: 100vh;
    background: #0a0a0a;
    color: #e0e0e0;
    font-family: 'Segoe UI', system-ui, sans-serif;
}

/* Sidebar */
.dashboard-sidebar {
    background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
    border-right: 1px solid #2a2a3e;
    padding: 1.5rem;
    overflow-y: auto;
}

.dashboard-logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #2a2a3e;
}

.logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(45deg, #00ff41, #00ffff);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #0a0a0a;
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.nav-item {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    background: transparent;
    border: 1px solid transparent;
    color: #b0b0c0;
    text-decoration: none;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.nav-item:hover {
    background: rgba(0, 255, 65, 0.1);
    border-color: rgba(0, 255, 65, 0.3);
    color: #e0e0e0;
}

.nav-item.active {
    background: rgba(0, 255, 65, 0.2);
    border-color: #00ff41;
    color: #00ff41;
}

.nav-icon {
    width: 20px;
    text-align: center;
}

/* Main Content */
.dashboard-main {
    padding: 2rem;
    overflow-y: auto;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #2a2a3e;
}

.dashboard-title {
    font-size: 1.8rem;
    font-weight: 600;
    background: linear-gradient(45deg, #00ff41, #00ffff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.header-controls {
    display: flex;
    gap: 1rem;
}

.control-btn {
    padding: 0.5rem 1rem;
    background: rgba(0, 255, 65, 0.1);
    border: 1px solid rgba(0, 255, 65, 0.3);
    border-radius: 8px;
    color: #00ff41;
    cursor: pointer;
    transition: all 0.3s ease;
}

.control-btn:hover {
    background: rgba(0, 255, 65, 0.2);
    transform: translateY(-2px);
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
    border: 1px solid #2a2a3e;
    border-radius: 12px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00ff41, #00ffff, #ff00ff);
}

.stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.stat-title {
    color: #b0b0c0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.stat-trend {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
}

.stat-trend.up {
    background: rgba(0, 255, 65, 0.2);
    color: #00ff41;
}

.stat-trend.down {
    background: rgba(255, 0, 0, 0.2);
    color: #ff4444;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 0.5rem;
}

.stat-description {
    color: #808090;
    font-size: 0.9rem;
}

/* Charts Container */
.charts-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.chart-card {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
    border: 1px solid #2a2a3e;
    border-radius: 12px;
    padding: 1.5rem;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #2a2a3e;
}

.chart-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #e0e0e0;
}

.chart-controls {
    display: flex;
    gap: 0.5rem;
}

.chart-control {
    padding: 0.5rem 1rem;
    background: rgba(0, 255, 65, 0.1);
    border: 1px solid rgba(0, 255, 65, 0.3);
    border-radius: 6px;
    color: #00ff41;
    font-size: 0.8rem;
    cursor: pointer;
}

.chart-content {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    position: relative;
}

/* Tables */
.data-table {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
    border: 1px solid #2a2a3e;
    border-radius: 12px;
    overflow: hidden;
}

.table-header {
    padding: 1.5rem;
    border-bottom: 1px solid #2a2a3e;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.table-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #e0e0e0;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    background: rgba(0, 255, 65, 0.1);
}

th {
    padding: 1rem;
    text-align: left;
    color: #00ff41;
    font-weight: 600;
    border-bottom: 1px solid rgba(0, 255, 65, 0.2);
}

td {
    padding: 1rem;
    color: #e0e0e0;
    border-bottom: 1px solid #2a2a3e;
}

tbody tr:hover {
    background: rgba(0, 255, 65, 0.05);
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    display: inline-block;
}

.status-badge.active {
    background: rgba(0, 255, 65, 0.2);
    color: #00ff41;
}

.status-badge.pending {
    background: rgba(255, 165, 0, 0.2);
    color: #ffa500;
}

.status-badge.inactive {
    background: rgba(255, 0, 0, 0.2);
    color: #ff4444;
}

/* Activity Feed */
.activity-feed {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
    border: 1px solid #2a2a3e;
    border-radius: 12px;
    padding: 1.5rem;
}

.activity-header {
    padding-bottom: 1rem;
    border-bottom: 1px solid #2a2a3e;
    margin-bottom: 1.5rem;
}

.activity-item {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #2a2a3e;
}

.activity-item:last-child {
    border-bottom: none;
}

.activity-icon {
    width: 40px;
    height: 40px;
    background: rgba(0, 255, 65, 0.1);
    border: 1px solid rgba(0, 255, 65, 0.3);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00ff41;
    flex-shrink: 0;
}

.activity-content {
    flex: 1;
}

.activity-title {
    color: #e0e0e0;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.activity-description {
    color: #808090;
    font-size: 0.9rem;
}

.activity-time {
    color: #606070;
    font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 1024px) {
    .dashboard-container {
        grid-template-columns: 1fr;
    }

    .dashboard-sidebar {
        display: none;
    }

    .charts-container {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .dashboard-main {
        padding: 1rem;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .dashboard-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .table-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    table {
        font-size: 0.9rem;
    }

    th, td {
        padding: 0.5rem;
    }
}

/* Loading States */
.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 255, 65, 0.2);
    border-top: 3px solid #00ff41;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    color: #808090;
    text-align: center;
    margin-top: 1rem;
}
</style>

<div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="dashboard-sidebar">
        <div class="dashboard-logo">
            <div class="logo-icon">NW3</div>
            <div>
                <h3 style="margin: 0; color: #e0e0e0;">NachoWeb3</h3>
                <p style="margin: 0; color: #808090; font-size: 0.8rem;">Admin Dashboard</p>
            </div>
        </div>

        <nav class="sidebar-nav">
            <a href="#overview" class="nav-item active">
                <span class="nav-icon">📊</span>
                <span>Visión General</span>
            </a>
            <a href="#analytics" class="nav-item">
                <span class="nav-icon">📈</span>
                <span>Analytics</span>
            </a>
            <a href="#content" class="nav-item">
                <span class="nav-icon">📝</span>
                <span>Contenido</span>
            </a>
            <a href="#users" class="nav-item">
                <span class="nav-icon">👥</span>
                <span>Usuarios</span>
            </a>
            <a href="#tools" class="nav-item">
                <span class="nav-icon">🛠️</span>
                <span>Herramientas</span>
            </a>
            <a href="#ai" class="nav-item">
                <span class="nav-icon">🤖</span>
                <span>Nweb3_AI</span>
            </a>
            <a href="#settings" class="nav-item">
                <span class="nav-icon">⚙️</span>
                <span>Configuración</span>
            </a>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="dashboard-main">
        <div class="dashboard-header">
            <h1 class="dashboard-title">Panel de Administración</h1>
            <div class="header-controls">
                <button class="control-btn" onclick="refreshData()">
                    🔄 Actualizar
                </button>
                <button class="control-btn" onclick="exportData()">
                    📥 Exportar
                </button>
                <button class="control-btn" onclick="toggleRealTime()">
                    ⚡ Tiempo Real: <span id="realtime-status">ON</span>
                </button>
            </div>
        </div>

        <!-- Stats Overview -->
        <section id="overview" class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Visitas Totales</span>
                    <span class="stat-trend up">↑ 12%</span>
                </div>
                <div class="stat-value" id="total-visits">24,847</div>
                <div class="stat-description">Últimos 30 días</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Usuarios Activos</span>
                    <span class="stat-trend up">↑ 8%</span>
                </div>
                <div class="stat-value" id="active-users">3,892</div>
                <div class="stat-description">Visitantes únicos</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Tiempo Promedio</span>
                    <span class="stat-trend up">↑ 15%</span>
                </div>
                <div class="stat-value" id="avg-time">4:32</div>
                <div class="stat-description">Minutos por sesión</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Conversion Rate</span>
                    <span class="stat-trend down">↓ 3%</span>
                </div>
                <div class="stat-value" id="conversion-rate">2.8%</div>
                <div class="stat-description">Suscripciones newsletter</div>
            </div>
        </section>

        <!-- Charts Section -->
        <section id="analytics" class="charts-container">
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Tráfico del Sitio</h3>
                    <div class="chart-controls">
                        <select class="chart-control" onchange="updateTrafficChart(this.value)">
                            <option value="7days">Últimos 7 días</option>
                            <option value="30days">Últimos 30 días</option>
                            <option value="90days">Últimos 90 días</option>
                        </select>
                    </div>
                </div>
                <div class="chart-content" id="traffic-chart">
                    <canvas id="traffic-canvas"></canvas>
                </div>
            </div>

            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Dispositivos</h3>
                    <div class="chart-controls">
                        <button class="chart-control">Detalles</button>
                    </div>
                </div>
                <div class="chart-content" id="devices-chart">
                    <canvas id="devices-canvas"></canvas>
                </div>
            </div>
        </section>

        <!-- Tools Usage -->
        <section id="tools" class="data-table">
            <div class="table-header">
                <h3 class="table-title">Uso de Herramientas</h3>
                <div class="header-controls">
                    <select class="control-btn" onchange="filterTools(this.value)">
                        <option value="all">Todas</option>
                        <option value="7days">Últimos 7 días</option>
                        <option value="30days">Últimos 30 días</option>
                    </select>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Herramienta</th>
                        <th>Usos</th>
                        <th>Usuarios Únicos</th>
                        <th>Tiempo Promedio</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody id="tools-usage-body">
                    <tr>
                        <td>📊 Market Indicators</td>
                        <td>8,742</td>
                        <td>2,156</td>
                        <td>5:23</td>
                        <td><span class="status-badge active">Activo</span></td>
                    </tr>
                    <tr>
                        <td>🎯 Airdrop Hunter</td>
                        <td>12,847</td>
                        <td>3,892</td>
                        <td>8:45</td>
                        <td><span class="status-badge active">Activo</span></td>
                    </tr>
                    <tr>
                        <td>📧 Newsletter</td>
                        <td>3,294</td>
                        <td>1,847</td>
                        <td>3:12</td>
                        <td><span class="status-badge active">Activo</span></td>
                    </tr>
                    <tr>
                        <td>🤖 Nweb3_AI</td>
                        <td>45,231</td>
                        <td>5,231</td>
                        <td>12:34</td>
                        <td><span class="status-badge active">Activo</span></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- Content Performance -->
        <section id="content" class="data-table">
            <div class="table-header">
                <h3 class="table-title">Rendimiento del Contenido</h3>
                <div class="header-controls">
                    <select class="control-btn" onchange="sortContent(this.value)">
                        <option value="views">Más Visitado</option>
                        <option value="time">Más Tiempo</option>
                        <option value="recent">Más Reciente</option>
                    </select>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Página</th>
                        <th>Visitas</th>
                        <th>Tiempo Promedio</th>
                        <th>Bounce Rate</th>
                        <th>Conversion</th>
                    </tr>
                </thead>
                <tbody id="content-performance-body">
                    <tr>
                        <td><a href="/nweb3-ai">🤖 Nweb3_AI</a></td>
                        <td>15,234</td>
                        <td>12:45</td>
                        <td>18%</td>
                        <td>5.2%</td>
                    </tr>
                    <tr>
                        <td><a href="/airdrop-hunter">🎯 Airdrop Hunter</a></td>
                        <td>8,742</td>
                        <td>8:23</td>
                        <td>24%</td>
                        <td>3.8%</td>
                    </tr>
                    <tr>
                        <td><a href="/crypto-market-indicators">📊 Market Indicators</a></td>
                        <td>6,892</td>
                        <td>6:45</td>
                        <td>31%</td>
                        <td>2.1%</td>
                    </tr>
                    <tr>
                        <td><a href="/newsletter">📧 Newsletter</a></td>
                        <td>3,294</td>
                        <td>4:12</td>
                        <td>42%</td>
                        <td>8.7%</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- AI Statistics -->
        <section id="ai" class="charts-container">
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Nweb3_AI - Actividad</h3>
                    <div class="chart-controls">
                        <span class="status-badge active">12,847 chats</span>
                    </div>
                </div>
                <div class="chart-content">
                    <canvas id="ai-activity-canvas"></canvas>
                </div>
            </div>

            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Imagenes Generadas</h3>
                    <div class="chart-controls">
                        <span class="status-badge active">45,231 imágenes</span>
                    </div>
                </div>
                <div class="chart-content">
                    <canvas id="ai-images-canvas"></canvas>
                </div>
            </div>
        </section>

        <!-- Activity Feed -->
        <section class="activity-feed">
            <div class="activity-header">
                <h3 class="table-title">Actividad Reciente</h3>
                <button class="control-btn" onclick="loadMoreActivity()">
                    Cargar más
                </button>
            </div>

            <div id="activity-list">
                <div class="activity-item">
                    <div class="activity-icon">🚀</div>
                    <div class="activity-content">
                        <div class="activity-title">Nuevo usuario registrado en Nweb3_AI</div>
                        <div class="activity-description">Usuario desde Buenos Aires, Argentina comenzó una conversación sobre trading de Bitcoin</div>
                        <div class="activity-time">Hace 2 minutos</div>
                    </div>
                </div>

                <div class="activity-item">
                    <div class="activity-icon">📊</div>
                    <div class="activity-content">
                        <div class="activity-title">Pico de uso en Market Indicators</div>
                        <div class="activity-description">45 usuarios concurrentes analizando indicadores de mercado cripto</div>
                        <div class="activity-time">Hace 5 minutos</div>
                    </div>
                </div>

                <div class="activity-item">
                    <div class="activity-icon">📧</div>
                    <div class="activity-content">
                        <div class="activity-title">Nuevo suscriptor newsletter</div>
                        <div class="activity-description">Usuario interesado en DeFi y trading con experiencia intermedia</div>
                        <div class="activity-time">Hace 8 minutos</div>
                    </div>
                </div>

                <div class="activity-item">
                    <div class="activity-icon">🎨</div>
                    <div class="activity-content">
                        <div class="activity-title">Generación de imágenes récord</div>
                        <div class="activity-description">234 imágenes generadas en una hora, prompt: "arte NFT cyberpunk"</div>
                        <div class="activity-time">Hace 12 minutos</div>
                    </div>
                </div>

                <div class="activity-item">
                    <div class="activity-icon">🎯</div>
                    <div class="activity-content">
                        <div class="activity-title">Airdrop Hunter hit record</div>
                        <div class="activity-description">156 usuarios verificaron elegibilidad en LayerZero airdrop</div>
                        <div class="activity-time">Hace 15 minutos</div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</div>

<!-- Scripts del Dashboard -->
<script src="{{ '/assets/js/chart.min.js' | relative_url }}"></script>
<script>
// Variables globales del dashboard
let realtimeEnabled = true;
let updateInterval;
let charts = {};

// Inicialización del dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    startRealTimeUpdates();
    initializeCharts();
});

function initializeDashboard() {
    console.log('Dashboard initialized');
    loadInitialData();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            const section = this.getAttribute('href').substring(1);
            if (section) {
                document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function loadInitialData() {
    // Simular carga de datos iniciales
    setTimeout(() => {
        updateStats();
        loadToolsUsage();
        loadContentPerformance();
        loadActivityFeed();
    }, 1000);
}

function startRealTimeUpdates() {
    if (realtimeEnabled) {
        updateInterval = setInterval(() => {
            updateStats();
            updateActivityFeed();
            updateCharts();
        }, 30000); // Actualizar cada 30 segundos
    }
}

function toggleRealTime() {
    realtimeEnabled = !realtimeEnabled;
    const statusElement = document.getElementById('realtime-status');

    if (realtimeEnabled) {
        statusElement.textContent = 'ON';
        statusElement.parentElement.classList.add('active');
        startRealTimeUpdates();
    } else {
        statusElement.textContent = 'OFF';
        statusElement.parentElement.classList.remove('active');
        clearInterval(updateInterval);
    }
}

function refreshData() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '🔄 Actualizando...';
    btn.disabled = true;

    loadInitialData();
    updateCharts();

    setTimeout(() => {
        btn.innerHTML = '✅ Actualizado';
        btn.disabled = false;

        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }, 2000);
}

function updateStats() {
    // Simular actualización de estadísticas
    const stats = {
        totalVisits: 24847 + Math.floor(Math.random() * 100),
        activeUsers: 3892 + Math.floor(Math.random() * 20),
        avgTime: generateRandomTime(),
        conversionRate: (2.8 + Math.random() * 0.5).toFixed(1)
    };

    document.getElementById('total-visits').textContent = stats.totalVisits.toLocaleString();
    document.getElementById('active-users').textContent = stats.activeUsers.toLocaleString();
    document.getElementById('avg-time').textContent = stats.avgTime;
    document.getElementById('conversion-rate').textContent = stats.conversionRate + '%';

    // Trackear actualización
    if (window.analyticsManager) {
        window.analyticsManager.trackEvent('dashboard_stats_update', {
            totalVisits: stats.totalVisits,
            activeUsers: stats.activeUsers
        });
    }
}

function generateRandomTime() {
    const minutes = Math.floor(Math.random() * 10) + 1;
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function loadToolsUsage() {
    const tools = [
        { name: 'Market Indicators', icon: '📊', uses: 8742, users: 2156, avgTime: '5:23' },
        { name: 'Airdrop Hunter', icon: '🎯', uses: 12847, users: 3892, avgTime: '8:45' },
        { name: 'Newsletter', icon: '📧', uses: 3294, users: 1847, avgTime: '3:12' },
        { name: 'Nweb3_AI', icon: '🤖', uses: 45231, users: 5231, avgTime: '12:34' }
    ];

    const tbody = document.getElementById('tools-usage-body');
    tbody.innerHTML = tools.map(tool => `
        <tr>
            <td>${tool.icon} ${tool.name}</td>
            <td>${tool.uses.toLocaleString()}</td>
            <td>${tool.users.toLocaleString()}</td>
            <td>${tool.avgTime}</td>
            <td><span class="status-badge active">Activo</span></td>
        </tr>
    `).join('');
}

function loadContentPerformance() {
    const content = [
        { page: 'Nweb3_AI', icon: '🤖', url: '/nweb3-ai', views: 15234, avgTime: '12:45', bounceRate: 18, conversion: 5.2 },
        { page: 'Airdrop Hunter', icon: '🎯', url: '/airdrop-hunter', views: 8742, avgTime: '8:23', bounceRate: 24, conversion: 3.8 },
        { page: 'Market Indicators', icon: '📊', url: '/crypto-market-indicators', views: 6892, avgTime: '6:45', bounceRate: 31, conversion: 2.1 },
        { page: 'Newsletter', icon: '📧', url: '/newsletter', views: 3294, avgTime: '4:12', bounceRate: 42, conversion: 8.7 }
    ];

    const tbody = document.getElementById('content-performance-body');
    tbody.innerHTML = content.map(item => `
        <tr>
            <td><a href="${item.url}">${item.icon} ${item.page}</a></td>
            <td>${item.views.toLocaleString()}</td>
            <td>${item.avgTime}</td>
            <td>${item.bounceRate}%</td>
            <td>${item.conversion}%</td>
        </tr>
    `).join('');
}

function loadActivityFeed() {
    // La actividad se carga dinámicamente
    updateActivityFeed();
}

function updateActivityFeed() {
    // Simular nueva actividad
    const activities = [
        { icon: '🚀', title: 'Nuevo usuario en Nweb3_AI', desc: 'Usuario desde Madrid comenzó trading conversation', time: 'Hace 1 minuto' },
        { icon: '📊', title: 'Pico en Market Indicators', desc: '89 usuarios concurrentes analizando indicadores', time: 'Hace 3 minutos' },
        { icon: '📧', title: 'Newsletter signup', desc: 'Usuario interesado en DeFi y trading', time: 'Hace 5 minutos' },
        { icon: '🎨', title: 'Generación masiva de imágenes', desc: '156 imágenes generadas, prompt: "NFT art"', time: 'Hace 8 minutos' },
        { icon: '🎯', title: 'Airdrop eligibility', desc: '234 usuarios verificaron LayerZero eligibility', time: 'Hace 12 minutos' }
    ];

    const activityList = document.getElementById('activity-list');
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];

    // Añadir nueva actividad al principio
    const newActivity = document.createElement('div');
    newActivity.className = 'activity-item';
    newActivity.innerHTML = `
        <div class="activity-icon">${randomActivity.icon}</div>
        <div class="activity-content">
            <div class="activity-title">${randomActivity.title}</div>
            <div class="activity-description">${randomActivity.desc}</div>
            <div class="activity-time">${randomActivity.time}</div>
        </div>
    `;

    activityList.insertBefore(newActivity, activityList.firstChild);

    // Limitar a 10 actividades recientes
    const allActivities = activityList.querySelectorAll('.activity-item');
    if (allActivities.length > 10) {
        for (let i = 10; i < allActivities.length; i++) {
            allActivities[i].remove();
        }
    }

    // Actualizar timestamps
    updateActivityTimestamps();
}

function updateActivityTimestamps() {
    const activities = document.querySelectorAll('.activity-time');
    activities.forEach((activity, index) => {
        const baseTime = index + 1;
        activity.textContent = `Hace ${baseTime} minuto${baseTime !== 1 ? 's' : ''}`;
    });
}

function loadMoreActivity() {
    alert('Cargar más actividad próximamente. Esta función conectará con una base de datos real de actividad del sitio.');
}

function exportData() {
    const data = {
        stats: {
            totalVisits: document.getElementById('total-visits').textContent,
            activeUsers: document.getElementById('active-users').textContent,
            avgTime: document.getElementById('avg-time').textContent,
            conversionRate: document.getElementById('conversion-rate').textContent
        },
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `nweb3-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

function initializeCharts() {
    // Chart.js se inicializaría aquí si estuviera disponible
    console.log('Charts initialized (placeholder)');
}

function updateCharts() {
    // Actualizar gráficos con nuevos datos
    console.log('Charts updated');
}

function updateTrafficChart(period) {
    console.log('Traffic chart updated for period:', period);
}

function filterTools(period) {
    console.log('Tools filtered for period:', period);
}

function sortContent(sortBy) {
    console.log('Content sorted by:', sortBy);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshData();
    }
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});

// Auto-refresh preventido cuando la pestaña no está activa
document.addEventListener('visibilitychange', function() {
    if (document.hidden && updateInterval) {
        clearInterval(updateInterval);
    } else if (!document.hidden && realtimeEnabled) {
        startRealTimeUpdates();
    }
});

console.log('Dashboard ready');
</script>