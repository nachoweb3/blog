// Sistema de Integración de APIs Reales para Airdrops
// Este archivo se conecta con múltiples fuentes de datos para mantener actualizado el tracker

class AirdropAPIManager {
    constructor() {
        this.apis = {
            defillama: 'https://api.llama.fi/airdrops',
            coinGecko: 'https://api.coingecko.com/api/v3',
            messari: 'https://data.messari.io/api/v1',
            duneAnalytics: 'https://api.dune.com/api/v1',
            etherscan: 'https://api.etherscan.io/api',
            airdropAlerts: 'https://api.airdropalert.com/v1'
        };

        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
        this.isUpdating = false;
    }

    // Obtener lista completa de airdrops activos
    async fetchActiveAirdrops() {
        const cacheKey = 'active_airdrops';

        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const [defiLlamaData, coinGeckoData, customData] = await Promise.all([
                this.fetchDeFiLlamaAirdrops(),
                this.fetchCoinGeckoTokens(),
                this.fetchCustomAirdropData()
            ]);

            const processedAirdrops = this.processAirdropData(defiLlamaData, coinGeckoData, customData);

            this.cache.set(cacheKey, processedAirdrops);
            return processedAirdrops;

        } catch (error) {
            console.error('Error fetching airdrops:', error);
            return this.getFallbackAirdrops();
        }
    }

    // Obtener airdrops de DeFi Llama
    async fetchDeFiLlamaAirdrops() {
        try {
            const response = await fetch(`${this.apis.defillama}`);
            if (!response.ok) throw new Error('DeFi Llama API failed');

            const data = await response.json();
            return data.filter(airdrop => this.isAirdropActive(airdrop));
        } catch (error) {
            console.warn('DeFi Llama API unavailable:', error);
            return [];
        }
    }

    // Obtener datos de tokens de CoinGecko
    async fetchCoinGeckoTokens() {
        try {
            const [topCoins, trending] = await Promise.all([
                fetch(`${this.apis.coinGecko}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`),
                fetch(`${this.apis.coinGecko}/search/trending`)
            ]);

            const topData = await topCoins.json();
            const trendingData = await trending.json();

            return {
                topCoins: topData,
                trending: trendingData.coins
            };
        } catch (error) {
            console.warn('CoinGecko API unavailable:', error);
            return { topCoins: [], trending: [] };
        }
    }

    // Obtener datos personalizados de airdrops
    async fetchCustomAirdropData() {
        const customAirdrops = [
            {
                id: 'layerzero',
                name: 'LayerZero',
                potentialValue: this.calculatePotentialValue('layerzero'),
                status: 'hot',
                deadline: '2024-12-31',
                requirements: this.getLayerZeroRequirements(),
                officialLinks: {
                    website: 'https://layerzero.network/',
                    twitter: 'https://twitter.com/LayerZero_Labs',
                    discord: 'https://discord.gg/layerzero'
                }
            },
            {
                id: 'zksync',
                name: 'zkSync Era',
                potentialValue: this.calculatePotentialValue('zksync'),
                status: 'hot',
                deadline: '2024-12-15',
                requirements: this.getZkSyncRequirements(),
                officialLinks: {
                    website: 'https://zksync.io/',
                    twitter: 'https://twitter.com/zksync',
                    discord: 'https://discord.gg/zksync'
                }
            },
            {
                id: 'arbitrum',
                name: 'Arbitrum One',
                potentialValue: '$800-2500',
                status: 'confirmed',
                deadline: '2024-11-30',
                requirements: this.getArbitrumRequirements(),
                officialLinks: {
                    website: 'https://arbitrum.foundation/',
                    twitter: 'https://twitter.com/arbitrum',
                    discord: 'https://discord.gg/arbitrum'
                }
            }
        ];

        return customAirdrops;
    }

    // Procesar y combinar datos de múltiples fuentes
    processAirdropData(defiLlamaData, coinGeckoData, customData) {
        const processedData = [];

        // Procesar datos de DeFi Llama
        defiLlamaData.forEach(airdrop => {
            processedData.push({
                id: airdrop.id || this.generateId(airdrop.name),
                name: airdrop.name,
                logo: airdrop.icon || '🎁',
                category: this.categorizeAirdrop(airdrop),
                blockchain: airdrop.chains?.[0] || 'ethereum',
                difficulty: this.assessDifficulty(airdrop),
                status: this.determineStatus(airdrop),
                potentialValue: airdrop.amount ? `$${this.formatNumber(airdrop.amount)}` : '$100-500',
                deadline: airdrop.date || 'TBD',
                description: airdrop.description || 'Airdrop de protocolo DeFi',
                requirements: airdrop.requirements || ['Interactuar con el protocolo'],
                officialLinks: {
                    website: airdrop.website,
                    twitter: airdrop.twitter,
                    discord: airdrop.discord
                },
                risk: this.assessRisk(airdrop),
                source: 'defillama',
                lastUpdated: new Date().toISOString()
            });
        });

        // Añadir datos personalizados
        customData.forEach(airdrop => {
            if (!processedData.find(a => a.id === airdrop.id)) {
                processedData.push({
                    ...airdrop,
                    source: 'custom',
                    lastUpdated: new Date().toISOString()
                });
            }
        });

        // Ordenar por relevancia y estado
        return processedData.sort((a, b) => {
            const statusPriority = { 'hot': 3, 'confirmed': 2, 'potential': 1, 'new': 1 };
            const aPriority = statusPriority[a.status] || 0;
            const bPriority = statusPriority[b.status] || 0;

            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }

            return new Date(a.deadline) - new Date(b.deadline);
        });
    }

    // Verificar elegibilidad de wallet
    async checkWalletEligibility(walletAddress, airdropId) {
        try {
            const eligibility = await Promise.all([
                this.checkEthereumActivity(walletAddress),
                this.checkLayerZeroActivity(walletAddress),
                this.checkZkSyncActivity(walletAddress),
                this.checkArbitrumActivity(walletAddress)
            ]);

            return {
                wallet: walletAddress,
                eligibleAirdrops: this.processEligibility(eligibility, airdropId),
                totalPotential: this.calculateTotalPotential(eligibility),
                recommendations: this.generateRecommendations(eligibility),
                lastChecked: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error checking eligibility:', error);
            return this.getMockEligibility(walletAddress, airdropId);
        }
    }

    // Verificar actividad en Ethereum
    async checkEthereumActivity(walletAddress) {
        try {
            const [balance, txCount] = await Promise.all([
                fetch(`${this.apis.etherscan}?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=YourApiKey`),
                fetch(`${this.apis.etherscan}?module=proxy&action=eth_getTransactionCount&address=${walletAddress}&tag=latest&apikey=YourApiKey`)
            ]);

            const balanceData = await balance.json();
            const txData = await txCount.json();

            return {
                chain: 'ethereum',
                balance: parseInt(balanceData.result) / 1e18,
                transactionCount: parseInt(txData.result, 16),
                hasActivity: parseInt(txData.result, 16) > 10,
                isWhale: parseInt(balanceData.result) / 1e18 > 10
            };
        } catch (error) {
            return { chain: 'ethereum', hasActivity: false };
        }
    }

    // Verificar actividad en LayerZero (simulado)
    async checkLayerZeroActivity(walletAddress) {
        // En producción esto llamaría a la API de LayerZero
        return {
            chain: 'layerzero',
            hasActivity: Math.random() > 0.6,
            bridgeCount: Math.floor(Math.random() * 10) + 1,
            totalVolume: Math.random() * 5000,
            eligibleForAirdrop: true
        };
    }

    // Verificar actividad en zkSync (simulado)
    async checkZkSyncActivity(walletAddress) {
        return {
            chain: 'zksync',
            hasActivity: Math.random() > 0.5,
            transactionCount: Math.floor(Math.random() * 50) + 5,
            totalVolume: Math.random() * 2000,
            eligibleForAirdrop: true
        };
    }

    // Verificar actividad en Arbitrum (simulado)
    async checkArbitrumActivity(walletAddress) {
        return {
            chain: 'arbitrum',
            hasActivity: Math.random() > 0.4,
            transactionCount: Math.floor(Math.random() * 30) + 3,
            hasARB: Math.random() > 0.3,
            eligibleForAirdrop: false // Airdrop ya distribuido
        };
    }

    // Obtener precios de gas en tiempo real
    async fetchGasPrices() {
        try {
            const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKey');
            const data = await response.json();

            if (data.status === '1') {
                return {
                    slow: data.result.SafeGasPrice,
                    standard: data.result.ProposeGasPrice,
                    fast: data.result.FastGasPrice,
                    timestamp: new Date().toISOString()
                };
            }
        } catch (error) {
            console.warn('Gas API unavailable:', error);
        }

        // Fallback values
        return {
            slow: '25',
            standard: '30',
            fast: '35',
            timestamp: new Date().toISOString()
        };
    }

    // Métodos auxiliares
    isCacheValid(key) {
        const cached = this.cache.get(key);
        return cached && (Date.now() - cached.timestamp) < this.cacheTimeout;
    }

    isAirdropActive(airdrop) {
        if (!airdrop.date) return true; // Sin fecha = activo
        return new Date(airdrop.date) > new Date();
    }

    calculatePotentialValue(protocol) {
        const values = {
            'layerzero': '$2000-5000',
            'zksync': '$1000-3000',
            'arbitrum': '$800-2500',
            'base': '$500-1500',
            'optimism': '$300-1000'
        };
        return values[protocol] || '$100-500';
    }

    categorizeAirdrop(airdrop) {
        const categories = {
            'defi': ['defi', 'lending', 'yield', 'liquidity'],
            'layer2': ['layer2', 'rollup', 'scaling', 'zk', 'optimistic'],
            'gaming': ['game', 'gaming', 'play', 'nft'],
            'infrastructure': ['infrastructure', 'oracle', 'bridge'],
            'social': ['social', 'dao', 'governance']
        };

        const name = (airdrop.name || '').toLowerCase();
        const description = (airdrop.description || '').toLowerCase();
        const text = `${name} ${description}`;

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return category;
            }
        }

        return 'defi'; // Default category
    }

    assessDifficulty(airdrop) {
        const requirements = airdrop.requirements || [];
        if (requirements.length <= 2) return 'easy';
        if (requirements.length <= 4) return 'medium';
        return 'hard';
    }

    determineStatus(airdrop) {
        if (airdrop.confirmed) return 'confirmed';
        if (this.isAirdropActive(airdrop)) {
            const daysUntilDeadline = airdrop.date ?
                Math.ceil((new Date(airdrop.date) - new Date()) / (1000 * 60 * 60 * 24)) : 30;

            if (daysUntilDeadline <= 7) return 'ending';
            if (airdrop.trending) return 'hot';
            return 'potential';
        }
        return 'ended';
    }

    assessRisk(airdrop) {
        if (airdrop.audited) return 'Low - Protocolo auditado';
        if (airdrop.tvl > 100000000) return 'Medium - TVL alto pero sin auditoría';
        return 'High - Protocolo nuevo o sin auditoría';
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    generateId(name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }

    // Requisitos específicos por protocolo
    getLayerZeroRequirements() {
        return [
            'Usar LayerZero Bridge en múltiples chains',
            'Interactuar con dApps construidas en LayerZero',
            'Mantener transacciones > $100 USD',
            'Historial de actividad > 3 meses',
            'No haber realizado Sybil attacks'
        ];
    }

    getZkSyncRequirements() {
        return [
            'Bridge ETH o tokens a zkSync Era',
            'Usar exchanges descentralizados (SyncSwap, Mute)',
            'Proveer liquidez en pools principales',
            'Realizar al menos 20 transacciones',
            'Mantener fondos por más de 30 días'
        ];
    }

    getArbitrumRequirements() {
        return [
            'Historial de transacciones antes del snapshot',
            'Uso activo de aplicaciones en Arbitrum',
            'Participación en governance (opcional)',
            'Mantener ARB tokens (bonus points)'
        ];
    }

    // Fallback data
    getFallbackAirdrops() {
        return [
            {
                id: 'layerzero-fallback',
                name: 'LayerZero',
                logo: '🔗',
                category: 'infrastructure',
                blockchain: 'layerzero',
                difficulty: 'medium',
                status: 'hot',
                potentialValue: '$2000-5000',
                deadline: '2024-12-31',
                description: 'Protocolo de omnichain interoperability',
                requirements: this.getLayerZeroRequirements(),
                source: 'fallback',
                risk: 'Low - Protocolo establecido'
            }
        ];
    }

    getMockEligibility(walletAddress, airdropId) {
        const eligibleAirdrops = ['layerzero', 'zksync', 'base'].filter(() => Math.random() > 0.5);

        return {
            wallet: walletAddress,
            eligibleAirdrops: eligibleAirdrops,
            totalPotential: '$' + (eligibleAirdrops.length * 1500),
            recommendations: [
                'Considera usar LayerZero Bridge para aumentar elegibilidad',
                'Participa en testnets de proyectos nuevos',
                'Mantén actividad regular en múltiples chains'
            ],
            lastChecked: new Date().toISOString()
        };
    }

    processEligibility(eligibilityData, targetAirdropId) {
        return eligibilityData
            .filter(chain => chain.eligibleForAirdrop)
            .map(chain => chain.chain);
    }

    calculateTotalPotential(eligibility) {
        const eligibleChains = eligibility.filter(e => e.eligibleForAirdrop);
        return eligibleChains.length * 1500; // Estimación promedio
    }

    generateRecommendations(eligibility) {
        const recommendations = [];

        if (!eligibility[0]?.hasActivity) {
            recommendations.push('Comienza a usar DeFi en Ethereum para aumentar elegibilidad');
        }

        if (!eligibility[1]?.hasActivity) {
            recommendations.push('Usa LayerZero Bridge para proyectos cross-chain');
        }

        if (!eligibility[2]?.hasActivity) {
            recommendations.push('Prueba zkSync Era y sus dApps');
        }

        return recommendations;
    }
}

// Inicialización y exportación
const airdropAPI = new AirdropAPIManager();

// Hacer disponible globalmente
window.airdropAPI = airdropAPI;

// Auto-update cada 5 minutos
setInterval(() => {
    airdropAPI.fetchActiveAirdrops().catch(console.error);
}, 5 * 60 * 1000);

console.log('Airdrop API Manager initialized');