/**
 * Advanced Social Sharing System for NachoWeb3
 * Animated sharing buttons with URL generation and analytics tracking
 */

class SocialSharing {
    constructor() {
        this.config = {
            networks: {
                twitter: {
                    name: 'Twitter',
                    icon: '🐦',
                    color: '#1DA1F2',
                    url: 'https://twitter.com/intent/tweet',
                    params: {
                        text: 'title',
                        url: 'current',
                        via: 'nachoweb3__x'
                    }
                },
                facebook: {
                    name: 'Facebook',
                    icon: '📘',
                    color: '#4267B2',
                    url: 'https://www.facebook.com/sharer/sharer.php',
                    params: {
                        u: 'current'
                    }
                },
                linkedin: {
                    name: 'LinkedIn',
                    icon: '💼',
                    color: '#0077B5',
                    url: 'https://www.linkedin.com/sharing/share-offsite/',
                    params: {
                        url: 'current',
                        title: 'title',
                        summary: 'description'
                    }
                },
                reddit: {
                    name: 'Reddit',
                    icon: '🤖',
                    color: '#FF4500',
                    url: 'https://reddit.com/submit',
                    params: {
                        url: 'current',
                        title: 'title'
                    }
                },
                whatsapp: {
                    name: 'WhatsApp',
                    icon: '💬',
                    color: '#25D366',
                    url: 'https://wa.me/',
                    params: {
                        text: 'title+url'
                    }
                },
                telegram: {
                    name: 'Telegram',
                    icon: '✈️',
                    color: '#0088CC',
                    url: 'https://t.me/share/url',
                    params: {
                        url: 'current',
                        text: 'title'
                    }
                }
            },
            animation: {
                duration: 300,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            },
            positions: ['inline', 'floating', 'sidebar'],
            autoShow: true,
            showCount: true
        };

        this.sharingContainers = [];
        this.shareCounts = new Map();
        this.isInitialized = false;

        this.init();
    }

    init() {
        this.createInlineSharing();
        this.createFloatingSharing();
        this.createSidebarSharing();
        this.setupEventListeners();
        this.loadShareCounts();
        this.trackSharingBehavior();

        this.isInitialized = true;
        console.log('SocialSharing initialized');
    }

    createInlineSharing() {
        // Find article containers
        const articles = document.querySelectorAll('.post-content, .article-content, .content');

        articles.forEach(article => {
            const container = this.createSharingContainer('inline');

            // Insert after first paragraph or at beginning
            const firstParagraph = article.querySelector('p');
            if (firstParagraph) {
                firstParagraph.insertAdjacentElement('afterend', container);
            } else {
                article.insertAdjacentElement('afterbegin', container);
            }
        });
    }

    createFloatingSharing() {
        // Create floating share buttons for mobile
        const container = this.createSharingContainer('floating');
        document.body.appendChild(container);
    }

    createSidebarSharing() {
        // Create sidebar share buttons for desktop
        if (window.innerWidth > 1024) {
            const container = this.createSharingContainer('sidebar');
            document.body.appendChild(container);
        }
    }

    createSharingContainer(position) {
        const container = document.createElement('div');
        container.className = `social-sharing social-sharing-${position}`;

        let html = `
            <div class="social-sharing-header">
                <span class="share-icon">📤</span>
                <span class="share-text">Compartir</span>
                ${this.config.showCount ? '<span class="share-count" data-count="0">0</span>' : ''}
            </div>
            <div class="social-sharing-buttons">
        `;

        // Add share buttons for each network
        Object.entries(this.config.networks).forEach(([key, network]) => {
            html += this.createShareButton(key, network, position);
        });

        html += `
            </div>
            <div class="social-sharing-more">
                <button class="copy-link-btn" title="Copiar enlace">
                    <span class="copy-icon">🔗</span>
                    <span class="copy-text">Copiar</span>
                </button>
            </div>
        `;

        container.innerHTML = html;
        this.sharingContainers.push(container);

        // Setup button event listeners
        this.setupButtonListeners(container);

        return container;
    }

    createShareButton(networkKey, network, position) {
        return `
            <button class="share-btn share-btn-${networkKey}"
                    data-network="${networkKey}"
                    title="Compartir en ${network.name}"
                    style="--network-color: ${network.color}">
                <span class="share-btn-icon">${network.icon}</span>
                ${position === 'inline' ? `<span class="share-btn-name">${network.name}</span>` : ''}
            </button>
        `;
    }

    setupButtonListeners(container) {
        // Share buttons
        container.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const network = btn.dataset.network;
                this.share(network);
            });
        });

        // Copy link button
        container.querySelectorAll('.copy-link-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.copyLink(btn);
            });
        });
    }

    share(network) {
        const networkConfig = this.config.networks[network];
        if (!networkConfig) return;

        const shareUrl = this.buildShareUrl(networkConfig);

        // Track share attempt
        this.trackShare(network);

        // Show animation
        this.animateShare(network);

        // Open share dialog
        this.openShareDialog(shareUrl, network);
    }

    buildShareUrl(networkConfig) {
        const params = new URLSearchParams();
        const currentUrl = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(this.getShareTitle());
        const description = encodeURIComponent(this.getShareDescription());

        Object.entries(networkConfig.params).forEach(([key, value]) => {
            switch (value) {
                case 'current':
                    params.set(key, currentUrl);
                    break;
                case 'title':
                    params.set(key, title);
                    break;
                case 'description':
                    params.set(key, description);
                    break;
                case 'title+url':
                    params.set(key, `${title} ${currentUrl}`);
                    break;
                case 'via':
                    params.set(key, networkConfig.params.via);
                    break;
                default:
                    params.set(key, value);
            }
        });

        return `${networkConfig.url}?${params.toString()}`;
    }

    openShareDialog(url, network) {
        if (network === 'whatsapp') {
            // WhatsApp opens in same tab
            window.location.href = url;
        } else {
            // Others open in popup
            const width = 600;
            const height = 400;
            const left = (window.innerWidth - width) / 2;
            const top = (window.innerHeight - height) / 2;

            window.open(
                url,
                'share',
                `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
            );
        }
    }

    animateShare(network) {
        // Add animation to all share buttons for this network
        document.querySelectorAll(`.share-btn-${network}`).forEach(btn => {
            btn.classList.add('sharing');

            setTimeout(() => {
                btn.classList.remove('sharing');
                btn.classList.add('shared');

                setTimeout(() => {
                    btn.classList.remove('shared');
                }, 1000);
            }, this.config.animation.duration);
        });

        // Show success notification
        this.showShareNotification(network);
    }

    showShareNotification(network) {
        const networkConfig = this.config.networks[network];
        const notification = document.createElement('div');
        notification.className = 'share-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${networkConfig.icon}</span>
                <span class="notification-text">¡Compartido en ${networkConfig.name}!</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    copyLink(button) {
        const url = window.location.href;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                this.showCopySuccess(button);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                this.showCopySuccess(button);
            } catch (err) {
                console.error('Failed to copy link:', err);
            }

            textArea.remove();
        }
    }

    showCopySuccess(button) {
        const originalContent = button.innerHTML;
        button.innerHTML = `
            <span class="copy-icon">✅</span>
            <span class="copy-text">¡Copiado!</span>
        `;
        button.classList.add('copied');

        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('copied');
        }, 2000);
    }

    getShareTitle() {
        // Try to get title from various sources
        const titleElement = document.querySelector('h1, .post-title, .article-title, title');
        return titleElement ? titleElement.textContent.trim() : document.title;
    }

    getShareDescription() {
        // Try to get description from various sources
        const descElement = document.querySelector('meta[name="description"]');
        if (descElement) return descElement.content;

        const firstParagraph = document.querySelector('.post-content p, .article-content p, .content p');
        if (firstParagraph) {
            return firstParagraph.textContent.trim().substring(0, 200) + '...';
        }

        return '';
    }

    loadShareCounts() {
        if (!this.config.showCount) return;

        // Simulate loading share counts (in real app, this would call an API)
        Object.keys(this.config.networks).forEach(network => {
            const count = Math.floor(Math.random() * 100) + 5;
            this.shareCounts.set(network, count);
        });

        this.updateShareCountDisplay();
    }

    updateShareCountDisplay() {
        const totalShares = Array.from(this.shareCounts.values()).reduce((sum, count) => sum + count, 0);

        document.querySelectorAll('.share-count').forEach(element => {
            element.textContent = totalShares;
            element.setAttribute('data-count', totalShares);
        });
    }

    trackShare(network) {
        // Track in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: network,
                content_type: 'article',
                item_id: window.location.pathname
            });
        }

        // Increment local count
        const currentCount = this.shareCounts.get(network) || 0;
        this.shareCounts.set(network, currentCount + 1);
        this.updateShareCountDisplay();

        // Custom event
        const event = new CustomEvent('socialShare', {
            detail: { network, url: window.location.href }
        });
        document.dispatchEvent(event);
    }

    trackSharingBehavior() {
        // Track hover intent
        document.querySelectorAll('.share-btn').forEach(btn => {
            let hoverTimeout;

            btn.addEventListener('mouseenter', () => {
                hoverTimeout = setTimeout(() => {
                    this.trackShareIntent(btn.dataset.network);
                }, 1000);
            });

            btn.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
            });
        });
    }

    trackShareIntent(network) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share_intent', {
                method: network,
                content_type: 'article'
            });
        }
    }

    setupEventListeners() {
        // Handle window resize for responsive sharing
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle scroll for floating buttons
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Keyboard shortcut for sharing
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + S: Quick share
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.quickShare();
            }
        });
    }

    handleResize() {
        // Show/hide sidebar sharing based on screen size
        const sidebarSharing = document.querySelector('.social-sharing-sidebar');

        if (sidebarSharing) {
            if (window.innerWidth > 1024) {
                sidebarSharing.style.display = 'block';
            } else {
                sidebarSharing.style.display = 'none';
            }
        }
    }

    handleScroll() {
        // Show/hide floating sharing based on scroll position
        const floatingSharing = document.querySelector('.social-sharing-floating');

        if (floatingSharing) {
            if (window.scrollY > 200) {
                floatingSharing.classList.add('visible');
            } else {
                floatingSharing.classList.remove('visible');
            }
        }
    }

    quickShare() {
        // Share on the most popular network (Twitter by default)
        this.share('twitter');
    }

    // Public API
    updateShareData(title, description, url) {
        // Update sharing data dynamically
        const tempTitle = document.title;
        const tempDesc = document.querySelector('meta[name="description"]')?.content;

        if (title) document.title = title;
        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = description;
        }

        // Restore after a delay
        setTimeout(() => {
            if (tempTitle) document.title = tempTitle;
            if (tempDesc && metaDesc) metaDesc.content = tempDesc;
        }, 5000);
    }
}

// Social Sharing Styles
const socialStyles = `
<style>
/* Base Social Sharing Styles */
.social-sharing {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(138, 43, 226, 0.3);
    border-radius: 15px;
    padding: 1rem;
    backdrop-filter: blur(10px);
}

.social-sharing-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.share-icon {
    font-size: 1.2rem;
}

.share-text {
    color: var(--text-primary, #ffffff);
    font-weight: 600;
    flex: 1;
}

.share-count {
    background: var(--primary-color, #8a2be2);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    min-width: 20px;
    text-align: center;
}

/* Social Sharing Buttons */
.social-sharing-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.share-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.share-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.share-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: var(--network-color, #8a2be2);
    border-radius: 50%;
    transition: all 0.5s ease;
    transform: translate(-50%, -50%);
    z-index: 0;
}

.share-btn:hover::before {
    width: 100%;
    height: 100%;
}

.share-btn-icon,
.share-btn-name {
    position: relative;
    z-index: 1;
}

.share-btn-icon {
    font-size: 1.1rem;
}

.share-btn.sharing {
    animation: pulse 1s ease-in-out infinite;
}

.share-btn.shared {
    background: var(--network-color, #8a2be2);
    animation: share-success 1s ease;
}

/* Copy Link Button */
.social-sharing-more {
    display: flex;
    justify-content: center;
}

.copy-link-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: var(--text-primary, #ffffff);
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
}

.copy-link-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
}

.copy-link-btn.copied {
    background: rgba(0, 255, 136, 0.2);
    border-color: #00ff88;
    color: #00ff88;
}

/* Position-specific styles */
.social-sharing-inline {
    margin: 2rem 0;
}

.social-sharing-floating {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    min-width: auto;
    padding: 0.75rem;
    transform: translateY(150%);
    transition: transform 0.3s ease;
}

.social-sharing-floating.visible {
    transform: translateY(0);
}

.social-sharing-floating .social-sharing-header {
    display: none;
}

.social-sharing-floating .social-sharing-buttons {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0;
}

.social-sharing-floating .share-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    justify-content: center;
    padding: 0;
}

.social-sharing-floating .share-btn-name {
    display: none;
}

.social-sharing-sidebar {
    position: fixed;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    z-index: 1000;
}

.social-sharing-sidebar .social-sharing-header {
    display: none;
}

.social-sharing-sidebar .social-sharing-buttons {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0;
}

.social-sharing-sidebar .share-btn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    justify-content: center;
    padding: 0;
}

.social-sharing-sidebar .share-btn-name {
    display: none;
}

.social-sharing-more {
    display: none;
}

/* Share Notification */
.share-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid var(--network-color, #8a2be2);
    border-radius: 10px;
    padding: 1rem 1.5rem;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    backdrop-filter: blur(10px);
}

.share-notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.notification-icon {
    font-size: 1.2rem;
}

.notification-text {
    color: var(--text-primary, #ffffff);
    font-weight: 500;
}

/* Animations */
@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes share-success {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

/* Responsive Design */
@media (max-width: 1024px) {
    .social-sharing-sidebar {
        display: none;
    }
}

@media (max-width: 768px) {
    .social-sharing-inline .social-sharing-buttons {
        justify-content: center;
    }

    .share-btn {
        flex: 1;
        min-width: 0;
        justify-content: center;
        padding: 0.5rem;
    }

    .share-btn-name {
        display: none;
    }
}

/* Dark theme support */
body.theme-light .social-sharing {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(138, 43, 226, 0.2);
}

body.theme-light .share-text {
    color: var(--text-primary, #1a1a1a);
}

body.theme-light .copy-link-btn {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
    color: var(--text-primary, #1a1a1a);
}

/* Matrix theme support */
body.theme-matrix .share-btn::before {
    background: var(--primary-color, #00ff00);
}

body.theme-matrix .share-notification {
    border-color: var(--primary-color, #00ff00);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    .share-btn,
    .copy-link-btn,
    .social-sharing-floating,
    .share-notification {
        transition: none;
    }

    .share-btn.sharing,
    .share-btn.shared {
        animation: none;
    }
}

/* Focus styles */
.share-btn:focus,
.copy-link-btn:focus {
    outline: 2px solid var(--primary-color, #8a2be2);
    outline-offset: 2px;
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', socialStyles);

// Initialize social sharing
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.socialSharing = new SocialSharing();
        });
    } else {
        window.socialSharing = new SocialSharing();
    }

    // Global access
    window.shareArticle = (network) => window.socialSharing?.share(network);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialSharing;
}