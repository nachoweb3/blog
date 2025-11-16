// Funcionalidad de búsqueda client-side
(function() {
    'use strict';

    // Elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchClear = document.getElementById('searchClear');
    const searchResults = document.getElementById('searchResults');

    if (!searchInput || !searchResults) return;

    let searchTimeout;

    // Función para normalizar texto (quitar acentos y convertir a minúsculas)
    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    // Función para resaltar términos de búsqueda
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Función para truncar texto
    function truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim() + '...';
    }

    // Función de búsqueda
    function performSearch(query) {
        if (!query || query.length < 2) {
            searchResults.style.display = 'none';
            searchResults.innerHTML = '';
            return;
        }

        const normalizedQuery = normalizeText(query);
        const results = [];

        // Buscar en todos los posts
        window.searchData.forEach(post => {
            let score = 0;
            let matchedIn = [];

            // Buscar en título (peso: 3)
            if (normalizeText(post.title).includes(normalizedQuery)) {
                score += 3;
                matchedIn.push('título');
            }

            // Buscar en tags (peso: 2)
            const matchedTags = post.tags.filter(tag =>
                normalizeText(tag).includes(normalizedQuery)
            );
            if (matchedTags.length > 0) {
                score += 2 * matchedTags.length;
                matchedIn.push('tags');
            }

            // Buscar en excerpt (peso: 1.5)
            if (normalizeText(post.excerpt).includes(normalizedQuery)) {
                score += 1.5;
                matchedIn.push('descripción');
            }

            // Buscar en contenido (peso: 1)
            if (normalizeText(post.content).includes(normalizedQuery)) {
                score += 1;
                matchedIn.push('contenido');
            }

            // Buscar en categoría (peso: 2)
            if (normalizeText(post.category).includes(normalizedQuery)) {
                score += 2;
                matchedIn.push('categoría');
            }

            if (score > 0) {
                results.push({
                    ...post,
                    score,
                    matchedIn
                });
            }
        });

        // Ordenar por relevancia (score)
        results.sort((a, b) => b.score - a.score);

        // Mostrar resultados
        displayResults(results, query);
    }

    // Función para mostrar resultados
    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>No se encontraron resultados para "<strong>${query}</strong>"</p>
                    <p class="search-suggestion">Intenta con otros términos de búsqueda</p>
                </div>
            `;
            searchResults.style.display = 'block';
            return;
        }

        const resultsHTML = `
            <div class="search-results-header">
                <p>Se encontraron <strong>${results.length}</strong> resultado${results.length !== 1 ? 's' : ''} para "<strong>${query}</strong>"</p>
            </div>
            <div class="search-results-list">
                ${results.slice(0, 10).map(result => {
                    const categoryClass = `category-${result.category}`;
                    const excerpt = highlightText(truncateText(result.excerpt || result.content, 120), query);

                    return `
                        <div class="search-result-item">
                            <a href="${result.url}" class="search-result-link">
                                ${result.image ? `
                                    <div class="search-result-image">
                                        <img src="${result.image}" alt="${result.title}" loading="lazy">
                                        <span class="category-badge ${categoryClass}">${result.category.toUpperCase()}</span>
                                    </div>
                                ` : ''}
                                <div class="search-result-content">
                                    <h3 class="search-result-title">${highlightText(result.title, query)}</h3>
                                    <p class="search-result-excerpt">${excerpt}</p>
                                    <div class="search-result-meta">
                                        <span class="search-result-date">${result.date}</span>
                                        <span class="separator">•</span>
                                        <span class="search-result-tags">
                                            ${result.tags.slice(0, 3).map(tag =>
                                                `<span class="tag-small">#${highlightText(tag, query)}</span>`
                                            ).join(' ')}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    `;
                }).join('')}
            </div>
            ${results.length > 10 ? `
                <div class="search-results-footer">
                    <p>Mostrando los primeros 10 resultados de ${results.length}</p>
                </div>
            ` : ''}
        `;

        searchResults.innerHTML = resultsHTML;
        searchResults.style.display = 'block';
    }

    // Event listeners
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();

        // Mostrar/ocultar botón de limpiar
        if (query.length > 0) {
            searchClear.style.display = 'flex';
        } else {
            searchClear.style.display = 'none';
        }

        // Debounce para no buscar en cada tecla
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    // Buscar al hacer clic en el botón
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value.trim());
    });

    // Buscar con Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput.value.trim());
        }
    });

    // Limpiar búsqueda
    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
        searchInput.focus();
    });

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-bar-container')) {
            // No cerrar inmediatamente para permitir hacer clic en resultados
            // searchResults.style.display = 'none';
        }
    });

    // Atajos de teclado
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K para abrir búsqueda
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }

        // Escape para cerrar búsqueda
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchClear.style.display = 'none';
            searchResults.style.display = 'none';
            searchInput.blur();
        }
    });

})();
