/**
 * Reading Progress Bar and Time Estimator for NachoWeb3
 * Shows reading progress, estimated time remaining, and other reading metrics
 */

class ReadingProgress {
    constructor() {
        this.config = {
            progressBar: {
                position: 'top', // 'top', 'bottom', 'both'
                height: '4px',
                color: 'var(--primary-color, #8a2be2)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                showPercentage: false,
                hideOnComplete: false
            },
            estimator: {
                wordsPerMinute: 200,
                showTimeRemaining: true,
                showTimeEstimate: true,
                updateInterval: 1000,
                minArticleLength: 300
            },
            floatingIndicator: {
                enabled: true,
                position: 'bottom-right',
                showReadingTime: true,
                showWordCount: true
            },
            analytics: {
                trackReadingSpeed: true,
                trackCompletion: true,
                trackAbandonment: true
            }
        };

        this.article = null;
        this.progressBar = null;
        this.floatingIndicator = null;
        this.readingStartTime = null;
        this.totalReadingTime = 0;
        this.isCompleted = false;
        this.scrollDebounce = null;

        this.init();
    }

    init() {
        this.findArticle();
        if (!this.article) return;

        const wordCount = this.getWordCount();
        if (wordCount < this.config.estimator.minArticleLength) return;

        this.createProgressBar();
        this.createFloatingIndicator();
        this.setupEventListeners();
        this.startReadingSession();
        this.updateProgress();

        console.log('ReadingProgress initialized with', wordCount, 'words');
    }

    findArticle() {
        this.article = document.querySelector('.post-content, .article-content, .content, main');
    }

    getWordCount() {
        if (!this.article) return 0;

        // Remove script and style content
        const clone = this.article.cloneNode(true);
        clone.querySelectorAll('script, style, .no-reading, .reading-exclude').forEach(el => el.remove());

        const text = clone.textContent || clone.innerText;
        return text.trim().split(/\s+/).length;
    }

    createProgressBar() {
        const position = this.config.progressBar.position;

        if (position === 'top' || position === 'both') {
            this.createProgressBarAtPosition('top');
        }

        if (position === 'bottom' || position === 'both') {
            this.createProgressBarAtPosition('bottom');
        }
    }

    createProgressBarAtPosition(position) {
        const progressBar = document.createElement('div');
        progressBar.className = `reading-progress-bar reading-progress-${position}`;
        progressBar.innerHTML = `
            <div class="progress-container">
                <div class="progress-fill" id="progress-fill-${position}"></div>
                ${this.config.progressBar.showPercentage ? `
                    <div class="progress-percentage" id="progress-percentage-${position}">0%</div>
                ` : ''}
            </div>
        `;

        // Insert progress bar
        if (position === 'top') {
            document.body.insertBefore(progressBar, document.body.firstChild);
        } else if (position === 'bottom') {
            document.body.appendChild(progressBar);
        }

        this.progressBar = progressBar;
    }

    createFloatingIndicator() {
        if (!this.config.floatingIndicator.enabled) return;

        const indicator = document.createElement('div');
        indicator.className = 'reading-indicator';
        indicator.innerHTML = `
            <div class="indicator-content">
                <div class="indicator-icon">📖</div>
                <div class="indicator-stats">
                    <div class="reading-time" id="reading-time-remaining">-- min restantes</div>
                    <div class="word-count" id="word-count-info">-- palabras</div>
                    <div class="reading-speed" id="reading-speed-info">-- ppm</div>
                </div>
            </div>
            <div class="indicator-progress">
                <div class="mini-progress" id="mini-progress"></div>
            </div>
        `;

        // Style based on position
        indicator.style.setProperty('--position', this.config.floatingIndicator.position);
        document.body.appendChild(indicator);

        this.floatingIndicator = indicator;

        // Set initial position
        this.updateFloatingIndicatorPosition();
    }

    setupEventListeners() {
        // Scroll event with debouncing
        window.addEventListener('scroll', () => {
            if (this.scrollDebounce) {
                clearTimeout(this.scrollDebounce);
            }

            this.scrollDebounce = setTimeout(() => {
                this.updateProgress();
            }, 16); // ~60fps
        });

        // Resize event
        window.addEventListener('resize', () => {
            this.updateFloatingIndicatorPosition();
        });

        // Visibility change events
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseReading();
            } else {
                this.resumeReading();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + P: Toggle progress indicator
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.toggleFloatingIndicator();
            }

            // Ctrl/Cmd + Shift + R: Reset reading session
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.resetReadingSession();
            }
        });

        // Page unload events
        window.addEventListener('beforeunload', () => {
            this.trackReadingCompletion();
        });
    }

    startReadingSession() {
        this.readingStartTime = Date.now();
        this.isCompleted = false;

        // Track session start
        if (this.config.analytics.trackReadingSpeed) {
            this.trackEvent('reading_session_start', {
                word_count: this.getWordCount(),
                article_url: window.location.pathname
            });
        }
    }

    updateProgress() {
        if (!this.article || this.isCompleted) return;

        const articleRect = this.article.getBoundingClientRect();
        const articleHeight = this.article.offsetHeight;
        const scrollTop = window.scrollY;
        const articleTop = this.article.offsetTop;

        // Calculate reading progress
        const viewportHeight = window.innerHeight;
        const articleBottom = articleTop + articleHeight;
        const progress = this.calculateProgress(articleTop, articleBottom, scrollTop, viewportHeight);

        this.updateProgressBar(progress);
        this.updateFloatingIndicator(progress);
        this.updateReadingStats(progress);

        // Check if completed
        if (progress >= 100 && !this.isCompleted) {
            this.onReadingCompleted();
        }
    }

    calculateProgress(articleTop, articleBottom, scrollTop, viewportHeight) {
        // More sophisticated progress calculation
        let progress = 0;

        if (scrollTop < articleTop - viewportHeight) {
            progress = 0;
        } else if (scrollTop > articleBottom) {
            progress = 100;
        } else {
            const readingStart = articleTop - viewportHeight;
            const readingEnd = articleBottom;
            const readingRange = readingEnd - readingStart;
            const currentPosition = scrollTop - readingStart;

            progress = Math.min(100, Math.max(0, (currentPosition / readingRange) * 100));
        }

        return Math.round(progress);
    }

    updateProgressBar(progress) {
        const position = this.config.progressBar.position;

        if (position === 'top' || position === 'both') {
            this.updateProgressBarElement('top', progress);
        }

        if (position === 'bottom' || position === 'both') {
            this.updateProgressBarElement('bottom', progress);
        }
    }

    updateProgressBarElement(position, progress) {
        const fill = document.getElementById(`progress-fill-${position}`);
        const percentage = document.getElementById(`progress-percentage-${position}`);

        if (fill) {
            fill.style.width = `${progress}%`;
        }

        if (percentage) {
            percentage.textContent = `${progress}%`;
        }

        // Hide on complete if configured
        if (this.config.progressBar.hideOnComplete && progress >= 100) {
            const bar = document.querySelector(`.reading-progress-${position}`);
            if (bar) {
                bar.style.opacity = '0';
            }
        }
    }

    updateFloatingIndicator(progress) {
        if (!this.floatingIndicator) return;

        const miniProgress = document.getElementById('mini-progress');
        if (miniProgress) {
            miniProgress.style.width = `${progress}%`;
        }

        // Update position based on scroll
        this.updateFloatingIndicatorPosition();
    }

    updateFloatingIndicatorPosition() {
        if (!this.floatingIndicator) return;

        const position = this.config.floatingIndicator.position;
        let styles = {};

        switch (position) {
            case 'bottom-right':
                styles = {
                    bottom: '20px',
                    right: '20px'
                };
                break;
            case 'bottom-left':
                styles = {
                    bottom: '20px',
                    left: '20px'
                };
                break;
            case 'top-right':
                styles = {
                    top: '100px',
                    right: '20px'
                };
                break;
            case 'top-left':
                styles = {
                    top: '100px',
                    left: '20px'
                };
                break;
        }

        Object.assign(this.floatingIndicator.style, styles);
    }

    updateReadingStats(progress) {
        if (!this.config.floatingIndicator.enabled) return;

        const wordCount = this.getWordCount();
        const wordsRead = Math.round((progress / 100) * wordCount);
        const wordsRemaining = wordCount - wordsRead;

        // Update word count
        const wordCountInfo = document.getElementById('word-count-info');
        if (wordCountInfo) {
            wordCountInfo.textContent = `${wordCount.toLocaleString()} palabras`;
        }

        // Calculate reading time
        const currentTime = Date.now();
        const timeSpent = (currentTime - this.readingStartTime) / 1000 / 60; // minutes
        const readingSpeed = wordsRead / Math.max(1, timeSpent);

        // Update reading speed
        const speedInfo = document.getElementById('reading-speed-info');
        if (speedInfo && wordsRead > 50) { // Only show after some content is read
            speedInfo.textContent = `${Math.round(readingSpeed)} ppm`;
        }

        // Update time remaining
        if (this.config.estimator.showTimeRemaining && wordsRemaining > 0) {
            const timeRemaining = wordsRemaining / Math.max(100, readingSpeed);
            const timeRemainingInfo = document.getElementById('reading-time-remaining');
            if (timeRemainingInfo) {
                timeRemainingInfo.textContent = `${Math.ceil(timeRemaining)} min restantes`;
            }
        }
    }

    onReadingCompleted() {
        this.isCompleted = true;
        this.totalReadingTime = (Date.now() - this.readingStartTime) / 1000 / 60;

        // Show completion notification
        this.showCompletionNotification();

        // Track completion
        if (this.config.analytics.trackCompletion) {
            this.trackEvent('reading_completed', {
                reading_time: this.totalReadingTime,
                word_count: this.getWordCount(),
                reading_speed: this.getWordCount() / this.totalReadingTime,
                article_url: window.location.pathname
            });
        }

        // Hide floating indicator after delay
        setTimeout(() => {
            if (this.floatingIndicator) {
                this.floatingIndicator.classList.add('completed');
            }
        }, 2000);
    }

    showCompletionNotification() {
        const notification = document.createElement('div');
        notification.className = 'reading-completion-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="completion-icon">🎉</div>
                <div class="completion-message">
                    <h4>¡Artículo completado!</h4>
                    <p>Tiempo de lectura: ${Math.round(this.totalReadingTime)} minutos</p>
                </div>
                <button class="completion-close" onclick="this.parentElement.parentElement.remove()">✕</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    pauseReading() {
        // Track pause time
        this.pauseStartTime = Date.now();
    }

    resumeReading() {
        // Adjust reading start time to account for pause
        if (this.pauseStartTime) {
            const pauseDuration = Date.now() - this.pauseStartTime;
            this.readingStartTime += pauseDuration;
            this.pauseStartTime = null;
        }
    }

    toggleFloatingIndicator() {
        if (!this.floatingIndicator) return;

        const isHidden = this.floatingIndicator.classList.contains('hidden');
        if (isHidden) {
            this.floatingIndicator.classList.remove('hidden');
        } else {
            this.floatingIndicator.classList.add('hidden');
        }
    }

    resetReadingSession() {
        this.readingStartTime = Date.now();
        this.isCompleted = false;
        this.totalReadingTime = 0;

        // Reset progress bars
        document.querySelectorAll('.progress-fill').forEach(fill => {
            fill.style.width = '0%';
        });

        document.querySelectorAll('.progress-percentage').forEach(percentage => {
            percentage.textContent = '0%';
        });

        // Reset completion state
        if (this.floatingIndicator) {
            this.floatingIndicator.classList.remove('completed');
        }

        this.updateProgress();
    }

    trackReadingCompletion() {
        if (!this.config.analytics.trackAbandonment) return;

        const progress = this.calculateProgress();
        const timeSpent = (Date.now() - this.readingStartTime) / 1000 / 60;

        if (!this.isCompleted && timeSpent > 1) {
            this.trackEvent('reading_abandoned', {
                progress_percent: progress,
                time_spent: timeSpent,
                word_count: this.getWordCount(),
                article_url: window.location.pathname
            });
        }
    }

    trackEvent(eventName, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }

        // Custom event
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    // Public API
    getProgress() {
        const articleTop = this.article.offsetTop;
        const articleBottom = articleTop + this.article.offsetHeight;
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;

        return this.calculateProgress(articleTop, articleBottom, scrollTop, viewportHeight);
    }

    getReadingTime() {
        return this.totalReadingTime;
    }

    getWordCount() {
        if (this.cachedWordCount) return this.cachedWordCount;
        this.cachedWordCount = this.getWordCount();
        return this.cachedWordCount;
    }

    destroy() {
        // Remove progress bars
        document.querySelectorAll('.reading-progress-bar').forEach(bar => bar.remove());

        // Remove floating indicator
        if (this.floatingIndicator) {
            this.floatingIndicator.remove();
        }

        // Remove completion notifications
        document.querySelectorAll('.reading-completion-notification').forEach(n => n.remove());
    }
}

// Reading Progress Styles
const progressStyles = `
<style>
/* Progress Bar Styles */
.reading-progress-bar {
    position: fixed;
    z-index: 9999;
    width: 100%;
    background: transparent;
}

.reading-progress-top {
    top: 0;
    left: 0;
}

.reading-progress-bottom {
    bottom: 0;
    left: 0;
}

.progress-container {
    position: relative;
    width: 100%;
    height: var(--progress-height, 4px);
    background: var(--progress-background-color, rgba(255, 255, 255, 0.1));
}

.progress-fill {
    height: 100%;
    background: var(--progress-color, var(--primary-color, #8a2be2));
    width: 0%;
    transition: width 0.3s ease;
    position: relative;
}

.progress-fill::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 30px;
    background: linear-gradient(90deg, transparent, var(--progress-color, var(--primary-color, #8a2be2)));
}

.progress-percentage {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-primary, #ffffff);
    font-size: 0.8rem;
    font-weight: 600;
    background: rgba(0, 0, 0, 0.8);
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.reading-progress-bar:hover .progress-percentage {
    opacity: 1;
}

/* Floating Reading Indicator */
.reading-indicator {
    position: fixed;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid rgba(138, 43, 226, 0.3);
    border-radius: 15px;
    padding: 1rem;
    backdrop-filter: blur(10px);
    z-index: 1000;
    min-width: 200px;
    transition: all 0.3s ease;
    transform-origin: bottom right;
}

.indicator-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.indicator-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
}

.indicator-stats {
    flex: 1;
    min-width: 0;
}

.reading-time,
.word-count,
.reading-speed {
    color: var(--text-primary, #ffffff);
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.reading-time {
    color: var(--primary-color, #8a2be2);
}

.word-count,
.reading-speed {
    color: var(--text-secondary, #e0e0e0);
    font-size: 0.8rem;
}

.indicator-progress {
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.mini-progress {
    height: 100%;
    background: var(--primary-color, #8a2be2);
    width: 0%;
    transition: width 0.3s ease;
}

.reading-indicator.hidden {
    opacity: 0;
    transform: scale(0.8);
    pointer-events: none;
}

.reading-indicator.completed {
    animation: completion-pulse 1s ease;
}

/* Completion Notification */
.reading-completion-notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, var(--primary-color, #8a2be2), var(--secondary-color, #764ba2));
    color: white;
    border-radius: 15px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(138, 43, 226, 0.5);
    z-index: 10001;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    backdrop-filter: blur(10px);
    max-width: 350px;
}

.reading-completion-notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.completion-icon {
    font-size: 2rem;
    flex-shrink: 0;
}

.completion-message {
    flex: 1;
}

.completion-message h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
}

.completion-message p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.9rem;
}

.completion-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 5px;
    transition: background 0.3s ease;
    flex-shrink: 0;
}

.completion-close:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Animations */
@keyframes completion-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

/* Responsive Design */
@media (max-width: 768px) {
    .reading-indicator {
        bottom: 10px;
        right: 10px;
        left: 10px;
        min-width: auto;
    }

    .indicator-content {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
    }

    .indicator-stats {
        width: 100%;
    }

    .reading-completion-notification {
        left: 10px;
        right: 10px;
        max-width: none;
        transform: translateY(-100px);
    }

    .reading-completion-notification.show {
        transform: translateY(0);
    }
}

@media (max-width: 480px) {
    .reading-indicator {
        padding: 0.75rem;
    }

    .indicator-icon {
        font-size: 1.2rem;
    }

    .progress-percentage {
        display: none;
    }
}

/* Dark theme support */
body.theme-light .reading-indicator {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(138, 43, 226, 0.2);
}

body.theme-light .reading-time,
body.theme-light .word-count,
body.theme-light .reading-speed {
    color: var(--text-primary, #1a1a1a);
}

body.theme-light .word-count,
body.theme-light .reading-speed {
    color: var(--text-secondary, #4a4a4a);
}

/* Matrix theme support */
body.theme-matrix .progress-fill {
    background: var(--primary-color, #00ff00);
}

body.theme-matrix .reading-indicator {
    border-color: var(--primary-color, #00ff00);
}

body.theme-matrix .reading-time {
    color: var(--primary-color, #00ff00);
}

body.theme-matrix .mini-progress {
    background: var(--primary-color, #00ff00);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    .progress-fill,
    .mini-progress,
    .reading-indicator,
    .reading-completion-notification {
        transition: none;
    }

    .reading-indicator.completed,
    .reading-completion-notification {
        animation: none;
    }
}

/* Print styles */
@media print {
    .reading-progress-bar,
    .reading-indicator,
    .reading-completion-notification {
        display: none !important;
    }
}

/* Focus styles */
.reading-indicator:focus-within {
    outline: 2px solid var(--primary-color, #8a2be2);
    outline-offset: 2px;
}

.completion-close:focus {
    outline: 2px solid white;
    outline-offset: 2px;
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', progressStyles);

// Initialize reading progress
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.readingProgress = new ReadingProgress();
        });
    } else {
        window.readingProgress = new ReadingProgress();
    }

    // Global access
    window.getReadingProgress = () => window.readingProgress?.getProgress();
    window.resetReadingProgress = () => window.readingProgress?.resetReadingSession();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReadingProgress;
}