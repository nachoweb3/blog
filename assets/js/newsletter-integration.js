/**
 * Newsletter Integration Script
 *
 * This script integrates the newsletter backend with the frontend form,
 * providing seamless subscription functionality with proper error handling,
 * loading states, and user feedback.
 */

// Load newsletter backend
if (typeof newsletterBackend === 'undefined') {
    console.error('Newsletter backend not loaded. Please include newsletter-backend.js first');
}

class NewsletterIntegration {
    constructor() {
        this.backend = window.newsletterBackend;
        this.form = null;
        this.submitButton = null;
        this.modal = null;
        this.init();
    }

    init() {
        this.setupElements();
        this.bindEvents();
        this.setupValidation();
        this.loadStatistics();
    }

    setupElements() {
        this.form = document.getElementById('main-subscription-form');
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        this.modal = document.getElementById('success-modal');

        if (!this.form) {
            console.error('Newsletter form not found');
            return;
        }
    }

    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        // Close modal events
        const closeButtons = document.querySelectorAll('.close-btn, .modal-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', this.closeModal.bind(this));
        });

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });

        // Plan selection buttons
        const planButtons = document.querySelectorAll('[onclick^="subscribe"]');
        planButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const plan = e.target.getAttribute('onclick').match(/subscribe\('(.+?)'\)/)?.[1];
                if (plan) {
                    this.handlePlanSelection(plan);
                }
            });
        });
    }

    setupValidation() {
        // Real-time email validation
        const emailInput = document.getElementById('main-email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                this.validateEmail(emailInput);
            });
        }

        // Real-time name validation
        const nameInput = document.getElementById('main-name');
        if (nameInput) {
            nameInput.addEventListener('blur', () => {
                this.validateName(nameInput);
            });
        }

        // Interests validation (at least one selected)
        const interestsCheckboxes = document.querySelectorAll('input[name="interests"]');
        interestsCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.validateInterests();
            });
        });
    }

    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.showError(input, 'Email is required');
            return false;
        }

        if (!emailRegex.test(email)) {
            this.showError(input, 'Please enter a valid email address');
            return false;
        }

        this.clearError(input);
        return true;
    }

    validateName(input) {
        const name = input.value.trim();

        if (!name) {
            this.showError(input, 'Name is required');
            return false;
        }

        if (name.length < 2) {
            this.showError(input, 'Name must be at least 2 characters');
            return false;
        }

        this.clearError(input);
        return true;
    }

    validateInterests() {
        const checkedBoxes = document.querySelectorAll('input[name="interests"]:checked');

        if (checkedBoxes.length === 0) {
            this.showInterestsError('Please select at least one interest');
            return false;
        }

        this.clearInterestsError();
        return true;
    }

    showError(input, message) {
        this.clearError(input);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;

        input.parentNode.appendChild(errorDiv);
        input.classList.add('error');
    }

    clearError(input) {
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        input.classList.remove('error');
    }

    showInterestsError(message) {
        const interestsSection = document.querySelector('.interests-section');
        let errorDiv = interestsSection.querySelector('.interests-error');

        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'interests-error';
            interestsSection.appendChild(errorDiv);
        }

        errorDiv.textContent = message;
    }

    clearInterestsError() {
        const errorDiv = document.querySelector('.interests-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();

        try {
            await this.setLoadingState(true);

            const result = await this.backend.subscribe(formData);

            if (result.success) {
                this.handleSuccess(result);
            } else {
                this.handleError(result.message);
            }

        } catch (error) {
            this.handleError('An unexpected error occurred. Please try again.');
            console.error('Newsletter submission error:', error);
        } finally {
            await this.setLoadingState(false);
        }
    }

    validateForm() {
        const emailInput = document.getElementById('main-email');
        const nameInput = document.getElementById('main-name');
        const privacyConsent = document.getElementById('privacy-consent');

        let isValid = true;

        isValid = this.validateEmail(emailInput) && isValid;
        isValid = this.validateName(nameInput) && isValid;
        isValid = this.validateInterests() && isValid;

        if (!privacyConsent.checked) {
            alert('You must accept the privacy policy to subscribe');
            isValid = false;
        }

        return isValid;
    }

    getFormData() {
        const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
            .map(cb => cb.value);

        return {
            email: document.getElementById('main-email').value.trim(),
            name: document.getElementById('main-name').value.trim(),
            interests: interests,
            experience: document.getElementById('experience-level').value,
            investment: document.getElementById('investment-size').value,
            privacyConsent: document.getElementById('privacy-consent').checked
        };
    }

    async setLoadingState(loading) {
        if (!this.submitButton) return;

        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <span class="loading-spinner"></span>
                🔄 Processing...
            `;
            this.submitButton.style.cursor = 'not-allowed';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = '🚀 Suscribirse Gratis';
            this.submitButton.style.cursor = 'pointer';
        }
    }

    handleSuccess(result) {
        // Reset form
        this.form.reset();

        // Show success modal
        this.showSuccessModal(result.message);

        // Update statistics
        this.updateStatistics();

        // Confetti animation (optional)
        this.celebrateSuccess();
    }

    handleError(message) {
        // Show error message
        this.showErrorMessage(message);

        // Shake form animation
        this.shakeForm();
    }

    showSuccessModal(message) {
        if (!this.modal) return;

        const messageElement = document.getElementById('success-message');
        if (messageElement) {
            messageElement.textContent = message;
        }

        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (!this.modal) return;

        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    showErrorMessage(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.form-error');

        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            this.form.appendChild(errorDiv);
        }

        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    shakeForm() {
        this.form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            this.form.style.animation = '';
        }, 500);
    }

    celebrateSuccess() {
        // Simple celebration animation
        const button = this.submitButton;
        button.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        button.innerHTML = '✅ ¡Suscripción Exitosa!';

        setTimeout(() => {
            button.style.background = '';
            button.innerHTML = '🚀 Suscribirse Gratis';
        }, 3000);
    }

    handlePlanSelection(plan) {
        console.log(`Plan selected: ${plan}`);

        if (plan === 'free') {
            // Direct subscription for free plan
            this.showSuccessModal('¡Bienvenido! Te has suscrito al plan gratuito. Recibirás tu primer newsletter en 24 horas.');
        } else {
            // For paid plans, show pricing information or redirect to payment
            this.showPaidPlanModal(plan);
        }
    }

    showPaidPlanModal(plan) {
        const planInfo = {
            pro: {
                name: 'Pro',
                price: '$29/mes',
                features: ['Newsletter premium completo', 'Alertas urgentes', 'Research exclusivo', 'Comunidad Discord']
            },
            vip: {
                name: 'VIP',
                price: '$99/mes',
                features: ['Todo lo Pro', 'Consultoría 1-on-1', 'Alertas personalizados', 'Networking exclusivo']
            }
        };

        const info = planInfo[plan];
        if (!info) return;

        // Create modal content
        const modalHtml = `
            <div id="paid-plan-modal" class="modal">
                <div class="modal-content">
                    <span class="close-btn" onclick="this.closest('.modal').remove()">&times;</span>
                    <h2>🎯 Plan ${info.name}</h2>
                    <div class="plan-pricing">${info.price}</div>
                    <ul class="plan-features">
                        ${info.features.map(feature => `<li>✅ ${feature}</li>`).join('')}
                    </ul>
                    <p>🚀 Próximamente disponible. Por ahora, únete gratis y te contactaremos para la activación del plan ${info.name}.</p>
                    <div class="modal-actions">
                        <button class="modal-btn secondary" onclick="this.closest('.modal').remove()">Cerrar</button>
                        <button class="modal-btn primary" onclick="newsletterIntegration.handlePaidPlanInterest('${plan}')">Interesado en ${info.name}</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    async handlePaidPlanInterest(plan) {
        const formData = this.getFormData();

        // Add plan interest to data
        formData.planInterest = plan;
        formData.timestamp = new Date().toISOString();

        try {
            const result = await this.backend.subscribe(formData);

            if (result.success) {
                this.closeModal();
                document.querySelector('#paid-plan-modal')?.remove();
                this.showSuccessModal(`¡Gracias por tu interés en el plan ${plan}! Te contactaremos pronto con los detalles de activación.`);
            } else {
                alert('Error al procesar tu solicitud. Por favor intenta de nuevo.');
            }
        } catch (error) {
            console.error('Paid plan interest error:', error);
            alert('Error inesperado. Por favor intenta de nuevo.');
        }
    }

    loadStatistics() {
        const stats = this.backend.getStatistics();

        // Update subscriber count
        const subscribersElement = document.getElementById('subscribers-count');
        if (subscribersElement && stats.total > 0) {
            subscribersElement.textContent = (2847 + stats.total).toLocaleString();
        }
    }

    updateStatistics() {
        // Update real-time statistics
        const subscribersElement = document.getElementById('subscribers-count');
        if (subscribersElement) {
            const current = parseInt(subscribersElement.textContent.replace(/,/g, ''));
            subscribersElement.textContent = (current + 1).toLocaleString();
        }
    }
}

// CSS styles for newsletter integration
const newsletterStyles = `
<style>
/* Newsletter Form Validation Styles */
.field-error {
    color: #ff6b6b;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    display: block;
}

.interests-error {
    color: #ff6b6b;
    font-size: 0.9rem;
    margin-top: 1rem;
    text-align: center;
    background: rgba(255, 107, 107, 0.1);
    padding: 0.75rem;
    border-radius: 8px;
}

.form-error {
    background: #ff6b6b;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    text-align: center;
    animation: slideDown 0.3s ease;
}

input.error, select.error {
    border-color: #ff6b6b !important;
    background: rgba(255, 107, 107, 0.1) !important;
}

/* Loading Spinner */
.loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s ease-in-out infinite;
    margin-right: 0.5rem;
}

/* Shake Animation */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}

/* Slide Down Animation */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Spin Animation */
@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Paid Plan Modal Styles */
.plan-pricing {
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
    text-align: center;
    margin: 1rem 0;
}

.plan-features {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0;
}

.plan-features li {
    padding: 0.5rem 0;
    color: #555;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
}

.modal-btn.secondary {
    background: #6c757d;
    color: white;
}

.modal-btn.secondary:hover {
    background: #5a6268;
}

/* Enhanced button hover effects */
.subscribe-btn:hover:disabled {
    transform: none !important;
    cursor: not-allowed !important;
}
</style>
`;

// Inject styles
if (typeof document !== 'undefined') {
    document.head.insertAdjacentHTML('beforeend', newsletterStyles);
}

// Initialize newsletter integration when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.newsletterIntegration = new NewsletterIntegration();
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsletterIntegration;
}