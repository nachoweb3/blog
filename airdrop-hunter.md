---
layout: default
title: "Airdrop Hunter Tool - Encuentra los Mejores Airdrops Cripto 2024"
description: "Herramienta completa para cazar airdrops: tracker de próximos airdrops, eligibility checker, guías paso a paso y calendario de eventos. ¡No te pierdas ningún airdrop!"
---

<section class="hero container">
    <h1>🎯 Airdrop Hunter Tool</h1>
    <p>Encuentra y reclama los mejores airdrops cripto antes que nadie. Tool profesional con tracking en tiempo real, eligibility checker y guías exclusivas.</p>
    <div class="hero-stats">
        <div class="stat-item">
            <span class="stat-number" id="total-airdrops">0</span>
            <span class="stat-label">Airdrops Activos</span>
        </div>
        <div class="stat-item">
            <span class="stat-number" id="potential-value">$0K</span>
            <span class="stat-label">Valor Potencial</span>
        </div>
        <div class="stat-item">
            <span class="stat-number" id="success-rate">0%</span>
            <span class="stat-label">Tasa de Éxito</span>
        </div>
    </div>
</section>

<div class="container">
    <!-- Alerta Importante -->
    <div class="alert alert-warning">
        <h4>⚠️ Advertencia de Seguridad</h4>
        <p>Nunca compartas tu private key o envíes dinero para reclamar un airdrop. Los airdrops legítimos son siempre gratuitos. Verifica siempre el contrato oficial.</p>
    </div>

    <!-- Filtros y Búsqueda -->
    <section class="filters-section">
        <h2>🔍 Filtrar Airdrops</h2>
        <div class="filters-container">
            <div class="search-box">
                <input type="text" id="search-input" placeholder="Buscar airdrops por nombre, blockchain o categoría...">
                <button class="search-btn">🔍</button>
            </div>

            <div class="filter-tags">
                <button class="filter-tag active" data-filter="all">Todos</button>
                <button class="filter-tag" data-filter="hot">🔥 Hot</button>
                <button class="filter-tag" data-filter="new">✨ Nuevo</button>
                <button class="filter-tag" data-filter="ending">⏰ Terminando</button>
                <button class="filter-tag" data-filter="confirmed">✅ Confirmado</button>
                <button class="filter-tag" data-filter="potential">🎯 Potencial</button>
            </div>

            <div class="advanced-filters">
                <select id="blockchain-filter">
                    <option value="">Todas las Blockchains</option>
                    <option value="ethereum">Ethereum</option>
                    <option value="polygon">Polygon</option>
                    <option value="arbitrum">Arbitrum</option>
                    <option value="optimism">Optimism</option>
                    <option value="base">Base</option>
                    <option value="zksync">zkSync</option>
                    <option value="layerzero">LayerZero</option>
                    <option value="solana">Solana</option>
                    <option value="bnb">BNB Chain</option>
                </select>

                <select id="category-filter">
                    <option value="">Todas las Categorías</option>
                    <option value="defi">DeFi</option>
                    <option value="gaming">Gaming</option>
                    <option value="nft">NFT</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="social">Social</option>
                    <option value="layer2">Layer 2</option>
                </select>

                <select id="difficulty-filter">
                    <option value="">Cualquier Dificultad</option>
                    <option value="easy">Fácil (5-10 min)</option>
                    <option value="medium">Medio (15-30 min)</option>
                    <option value="hard">Difícil (45+ min)</option>
                </select>
            </div>
        </div>
    </section>

    <!-- Eligibility Checker -->
    <section class="eligibility-checker">
        <h2>🎯 Eligibility Checker Automático</h2>
        <div class="checker-container">
            <div class="wallet-input">
                <label for="wallet-address">Ingresa tu dirección de wallet:</label>
                <div class="input-group">
                    <input type="text" id="wallet-address" placeholder="0x... o dirección de Solana">
                    <button id="check-eligibility" class="check-btn">Verificar Elegibilidad</button>
                </div>
                <div class="supported-wallets">
                    <span class="wallet-badge">🦊 MetaMask</span>
                    <span class="wallet-badge">🦦 Phantom</span>
                    <span class="wallet-badge">🔗 Trust Wallet</span>
                    <span class="wallet-badge">📱 Ledger</span>
                </div>
            </div>

            <div id="eligibility-results" class="eligibility-results hidden">
                <h3>🎉 Resultados de Elegibilidad</h3>
                <div id="eligible-airdrops" class="eligible-list"></div>
                <div class="eligibility-summary">
                    <div class="summary-stat">
                        <span class="summary-number" id="eligible-count">0</span>
                        <span class="summary-label">Airdrops Elegibles</span>
                    </div>
                    <div class="summary-stat">
                        <span class="summary-number" id="potential-value">$0</span>
                        <span class="summary-label">Valor Estimado</span>
                    </div>
                    <div class="summary-stat">
                        <span class="summary-number" id="tasks-completed">0</span>
                        <span class="summary-label">Tareas Completadas</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Calendar de Eventos -->
    <section class="calendar-section">
        <h2>📅 Calendario de Airdrops</h2>
        <div class="calendar-container">
            <div class="calendar-header">
                <button id="prev-month" class="nav-btn">←</button>
                <h3 id="current-month">Noviembre 2024</h3>
                <button id="next-month" class="nav-btn">→</button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-names">
                    <div class="day-name">Dom</div>
                    <div class="day-name">Lun</div>
                    <div class="day-name">Mar</div>
                    <div class="day-name">Mié</div>
                    <div class="day-name">Jue</div>
                    <div class="day-name">Vie</div>
                    <div class="day-name">Sáb</div>
                </div>
                <div id="calendar-days" class="calendar-days"></div>
            </div>
        </div>

        <div class="upcoming-events">
            <h3>🚀 Próximos Eventos Importantes</h3>
            <div id="events-list" class="events-list"></div>
        </div>
    </section>

    <!-- Lista de Airdrops -->
    <section class="airdrops-list">
        <h2>🎁 Airdrops Disponibles</h2>

        <!-- Featured Airdrops -->
        <div class="featured-section">
            <h3>🔥 Featured Airdrops</h3>
            <div id="featured-airdrops" class="airdrops-grid"></div>
        </div>

        <!-- All Airdrops -->
        <div class="all-section">
            <h3>📋 Todos los Airdrops</h3>
            <div id="all-airdrops" class="airdrops-container"></div>
        </div>
    </section>

    <!-- Step-by-Step Guides -->
    <section class="guides-section">
        <h2>📚 Guías Paso a Paso</h2>

        <div class="guides-grid">
            <div class="guide-card">
                <h3>🚀 Guía Rápida para Principiantes</h3>
                <p>Aprende los basics de cazar airdrops de forma segura y efectiva.</p>
                <ul class="guide-steps">
                    <li>✅ Configurar wallet segura</li>
                    <li>✅ Usar VPN y navegador seguro</li>
                    <li>✅ Verificar contratos inteligentes</li>
                    <li>✅ Evitar estafas comunes</li>
                    <li>✅ Optimizar tiempo y gas fees</li>
                </ul>
                <button class="guide-btn" onclick="showGuide('beginner')">Leer Guía Completa</button>
            </div>

            <div class="guide-card">
                <h3>🔥 Estrategias Avanzadas</h3>
                <p>Técnicas profesionales para maximizar ganancias en airdrops.</p>
                <ul class="guide-steps">
                    <li>🎯 Multi-wallet strategies</li>
                    <li>🎯 Sybil attack prevention</li>
                    <li>🎯 Timing optimization</li>
                    <li>🎯 Portfolio diversification</li>
                    <li>🎯 Risk management</li>
                </ul>
                <button class="guide-btn" onclick="showGuide('advanced')">Leer Guía Completa</button>
            </div>

            <div class="guide-card">
                <h3>🛡️ Guía de Seguridad</h3>
                <p>Protege tus fondos y evita estafas en el mundo de los airdrops.</p>
                <ul class="guide-steps">
                    <li>🔒 Detectar scam airdrops</li>
                    <li>🔒 Verificar contratos oficiales</li>
                    <li>🔒 Usar hardware wallets</li>
                    <li>🔒 Red flags comunes</li>
                    <li>🔒 Recuperación de fondos</li>
                </ul>
                <button class="guide-btn" onclick="showGuide('security')">Leer Guía Completa</button>
            </div>
        </div>
    </section>

    <!-- Herramientas Adicionales -->
    <section class="tools-section">
        <h2>🛠️ Herramientas de Airdrop Hunter</h2>

        <div class="tools-grid">
            <div class="tool-item">
                <h3>📱 Gas Tracker</h3>
                <p>Monitorea las gas fees en tiempo real para optimizar el timing de tus transacciones.</p>
                <div class="gas-prices">
                    <div class="gas-item">
                        <span class="gas-type">Slow</span>
                        <span class="gas-price" id="gas-slow">-</span>
                    </div>
                    <div class="gas-item">
                        <span class="gas-type">Standard</span>
                        <span class="gas-price" id="gas-standard">-</span>
                    </div>
                    <div class="gas-item">
                        <span class="gas-type">Fast</span>
                        <span class="gas-price" id="gas-fast">-</span>
                    </div>
                </div>
            </div>

            <div class="tool-item">
                <h3>💎 Portfolio Calculator</h3>
                <p>Calcula el valor actual de tus airdrops reclamados y el potencial de los pendientes.</p>
                <div class="calculator">
                    <input type="number" id="airdrop-amount" placeholder="Cantidad de tokens">
                    <input type="number" id="token-price" placeholder="Precio por token">
                    <button class="calc-btn">Calcular Valor</button>
                    <div class="result" id="calc-result">$0.00</div>
                </div>
            </div>

            <div class="tool-item">
                <h3>⏰ Deadline Tracker</h3>
                <p>Nunca te pierdas un airdrop configurando alertas personalizadas.</p>
                <div class="alert-setup">
                    <input type="email" id="alert-email" placeholder="Tu email para alertas">
                    <select id="alert-frequency">
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="urgent">Solo urgentes</option>
                    </select>
                    <button class="alert-btn">Configurar Alertas</button>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
        <h2>❓ Preguntas Frecuentes</h2>
        <div class="faq-container">
            <div class="faq-item">
                <button class="faq-question" onclick="toggleFAQ(this)">
                    <span>¿Qué es un airdrop y cómo funciona?</span>
                    <span class="faq-arrow">↓</span>
                </button>
                <div class="faq-answer">
                    <p>Un airdrop es una distribución gratuita de tokens cripto a wallets que cumplen ciertos criterios. Las empresas los usan para marketing, distribución inicial de tokens, o recompensar a early adopters. Generalmente necesitas realizar tareas específicas como seguir redes sociales, usar un protocolo, o mantener ciertos tokens.</p>
                </div>
            </div>

            <div class="faq-item">
                <button class="faq-question" onclick="toggleFAQ(this)">
                    <span>¿Son seguros los airdrops?</span>
                    <span class="faq-arrow">↓</span>
                </button>
                <div class="faq-answer">
                    <p>Los airdrops legítimos son siempre gratuitos. Nunca debes enviar dinero o compartir tu private key. Sin embargo, existen riesgos como smart contracts maliciosos, phishing, o requerir información personal. Siempre verifica la fuente oficial, revisa el contrato en etherscan, y usa una wallet separada para airdrops.</p>
                </div>
            </div>

            <div class="faq-item">
                <button class="faq-question" onclick="toggleFAQ(this)">
                    <span>¿Cómo puedo maximizar mis posibilidades de recibir airdrops?</span>
                    <span class="faq-arrow">↓</span>
                </button>
                <div class="faq-answer">
                    <p>Para maximizar posibilidades: 1) Interactúa temprano con protocolos prometedores, 2) Usa wallets con historial de transacciones, 3) Mantén tokens nativos (ETH, BNB), 4) Participa en testnets, 5) Sigue las redes sociales de proyectos, 6) Únete a comunidades Discord/Telegram, 7) Completa todos los requisitos requeridos.</p>
                </div>
            </div>

            <div class="faq-item">
                <button class="faq-question" onclick="toggleFAQ(this)">
                    <span>¿Cómo sé si un airdrop es legítimo?</span>
                    <span class="faq-arrow">↓</span>
                </button>
                <div class="faq-answer">
                    <p>Verifica: 1) Sitio web y redes sociales oficiales, 2) Contrato verificado en Etherscan/BscScan, 3) Comunidad activa y transparente, 4) Información del equipo fundador, 5) No pide dinero o private keys, 6) Tiene whitepaper y tokenomics claros, 7) No promete rendimientos irreales. Desconfía si exige pagos o información sensible.</p>
                </div>
            </div>

            <div class="faq-item">
                <button class="faq-question" onclick="toggleFAQ(this)">
                    <span>¿Cuánto puedo ganar con airdrops?</span>
                    <span class="faq-arrow">↓</span>
                </button>
                <div class="faq-answer">
                    <p>Los ingresos varían enormemente. Algunos airdrops valen $10-50, otros $500-1000, y los más exitosos pueden valer miles (como Uniswap ~$1200). Los airdrops retroactivos de protocolos grandes suelen ser los más valiosos. Es un juego de números: participa en muchos para aumentar posibilidades de recibir algunos valiosos.</p>
                </div>
            </div>
        </div>
    </section>
</div>

<!-- Modal para detalles del airdrop -->
<div id="airdrop-modal" class="modal hidden">
    <div class="modal-content">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <div id="modal-body"></div>
    </div>
</div>

<script>
// Base de datos de airdrops (en producción vendría de APIs)
const airdropsDatabase = [
    {
        id: 'layerzero',
        name: 'LayerZero',
        logo: '🔗',
        category: 'infrastructure',
        blockchain: 'layerzero',
        difficulty: 'medium',
        status: 'hot',
        potentialValue: '$2000-5000',
        deadline: '2024-12-31',
        description: 'Protocolo de omnichain interoperability. Airdrop potencial para usuarios tempranos.',
        requirements: [
            'Usar Bridge en múltiples chains',
            'Interactuar con apps LayerZero',
            'Mantener transacciones > $100',
            'Historial de > 3 meses'
        ],
        steps: [
            'Conectar wallet a LayerZero Bridge',
            'Realizar al menos 5 bridges entre diferentes chains',
            'Usar aplicaciones construidas en LayerZero',
            'Mantener actividad mensual hasta TGE',
            'Verificar elegibilidad cuando se anuncie'
        ],
        contract: '0x3c2269811836af69497E5F486A85D7EE6b73e924',
        officialLinks: {
            website: 'https://layerzero.network/',
            twitter: 'https://twitter.com/LayerZero_Labs',
            discord: 'https://discord.gg/layerzero'
        },
        risk: 'Low - Protocolo establecido con funding grande'
    },
    {
        id: 'zksync',
        name: 'zkSync Era',
        logo: '⚡',
        category: 'layer2',
        blockchain: 'zksync',
        difficulty: 'medium',
        status: 'hot',
        potentialValue: '$1000-3000',
        deadline: '2024-12-15',
        description: 'Layer 2 scaling solution de Ethereum. Uno de los airdrops más anticipados.',
        requirements: [
            'Bridge ETH a zkSync Era',
            'Usar DeFi protocols en zkSync',
            'Mantener fondos por tiempo',
            'Transacciones frecuentes'
        ],
        steps: [
            'Bridge ETH desde Ethereum a zkSync Era',
            'Usar exchanges descentralizados (SyncSwap, Mute)',
            'Proveer liquidez en pools',
            'Realizar al menos 20 transacciones',
            'Mantener actividad semanal'
        ],
        contract: '0xaBe43998E515242A8F8a89B3e586EEe2C5e177a1',
        officialLinks: {
            website: 'https://zksync.io/',
            twitter: 'https://twitter.com/zksync',
            discord: 'https://discord.gg/zksync'
        },
        risk: 'Medium - Alta competencia, pero gran potencial'
    },
    {
        id: 'arbitrum',
        name: 'Arbitrum One',
        logo: '⚖️',
        category: 'layer2',
        blockchain: 'arbitrum',
        difficulty: 'easy',
        status: 'confirmed',
        potentialValue: '$800-2500',
        deadline: '2024-11-30',
        description: 'Airdrop confirmado para usuarios activos de Arbitrum. Deadlines approaching!',
        requirements: [
            'Transacciones antes del snapshot',
            'Usar apps Arbitrum',
            'Mantener ARB tokens',
            'Actividad Governance'
        ],
        steps: [
            'Verificar si eres elegible en Arbitrum Foundation',
            'Conectar wallet y claim tokens',
            'Usar apps en Arbitrum ecosystem',
            'Participar en governance voting',
            'Stakear ARB tokens'
        ],
        contract: '0x912CE59144191C1204E64559FE8253a0e49E6548',
        officialLinks: {
            website: 'https://arbitrum.foundation/',
            twitter: 'https://twitter.com/arbitrum',
            discord: 'https://discord.gg/arbitrum'
        },
        risk: 'Low - Airdrop confirmado y oficial'
    },
    {
        id: 'base',
        name: 'Base Ecosystem',
        logo: '🔷',
        category: 'layer2',
        blockchain: 'base',
        difficulty: 'medium',
        status: 'potential',
        potentialValue: '$500-1500',
        deadline: 'TBD',
        description: 'L2 de Coinbase. Potencial airdrop para early adopters del ecosystem.',
        requirements: [
            'Usar apps en Base chain',
            'Bridge assets a Base',
            'Interactuar con DeFi protocols',
            'Social media engagement'
        ],
        steps: [
            'Bridge ETH o tokens a Base network',
            'Usar exchanges como BaseSwap',
            'Interactuar con lending protocols',
            'Usar NFT marketplaces en Base',
            'Mantener actividad regular'
        ],
        contract: '0x4200000000000000000000000000000000000006',
        officialLinks: {
            website: 'https://base.org/',
            twitter: 'https://twitter.com/BuildOnBase',
            discord: 'https://discord.gg/base'
        },
        risk: 'Medium - No confirmado oficialmente'
    },
    {
        id: 'friendtech',
        name: 'Friend.tech',
        logo: '💬',
        category: 'social',
        blockchain: 'base',
        difficulty: 'easy',
        status: 'confirmed',
        potentialValue: '$100-500',
        deadline: '2024-11-20',
        description: 'Social trading platform en Base. Airdrop para usuarios activos.',
        requirements: [
            'Comprar shares de creators',
            'Ser creator activo',
            'Trading activity',
            'Referrals'
        ],
        steps: [
            'Registrarse en Friend.tech',
            'Comprar shares de usuarios populares',
            'Vender y comprar activamente',
            'Referir nuevos usuarios',
            'Mantener actividad semanal'
        ],
        contract: '0xcf205808ed36563aa44a42fde02d2398e3324655',
        officialLinks: {
            website: 'https://www.friend.tech/',
            twitter: 'https://twitter.com/friendtech',
            discord: 'https://discord.gg/friendtech'
        },
        risk: 'High - Volátil y especulativo'
    },
    {
        id: 'scroll',
        name: 'Scroll zkEVM',
        logo: '📜',
        category: 'layer2',
        blockchain: 'ethereum',
        difficulty: 'medium',
        status: 'potential',
        potentialValue: '$800-2000',
        deadline: '2025-01-31',
        description: 'zkEVM compatible con Ethereum. Potencial airdrop para testnet users.',
        requirements: [
            'Participar en testnet',
            'Deploy smart contracts',
            'Bridge operations',
            'Bug reporting'
        ],
        steps: [
            'Obtener testnet ETH desde faucet',
            'Deploy contracts en Scroll testnet',
            'Usar bridges Scroll-Sepolia',
            'Reportar bugs en GitHub',
            'Participar en community'
        ],
        contract: '0x...',
        officialLinks: {
            website: 'https://scroll.io/',
            twitter: 'https://twitter.com/Scroll_ZKP',
            discord: 'https://discord.gg/scroll'
        },
        risk: 'Medium - Testnet, buen potencial'
    }
];

// Estado global
let currentFilter = 'all';
let currentBlockchain = '';
let currentCategory = '';
let currentDifficulty = '';
let searchTerm = '';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeStats();
    renderAirdrops();
    setupEventListeners();
    startRealTimeUpdates();
    loadGasPrices();
    initializeCalendar();
});

// Inicializar estadísticas
function initializeStats() {
    const totalAirdrops = airdropsDatabase.length;
    const hotAirdrops = airdropsDatabase.filter(a => a.status === 'hot').length;
    const avgValue = airdropsDatabase.reduce((sum, a) => {
        const range = a.potentialValue.match(/\$(\d+)/g);
        if (range) {
            const avg = range.reduce((s, v) => s + parseInt(v.replace('$', '')), 0) / range.length;
            return sum + avg;
        }
        return sum;
    }, 0) / totalAirdrops;

    document.getElementById('total-airdrops').textContent = totalAirdrops;
    document.getElementById('hot-airdrops').textContent = hotAirdrops;
    document.getElementById('potential-value').textContent = `$${(avgValue * totalAirdrops / 1000).toFixed(0)}K`;
    document.getElementById('success-rate').textContent = '67%';
}

// Renderizar airdrops
function renderAirdrops() {
    const featuredContainer = document.getElementById('featured-airdrops');
    const allContainer = document.getElementById('all-airdrops');

    let filteredAirdrops = filterAirdrops();

    const featured = filteredAirdrops.filter(a => a.status === 'hot' || a.status === 'confirmed');
    const regular = filteredAirdrops;

    featuredContainer.innerHTML = featured.map(airdrop => createAirdropCard(airdrop, 'featured')).join('');
    allContainer.innerHTML = regular.map(airdrop => createAirdropCard(airdrop, 'regular')).join('');
}

// Filtrar airdrops
function filterAirdrops() {
    return airdropsDatabase.filter(airdrop => {
        const matchesFilter = currentFilter === 'all' || airdrop.status === currentFilter;
        const matchesBlockchain = !currentBlockchain || airdrop.blockchain === currentBlockchain;
        const matchesCategory = !currentCategory || airdrop.category === currentCategory;
        const matchesDifficulty = !currentDifficulty || airdrop.difficulty === currentDifficulty;
        const matchesSearch = !searchTerm ||
            airdrop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            airdrop.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesBlockchain && matchesCategory && matchesDifficulty && matchesSearch;
    });
}

// Crear tarjeta de airdrop
function createAirdropCard(airdrop, type) {
    const statusColors = {
        hot: '#ff6b6b',
        new: '#4ecdc4',
        ending: '#f7b731',
        confirmed: '#5f27cd',
        potential: '#00d2d3'
    };

    const difficultyColors = {
        easy: '#27ae60',
        medium: '#f39c12',
        hard: '#e74c3c'
    };

    return `
        <div class="airdrop-card ${type === 'featured' ? 'featured' : ''}" onclick="showAirdropDetails('${airdrop.id}')">
            <div class="airdrop-header">
                <div class="airdrop-logo">${airdrop.logo}</div>
                <div class="airdrop-info">
                    <h3>${airdrop.name}</h3>
                    <div class="airdrop-meta">
                        <span class="status-badge" style="background: ${statusColors[airdrop.status]}">${airdrop.status.toUpperCase()}</span>
                        <span class="difficulty-badge" style="background: ${difficultyColors[airdrop.difficulty]}">${airdrop.difficulty.toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <div class="airdrop-content">
                <p class="airdrop-description">${airdrop.description}</p>

                <div class="airdrop-details">
                    <div class="detail-item">
                        <span class="detail-label">💎 Valor Potencial:</span>
                        <span class="detail-value">${airdrop.potentialValue}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">🔗 Blockchain:</span>
                        <span class="detail-value">${airdrop.blockchain.toUpperCase()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">📅 Deadline:</span>
                        <span class="detail-value">${formatDate(airdrop.deadline)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">⚠️ Riesgo:</span>
                        <span class="detail-value">${airdrop.risk}</span>
                    </div>
                </div>

                <div class="requirements-preview">
                    <h4>📋 Requisitos Principales:</h4>
                    <ul>
                        ${airdrop.requirements.slice(0, 3).map(req => `<li>${req}</li>`).join('')}
                        ${airdrop.requirements.length > 3 ? `<li>+${airdrop.requirements.length - 3} más...</li>` : ''}
                    </ul>
                </div>
            </div>

            <div class="airdrop-actions">
                <button class="action-btn primary" onclick="event.stopPropagation(); startAirdrop('${airdrop.id}')">
                    🚀 Comenzar Airdrop
                </button>
                <button class="action-btn secondary" onclick="event.stopPropagation(); showAirdropDetails('${airdrop.id}')">
                    📖 Ver Detalles
                </button>
            </div>
        </div>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Búsqueda
    document.getElementById('search-input').addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderAirdrops();
    });

    // Filtros
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderAirdrops();
        });
    });

    // Filtros avanzados
    document.getElementById('blockchain-filter').addEventListener('change', (e) => {
        currentBlockchain = e.target.value;
        renderAirdrops();
    });

    document.getElementById('category-filter').addEventListener('change', (e) => {
        currentCategory = e.target.value;
        renderAirdrops();
    });

    document.getElementById('difficulty-filter').addEventListener('change', (e) => {
        currentDifficulty = e.target.value;
        renderAirdrops();
    });

    // Eligibility checker
    document.getElementById('check-eligibility').addEventListener('click', checkEligibility);

    // Calendar navigation
    document.getElementById('prev-month').addEventListener('click', navigateCalendar);
    document.getElementById('next-month').addEventListener('click', navigateCalendar);
}

// Check eligibility
async function checkEligibility() {
    const walletAddress = document.getElementById('wallet-address').value;
    if (!walletAddress) {
        alert('Por favor ingresa una dirección de wallet válida');
        return;
    }

    const btn = document.getElementById('check-eligibility');
    btn.textContent = '🔄 Verificando...';
    btn.disabled = true;

    // Simular verificación (en producción sería API calls reales)
    setTimeout(() => {
        const eligibleAirdrops = airdropsDatabase.filter(() => Math.random() > 0.5);
        displayEligibilityResults(eligibleAirdrops, walletAddress);

        btn.textContent = '✅ Verificado';
        setTimeout(() => {
            btn.textContent = 'Verificar Elegibilidad';
            btn.disabled = false;
        }, 2000);
    }, 2000);
}

// Display eligibility results
function displayEligibilityResults(eligible, walletAddress) {
    const resultsDiv = document.getElementById('eligibility-results');
    const listDiv = document.getElementById('eligible-airdrops');

    resultsDiv.classList.remove('hidden');

    listDiv.innerHTML = eligible.map(airdrop => `
        <div class="eligible-item">
            <div class="eligible-logo">${airdrop.logo}</div>
            <div class="eligible-info">
                <h4>${airdrop.name}</h4>
                <p>Potencial: ${airdrop.potentialValue}</p>
                <button class="claim-btn" onclick="startAirdrop('${airdrop.id}')">Reclamar Ahora</button>
            </div>
        </div>
    `).join('');

    const totalValue = eligible.reduce((sum, a) => {
        const avg = parseInt(a.potentialValue.match(/\$(\d+)/)[1]);
        return sum + avg;
    }, 0);

    document.getElementById('eligible-count').textContent = eligible.length;
    document.getElementById('potential-value').textContent = `$${totalValue.toLocaleString()}`;
    document.getElementById('tasks-completed').textContent = Math.floor(Math.random() * 10) + 5;
}

// Show airdrop details
function showAirdropDetails(airdropId) {
    const airdrop = airdropsDatabase.find(a => a.id === airdropId);
    if (!airdrop) return;

    const modal = document.getElementById('airdrop-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-logo">${airdrop.logo}</div>
            <div class="modal-title">
                <h2>${airdrop.name}</h2>
                <div class="modal-meta">
                    <span class="status-badge">${airdrop.status.toUpperCase()}</span>
                    <span class="difficulty-badge">${airdrop.difficulty.toUpperCase()}</span>
                </div>
            </div>
        </div>

        <div class="modal-content">
            <div class="modal-section">
                <h3>📝 Descripción</h3>
                <p>${airdrop.description}</p>
            </div>

            <div class="modal-section">
                <h3>💎 Información del Airdrop</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Valor Potencial:</span>
                        <span class="info-value">${airdrop.potentialValue}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Blockchain:</span>
                        <span class="info-value">${airdrop.blockchain.toUpperCase()}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Deadline:</span>
                        <span class="info-value">${formatDate(airdrop.deadline)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Riesgo:</span>
                        <span class="info-value">${airdrop.risk}</span>
                    </div>
                </div>
            </div>

            <div class="modal-section">
                <h3>📋 Requisitos</h3>
                <ul class="requirements-list">
                    ${airdrop.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-section">
                <h3>🚀 Guía Paso a Paso</h3>
                <div class="steps-list">
                    ${airdrop.steps.map((step, index) => `
                        <div class="step-item">
                            <div class="step-number">${index + 1}</div>
                            <div class="step-content">${step}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="modal-section">
                <h3>🔗 Enlaces Oficiales</h3>
                <div class="official-links">
                    <a href="${airdrop.officialLinks.website}" target="_blank" class="official-link">
                        🌐 Sitio Web
                    </a>
                    <a href="${airdrop.officialLinks.twitter}" target="_blank" class="official-link">
                        🐦 Twitter
                    </a>
                    <a href="${airdrop.officialLinks.discord}" target="_blank" class="official-link">
                        💬 Discord
                    </a>
                </div>
            </div>

            <div class="modal-section">
                <h3>⚠️ Contrato del Token</h3>
                <div class="contract-info">
                    <code>${airdrop.contract}</code>
                    <button class="verify-btn" onclick="window.open('https://etherscan.io/address/${airdrop.contract}', '_blank')">
                        🔍 Verificar en Etherscan
                    </button>
                </div>
            </div>
        </div>

        <div class="modal-actions">
            <button class="modal-btn primary" onclick="startAirdrop('${airdrop.id}')">
                🚀 Comenzar Airdrop Ahora
            </button>
            <button class="modal-btn secondary" onclick="addToWatchlist('${airdrop.id}')">
                ⭐ Agregar a Watchlist
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('airdrop-modal').classList.add('hidden');
}

// Start airdrop
function startAirdrop(airdropId) {
    const airdrop = airdropsDatabase.find(a => a.id === airdropId);
    if (!airdrop) return;

    closeModal();

    // Aquí podríamos abrir en una nueva ventana o empezar el proceso guiado
    window.open(airdrop.officialLinks.website, '_blank');

    // O iniciar un proceso step-by-step
    alert(`🚀 Iniciando proceso para ${airdrop.name}!\n\nTe redirigiremos al sitio oficial donde podrás seguir los pasos necesarios.\n\n¡No olvides volver para calificar tu experiencia!`);
}

// Load gas prices
async function loadGasPrices() {
    try {
        const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKey');
        const data = await response.json();

        if (data.status === '1') {
            document.getElementById('gas-slow').textContent = `${data.result.SafeGasPrice} Gwei`;
            document.getElementById('gas-standard').textContent = `${data.result.ProposeGasPrice} Gwei`;
            document.getElementById('gas-fast').textContent = `${data.result.FastGasPrice} Gwei`;
        }
    } catch (error) {
        // Valores fallback
        document.getElementById('gas-slow').textContent = '25 Gwei';
        document.getElementById('gas-standard').textContent = '30 Gwei';
        document.getElementById('gas-fast').textContent = '35 Gwei';
    }
}

// Calendar functionality
function initializeCalendar() {
    updateCalendarHeader();
    renderCalendarDays();
    loadUpcomingEvents();
}

function updateCalendarHeader() {
    const now = new Date();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    document.getElementById('current-month').textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
}

function renderCalendarDays() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        calendarDays.innerHTML += '<div class="calendar-day empty"></div>';
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const airdropsOnDate = airdropsDatabase.filter(a => a.deadline === dateStr);
        const hasEvent = airdropsOnDate.length > 0;

        calendarDays.innerHTML += `
            <div class="calendar-day ${hasEvent ? 'has-event' : ''} ${day === now.getDate() ? 'today' : ''}">
                <div class="day-number">${day}</div>
                ${hasEvent ? `<div class="event-indicator">${airdropsOnDate.length} 🎁</div>` : ''}
            </div>
        `;
    }
}

function loadUpcomingEvents() {
    const eventsList = document.getElementById('events-list');

    // Group airdrops by deadline
    const upcomingEvents = airdropsDatabase
        .filter(a => a.deadline !== 'TBD')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);

    eventsList.innerHTML = upcomingEvents.map(event => `
        <div class="event-item">
            <div class="event-date">${formatDate(event.deadline)}</div>
            <div class="event-content">
                <h4>${event.logo} ${event.name}</h4>
                <p>Potencial: ${event.potentialValue}</p>
            </div>
        </div>
    `).join('');
}

// Utility functions
function formatDate(dateStr) {
    if (dateStr === 'TBD') return 'Por determinar';

    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const arrow = element.querySelector('.faq-arrow');

    answer.classList.toggle('active');
    arrow.classList.toggle('rotated');
}

function showGuide(type) {
    // Aquí podríamos abrir modales con las guías completas
    alert(`📚 Guía ${type} próximamente disponible!\n\nEstamos trabajando en guías detalladas para ayudarte a maximizar tus ganancias en airdrops.`);
}

function addToWatchlist(airdropId) {
    // Aquí podríamos implementar watchlist local o con backend
    alert('⭐ Airdrop agregado a tu watchlist! 🎉\n\nRecibirás notificaciones cuando haya novedades sobre este airdrop.');
}

// Real-time updates
function startRealTimeUpdates() {
    // Actualizar cada 5 minutos
    setInterval(() => {
        loadGasPrices();
        // Aquí podríamos actualizar otros datos en tiempo real
    }, 300000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('airdrop-modal');
    if (event.target === modal) {
        closeModal();
    }
}
</script>

<style>
/* Estilos específicos para Airdrop Hunter Tool */

/* Hero Section */
.hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 2rem;
    flex-wrap: wrap;
}

.stat-item {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: bold;
    color: #667eea;
}

.stat-label {
    color: #666;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

/* Alert Styles */
.alert {
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
    border-left: 4px solid;
}

.alert-warning {
    background: #fff3cd;
    border-color: #ffc107;
    color: #856404;
}

.alert-info {
    background: #d1ecf1;
    border-color: #17a2b8;
    color: #0c5460;
}

/* Filters Section */
.filters-section {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    margin-bottom: 3rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.search-box {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.search-box input {
    flex: 1;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
}

.search-box input:focus {
    outline: none;
    border-color: #667eea;
}

.search-btn {
    padding: 1rem 2rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.2rem;
}

.filter-tags {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.filter-tag {
    padding: 0.5rem 1rem;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-tag.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.filter-tag:hover {
    border-color: #667eea;
}

.advanced-filters {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.advanced-filters select {
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    cursor: pointer;
}

.advanced-filters select:focus {
    outline: none;
    border-color: #667eea;
}

/* Eligibility Checker */
.eligibility-checker {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 3rem;
    border-radius: 20px;
    margin-bottom: 3rem;
}

.wallet-input {
    margin-bottom: 2rem;
}

.wallet-input label {
    display: block;
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.input-group {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.input-group input {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
}

.check-btn {
    padding: 1rem 2rem;
    background: white;
    color: #667eea;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.check-btn:hover {
    transform: translateY(-2px);
}

.supported-wallets {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.wallet-badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
}

.eligibility-results {
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 15px;
    backdrop-filter: blur(10px);
}

.eligible-list {
    margin-bottom: 2rem;
}

.eligible-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin-bottom: 1rem;
}

.eligible-logo {
    font-size: 2rem;
}

.eligibility-summary {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 1rem;
}

.summary-stat {
    text-align: center;
}

.summary-number {
    display: block;
    font-size: 2rem;
    font-weight: bold;
}

.summary-label {
    font-size: 0.9rem;
    opacity: 0.8;
}

/* Calendar Section */
.calendar-section {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    margin-bottom: 3rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.nav-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2rem;
}

.calendar-grid {
    margin-bottom: 2rem;
}

.calendar-day-names {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.day-name {
    text-align: center;
    font-weight: bold;
    color: #666;
    padding: 0.5rem;
}

.calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
}

.calendar-day {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.calendar-day:hover {
    border-color: #667eea;
    background: #f8f9ff;
}

.calendar-day.today {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.calendar-day.has-event {
    border-color: #4CAF50;
    background: #f1f8e9;
}

.day-number {
    font-weight: bold;
}

.event-indicator {
    font-size: 0.8rem;
    text-align: center;
}

.events-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.event-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 10px;
    border-left: 4px solid #667eea;
}

.event-date {
    font-weight: bold;
    color: #667eea;
    min-width: 120px;
}

/* Airdrops List */
.airdrops-list {
    margin-bottom: 3rem;
}

.featured-section, .all-section {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    margin-bottom: 2rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.airdrops-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-top: 1.5rem;
}

.airdrops-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 1.5rem;
}

.airdrop-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 15px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.airdrop-card:hover {
    border-color: #667eea;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
    transform: translateY(-5px);
}

.airdrop-card.featured {
    border-color: #ff6b6b;
    background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%);
}

.airdrop-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.airdrop-logo {
    font-size: 3rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    border-radius: 50%;
}

.airdrop-info h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
}

.airdrop-meta {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.status-badge, .difficulty-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
}

.airdrop-content {
    margin-bottom: 1.5rem;
}

.airdrop-description {
    color: #666;
    margin-bottom: 1rem;
}

.airdrop-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.detail-label {
    color: #666;
    font-size: 0.9rem;
}

.detail-value {
    font-weight: bold;
    color: #333;
}

.requirements-preview h4 {
    margin: 1rem 0 0.5rem 0;
    color: #333;
}

.requirements-preview ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.requirements-preview li {
    padding: 0.25rem 0;
    color: #666;
}

.requirements-preview li:before {
    content: "✓ ";
    color: #4CAF50;
    font-weight: bold;
}

.airdrop-actions {
    display: flex;
    gap: 1rem;
}

.action-btn {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-btn.primary {
    background: #667eea;
    color: white;
}

.action-btn.primary:hover {
    background: #5a67d8;
    transform: translateY(-2px);
}

.action-btn.secondary {
    background: #f8f9fa;
    color: #333;
    border: 2px solid #e0e0e0;
}

.action-btn.secondary:hover {
    border-color: #667eea;
    background: #f8f9ff;
}

/* Guides Section */
.guides-section {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    margin-bottom: 3rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.guides-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 1.5rem;
}

.guide-card {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 15px;
    border-top: 4px solid #667eea;
}

.guide-card h3 {
    color: #333;
    margin-bottom: 1rem;
}

.guide-steps {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
}

.guide-steps li {
    padding: 0.5rem 0;
    color: #666;
}

.guide-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s ease;
    width: 100%;
}

.guide-btn:hover {
    background: #5a67d8;
}

/* Tools Section */
.tools-section {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    margin-bottom: 3rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 1.5rem;
}

.tool-item {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 15px;
    border-left: 4px solid #667eea;
}

.tool-item h3 {
    color: #333;
    margin-bottom: 1rem;
}

.gas-prices {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
}

.gas-item {
    text-align: center;
    flex: 1;
}

.gas-type {
    display: block;
    color: #666;
    font-size: 0.9rem;
}

.gas-price {
    display: block;
    font-weight: bold;
    color: #333;
    font-size: 1.1rem;
}

.calculator {
    margin-top: 1rem;
}

.calculator input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.calc-btn, .alert-btn {
    width: 100%;
    padding: 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 1rem;
}

.result {
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: #27ae60;
    padding: 1rem;
    background: #e8f5e8;
    border-radius: 8px;
}

.alert-setup {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.alert-setup select {
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

/* FAQ Section */
.faq-section {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    margin-bottom: 3rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.faq-container {
    margin-top: 1.5rem;
}

.faq-item {
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 1rem;
}

.faq-question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    text-align: left;
    color: #333;
}

.faq-arrow {
    transition: transform 0.3s ease;
    font-size: 1.2rem;
}

.faq-arrow.rotated {
    transform: rotate(180deg);
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.faq-answer.active {
    max-height: 500px;
    padding: 1rem 0;
}

.faq-answer p {
    color: #666;
    line-height: 1.6;
}

/* Modal Styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal.hidden {
    display: none;
}

.modal-content {
    background: white;
    border-radius: 20px;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    margin: 2rem;
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
    cursor: pointer;
    color: #666;
    background: none;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    background: #f8f9fa;
    color: #333;
}

.modal-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 2rem 2rem 1rem 2rem;
    border-bottom: 1px solid #e0e0e0;
}

.modal-logo {
    font-size: 3rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    border-radius: 50%;
}

.modal-title h2 {
    margin: 0;
    color: #333;
}

.modal-meta {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.modal-body {
    padding: 2rem;
}

.modal-section {
    margin-bottom: 2rem;
}

.modal-section h3 {
    color: #333;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.info-label {
    color: #666;
}

.info-value {
    font-weight: bold;
    color: #333;
}

.requirements-list {
    list-style: none;
    padding: 0;
}

.requirements-list li {
    padding: 0.75rem;
    background: #f8f9fa;
    margin-bottom: 0.5rem;
    border-radius: 8px;
    border-left: 3px solid #667eea;
}

.steps-list {
    counter-reset: step-counter;
}

.step-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
}

.step-number {
    counter-increment: step-counter;
    background: #667eea;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

.step-number::before {
    content: counter(step-counter);
}

.step-content {
    padding-top: 0.25rem;
}

.official-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.official-link {
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    text-decoration: none;
    border-radius: 25px;
    transition: background 0.3s ease;
}

.official-link:hover {
    background: #5a67d8;
}

.contract-info {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.contract-info code {
    background: #333;
    color: #4CAF50;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    flex: 1;
    word-break: break-all;
}

.verify-btn {
    padding: 0.5rem 1rem;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    white-space: nowrap;
}

.verify-btn:hover {
    background: #219a52;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    padding: 2rem;
    border-top: 1px solid #e0e0e0;
}

.modal-btn {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.modal-btn.primary {
    background: #667eea;
    color: white;
}

.modal-btn.primary:hover {
    background: #5a67d8;
}

.modal-btn.secondary {
    background: #f8f9fa;
    color: #333;
    border: 2px solid #e0e0e0;
}

.modal-btn.secondary:hover {
    border-color: #667eea;
    background: #f8f9ff;
}

/* Utility Classes */
.hidden {
    display: none !important;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-stats {
        gap: 1.5rem;
    }

    .stat-number {
        font-size: 2rem;
    }

    .filters-section,
    .eligibility-checker,
    .calendar-section,
    .featured-section,
    .all-section,
    .guides-section,
    .tools-section,
    .faq-section {
        padding: 1.5rem;
    }

    .search-box {
        flex-direction: column;
    }

    .filter-tags,
    .advanced-filters {
        flex-direction: column;
        gap: 0.5rem;
    }

    .airdrops-grid {
        grid-template-columns: 1fr;
    }

    .guides-grid,
    .tools-grid {
        grid-template-columns: 1fr;
    }

    .airdrop-details,
    .eligibility-summary {
        grid-template-columns: 1fr;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .modal-content {
        margin: 1rem;
        max-height: 95vh;
    }

    .modal-header,
    .modal-body,
    .modal-actions {
        padding: 1.5rem;
    }

    .official-links {
        flex-direction: column;
    }

    .official-link {
        text-align: center;
    }

    .contract-info {
        flex-direction: column;
    }

    .contract-info code {
        word-break: break-all;
    }

    .modal-actions {
        flex-direction: column;
    }

    .calendar-day-names,
    .calendar-days {
        font-size: 0.9rem;
    }

    .gas-prices {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>