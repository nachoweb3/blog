/**
 * Automatic Table of Contents Generator for NachoWeb3
 * Creates interactive TOC for long articles with smooth scrolling
 */

class TableOfContents {
    constructor() {
        this.config = {
            minHeadings: 3,
            minWordCount: 500,
            container: {
                position: 'sidebar', // 'sidebar', 'top', 'floating'
                title: '📋 Índice',
                showProgress: true,
                showCounts: true
            },
            headings: {
                selector: 'h1, h2, h3, h4, h5, h6',
                exclude: '.no-toc, .toc-exclude',
                minLevel: 2,
                maxLevel: 4
            },
            styling: {
                width: '280px',
                maxHeight: '70vh',
                itemPadding: '0.75rem 1rem',
                indentSize: '1.5rem',
                highlightActive: true,
                smoothScroll: true
            },
            analytics: {
                trackClicks: true,
                trackScroll: true
            }
        };

        this.toc = null;
        this.headings = [];
        this.activeHeading = null;
        this.scrollProgress = 0;
        this.isSticky = false;

        this.init();
    }

    init() {
        this.checkArticleEligibility();
    }

    checkArticleEligibility() {
        // Check if article is long enough for TOC
        const article = this.getArticleElement();
        if (!article) return;

        const wordCount = this.getWordCount(article);
        const headings = this.getHeadings();

        if (wordCount >= this.config.minWordCount && headings.length >= this.config.minHeadings) {
            this.createTableOfContents(headings);
            this.setupEventListeners();
            this.trackReadingProgress();
        }
    }

    getArticleElement() {
        return document.querySelector('.post-content, .article-content, .content, main');
    }

    getWordCount(element) {
        const text = element.textContent || element.innerText;
        return text.trim().split(/\s+/).length;
    }

    getHeadings() {
        const article = this.getArticleElement();
        if (!article) return [];

        const headings = article.querySelectorAll(this.config.headings.selector);
        const filteredHeadings = [];

        headings.forEach((heading, index) => {
            // Skip excluded headings
            if (heading.matches(this.config.headings.exclude)) return;

            const level = parseInt(heading.tagName.substring(1));
            if (level < this.config.headings.minLevel || level > this.config.headings.maxLevel) return;

            // Create unique ID if not present
            if (!heading.id) {
                heading.id = this.generateHeadingId(heading.textContent, index);
            }

            filteredHeadings.push({
                element: heading,
                text: heading.textContent.trim(),
                level: level,
                id: heading.id,
                wordCount: heading.textContent.trim().split(/\s+/).length
            });
        });

        return filteredHeadings;
    }

    generateHeadingId(text, index) {
        const base = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);

        const id = base || `heading-${index}`;
        let finalId = id;
        let counter = 1;

        while (document.getElementById(finalId)) {
            finalId = `${id}-${counter}`;
            counter++;
        }

        return finalId;
    }

    createTableOfContents(headings) {
        this.headings = headings;

        // Create TOC container
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = this.generateTOCHTML(headings);

        // Insert TOC based on configuration
        this.insertTOC(toc);

        this.toc = toc;
        console.log('Table of Contents created with', headings.length, 'headings');
    }

    generateTOCHTML(headings) {
        let html = `
            <div class="toc-header">
                <h3 class="toc-title">${this.config.container.title}</h3>
                ${this.config.container.showProgress ? `
                    <div class="toc-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="toc-progress-fill"></div>
                        </div>
                        <span class="progress-text" id="toc-progress-text">0%</span>
                    </div>
                ` : ''}
            </div>
            <div class="toc-toggle">
                <button class="toggle-btn" id="toc-toggle-btn">
                    <span class="toggle-icon">▼</span>
                </button>
            </div>
            <div class="toc-content" id="toc-content">
        `;

        // Generate heading items
        headings.forEach((heading, index) => {
            const indent = (heading.level - this.config.headings.minLevel) * 20;
            const countText = this.config.container.showCounts ?
                `<span class="toc-count">(${heading.wordCount} palabras)</span>` : '';

            html += `
                <a href="#${heading.id}"
                   class="toc-item toc-level-${heading.level}"
                   data-level="${heading.level}"
                   data-index="${index}"
                   style="padding-left: ${indent}px">
                    <span class="toc-number">${index + 1}.</span>
                    <span class="toc-text">${heading.text}</span>
                    ${countText}
                </a>
            `;
        });

        html += `
            </div>
            ${this.config.container.showProgress ? `
                <div class="toc-stats">
                    <div class="stat-item">
                        <span class="stat-label">Tiempo lectura:</span>
                        <span class="stat-value" id="toc-reading-time">-- min</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Secciones:</span>
                        <span class="stat-value">${headings.length}</span>
                    </div>
                </div>
            ` : ''}
        `;

        return html;
    }

    insertTOC(toc) {
        const article = this.getArticleElement();
        if (!article) return;

        switch (this.config.container.position) {
            case 'sidebar':
                this.insertSidebarTOC(toc, article);
                break;
            case 'top':
                this.insertTopTOC(toc, article);
                break;
            case 'floating':
                this.insertFloatingTOC(toc);
                break;
        }
    }

    insertSidebarTOC(toc, article) {
        // Create sidebar container
        const sidebar = document.createElement('div');
        sidebar.className = 'toc-sidebar';
        sidebar.appendChild(toc);

        // Insert after article or before it if space is limited
        if (window.innerWidth > 1200) {
            article.parentNode.insertBefore(sidebar, article.nextSibling);
        } else {
            article.insertBefore(toc, article.firstChild);
        }
    }

    insertTopTOC(toc, article) {
        // Insert at the beginning of article
        article.insertBefore(toc, article.firstChild);
    }

    insertFloatingTOC(toc) {
        // Create floating container
        const floating = document.createElement('div');
        floating.className = 'toc-floating';
        floating.appendChild(toc);

        document.body.appendChild(floating);
    }

    setupEventListeners() {
        if (!this.toc) return;

        // Toggle TOC content
        const toggleBtn = document.getElementById('toc-toggle-btn');
        const tocContent = document.getElementById('toc-content');

        if (toggleBtn && tocContent) {
            toggleBtn.addEventListener('click', () => {
                const isCollapsed = tocContent.classList.contains('collapsed');

                if (isCollapsed) {
                    tocContent.classList.remove('collapsed');
                    toggleBtn.querySelector('.toggle-icon').textContent = '▼';
                    localStorage.setItem('toc_collapsed', 'false');
                } else {
                    tocContent.classList.add('collapsed');
                    toggleBtn.querySelector('.toggle-icon').textContent = '▶';
                    localStorage.setItem('toc_collapsed', 'true');
                }
            });

            // Restore collapsed state
            if (localStorage.getItem('toc_collapsed') === 'true') {
                tocContent.classList.add('collapsed');
                toggleBtn.querySelector('.toggle-icon').textContent = '▶';
            }
        }

        // Heading clicks
        this.toc.querySelectorAll('.toc-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    this.scrollToHeading(targetElement, item);
                    this.trackTOCClick(item);
                }
            });
        });

        // Scroll events for active highlighting
        if (this.config.styling.highlightActive) {
            window.addEventListener('scroll', () => {
                this.updateActiveHeading();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T: Toggle TOC
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTOC();
            }

            // Ctrl/Cmd + Shift + Up/Down: Navigate headings
            if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateToPreviousHeading();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateToNextHeading();
                }
            }
        });
    }

    scrollToHeading(heading, tocItem) {
        if (!this.config.styling.smoothScroll) {
            heading.scrollIntoView();
            return;
        }

        const offset = 100; // Offset for fixed headers
        const headingPosition = heading.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top: headingPosition,
            behavior: 'smooth'
        });

        // Highlight the clicked item
        this.highlightTOCItem(tocItem);
    }

    updateActiveHeading() {
        let activeHeading = null;
        let activeIndex = -1;

        // Find current heading based on scroll position
        this.headings.forEach((heading, index) => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 150) {
                activeHeading = heading;
                activeIndex = index;
            }
        });

        if (activeHeading !== this.activeHeading) {
            this.activeHeading = activeHeading;
            this.updateTOCActiveState(activeIndex);
        }
    }

    updateTOCActiveState(activeIndex) {
        // Remove active class from all items
        this.toc.querySelectorAll('.toc-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current item
        if (activeIndex >= 0) {
            const activeItem = this.toc.querySelector(`[data-index="${activeIndex}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
                this.scrollTOCToItem(activeItem);
            }
        }
    }

    scrollTOCToItem(item) {
        const tocContent = document.getElementById('toc-content');
        if (!tocContent) return;

        const itemRect = item.getBoundingClientRect();
        const contentRect = tocContent.getBoundingClientRect();

        // Check if item is outside visible area
        if (itemRect.top < contentRect.top || itemRect.bottom > contentRect.bottom) {
            item.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }

    highlightTOCItem(item) {
        // Remove previous highlights
        this.toc.querySelectorAll('.toc-item').forEach(el => {
            el.classList.remove('clicked');
        });

        // Add highlight to clicked item
        item.classList.add('clicked');

        // Remove highlight after animation
        setTimeout(() => {
            item.classList.remove('clicked');
        }, 1000);
    }

    trackReadingProgress() {
        if (!this.config.container.showProgress) return;

        const article = this.getArticleElement();
        if (!article) return;

        const updateProgress = () => {
            const articleRect = article.getBoundingClientRect();
            const articleHeight = article.offsetHeight;
            const scrollTop = window.scrollY;
            const articleTop = article.offsetTop;

            // Calculate reading progress
            const progress = Math.min(100, Math.max(0,
                ((scrollTop - articleTop + 200) / articleHeight) * 100
            ));

            this.scrollProgress = Math.round(progress);
            this.updateProgressDisplay();
        };

        // Initial update
        updateProgress();

        // Update on scroll
        window.addEventListener('scroll', updateProgress, { passive: true });

        // Update reading time estimate
        this.updateReadingTime();
    }

    updateProgressDisplay() {
        const progressFill = document.getElementById('toc-progress-fill');
        const progressText = document.getElementById('toc-progress-text');

        if (progressFill) {
            progressFill.style.width = `${this.scrollProgress}%`;
        }

        if (progressText) {
            progressText.textContent = `${this.scrollProgress}%`;
        }
    }

    updateReadingTime() {
        const article = this.getArticleElement();
        if (!article) return;

        const wordCount = this.getWordCount(article);
        const readingSpeed = 200; // words per minute
        const readingTime = Math.ceil(wordCount / readingSpeed);

        const timeElement = document.getElementById('toc-reading-time');
        if (timeElement) {
            timeElement.textContent = `${readingTime} min`;
        }
    }

    trackTOCClick(item) {
        if (!this.config.analytics.trackClicks) return;

        const headingText = item.querySelector('.toc-text').textContent;
        const headingLevel = item.dataset.level;

        // Track in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'toc_click', {
                heading_text: headingText,
                heading_level: headingLevel,
                article_url: window.location.pathname
            });
        }

        // Custom event
        const event = new CustomEvent('tocClick', {
            detail: { headingText, headingLevel, item }
        });
        document.dispatchEvent(event);
    }

    toggleTOC() {
        if (!this.toc) return;

        const tocContent = document.getElementById('toc-content');
        const toggleBtn = document.getElementById('toc-toggle-btn');

        if (tocContent && toggleBtn) {
            toggleBtn.click();
        }
    }

    navigateToPreviousHeading() {
        const currentActive = this.toc.querySelector('.toc-item.active');
        if (!currentActive) return;

        const currentIndex = parseInt(currentActive.dataset.index);
        if (currentIndex > 0) {
            const prevItem = this.toc.querySelector(`[data-index="${currentIndex - 1}"]`);
            if (prevItem) {
                prevItem.click();
            }
        }
    }

    navigateToNextHeading() {
        const currentActive = this.toc.querySelector('.toc-item.active');
        let currentIndex = -1;

        if (currentActive) {
            currentIndex = parseInt(currentActive.dataset.index);
        }

        if (currentIndex < this.headings.length - 1) {
            const nextItem = this.toc.querySelector(`[data-index="${currentIndex + 1}"]`);
            if (nextItem) {
                nextItem.click();
            }
        }
    }

    // Public API
    refresh() {
        // Refresh TOC if content has changed
        const existingTOC = document.querySelector('.table-of-contents');
        if (existingTOC) {
            existingTOC.remove();
        }

        this.checkArticleEligibility();
    }

    destroy() {
        if (this.toc) {
            this.toc.remove();
            this.toc = null;
        }
    }
}

// Table of Contents Styles
const tocStyles = `
<style>
/* Base TOC Styles */
.table-of-contents {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(138, 43, 226, 0.3);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    overflow: hidden;
}

.toc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(138, 43, 226, 0.1);
}

.toc-title {
    margin: 0;
    color: var(--text-primary, #ffffff);
    font-size: 1.1rem;
    font-weight: 600;
}

.toc-progress {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
}

.progress-bar {
    width: 100px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--primary-color, #8a2be2);
    border-radius: 2px;
    transition: width 0.3s ease;
}

.progress-text {
    color: var(--text-secondary, #e0e0e0);
    font-size: 0.8rem;
    font-weight: 600;
    min-width: 35px;
}

.toc-toggle {
    padding: 0.5rem;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-btn {
    background: none;
    border: none;
    color: var(--text-secondary, #e0e0e0);
    cursor: pointer;
    padding: 0.25rem;
    transition: all 0.3s ease;
    border-radius: 5px;
}

.toggle-btn:hover {
    color: var(--text-primary, #ffffff);
    background: rgba(255, 255, 255, 0.1);
}

.toc-content {
    max-height: 70vh;
    overflow-y: auto;
    transition: all 0.3s ease;
}

.toc-content.collapsed {
    max-height: 0;
    overflow: hidden;
}

.toc-item {
    display: block;
    color: var(--text-secondary, #e0e0e0);
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-left: 3px solid transparent;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.toc-item:hover {
    color: var(--text-primary, #ffffff);
    background: rgba(255, 255, 255, 0.05);
    border-left-color: var(--primary-color, #8a2be2);
}

.toc-item.active {
    color: var(--primary-color, #8a2be2);
    background: rgba(138, 43, 226, 0.1);
    border-left-color: var(--primary-color, #8a2be2);
}

.toc-item.clicked {
    background: rgba(138, 43, 226, 0.2);
    animation: toc-click 1s ease;
}

.toc-number {
    color: var(--primary-color, #8a2be2);
    font-weight: 600;
    margin-right: 0.5rem;
    opacity: 0.7;
}

.toc-text {
    flex: 1;
    font-size: 0.9rem;
    line-height: 1.4;
}

.toc-count {
    color: var(--text-secondary, #e0e0e0);
    font-size: 0.75rem;
    opacity: 0.7;
    margin-left: 0.5rem;
}

.toc-stats {
    display: flex;
    justify-content: space-around;
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.3);
}

.stat-item {
    text-align: center;
}

.stat-label {
    display: block;
    color: var(--text-secondary, #e0e0e0);
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
}

.stat-value {
    color: var(--primary-color, #8a2be2);
    font-weight: 600;
    font-size: 0.9rem;
}

/* Sidebar TOC */
.toc-sidebar {
    width: 320px;
    margin-left: 2rem;
    position: sticky;
    top: 100px;
    height: fit-content;
}

/* Floating TOC */
.toc-floating {
    position: fixed;
    top: 100px;
    right: 20px;
    width: 320px;
    max-height: 80vh;
    z-index: 1000;
    transform: translateX(350px);
    transition: transform 0.3s ease;
}

.toc-floating.visible {
    transform: translateX(0);
}

/* Top TOC */
.table-of-contents.toc-top {
    margin: 2rem 0;
    width: 100%;
    max-width: none;
}

.toc-level-2 {
    font-weight: 600;
}

.toc-level-3 {
    font-weight: 500;
    opacity: 0.9;
}

.toc-level-4 {
    font-weight: 400;
    opacity: 0.8;
    font-size: 0.85rem;
}

/* Scrollbar Styling */
.toc-content::-webkit-scrollbar {
    width: 6px;
}

.toc-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
}

.toc-content::-webkit-scrollbar-thumb {
    background: var(--primary-color, #8a2be2);
    border-radius: 3px;
}

.toc-content::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color, #764ba2);
}

/* Animations */
@keyframes toc-click {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
}

/* Responsive Design */
@media (max-width: 1200px) {
    .toc-sidebar {
        display: none;
    }

    .table-of-contents.toc-top {
        margin: 1rem 0;
    }
}

@media (max-width: 768px) {
    .toc-floating {
        position: static;
        transform: none;
        width: 100%;
        margin: 1rem 0;
    }

    .toc-item {
        padding: 0.5rem 1rem;
    }

    .toc-text {
        font-size: 0.85rem;
    }

    .toc-count {
        display: none;
    }

    .toc-stats {
        flex-direction: column;
        gap: 0.5rem;
    }
}

@media (max-width: 480px) {
    .toc-header {
        padding: 0.75rem 1rem;
    }

    .toc-title {
        font-size: 1rem;
    }

    .progress-bar {
        width: 80px;
    }

    .toc-item {
        padding: 0.5rem 0.75rem;
    }
}

/* Dark theme support */
body.theme-light .table-of-contents {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(138, 43, 226, 0.2);
}

body.theme-light .toc-title {
    color: var(--text-primary, #1a1a1a);
}

body.theme-light .toc-item {
    color: var(--text-secondary, #4a4a4a);
}

body.theme-light .toc-item:hover {
    color: var(--text-primary, #1a1a1a);
}

body.theme-light .toc-number {
    opacity: 0.5;
}

body.theme-light .stat-label {
    color: var(--text-secondary, #4a4a4a);
}

/* Matrix theme support */
body.theme-matrix .table-of-contents {
    border-color: var(--primary-color, #00ff00);
}

body.theme-matrix .toc-title {
    color: var(--text-primary, #00ff00);
}

body.theme-matrix .toc-item.active {
    color: var(--primary-color, #00ff00);
    border-left-color: var(--primary-color, #00ff00);
}

body.theme-matrix .toc-number {
    color: var(--primary-color, #00ff00);
}

body.theme-matrix .stat-value {
    color: var(--primary-color, #00ff00);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    .toc-item,
    .toggle-btn,
    .toc-content,
    .progress-fill,
    .toc-floating {
        transition: none;
    }

    .toc-item.clicked {
        animation: none;
    }
}

/* Focus styles */
.toc-item:focus,
.toggle-btn:focus {
    outline: 2px solid var(--primary-color, #8a2be2);
    outline-offset: 2px;
}

/* Print styles */
@media print {
    .table-of-contents {
        display: none;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', tocStyles);

// Initialize table of contents
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.tableOfContents = new TableOfContents();
        });
    } else {
        window.tableOfContents = new TableOfContents();
    }

    // Global access
    window.refreshTOC = () => window.tableOfContents?.refresh();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableOfContents;
}