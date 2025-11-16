/**
 * Blog UX/UI Enhancements
 * Funcionalidades: Progress bar, Scroll to top, Dark mode, Social share, Reading time
 */

(function() {
    'use strict';

    // ===== UTILIDADES =====

    /**
     * Muestra una notificación toast
     */
    function showToast(message, duration = 3000) {
        let toast = document.querySelector('.toast');

        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    /**
     * Calcula el tiempo de lectura basado en palabras
     */
    function calculateReadingTime() {
        const content = document.querySelector('.post-content');
        if (!content) return;

        const text = content.textContent || content.innerText;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // 200 palabras por minuto

        const timeElement = document.querySelector('.reading-time');
        if (timeElement) {
            timeElement.textContent = `${readingTime} min de lectura`;
        }
    }

    // ===== READING PROGRESS BAR =====

    function initReadingProgressBar() {
        // Solo en páginas de posts
        if (!document.querySelector('.post')) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        document.body.appendChild(progressBar);

        function updateProgressBar() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const progress = (scrollTop / documentHeight) * 100;

            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }

        window.addEventListener('scroll', updateProgressBar, { passive: true });
        updateProgressBar(); // Inicializar
    }

    // ===== SCROLL TO TOP BUTTON =====

    function initScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Volver arriba');
        document.body.appendChild(scrollBtn);

        function toggleScrollButton() {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', toggleScrollButton, { passive: true });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        toggleScrollButton(); // Inicializar
    }

    // ===== DARK MODE TOGGLE =====

    function initDarkMode() {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.setAttribute('aria-label', 'Alternar modo oscuro');
        document.body.appendChild(darkModeToggle);

        // Cargar preferencia guardada
        const currentMode = localStorage.getItem('darkMode');
        if (currentMode === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '☀️';
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            const isDarkMode = document.body.classList.contains('dark-mode');
            darkModeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';

            // Guardar preferencia
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');

            showToast(isDarkMode ? 'Modo oscuro activado' : 'Modo claro activado', 2000);
        });
    }

    // ===== SOCIAL SHARE BUTTONS =====

    function initSocialShare() {
        const shareContainer = document.querySelector('.post-share');
        if (!shareContainer) return;

        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);

        // Limpiar contenido existente excepto el label
        const shareLabel = shareContainer.querySelector('.share-label');
        shareContainer.innerHTML = '';
        if (shareLabel) {
            shareContainer.appendChild(shareLabel);
        }

        // Crear contenedor de botones
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'social-share-container';

        // Twitter
        const twitterBtn = createShareButton(
            'Twitter',
            `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`,
            'twitter',
            '𝕏'
        );

        // Facebook
        const facebookBtn = createShareButton(
            'Facebook',
            `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
            'facebook',
            'f'
        );

        // LinkedIn
        const linkedinBtn = createShareButton(
            'LinkedIn',
            `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`,
            'linkedin',
            'in'
        );

        // WhatsApp
        const whatsappBtn = createShareButton(
            'WhatsApp',
            `https://wa.me/?text=${pageTitle}%20${pageUrl}`,
            'whatsapp',
            '📱'
        );

        // Copiar enlace
        const copyBtn = document.createElement('button');
        copyBtn.className = 'share-button copy-link';
        copyBtn.innerHTML = '🔗 Copiar enlace';
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(window.location.href);
                copyBtn.innerHTML = '✓ Copiado';
                copyBtn.classList.add('copied');
                showToast('Enlace copiado al portapapeles');

                setTimeout(() => {
                    copyBtn.innerHTML = '🔗 Copiar enlace';
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                showToast('Error al copiar el enlace');
            }
        });

        buttonsContainer.appendChild(twitterBtn);
        buttonsContainer.appendChild(facebookBtn);
        buttonsContainer.appendChild(linkedinBtn);
        buttonsContainer.appendChild(whatsappBtn);
        buttonsContainer.appendChild(copyBtn);

        shareContainer.appendChild(buttonsContainer);
    }

    function createShareButton(name, url, className, icon) {
        const btn = document.createElement('a');
        btn.href = url;
        btn.className = `share-button ${className}`;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.innerHTML = `${icon} ${name}`;
        return btn;
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====

    function initSmoothScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===== LAZY LOADING FOR IMAGES =====

    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores sin soporte
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====

    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observar elementos que queremos animar
        document.querySelectorAll('.post-card, .category-card').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== EXTERNAL LINKS =====

    function initExternalLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        links.forEach(link => {
            if (!link.hostname.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    // ===== KEYBOARD SHORTCUTS =====

    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Esc para cerrar modals o volver arriba
            if (e.key === 'Escape') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Ctrl/Cmd + D para dark mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                document.querySelector('.dark-mode-toggle')?.click();
            }
        });
    }

    // ===== PERFORMANCE MONITORING =====

    function logPerformance() {
        if ('performance' in window && 'PerformanceObserver' in window) {
            // Log de métricas de rendimiento
            window.addEventListener('load', () => {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page Load Time: ${pageLoadTime}ms`);
            });
        }
    }

    // ===== INIT ALL =====

    function init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        console.log('Initializing blog enhancements...');

        // Funcionalidades principales
        initReadingProgressBar();
        initScrollToTop();
        initDarkMode();
        initSocialShare();
        initSmoothScrollLinks();
        initLazyLoading();
        initScrollAnimations();
        initExternalLinks();
        initKeyboardShortcuts();

        // Calcular tiempo de lectura
        calculateReadingTime();

        // Performance monitoring (solo en desarrollo)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            logPerformance();
        }

        console.log('Blog enhancements initialized successfully!');
    }

    // Iniciar
    init();

})();
