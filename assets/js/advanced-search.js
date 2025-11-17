/**
 * Advanced Search System for NachoWeb3 Blog
 *
 * Features:
 * - Intelligent search with typo tolerance
 * - Advanced filtering and sorting
 * - Voice search support
 * - Real-time suggestions
 * - Search analytics
 * - Search history and popular searches
 * - Content highlighting
 * - Search result pagination
 */

class AdvancedSearchSystem {
    constructor(options = {}) {
        this.options = {
            // Search configuration
            minQueryLength: options.minQueryLength || 2,
            maxResults: options.maxResults || 20,
            debounceDelay: options.debounceDelay || 300,

            // Indexing
            enableContentIndexing: options.enableContentIndexing !== false,
            enableTagIndexing: options.enableTagIndexing !== false,
            enableCategoryIndexing: options.enableCategoryIndexing !== false,

            // Voice search
            enableVoiceSearch: options.enableVoiceSearch !== false,
            language: options.language || 'es-ES',

            // Analytics
            enableAnalytics: options.enableAnalytics !== false,

            // Caching
            enableCaching: options.enableCaching !== false,
            cacheTimeout: options.cacheTimeout || 5 * 60 * 1000, // 5 minutes

            ...options
        };

        // State
        this.index = {
            posts: [],
            tags: new Map(),
            categories: new Map(),
            fullText: new Map()
        };

        this.currentQuery = '';
        this.currentFilters = {
            categories: [],
            tags: [],
            dateFrom: null,
            dateTo: null,
            sortBy: 'relevance'
        };

        this.searchHistory = [];
        this.popularSearches = [];
        this.suggestions = [];

        this.isSearching = false;
        this.searchResults = [];

        // Initialize
        this.init();
    }

    init() {
        console.log('🔍 Advanced Search System initializing...');

        // Build search index
        this.buildSearchIndex();

        // Setup search UI
        this.setupSearchUI();

        // Setup voice search
        if (this.options.enableVoiceSearch) {
            this.setupVoiceSearch();
        }

        // Load search history
        this.loadSearchHistory();

        // Load popular searches
        this.loadPopularSearches();

        // Setup analytics
        if (this.options.enableAnalytics) {
            this.setupSearchAnalytics();
        }

        console.log('✅ Advanced Search System initialized');
    }

    async buildSearchIndex() {
        console.log('📚 Building search index...');

        try {
            // Fetch all blog posts
            const posts = await this.fetchBlogPosts();

            // Index each post
            posts.forEach(post => {
                this.indexPost(post);
            });

            console.log(`✅ Indexed ${posts.length} posts`);

        } catch (error) {
            console.error('Error building search index:', error);
        }
    }

    async fetchBlogPosts() {
        // In a real implementation, this would fetch from your API or filesystem
        // For demo purposes, we'll simulate posts

        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const posts = [
                    {
                        id: '1',
                        title: 'ChatGPT vs GPT-4: La Nueva Era de la IA',
                        content: 'Comparativa detallada entre ChatGPT y GPT-4. Ventajas y desventajas de cada modelo. Casos de uso recomendados para desarrolladores y empresas. Análisis de capacidades de razonamiento y generación de código.',
                        excerpt: 'Descubre las diferencias clave entre ChatGPT y GPT-4',
                        url: '/blog/chatgpt-vs-gpt4',
                        date: '2024-11-17',
                        categories: ['ia'],
                        tags: ['ChatGPT', 'GPT-4', 'IA', 'Machine Learning'],
                        author: 'NachoWeb3',
                        readingTime: 8,
                        image: '/blog/images/gpt4-comparison.jpg'
                    },
                    {
                        id: '2',
                        title: 'Ethereum 2.0: Todo lo que necesitas saber',
                        content: 'Guía completa sobre la actualización de Ethereum a Proof of Stake. Cambios técnicos, ventajas, y cómo prepararse para el futuro de la red Ethereum. Staking, validadores y recompensas explicadas.',
                        excerpt: 'Prepárate para el futuro de Ethereum con esta guía completa',
                        url: '/blog/ethereum-2.0-guia',
                        date: '2024-11-16',
                        categories: ['blockchain'],
                        tags: ['Ethereum', 'Proof of Stake', 'Staking', 'ETH2'],
                        author: 'NachoWeb3',
                        readingTime: 12,
                        image: '/blog/images/ethereum-2.jpg'
                    },
                    {
                        id: '3',
                        title: 'Tutorial: Trading Cryptos para Principiantes',
                        content: 'Guía paso a paso para comenzar a trading de criptomonedas. Análisis técnico, gestión de riesgo, estrategias de trading, y herramientas recomendadas. Cómo evitar errores comunes y proteger tu inversión.',
                        excerpt: 'Aprende trading de criptomonedas desde cero con este tutorial completo',
                        url: '/blog/trading-crypto-principiantes',
                        date: '2024-11-15',
                        categories: ['tutoriales', 'blockchain'],
                        tags: ['Trading', 'Bitcoin', 'Estrategias', 'Análisis técnico'],
                        author: 'NachoWeb3',
                        readingTime: 15,
                        image: '/blog/images/trading-tutorial.jpg'
                    },
                    {
                        id: '4',
                        title: 'Python para Blockchain: Desarrollo de Smart Contracts',
                        content: 'Tutorial completo de Python aplicado al desarrollo de blockchain. Smart contracts con Solidity, integración con Web3, y desarrollo de dApps. Proyectos prácticos y mejores prácticas de seguridad.',
                        excerpt: 'Aprende a desarrollar blockchain con Python y Solidity',
                        url: '/blog/python-blockchain-smart-contracts',
                        date: '2024-11-14',
                        categories: ['tutoriales', 'ia'],
                        tags: ['Python', 'Smart Contracts', 'Solidity', 'Blockchain', 'dApps'],
                        author: 'NachoWeb3',
                        readingTime: 20,
                        image: '/blog/images/python-blockchain.jpg'
                    },
                    {
                        id: '5',
                        title: 'NFTs: Guía Completa para Artistas Digitales',
                        content: 'Todo sobre NFTs: cómo crear, vender y comprar tokens no fungibles. Plataformas recomendadas, costos de gas, y estrategias de marketing digital para artistas. Casos de éxito y consejos expertos.',
                        excerpt: 'Conviértete en artista digital con esta guía completa de NFTs',
                        url: '/blog/nfts-guia-completa',
                        date: '2024-11-13',
                        categories: ['blockchain'],
                        tags: ['NFT', 'Arte digital', 'Marketplace', 'Web3'],
                        author: 'NachoWeb3',
                        readingTime: 10,
                        image: '/blog/images/nft-guide.jpg'
                    },
                    {
                        id: '6',
                        title: 'Machine Learning con JavaScript: Frameworks y Herramientas',
                        content: 'Explora las mejores librerías de Machine Learning para JavaScript. TensorFlow.js, Brain.js, y cómo implementar modelos de IA en aplicaciones web. Proyectos prácticos y ejemplos de código.',
                        excerpt: 'Implementa Machine Learning en tus proyectos web con JavaScript',
                        url: '/blog/machine-learning-javascript',
                        date: '2024-11-12',
                        categories: ['ia'],
                        tags: ['Machine Learning', 'JavaScript', 'TensorFlow.js', 'IA'],
                        author: 'NachoWeb3',
                        readingTime: 18,
                        image: '/blog/images/ml-javascript.jpg'
                    },
                    {
                        id: '7',
                        title: 'DeFi: Yield Farming y Liquidity Mining Explicado',
                        content: 'Guía completa sobre Decentralized Finance. Cómo funciona el yield farming, estrategias para maximizar rendimientos, y riesgos asociados. Protocolos recomendados y cómo evaluar su seguridad.',
                        excerpt: 'Maximiza tus rendimientos en DeFi con yield farming',
                        url: '/blog/def-yield-farming-guia',
                        date: '2024-11-11',
                        categories: ['blockchain'],
                        tags: ['DeFi', 'Yield Farming', 'Liquidity Mining', 'APY'],
                        author: 'NachoWeb3',
                        readingTime: 14,
                        image: '/blog/images/defi-yield.jpg'
                    },
                    {
                        id: '8',
                        title: 'React + Web3: Aplicaciones Descentralizadas',
                        content: 'Tutorial completo sobre cómo integrar React con blockchain. Conexión a wallets, lectura de contratos inteligentes, y creación de dApps interactivas. Web3.js, ethers.js y mejores prácticas.',
                        excerpt: 'Crea aplicaciones Web3 con React y blockchain',
                        url: '/blog/react-web3-dapps',
                        date: '2024-11-10',
                        categories: ['tutoriales', 'blockchain'],
                        tags: ['React', 'Web3', 'dApps', 'Ethers.js'],
                        author: 'NachoWeb3',
                        readingTime: 16,
                        image: '/blog/images/react-web3.jpg'
                    }
                ];
                resolve(posts);
            }, 1000);
        });
    }

    indexPost(post) {
        // Create searchable text
        const searchableText = [
            post.title,
            post.content,
            post.excerpt,
            post.tags.join(' '),
            post.categories.join(' ')
        ].join(' ').toLowerCase();

        // Index post
        const indexedPost = {
            ...post,
            searchableText,
            score: 0
        };

        this.index.posts.push(indexedPost);

        // Index tags
        post.tags.forEach(tag => {
            if (!this.index.tags.has(tag)) {
                this.index.tags.set(tag, []);
            }
            this.index.tags.get(tag).push(post.id);
        });

        // Index categories
        post.categories.forEach(category => {
            if (!this.index.categories.has(category)) {
                this.index.categories.set(category, []);
            }
            this.index.categories.get(category).push(post.id);
        });

        // Create full-text index for advanced search
        this.index.fullText.set(post.id, {
            title: post.title.toLowerCase(),
            content: post.content.toLowerCase(),
            excerpt: post.excerpt.toLowerCase(),
            tags: post.tags.map(t => t.toLowerCase()),
            categories: post.categories.map(c => c.toLowerCase())
        });
    }

    setupSearchUI() {
        // Search input
        const searchInput = document.getElementById('search-input-advanced');
        const searchBtn = document.getElementById('search-btn-advanced');

        if (searchInput) {
            // Input handler with debouncing
            searchInput.addEventListener('input', this.debounce((e) => {
                const query = e.target.value.trim();
                if (query.length >= this.options.minQueryLength) {
                    this.handleQuery(query);
                    this.showSuggestions(query);
                } else {
                    this.hideSuggestions();
                }
            }, this.options.debounceDelay));

            // Enter key handler
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch();
                }
            });

            // Focus/blur handlers
            searchInput.addEventListener('focus', () => {
                const query = searchInput.value.trim();
                if (query.length >= this.options.minQueryLength) {
                    this.showSuggestions(query);
                }
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => this.hideSuggestions(), 200);
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        // Filter handlers
        this.setupFilterHandlers();

        // Sort handler
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentFilters.sortBy = e.target.value;
                this.sortResults();
            });
        }

        // Clear filters
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Save search
        const saveSearchBtn = document.getElementById('save-search');
        if (saveSearchBtn) {
            saveSearchBtn.addEventListener('click', () => {
                this.saveCurrentSearch();
            });
        }

        // Tag cloud handlers
        this.setupTagCloudHandlers();
    }

    setupFilterHandlers() {
        // Category filters
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.currentFilters.categories.push(e.target.value);
                } else {
                    this.currentFilters.categories = this.currentFilters.categories
                        .filter(cat => cat !== e.target.value);
                }
                this.applyFilters();
            });
        });

        // Date range filters
        const dateFrom = document.getElementById('date-from');
        const dateTo = document.getElementById('date-to');

        if (dateFrom) {
            dateFrom.addEventListener('change', (e) => {
                this.currentFilters.dateFrom = e.target.value;
                this.applyFilters();
            });
        }

        if (dateTo) {
            dateTo.addEventListener('change', (e) => {
                this.currentFilters.dateTo = e.target.value;
                this.applyFilters();
            });
        }
    }

    setupTagCloudHandlers() {
        const clickableTags = document.querySelectorAll('.clickable-tag');
        clickableTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const tagText = tag.dataset.tag;
                const searchInput = document.getElementById('search-input-advanced');

                if (searchInput) {
                    searchInput.value = tagText;
                    this.performSearch();
                }

                // Track tag click analytics
                if (this.options.enableAnalytics) {
                    this.trackSearchEvent('tag_click', { tag: tagText });
                }
            });
        });
    }

    setupVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Voice search not supported in this browser');
            return;
        }

        const voiceBtn = document.getElementById('voice-search-btn');
        if (!voiceBtn) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.options.language;

        this.recognition.onstart = () => {
            voiceBtn.classList.add('listening');
            voiceBtn.innerHTML = '<span>🎙️</span> Escuchando...';
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const searchInput = document.getElementById('search-input-advanced');

            if (searchInput) {
                searchInput.value = transcript;
                this.performSearch();
            }

            this.trackSearchEvent('voice_search', { query: transcript });
        };

        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            voiceBtn.classList.remove('listening');
            voiceBtn.innerHTML = '<span>🎤</span>';
            this.showNotification('Error en el reconocimiento de voz', 'error');
        };

        this.recognition.onend = () => {
            voiceBtn.classList.remove('listening');
            voiceBtn.innerHTML = '<span>🎤</span>';
        };

        voiceBtn.addEventListener('click', () => {
            this.recognition.start();
        });
    }

    handleQuery(query) {
        this.currentQuery = query;

        // Generate suggestions
        this.generateSuggestions(query);

        // Update popular searches
        this.updatePopularSearches();
    }

    generateSuggestions(query) {
        const suggestions = [];

        // Title suggestions
        this.index.posts.forEach(post => {
            if (post.title.toLowerCase().includes(query.toLowerCase())) {
                suggestions.push({
                    type: 'title',
                    text: post.title,
                    url: post.url,
                    post: post
                });
            }
        });

        // Tag suggestions
        this.index.tags.forEach((posts, tag) => {
            if (tag.toLowerCase().includes(query.toLowerCase())) {
                suggestions.push({
                    type: 'tag',
                    text: tag,
                    url: `/blog/tag/${tag}`,
                    count: posts.length
                });
            }
        });

        // Category suggestions
        this.index.categories.forEach((posts, category) => {
            if (category.toLowerCase().includes(query.toLowerCase())) {
                suggestions.push({
                    type: 'category',
                    text: category,
                    url: `/blog/${category}`,
                    count: posts.length
                });
            }
        });

        // Sort and limit suggestions
        suggestions.sort((a, b) => {
            const aScore = this.calculateSuggestionScore(a, query);
            const bScore = this.calculateSuggestionScore(b, query);
            return bScore - aScore;
        });

        this.suggestions = suggestions.slice(0, 8);
    }

    calculateSuggestionScore(suggestion, query) {
        let score = 0;

        // Exact match bonus
        if (suggestion.text.toLowerCase() === query.toLowerCase()) {
            score += 100;
        }

        // Starts with query bonus
        if (suggestion.text.toLowerCase().startsWith(query.toLowerCase())) {
            score += 50;
        }

        // Contains query bonus
        if (suggestion.text.toLowerCase().includes(query.toLowerCase())) {
            score += 25;
        }

        // Length preference (shorter suggestions get bonus)
        score += Math.max(0, 20 - suggestion.text.length);

        // Type preference
        switch (suggestion.type) {
            case 'title':
                score += 30;
                break;
            case 'tag':
                score += 20;
                break;
            case 'category':
                score += 15;
                break;
        }

        return score;
    }

    showSuggestions(query) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) return;

        if (this.suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        suggestionsContainer.innerHTML = this.suggestions.map(suggestion => `
            <div class="suggestion-item" data-url="${suggestion.url}">
                ${suggestion.type === 'title' ? `
                    <div class="suggestion-title">${this.highlightText(suggestion.text, query)}</div>
                    <div class="suggestion-meta">${suggestion.post.date} • ${suggestion.post.readingTime} min lectura</div>
                ` : `
                    <div class="suggestion-title">${this.highlightText(suggestion.text, query)}</div>
                    <div class="suggestion-meta">${suggestion.count} ${suggestion.type === 'tag' ? 'artículos' : 'categorías'}</div>
                `}
            </div>
        `).join('');

        suggestionsContainer.style.display = 'block';

        // Add click handlers to suggestions
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                window.location.href = url;
            });
        });
    }

    hideSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    highlightText(text, query) {
        if (!query) return text;

        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    async performSearch() {
        const searchInput = document.getElementById('search-input-advanced');
        const query = searchInput?.value?.trim();

        if (!query || query.length < this.options.minQueryLength) {
            this.showNotification('Por favor, ingresa al menos ' + this.options.minQueryLength + ' caracteres', 'warning');
            return;
        }

        this.currentQuery = query;
        this.isSearching = true;
        this.showLoading(true);
        this.hideSuggestions();

        try {
            // Search with current filters
            const results = this.search(query, this.currentFilters);

            // Sort results
            this.searchResults = this.sortResultsByScore(results);

            // Update UI
            this.renderResults();
            this.updateStats();

            // Save to history
            this.addToSearchHistory(query);

            // Track search analytics
            if (this.options.enableAnalytics) {
                this.trackSearchEvent('search_performed', {
                    query,
                    resultsCount: this.searchResults.length,
                    filters: this.currentFilters
                });
            }

        } catch (error) {
            console.error('Search error:', error);
            this.showNotification('Error al realizar la búsqueda', 'error');
        } finally {
            this.isSearching = false;
            this.showLoading(false);
        }
    }

    search(query, filters) {
        const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);

        let results = [];

        // Search all posts
        this.index.posts.forEach(post => {
            let score = 0;
            let matches = [];

            // Full text search
            const fullText = this.index.fullText.get(post.id);

            // Title matching (highest weight)
            const titleMatch = this.searchInText(post.title.toLowerCase(), queryWords);
            if (titleMatch.matches > 0) {
                score += titleMatch.matches * 10;
                matches.push(...titleMatch.words);
            }

            // Content matching
            const contentMatch = this.searchInText(post.content.toLowerCase(), queryWords);
            if (contentMatch.matches > 0) {
                score += contentMatch.matches * 5;
                matches.push(...contentMatch.words);
            }

            // Excerpt matching
            const excerptMatch = this.searchInText(post.excerpt.toLowerCase(), queryWords);
            if (excerptMatch.matches > 0) {
                score += excerptMatch.matches * 8;
                matches.push(...excerptMatch.words);
            }

            // Tag matching
            const tagMatches = this.searchInArray(post.tags, queryWords);
            score += tagMatches * 7;
            matches.push(...tagMatches);

            // Category matching
            const categoryMatches = this.searchInArray(post.categories, queryWords);
            score += categoryMatches * 6;
            matches.push(...categoryMatches);

            // Only include if there are matches
            if (score > 0) {
                results.push({
                    ...post,
                    score,
                    matches,
                    relevanceScore: score / queryWords.length
                });
            }
        });

        // Apply filters
        results = this.applyFiltersToResults(results, filters);

        return results;
    }

    searchInText(text, queryWords) {
        let matches = 0;
        const matchedWords = [];

        queryWords.forEach(word => {
            const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            const wordMatches = (text.match(regex) || []).length;
            matches += wordMatches;
            if (wordMatches > 0) {
                matchedWords.push(word);
            }
        });

        return { matches, words: matchedWords };
    }

    searchInArray(array, queryWords) {
        let matches = 0;

        array.forEach(item => {
            const itemLower = item.toLowerCase();
            queryWords.forEach(word => {
                if (itemLower.includes(word)) {
                    matches++;
                }
            });
        });

        return matches;
    }

    applyFiltersToResults(results, filters) {
        // Category filter
        if (filters.categories.length > 0) {
            results = results.filter(post =>
                post.categories.some(cat => filters.categories.includes(cat))
            );
        }

        // Date range filter
        if (filters.dateFrom || filters.dateTo) {
            results = results.filter(post => {
                const postDate = new Date(post.date);
                const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
                const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

                if (fromDate && postDate < fromDate) return false;
                if (toDate && postDate > toDate) return false;
                return true;
            });
        }

        return results;
    }

    sortResultsByScore(results) {
        return results.sort((a, b) => {
            // Primary sort by score
            if (b.score !== a.score) {
                return b.score - a.score;
            }

            // Secondary sort by date
            return new Date(b.date) - new Date(a.date);
        });
    }

    sortResults() {
        switch (this.currentFilters.sortBy) {
            case 'date-desc':
                this.searchResults.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                this.searchResults.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'title-asc':
                this.searchResults.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                this.searchResults.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'reading-time-asc':
                this.searchResults.sort((a, b) => (a.readingTime || 0) - (b.readingTime || 0));
                break;
            case 'reading-time-desc':
                this.searchResults.sort((a, b) => (b.readingTime || 0) - (a.readingTime || 0));
                break;
            case 'relevance':
            default:
                // Already sorted by relevance/score
                break;
        }

        this.renderResults();
    }

    renderResults() {
        const resultsContainer = document.getElementById('search-results');
        const noResults = document.getElementById('no-results');
        const pagination = document.getElementById('search-pagination');

        if (!resultsContainer) return;

        // Clear previous results
        resultsContainer.innerHTML = '';

        if (this.searchResults.length === 0) {
            resultsContainer.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
            if (pagination) pagination.style.display = 'none';
            return;
        }

        resultsContainer.style.display = 'grid';
        if (noResults) noResults.style.display = 'none';
        if (pagination) pagination.style.display = 'flex';

        // Render results
        this.searchResults.forEach(result => {
            const resultCard = this.createResultCard(result);
            resultsContainer.innerHTML += resultCard;
        });

        // Setup pagination
        this.setupPagination();
    }

    createResultCard(result) {
        return `
            <div class="search-result-card">
                <div class="result-header">
                    <div>
                        <h3 class="result-title">
                            <a href="${result.url}">${this.highlightText(result.title, this.currentQuery)}</a>
                        </h3>
                        <div class="result-meta">
                            <span class="result-category">${result.categories[0]}</span>
                            <span>•</span>
                            <span>${new Date(result.date).toLocaleDateString('es-ES')}</span>
                            <span>•</span>
                            <span>${result.readingTime} min lectura</span>
                        </div>
                    </div>
                </div>

                <div class="result-excerpt">
                    ${this.highlightText(result.excerpt, this.currentQuery)}
                </div>

                <div class="result-tags">
                    ${result.tags.slice(0, 5).map(tag => `
                        <span class="result-tag">${tag}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    setupPagination() {
        const paginationContainer = document.getElementById('search-pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.searchResults.length / this.options.maxResults);
        const currentPage = 1;

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        let paginationHTML = '';

        // Previous button
        if (currentPage > 1) {
            paginationHTML += `
                <button class="pagination-btn" onclick="searchSystem.goToPage(${currentPage - 1})">
                    ← Anterior
                </button>
            `;
        }

        // Page numbers
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            const isActive = i === currentPage;
            paginationHTML += `
                <button class="pagination-btn ${isActive ? 'active' : ''}" onclick="searchSystem.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        // Next button
        if (currentPage < totalPages) {
            paginationHTML += `
                <button class="pagination-btn" onclick="searchSystem.goToPage(${currentPage + 1})">
                    Siguiente →
                </button>
            `;
        }

        paginationContainer.innerHTML = paginationHTML;
    }

    updateStats() {
        const statsContainer = document.getElementById('search-stats');
        if (!statsContainer) return;

        const resultsCount = document.getElementById('results-count');
        const searchQuery = document.getElementById('search-query');
        const searchTime = document.getElementById('search-time');

        if (resultsCount) resultsCount.textContent = this.searchResults.length;
        if (searchQuery) searchQuery.textContent = `"${this.currentQuery}"`;

        statsContainer.style.display = 'flex';
    }

    showLoading(show) {
        const loading = document.getElementById('search-loading');
        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `search-notification search-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'error' ? '#ff6b6b' : (type === 'warning' ? '#ffd93d' : '#4caf50'),
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease-out',
            maxWidth: '400px'
        });

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    addToSearchHistory(query) {
        // Remove existing entry if present
        this.searchHistory = this.searchHistory.filter(item => item.query !== query);

        // Add to beginning
        this.searchHistory.unshift({
            query,
            timestamp: Date.now()
        });

        // Limit to 20 items
        this.searchHistory = this.searchHistory.slice(0, 20);

        // Save to localStorage
        this.saveSearchHistory();

        // Update UI
        this.updateRecentSearches();
    }

    loadSearchHistory() {
        try {
            const saved = localStorage.getItem('search_history');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
                this.updateRecentSearches();
            }
        } catch (error) {
            console.error('Error loading search history:', error);
        }
    }

    saveSearchHistory() {
        try {
            localStorage.setItem('search_history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    }

    updateRecentSearches() {
        const recentSearchesList = document.getElementById('recent-searches-list');
        if (!recentSearchesList) return;

        if (this.searchHistory.length === 0) {
            recentSearchesList.innerHTML = '<p>No hay búsquedas recientes</p>';
            return;
        }

        recentSearchesList.innerHTML = this.searchHistory.slice(0, 10).map(item => `
            <span class="search-term" onclick="searchSystem.search('${item.query}')">
                ${item.query}
            </span>
        `).join('');
    }

    loadPopularSearches() {
        // Default popular searches
        this.popularSearches = [
            'ChatGPT',
            'Bitcoin',
            'Ethereum',
            'Trading',
            'NFT',
            'Python',
            'Machine Learning',
            'DeFi',
            'Smart Contracts'
        ];

        // Update UI
        this.updatePopularSearches();
    }

    updatePopularSearches() {
        const popularSearchesList = document.getElementById('popular-searches-list');
        if (!popularSearchesList) return;

        popularSearchesList.innerHTML = this.popularSearches.map(term => `
            <span class="search-term" onclick="searchSystem.search('${term}')">
                ${term}
            </span>
        `).join('');
    }

    updatePopularSearches() {
        // Update based on most frequent searches
        if (this.searchHistory.length > 10) {
            const queryCounts = {};
            this.searchHistory.forEach(item => {
                queryCounts[item.query] = (queryCounts[item.query] || 0) + 1;
            });

            this.popularSearches = Object.entries(queryCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([query]) => query);
        }

        this.updatePopularSearches();
    }

    saveCurrentSearch() {
        if (this.currentQuery) {
            this.addToSearchHistory(this.currentQuery);
            this.showNotification('Búsqueda guardada: ' + this.currentQuery, 'success');
        }
    }

    clearFilters() {
        // Reset filters
        this.currentFilters = {
            categories: [],
            tags: [],
            dateFrom: null,
            dateTo: null,
            sortBy: 'relevance'
        };

        // Reset UI
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.checked = false;
        });

        const dateFrom = document.getElementById('date-from');
        const dateTo = document.getElementById('date-to');
        const sortSelect = document.getElementById('sort-select');

        if (dateFrom) dateFrom.value = '';
        if (dateTo) dateTo.value = '';
        if (sortSelect) sortSelect.value = 'relevance';

        // Reapply filters
        this.applyFilters();
    }

    applyFilters() {
        if (this.searchResults.length > 0) {
            // Re-search with current query and filters
            this.searchResults = this.search(this.currentQuery, this.currentFilters);
            this.sortResultsByScore(this.searchResults);
            this.renderResults();
        }
    }

    goToPage(page) {
        // Implement pagination
        console.log('Going to page:', page);
    }

    setupSearchAnalytics() {
        // Track search events
        console.log('📊 Search analytics enabled');
    }

    trackSearchEvent(event, data) {
        if (this.options.enableAnalytics && typeof gtag !== 'undefined') {
            gtag('event', event, {
                ...data,
                custom_parameter_1: 'search'
            });
        }
    }

    // Utility functions
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

    // Public API
    search(query) {
        const searchInput = document.getElementById('search-input-advanced');
        if (searchInput) {
            searchInput.value = query;
        }
        this.performSearch();
    }
}

// Initialize search system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.searchSystem = new AdvancedSearchSystem({
        enableVoiceSearch: true,
        enableAnalytics: true,
        minQueryLength: 2,
        maxResults: 20,
        debounceDelay: 300
    });

    console.log('🔍 Advanced Search System loaded');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedSearchSystem;
}