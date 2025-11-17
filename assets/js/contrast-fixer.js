/**
 * Dynamic Contrast Fixer for NachoWeb3
 * Automatically fixes contrast issues dynamically
 */

class ContrastFixer {
    constructor() {
        this.config = {
            minContrastRatio: 4.5, // WCAG AA standard
            brightnessThreshold: 128,
            lightTextOnDark: true,
            autoFix: true,
            debugMode: false
        };

        this.foundIssues = [];
        this.isFixed = false;

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.runFixes());
        } else {
            this.runFixes();
        }

        // Run fixes after dynamic content loads
        this.observeChanges();
    }

    runFixes() {
        this.fixTextColors();
        this.fixBackgrounds();
        this.fixBorders();
        this.fixFormElements();
        this.fixLinks();
        this.fixReadability();

        if (this.config.debugMode) {
            console.log('ContrastFixer: Fixed issues', this.foundIssues);
        }

        this.isFixed = true;
        this.dispatchFixedEvent();
    }

    fixTextColors() {
        // Find elements with poor contrast
        const elements = document.querySelectorAll('*');

        elements.forEach(element => {
            const computed = window.getComputedStyle(element);
            const color = this.extractColor(computed.color);
            const backgroundColor = this.extractColor(computed.backgroundColor);

            // Skip if no background color
            if (backgroundColor.alpha === 0) return;

            const contrast = this.calculateContrast(color, backgroundColor);

            if (contrast < this.config.minContrastRatio) {
                this.fixElementContrast(element, color, backgroundColor);
                this.logIssue('text_contrast', element, contrast);
            }
        });
    }

    fixBackgrounds() {
        // Fix white backgrounds that hurt eyes in dark mode
        const whiteBackgrounds = document.querySelectorAll('[style*="background: white"], [style*="background: #fff"], [style*="background: #ffffff"]');

        whiteBackgrounds.forEach(element => {
            element.style.background = 'rgba(26, 26, 26, 0.95)';
            element.style.color = '#ffffff';
            this.logIssue('white_background', element);
        });

        // Fix cards and containers with poor contrast
        const cards = document.querySelectorAll('.card, .post-card, .widget, .sidebar-item');
        cards.forEach(card => {
            const computed = window.getComputedStyle(card);
            if (this.isTooLight(computed.backgroundColor)) {
                card.style.background = 'rgba(255, 255, 255, 0.05)';
                card.style.border = '1px solid rgba(138, 43, 226, 0.3)';
                this.logIssue('card_background', card);
            }
        });
    }

    fixBorders() {
        // Fix invisible borders
        const elements = document.querySelectorAll('[style*="border: 1px solid white"], [style*="border: 1px solid #fff"]');

        elements.forEach(element => {
            element.style.borderColor = 'rgba(138, 43, 226, 0.5)';
            this.logIssue('white_border', element);
        });
    }

    fixFormElements() {
        const formElements = document.querySelectorAll('input, textarea, select');

        formElements.forEach(element => {
            const computed = window.getComputedStyle(element);

            // Fix dark text on dark background
            if (this.isTooDark(computed.color) && this.isTooDark(computed.backgroundColor)) {
                element.style.color = '#ffffff';
                element.style.backgroundColor = 'rgba(42, 42, 42, 0.8)';
                element.style.borderColor = 'rgba(138, 43, 226, 0.4)';
                this.logIssue('form_contrast', element);
            }

            // Fix placeholder color
            element.style.setProperty('--placeholder-color', '#b0b0b0', 'important');
        });
    }

    fixLinks() {
        // Fix links that are not visible
        const links = document.querySelectorAll('a');

        links.forEach(link => {
            const computed = window.getComputedStyle(link);
            const parentComputed = window.getComputedStyle(link.parentElement);

            if (this.colorsTooSimilar(computed.color, parentComputed.backgroundColor)) {
                link.style.color = '#8a2be2';
                this.logIssue('link_visibility', link);
            }
        });
    }

    fixReadability() {
        // Fix text size and spacing for better readability
        const textElements = document.querySelectorAll('p, span, div');

        textElements.forEach(element => {
            const computed = window.getComputedStyle(element);
            const fontSize = parseFloat(computed.fontSize);

            // Ensure minimum font size
            if (fontSize < 14) {
                element.style.fontSize = '14px';
                this.logIssue('font_size', element);
            }

            // Ensure proper line height
            if (parseFloat(computed.lineHeight) < 1.4) {
                element.style.lineHeight = '1.6';
                this.logIssue('line_height', element);
            }
        });
    }

    // Color utility functions
    extractColor(colorString) {
        // Handle various color formats
        const rgb = colorString.match(/\d+/g);
        if (!rgb) return { r: 0, g: 0, b: 0, a: 1 };

        return {
            r: parseInt(rgb[0]),
            g: parseInt(rgb[1]),
            b: parseInt(rgb[2]),
            a: rgb[3] ? parseFloat(rgb[3]) : 1
        };
    }

    calculateLuminance(color) {
        const { r, g, b } = color;
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    calculateContrast(color1, color2) {
        const l1 = this.calculateLuminance(color1);
        const l2 = this.calculateLuminance(color2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    isTooLight(color) {
        const extracted = this.extractColor(color);
        return extracted.r > 200 && extracted.g > 200 && extracted.b > 200;
    }

    isTooDark(color) {
        const extracted = this.extractColor(color);
        return extracted.r < 50 && extracted.g < 50 && extracted.b < 50;
    }

    colorsTooSimilar(color1, color2) {
        const c1 = this.extractColor(color1);
        const c2 = this.extractColor(color2);
        const diff = Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b);
        return diff < 30; // Colors are too similar
    }

    fixElementContrast(element, textColor, bgColor) {
        if (this.config.lightTextOnDark && this.isTooDark(bgColor)) {
            // Use light text on dark background
            element.style.color = '#ffffff';
        } else {
            // Use dark text on light background
            element.style.color = '#000000';
        }

        // Add better background if needed
        if (bgColor.a < 0.1) {
            element.style.backgroundColor = 'rgba(26, 26, 26, 0.9)';
        }
    }

    logIssue(type, element, details = null) {
        this.foundIssues.push({
            type,
            element: element.tagName.toLowerCase(),
            className: element.className,
            details,
            timestamp: Date.now()
        });
    }

    observeChanges() {
        // Watch for dynamic content changes
        const observer = new MutationObserver((mutations) => {
            if (!this.isFixed) return;

            let needsRerun = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    needsRerun = true;
                }
            });

            if (needsRerun && this.config.autoFix) {
                setTimeout(() => this.runFixes(), 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    dispatchFixedEvent() {
        const event = new CustomEvent('contrastFixed', {
            detail: {
                issuesFound: this.foundIssues.length,
                issues: this.foundIssues
            }
        });
        document.dispatchEvent(event);
    }

    // Public API
    getIssues() {
        return this.foundIssues;
    }

    rerunFixes() {
        this.foundIssues = [];
        this.runFixes();
    }

    enableDebugMode() {
        this.config.debugMode = true;
        console.log('ContrastFixer: Debug mode enabled');
    }

    disableAutoFix() {
        this.config.autoFix = false;
    }
}

// Initialize the contrast fixer
if (typeof window !== 'undefined') {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.contrastFixer = new ContrastFixer();

        // Global access for manual fixes
        window.fixContrast = () => window.contrastFixer.rerunFixes();
        window.getContrastIssues = () => window.contrastFixer.getIssues();

        console.log('🎨 ContrastFixer initialized - improving readability');
    }, 1000);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContrastFixer;
}