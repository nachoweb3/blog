/**
 * Advanced Theme System for NachoWeb3
 * Supports dark, light, and matrix themes with smooth transitions
 */

class ThemeSystem {
    constructor() {
        this.themes = {
            dark: {
                name: 'Modo Oscuro',
                icon: '🌙',
                primary: '#8a2be2',
                secondary: '#764ba2',
                background: '#0a0a0a',
                surface: '#1a1a1a',
                text: '#ffffff',
                textSecondary: '#e0e0e0'
            },
            light: {
                name: 'Modo Claro',
                icon: '☀️',
                primary: '#8a2be2',
                secondary: '#764ba2',
                background: '#ffffff',
                surface: '#f8f9fa',
                text: '#1a1a1a',
                textSecondary: '#4a4a4a'
            },
            matrix: {
                name: 'Modo Matrix',
                icon: '💚',
                primary: '#00ff00',
                secondary: '#00cc00',
                background: '#000000',
                surface: '#0a1a0a',
                text: '#00ff00',
                textSecondary: '#00cc00'
            }
        };

        this.currentTheme = this.getSavedTheme() || this.detectSystemTheme();
        this.isTransitioning = false;
        this.themeToggle = null;

        this.init();
    }

    init() {
        this.createThemeToggle();
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.setupSystemDetection();
        console.log(`ThemeSystem initialized: ${this.themes[this.currentTheme].name}`);
    }

    createThemeToggle() {
        // Create theme toggle button
        const toggle = document.createElement('div');
        toggle.className = 'theme-toggle';
        toggle.innerHTML = `
            <button class="theme-btn" id="theme-btn" title="Cambiar tema">
                <span class="theme-icon">${this.themes[this.currentTheme].icon}</span>
            </button>
            <div class="theme-dropdown" id="theme-dropdown">
                <div class="theme-option ${this.currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                    <span class="theme-option-icon">🌙</span>
                    <span class="theme-option-name">Modo Oscuro</span>
                </div>
                <div class="theme-option ${this.currentTheme === 'light' ? 'active' : ''}" data-theme="light">
                    <span class="theme-option-icon">☀️</span>
                    <span class="theme-option-name">Modo Claro</span>
                </div>
                <div class="theme-option ${this.currentTheme === 'matrix' ? 'active' : ''}" data-theme="matrix">
                    <span class="theme-option-icon">💚</span>
                    <span class="theme-option-name">Modo Matrix</span>
                </div>
                <div class="theme-divider"></div>
                <div class="theme-option ${this.currentTheme === 'auto' ? 'active' : ''}" data-theme="auto">
                    <span class="theme-option-icon">🤖</span>
                    <span class="theme-option-name">Automático</span>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(toggle);
        this.themeToggle = toggle;

        // Setup event listeners for toggle
        this.setupToggleListeners();
    }

    setupToggleListeners() {
        const themeBtn = document.getElementById('theme-btn');
        const themeDropdown = document.getElementById('theme-dropdown');

        if (!themeBtn || !themeDropdown) return;

        // Toggle dropdown
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('show');
        });

        // Handle theme selection
        themeDropdown.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const theme = option.dataset.theme;
                this.setTheme(theme);
                themeDropdown.classList.remove('show');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.themeToggle.contains(e.target)) {
                themeDropdown.classList.remove('show');
            }
        });
    }

    setTheme(theme) {
        if (this.isTransitioning) return;

        // Handle auto theme
        if (theme === 'auto') {
            theme = this.detectSystemTheme();
            localStorage.setItem('theme_preference', 'auto');
        } else {
            localStorage.setItem('theme_preference', theme);
            localStorage.setItem('theme', theme);
        }

        if (theme === this.currentTheme) return;

        this.applyTheme(theme);
        this.currentTheme = theme;

        // Update UI
        this.updateThemeToggle();
        this.trackThemeChange(theme);
    }

    applyTheme(theme) {
        const themeConfig = this.themes[theme];
        if (!themeConfig) return;

        this.isTransitioning = true;

        // Add transition class
        document.body.classList.add('theme-transitioning');

        // Apply CSS variables
        document.documentElement.style.setProperty('--primary-color', themeConfig.primary);
        document.documentElement.style.setProperty('--secondary-color', themeConfig.secondary);
        document.documentElement.style.setProperty('--bg-primary', themeConfig.background);
        document.documentElement.style.setProperty('--bg-secondary', themeConfig.surface);
        document.documentElement.style.setProperty('--text-primary', themeConfig.text);
        document.documentElement.style.setProperty('--text-secondary', themeConfig.textSecondary);

        // Update body classes
        document.body.classList.remove('theme-dark', 'theme-light', 'theme-matrix');
        document.body.classList.add(`theme-${theme}`);

        // Handle special theme effects
        if (theme === 'matrix') {
            this.enableMatrixEffects();
        } else {
            this.disableMatrixEffects();
        }

        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
            this.isTransitioning = false;
        }, 300);

        // Dispatch event
        this.dispatchThemeChanged(theme);
    }

    updateThemeToggle() {
        const themeIcon = document.querySelector('.theme-icon');
        const themeOptions = document.querySelectorAll('.theme-option');

        if (themeIcon) {
            themeIcon.textContent = this.themes[this.currentTheme].icon;
        }

        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === this.currentTheme ||
                (option.dataset.theme === 'auto' && localStorage.getItem('theme_preference') === 'auto')) {
                option.classList.add('active');
            }
        });
    }

    detectSystemTheme() {
        // Check if user prefers dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    setupSystemDetection() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                if (localStorage.getItem('theme_preference') === 'auto') {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(newTheme);
                    this.currentTheme = newTheme;
                    this.updateThemeToggle();
                }
            });
        }
    }

    getSavedTheme() {
        const saved = localStorage.getItem('theme');
        const preference = localStorage.getItem('theme_preference');

        if (preference === 'auto') {
            return this.detectSystemTheme();
        }

        return saved || null;
    }

    enableMatrixEffects() {
        // Add matrix rain effect
        if (!document.getElementById('matrix-canvas')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'matrix-canvas';
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                opacity: 0.3;
            `;
            document.body.appendChild(canvas);
            this.startMatrixRain(canvas);
        }

        // Add matrix-specific classes
        document.body.classList.add('matrix-active');
    }

    disableMatrixEffects() {
        // Remove matrix rain effect
        const canvas = document.getElementById('matrix-canvas');
        if (canvas) {
            canvas.remove();
        }

        // Remove matrix-specific classes
        document.body.classList.remove('matrix-active');
    }

    startMatrixRain(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}';
        const matrixArray = matrix.split('');

        const fontSize = 10;
        const columns = canvas.width / fontSize;

        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        function draw() {
            if (!document.body.classList.contains('theme-matrix')) {
                return; // Stop if not matrix theme
            }

            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff00';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const interval = setInterval(draw, 35);

        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Store interval for cleanup
        canvas.matrixInterval = interval;
    }

    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T: Quick theme toggle
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.cycleThemes();
            }

            // Ctrl/Cmd + Shift + M: Toggle matrix
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                this.toggleMatrix();
            }
        });

        // Listen for theme changes from other components
        document.addEventListener('setTheme', (e) => {
            this.setTheme(e.detail.theme);
        });
    }

    cycleThemes() {
        const themes = Object.keys(this.themes);
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    toggleMatrix() {
        if (this.currentTheme === 'matrix') {
            this.setTheme('dark');
        } else {
            this.setTheme('matrix');
        }
    }

    trackThemeChange(theme) {
        // Track theme change in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                theme_name: theme,
                theme_display_name: this.themes[theme].name
            });
        }

        // Custom event
        this.dispatchThemeChanged(theme);
    }

    dispatchThemeChanged(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: theme,
                themeConfig: this.themes[theme],
                previousTheme: this.currentTheme
            }
        });
        document.dispatchEvent(event);
    }

    // Public API
    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemeConfig(theme = this.currentTheme) {
        return this.themes[theme];
    }

    getAvailableThemes() {
        return Object.keys(this.themes).map(key => ({
            key,
            ...this.themes[key]
        }));
    }
}

// Theme Toggle Styles
const themeStyles = `
<style>
.theme-toggle {
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 1000;
}

.theme-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid var(--primary-color, #8a2be2);
    background: rgba(0, 0, 0, 0.8);
    color: var(--text-primary, #ffffff);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3);
}

.theme-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(138, 43, 226, 0.5);
}

.theme-dropdown {
    position: absolute;
    top: 60px;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid var(--primary-color, #8a2be2);
    border-radius: 15px;
    min-width: 200px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.theme-dropdown.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.theme-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 0;
}

.theme-option:first-child {
    border-radius: 13px 13px 0 0;
}

.theme-option:last-child {
    border-radius: 0 0 13px 13px;
}

.theme-option:hover {
    background: rgba(138, 43, 226, 0.1);
}

.theme-option.active {
    background: rgba(138, 43, 226, 0.2);
    border-left: 3px solid var(--primary-color, #8a2be2);
}

.theme-option-icon {
    font-size: 1.2rem;
    width: 20px;
    text-align: center;
}

.theme-option-name {
    color: var(--text-primary, #ffffff);
    font-weight: 500;
}

.theme-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 5px 0;
}

/* Theme transition effects */
body.theme-transitioning {
    transition: background-color 0.3s ease, color 0.3s ease;
}

body.theme-transitioning * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Matrix theme specific styles */
body.theme-matrix {
    --primary-color: #00ff00;
    --secondary-color: #00cc00;
    --text-primary: #00ff00;
    --text-secondary: #00cc00;
}

body.matrix-active {
    background: #000000 !important;
}

/* Light theme specific styles */
body.theme-light {
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --text-primary: #1a1a1a;
    --text-secondary: #4a4a4a;
}

body.theme-light .analytics-container,
body.theme-light .post-card,
body.theme-light .widget {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(138, 43, 226, 0.2);
}

body.theme-light .metric-card,
body.theme-light .chart-container {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(138, 43, 226, 0.3);
}

/* Mobile responsive */
@media (max-width: 768px) {
    .theme-toggle {
        top: auto;
        bottom: 20px;
        right: 20px;
    }

    .theme-btn {
        width: 45px;
        height: 45px;
        font-size: 1.3rem;
    }

    .theme-dropdown {
        top: auto;
        bottom: 60px;
        right: 0;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .theme-btn {
        border-width: 3px;
        background: #000000;
    }

    body.theme-light .theme-btn {
        background: #ffffff;
        border-color: #000000;
        color: #000000;
    }
}

/* Reduce motion support */
@media (prefers-reduced-motion: reduce) {
    .theme-btn,
    .theme-dropdown,
    .theme-option {
        transition: none;
    }

    body.theme-transitioning * {
        transition: none;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', themeStyles);

// Initialize theme system
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.themeSystem = new ThemeSystem();
        });
    } else {
        window.themeSystem = new ThemeSystem();
    }

    // Global access
    window.setTheme = (theme) => window.themeSystem?.setTheme(theme);
    window.getCurrentTheme = () => window.themeSystem?.getCurrentTheme();
    window.cycleThemes = () => window.themeSystem?.cycleThemes();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSystem;
}