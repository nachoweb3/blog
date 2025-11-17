// Matrix Rain Effect - Advanced Implementation
class MatrixRain {
    constructor(options = {}) {
        this.canvas = null;
        this.ctx = null;
        this.drops = [];
        this.chars = [];
        this.fontSize = options.fontSize || 14;
        this.columns = 0;
        this.rows = 0;
        this.speed = options.speed || 50;
        this.density = options.density || 0.05;
        this.color = options.color || '#8a2be2';
        this.bgColor = options.bgColor || '#000000';
        this.isActive = false;
        this.animationId = null;

        // Caracteres extendidos para efecto más realista
        this.charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

        this.init();
    }

    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.loadFromStorage();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'matrix-canvas';
        this.ctx = this.canvas.getContext('2d', { alpha: true });

        this.updateSize();
        window.addEventListener('resize', () => this.updateSize());
    }

    updateSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.ceil(this.canvas.width / this.fontSize);
        this.rows = Math.ceil(this.canvas.height / this.fontSize);

        // Reinitialize drops array
        if (this.drops.length !== this.columns) {
            this.drops = [];
            for (let i = 0; i < this.columns; i++) {
                this.drops[i] = Math.random() > 0.98 ? Math.floor(Math.random() * this.rows) : -1;
            }
        }
    }

    setupEventListeners() {
        // Performance optimization: pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        // Reduce speed on mobile devices for performance
        if (this.isMobile()) {
            this.speed = 100;
            this.density = 0.02;
        }
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    start() {
        if (this.isActive) return;

        this.isActive = true;
        this.createDrops();
        this.animate();

        // Save preference
        this.saveToStorage(true);

        console.log('Matrix rain started');
    }

    pause() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    resume() {
        if (this.isActive) return;
        this.isActive = true;
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.clear();

        // Save preference
        this.saveToStorage(false);

        console.log('Matrix rain stopped');
    }

    createDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            // Algunas columnas empiezan activas
            this.drops[i] = Math.random() > 0.95 ? Math.floor(Math.random() * this.rows) : -1;
        }
    }

    animate() {
        if (!this.isActive) return;

        this.animationId = requestAnimationFrame(() => this.animate());

        // Efecto de fade residual
        this.ctx.fillStyle = this.bgColor + '0a'; // Semi-transparent black
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            if (this.drops[i] < 0) {
                // Probabilidad de que una columna comience a "llover"
                if (Math.random() < this.density) {
                    this.drops[i] = 0;
                }
                continue;
            }

            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            // Caracter aleatorio con diferentes opacidades para efecto de profundidad
            const char = this.getRandomChar();
            const opacity = this.calculateOpacity(this.drops[i]);

            // Caracter principal (bright)
            this.ctx.fillStyle = this.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
            this.ctx.fillText(char, x, y);

            // Efecto de trail con caracteres más oscuros
            if (this.drops[i] > 1) {
                const trailChar = this.getRandomChar();
                this.ctx.fillStyle = this.color + Math.floor(opacity * 128).toString(16).padStart(2, '0');
                this.ctx.fillText(trailChar, x, y - this.fontSize);
            }

            // Efecto de fade out al final
            if (this.drops[i] > this.rows - 5) {
                const fadeOpacity = opacity * (this.rows - this.drops[i]) / 5;
                const fadeChar = this.getRandomChar();
                this.ctx.fillStyle = this.color + Math.floor(fadeOpacity * 255).toString(16).padStart(2, '0');
                this.ctx.fillText(fadeChar, x, y + this.fontSize);
            }

            this.drops[i]++;

            // Resetear cuando llega al fondo
            if (this.drops[i] > this.rows + 10) {
                this.drops[i] = -1;
            }
        }
    }

    getRandomChar() {
        return this.charSet[Math.floor(Math.random() * this.charSet.length)];
    }

    calculateOpacity(row) {
        // Efecto de "niebla" - más brillante en ciertas alturas
        const center = this.rows / 2;
        const distance = Math.abs(row - center);
        const maxDistance = this.rows / 2;

        // Opacidad base con efecto de fade
        let opacity = 1 - (distance / maxDistance) * 0.7;

        // Añadir variación aleatoria
        opacity += Math.random() * 0.3;

        // Efecto pulsante sutil
        const pulse = Math.sin(Date.now() * 0.001 + row * 0.1) * 0.1;
        opacity += pulse;

        return Math.max(0.1, Math.min(1, opacity));
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setSpeed(newSpeed) {
        this.speed = Math.max(10, Math.min(200, newSpeed));
    }

    setColor(newColor) {
        this.color = newColor;
    }

    setFontSize(newSize) {
        this.fontSize = Math.max(8, Math.min(32, newSize));
        this.updateSize();
    }

    // Storage methods
    saveToStorage(enabled) {
        try {
            localStorage.setItem('matrix_rain_enabled', enabled.toString());
            localStorage.setItem('matrix_rain_preferences', JSON.stringify({
                fontSize: this.fontSize,
                speed: this.speed,
                color: this.color,
                density: this.density
            }));
        } catch (error) {
            console.warn('Could not save Matrix preferences:', error);
        }
    }

    loadFromStorage() {
        try {
            const enabled = localStorage.getItem('matrix_rain_enabled') === 'true';
            const prefs = localStorage.getItem('matrix_rain_preferences');

            if (enabled && prefs) {
                const preferences = JSON.parse(prefs);
                this.fontSize = preferences.fontSize || this.fontSize;
                this.speed = preferences.speed || this.speed;
                this.color = preferences.color || this.color;
                this.density = preferences.density || this.density;
            }

            return enabled;
        } catch (error) {
            console.warn('Could not load Matrix preferences:', error);
            return false;
        }
    }

    getStats() {
        return {
            active: this.isActive,
            columns: this.columns,
            rows: this.rows,
            activeDrops: this.drops.filter(d => d >= 0).length,
            fontSize: this.fontSize,
            speed: this.speed,
            density: this.density
        };
    }
}

// Matrix Background Manager
class MatrixBackground {
    constructor() {
        this.matrix = new MatrixRain({
            fontSize: 14,
            speed: 50,
            density: 0.05,
            color: '#8a2be2',
            bgColor: '#000000'
        });

        this.body = document.body;
        this.toggleButton = null;
        this.isEnabled = false;

        this.init();
    }

    init() {
        this.createBackground();
        this.createToggleButton();
        this.setupEventListeners();
        this.loadInitialState();
    }

    createBackground() {
        const matrixBg = document.createElement('div');
        matrixBg.className = 'matrix-bg';
        matrixBg.appendChild(this.matrix.canvas);

        this.body.appendChild(matrixBg);
        this.body.style.backgroundColor = '#000';
    }

    createToggleButton() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'matrix-toggle';
        this.toggleButton.innerHTML = '🌐 MATRIX';
        this.toggleButton.title = 'Activar efecto Matrix';

        this.body.appendChild(this.toggleButton);
    }

    setupEventListeners() {
        this.toggleButton.addEventListener('click', () => {
            this.toggle();
        });

        // Keyboard shortcut: Ctrl+Shift+M
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                this.toggle();
            }
        });

        // Add keyboard info to title
        this.toggleButton.title += ' (Ctrl+Shift+M)';
    }

    toggle() {
        if (this.isEnabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    enable() {
        this.isEnabled = true;
        this.matrix.start();

        this.body.classList.add('matrix-active');
        this.toggleButton.classList.add('active');
        this.toggleButton.innerHTML = '💚 ACTIVO';

        // Add some cyberpunk effects
        this.addCyberpunkEffects();

        // Track event
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('matrix_background', {
                action: 'enable',
                timestamp: new Date().toISOString()
            });
        }

        console.log('Matrix background enabled');
    }

    disable() {
        this.isEnabled = false;
        this.matrix.stop();

        this.body.classList.remove('matrix-active');
        this.toggleButton.classList.remove('active');
        this.toggleButton.innerHTML = '🌐 MATRIX';

        // Remove cyberpunk effects
        this.removeCyberpunkEffects();

        // Track event
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('matrix_background', {
                action: 'disable',
                timestamp: new Date().toISOString()
            });
        }

        console.log('Matrix background disabled');
    }

    addCyberpunkEffects() {
        // Añadir efectos visuales adicionales
        document.documentElement.style.setProperty('--matrix-purple', '#8a2be2');
        document.documentElement.style.setProperty('--matrix-light-purple', '#e9d8fd');
        document.documentElement.style.filter = 'hue-rotate(0deg)';

        // Efecto de scanline sutil
        const scanline = document.createElement('div');
        scanline.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.3), transparent);
            z-index: 9999;
            pointer-events: none;
            animation: scanline 8s linear infinite;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes scanline {
                0% { transform: translateY(-2px); }
                100% { transform: translateY(${window.innerHeight}px); }
            }
        `;

        document.head.appendChild(style);
        this.body.appendChild(scanline);
        this.scanline = scanline;
    }

    removeCyberpunkEffects() {
        if (this.scanline) {
            this.scanline.remove();
            this.scanline = null;
        }

        document.documentElement.style.removeProperty('--matrix-purple');
        document.documentElement.style.removeProperty('--matrix-light-purple');
        document.documentElement.style.removeProperty('filter');
    }

    loadInitialState() {
        const wasEnabled = this.matrix.loadFromStorage();
        if (wasEnabled) {
            setTimeout(() => this.enable(), 1000); // Delay para asegurar que todo esté cargado
        }
    }

    getStats() {
        return {
            enabled: this.isEnabled,
            matrix: this.matrix.getStats()
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.matrixBackground = new MatrixBackground();

    // Activar automáticamente el efecto Matrix
    setTimeout(() => {
        if (window.matrixBackground && !window.matrixBackground.isEnabled) {
            window.matrixBackground.enable();
            // Asegurar que el body tenga la clase matrix-active
            document.body.classList.add('matrix-active');

            // Ocultar el botón toggle ya que es automático
            const toggle = document.querySelector('.matrix-toggle');
            if (toggle) {
                toggle.style.display = 'none';
                toggle.style.visibility = 'hidden';
                toggle.style.opacity = '0';
                toggle.style.pointerEvents = 'none';
            }
        }
    }, 500);

    // Exponer para debugging
    console.log('Matrix Background initialized and auto-enabled.');
});

// Exportar para uso programático
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MatrixRain, MatrixBackground };
}