// Newsletter Popup Enhanced with Analytics and UX Improvements
(function() {
    'use strict';

    // Configuración mejorada
    const STORAGE_KEY = 'newsletter_popup_shown';
    const SUBSCRIPTION_KEY = 'newsletter_subscribed';
    const ANALYTICS_KEY = 'newsletter_analytics';
    const DELAY_MS = 3000; // 3 segundos después de cargar la página
    const COOLDOWN_DAYS = 7; // No mostrar de nuevo por 7 días si cierran
    const SUCCESS_DISPLAY_MS = 5000; // Mostrar mensaje de éxito por 5 segundos

    // Analytics tracking
    const analytics = {
        track: function(event, data = {}) {
            const eventData = {
                event: event,
                timestamp: new Date().toISOString(),
                data: data,
                page: window.location.pathname,
                userAgent: navigator.userAgent
            };

            // Guardar en localStorage
            const events = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
            events.push(eventData);
            localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events.slice(-50))); // Guardar últimos 50 eventos

            // Enviar a Google Analytics si está disponible
            if (typeof gtag !== 'undefined') {
                gtag('event', event, {
                    event_category: 'newsletter',
                    event_label: data.action || 'popup',
                    custom_parameter_1: data.email ? 'provided' : 'not_provided'
                });
            }

            console.log('Newsletter Analytics:', eventData);
        }
    };

    // Función para crear el popup con diseño Matrix mejorado
    function createPopup() {
        const popup = document.createElement('div');
        popup.id = 'newsletter-popup';
        popup.className = 'newsletter-popup-overlay';
        popup.innerHTML = `
            <div class="newsletter-popup-content matrix-glow">
                <div class="matrix-header">
                    <div class="matrix-rain">█▓▒░█▓▒░█▓▒░</div>
                    <button class="newsletter-popup-close" aria-label="Cerrar">×</button>
                </div>

                <div class="newsletter-popup-icon">📧</div>
                <h2 class="matrix-title">🚀 Únete a la Comunidad Matrix</h2>
                <p class="matrix-description">
                    Acceso VIP a contenido exclusivo de IA, Blockchain y tutoriales
                    antes que nadie. Desbloquea el conocimiento del futuro.
                </p>

                <div class="newsletter-form-container">
                    <form class="newsletter-form" action="https://formsubmit.co/money4youbabe@gmail.com" method="POST">
                        <input type="hidden" name="_subject" value="[NACHOWEB3] Nueva suscripción desde Matrix Popup">
                        <input type="hidden" name="_captcha" value="false">
                        <input type="hidden" name="_template" value="box">
                        <input type="hidden" name="_next" value="https://nachoweb3.github.io/blog/gracias-por-suscribirte/">
                        <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">

                        <div class="newsletter-input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="tu@email.com"
                                required
                                class="newsletter-email-input matrix-input"
                                autocomplete="email"
                            >
                            <button type="submit" class="newsletter-submit-btn matrix-button">
                                <span class="button-text">Desbloquear Acceso</span>
                                <span class="button-loading" style="display: none;">Enviando...</span>
                            </button>
                        </div>

                        <p class="newsletter-privacy matrix-privacy">
                            🔒 Tu email está encriptado y seguro. Sin spam, cancela cuando quieras.
                        </p>
                    </form>

                    <div class="success-message" style="display: none;">
                        <div class="success-icon">✨</div>
                        <h3>¡Suscripción Exitosa!</h3>
                        <p>Revisa tu email para confirmar y recibir el contenido exclusivo.</p>
                    </div>
                </div>

                <div class="matrix-benefits">
                    <div class="benefit-item matrix-benefit">
                        <span class="benefit-icon">🎯</span>
                        <span>Tutoriales Exclusivos</span>
                    </div>
                    <div class="benefit-item matrix-benefit">
                        <span class="benefit-icon">💎</span>
                        <span>Contenido VIP</span>
                    </div>
                    <div class="benefit-item matrix-benefit">
                        <span class="benefit-icon">🚀</span>
                        <span>Acceso Anticipado</span>
                    </div>
                    <div class="benefit-item matrix-benefit">
                        <span class="benefit-icon">🔐</span>
                        <span>Comunidad Privada</span>
                    </div>
                </div>

                <div class="matrix-footer">
                    <span class="matrix-dots">•••</span>
                    <span class="subscribers-count">+1,247 Miembros Activos</span>
                    <span class="matrix-dots">•••</span>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
        return popup;
    }

    // Funciones mejoradas para mostrar/ocultar popup
    function showPopup() {
        const popup = document.getElementById('newsletter-popup');
        if (popup) {
            popup.classList.add('show');
            document.body.style.overflow = 'hidden';
            analytics.track('popup_shown', {
                delay: DELAY_MS,
                page: window.location.pathname
            });
        }
    }

    function hidePopup(action = 'close_button') {
        const popup = document.getElementById('newsletter-popup');
        if (popup) {
            popup.classList.remove('show');
            document.body.style.overflow = '';
            analytics.track('popup_closed', {
                action: action,
                time_shown: Date.now() - popup.dataset.showTime
            });
        }
    }

    // Mostrar mensaje de éxito
    function showSuccessMessage() {
        const form = document.querySelector('.newsletter-form-container');
        const successMsg = document.querySelector('.success-message');

        if (form && successMsg) {
            form.style.display = 'none';
            successMsg.style.display = 'block';

            analytics.track('subscription_success', {
                page: window.location.pathname
            });

            // Cerrar automáticamente después del tiempo de éxito
            setTimeout(() => {
                hidePopup('auto_close_success');
                markSubscribed();
            }, SUCCESS_DISPLAY_MS);
        }
    }

    // Funciones mejoradas de almacenamiento
    function markPopupShown() {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + COOLDOWN_DAYS);
        localStorage.setItem(STORAGE_KEY, expiryDate.toISOString());
        analytics.track('popup_cooldown_set', {
            cooldown_days: COOLDOWN_DAYS,
            expires_at: expiryDate.toISOString()
        });
    }

    function markSubscribed() {
        localStorage.setItem(SUBSCRIPTION_KEY, 'true');
        localStorage.setItem(SUBSCRIPTION_KEY + '_date', new Date().toISOString());
    }

    // Validación mejorada de email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    // Verificar si debemos mostrar el popup
    function shouldShowPopup() {
        // Si ya está suscrito, no mostrar
        if (localStorage.getItem(SUBSCRIPTION_KEY) === 'true') {
            return false;
        }

        const lastShown = localStorage.getItem(STORAGE_KEY);
        if (!lastShown) return true;

        const expiryDate = new Date(lastShown);
        return new Date() > expiryDate;
    }

    // Mostrar error de validación
    function showValidationError(input, message) {
        input.classList.add('error');

        // Eliminar mensaje de error anterior si existe
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);

        analytics.track('validation_error', {
            field: 'email',
            message: message
        });

        // Remover error después de 3 segundos
        setTimeout(() => {
            input.classList.remove('error');
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
    }

    // Inicialización mejorada con más event listeners
    function init() {
        if (!shouldShowPopup()) return;

        // Crear el popup
        const popup = createPopup();
        popup.dataset.showTime = Date.now(); // Track cuando se muestra

        // Referencias a elementos
        const closeBtn = popup.querySelector('.newsletter-popup-close');
        const form = popup.querySelector('.newsletter-form');
        const emailInput = popup.querySelector('.newsletter-email-input');
        const submitBtn = popup.querySelector('.newsletter-submit-btn');

        // Event listeners mejorados
        closeBtn.addEventListener('click', () => {
            hidePopup('close_button');
            markPopupShown();
        });

        // Cerrar al hacer click fuera del contenido
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                hidePopup('click_outside');
                markPopupShown();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('show')) {
                hidePopup('escape_key');
                markPopupShown();
            }
        });

        // Validación de email en tiempo real
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email && !isValidEmail(email)) {
                showValidationError(emailInput, 'Por favor, ingresa un email válido');
            }
        });

        // Limpiar error al escribir
        emailInput.addEventListener('input', () => {
            emailInput.classList.remove('error');
            const errorMsg = emailInput.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });

        // Al enviar el formulario
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();

            // Validar email
            if (!isValidEmail(email)) {
                showValidationError(emailInput, 'Por favor, ingresa un email válido');
                return;
            }

            // Track intento de suscripción
            analytics.track('subscription_attempt', {
                email_provided: !!email,
                email_length: email.length
            });

            // Mostrar estado de carga
            submitBtn.disabled = true;
            submitBtn.querySelector('.button-text').style.display = 'none';
            submitBtn.querySelector('.button-loading').style.display = 'inline-block';

            try {
                // Enviar formulario
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showSuccessMessage();
                    markSubscribed();
                } else {
                    throw new Error('Error en el servidor');
                }
            } catch (error) {
                // Mostrar error
                showValidationError(emailInput, 'Error al suscribirte. Intenta de nuevo.');
                submitBtn.disabled = false;
                submitBtn.querySelector('.button-text').style.display = 'inline-block';
                submitBtn.querySelector('.button-loading').style.display = 'none';

                analytics.track('subscription_error', {
                    error: error.message
                });
            }
        });

        // Animar contador de suscriptores
        animateSubscriberCount();

        // Mostrar después del delay
        setTimeout(showPopup, DELAY_MS);
    }

    // Animar contador de suscriptores
    function animateSubscriberCount() {
        const countElement = document.querySelector('.subscribers-count');
        if (!countElement) return;

        const baseCount = 1247;
        const increment = Math.floor(Math.random() * 10) + 1;
        const newCount = baseCount + increment;

        // Animar el número
        let current = baseCount;
        const incrementAmount = Math.ceil((newCount - current) / 20);

        const timer = setInterval(() => {
            current += incrementAmount;
            if (current >= newCount) {
                current = newCount;
                clearInterval(timer);
            }
            countElement.textContent = `+${current.toLocaleString()} Miembros Activos`;
        }, 100);
    }

    // Función de debug para ver analytics en consola
    window.debugNewsletterAnalytics = function() {
        const events = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
        console.table(events);
        console.log('Total events:', events.length);

        // Resumen
        const summary = {
            popup_shown: events.filter(e => e.event === 'popup_shown').length,
            popup_closed: events.filter(e => e.event === 'popup_closed').length,
            subscription_attempt: events.filter(e => e.event === 'subscription_attempt').length,
            subscription_success: events.filter(e => e.event === 'subscription_success').length,
            validation_error: events.filter(e => e.event === 'validation_error').length
        };
        console.table(summary);

        return { events, summary };
    };

    // Reset para testing
    window.resetNewsletter = function() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SUBSCRIPTION_KEY);
        localStorage.removeItem(ANALYTICS_KEY);
        const popup = document.getElementById('newsletter-popup');
        if (popup) popup.remove();
        console.log('Newsletter popup reset completed');
    };

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('Newsletter Popup Enhanced initialized');
})();
