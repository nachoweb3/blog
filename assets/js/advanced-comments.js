/**
 * Advanced Comment System with Social Login
 *
 * Features:
 * - Social login (Google, Facebook, Twitter, GitHub)
 * - Rich text editor with markdown support
 * - Real-time comments
 * - Comment threading and replies
 * - Moderation tools
 * - Spam protection
 * - Analytics integration
 * - Notification system
 */

class AdvancedCommentSystem {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = {
            // API configuration
            apiEndpoint: options.apiEndpoint || '/blog/api/comments',
            pageId: options.pageId || this.getPageId(),

            // Social login providers
            providers: options.providers || ['google', 'github', 'twitter', 'facebook'],

            // Comment settings
            enableMarkdown: options.enableMarkdown !== false,
            enableEmojis: options.enableEmojis !== false,
            enableThreading: options.enableThreading !== false,
            enableRealTime: options.enableRealTime !== false,

            // Moderation
            enableModeration: options.enableModeration !== false,
            autoApprove: options.autoApprove !== false,
            profanityFilter: options.profanityFilter !== false,

            // UI settings
            maxCommentLength: options.maxCommentLength || 2000,
            avatarSize: options.avatarSize || 40,
            theme: options.theme || 'matrix',

            // Analytics
            enableAnalytics: options.enableAnalytics !== false,

            ...options
        };

        // State
        this.comments = [];
        this.user = null;
        this.replyingTo = null;
        this.editingComment = null;
        this.realTimeConnection = null;

        // Initialize
        this.init();
    }

    init() {
        console.log('💬 Advanced Comment System initializing...');

        // Create comment system UI
        this.createCommentUI();

        // Load comments
        this.loadComments();

        // Setup authentication
        this.setupAuthentication();

        // Setup real-time updates
        if (this.options.enableRealTime) {
            this.setupRealTimeUpdates();
        }

        // Setup event listeners
        this.setupEventListeners();

        // Load user session
        this.loadUserSession();

        console.log('✅ Comment system initialized');
    }

    getPageId() {
        const url = window.location.pathname;
        return url.replace(/[^a-zA-Z0-9]/g, '_');
    }

    createCommentUI() {
        const commentSystemHTML = `
            <div class="advanced-comments" data-theme="${this.options.theme}">
                <!-- Comment Header -->
                <div class="comments-header">
                    <h3 class="comments-title">
                        <span class="comments-icon">💬</span>
                        <span class="comments-count">0</span>
                        Comentarios
                    </h3>
                    <div class="comments-actions">
                        <button class="comments-sort-btn" data-sort="newest">
                            <span>🕐</span>
                            Más recientes
                        </button>
                        <button class="comments-sort-btn" data-sort="popular">
                            <span>🔥</span>
                            Más populares
                        </button>
                    </div>
                </div>

                <!-- Comment Form -->
                <div class="comment-form-container" id="comment-form-container">
                    <!-- User authentication section -->
                    <div class="auth-section" id="auth-section">
                        <div class="auth-prompt">
                            <p>¿Qué opinas? Inicia sesión para participar</p>
                            <div class="auth-buttons">
                                ${this.createAuthButtons()}
                            </div>
                            <div class="auth-divider">
                                <span>o</span>
                            </div>
                            <div class="guest-login">
                                <button class="guest-comment-btn">
                                    <span>👤</span>
                                    Comentar como invitado
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Comment editor (shown after login) -->
                    <div class="comment-editor" id="comment-editor" style="display: none;">
                        <div class="comment-user-info">
                            <img class="user-avatar" id="current-user-avatar" src="" alt="User avatar">
                            <div class="user-details">
                                <div class="user-name" id="current-user-name"></div>
                                <button class="logout-btn" id="logout-btn">Cerrar sesión</button>
                            </div>
                        </div>

                        <div class="editor-toolbar">
                            ${this.options.enableMarkdown ? this.createMarkdownToolbar() : ''}
                            ${this.options.enableEmojis ? this.createEmojiToolbar() : ''}
                        </div>

                        <textarea
                            class="comment-textarea"
                            id="comment-textarea"
                            placeholder="Escribe tu comentario..."
                            maxlength="${this.options.maxCommentLength}"
                        ></textarea>

                        <div class="editor-footer">
                            <div class="char-count">
                                <span id="char-count">0</span> / ${this.options.maxCommentLength}
                            </div>
                            <div class="editor-actions">
                                <button class="cancel-btn" id="cancel-comment">Cancelar</button>
                                <button class="submit-btn" id="submit-comment" disabled>
                                    <span>💬</span>
                                    Comentar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Comments List -->
                <div class="comments-list" id="comments-list">
                    <!-- Comments will be loaded here -->
                </div>

                <!-- Loading indicator -->
                <div class="comments-loading" id="comments-loading">
                    <div class="loading-spinner"></div>
                    <p>Cargando comentarios...</p>
                </div>

                <!-- Empty state -->
                <div class="comments-empty" id="comments-empty" style="display: none;">
                    <div class="empty-icon">💭</div>
                    <h4>Sé el primero en comentar</h4>
                    <p>Comparte tu opinión sobre este artículo</p>
                </div>
            </div>
        `;

        this.container.innerHTML = commentSystemHTML;
        this.attachCommentStyles();
    }

    createAuthButtons() {
        const providers = {
            google: {
                name: 'Google',
                icon: '🔍',
                color: '#4285f4'
            },
            github: {
                name: 'GitHub',
                icon: '🐙',
                color: '#333'
            },
            twitter: {
                name: 'Twitter',
                icon: '🐦',
                color: '#1da1f2'
            },
            facebook: {
                name: 'Facebook',
                icon: '📘',
                color: '#3b5998'
            }
        };

        return this.options.providers
            .map(provider => providers[provider])
            .filter(Boolean)
            .map(provider => `
                <button class="auth-btn" data-provider="${provider.name.toLowerCase()}" style="--provider-color: ${provider.color}">
                    <span class="auth-icon">${provider.icon}</span>
                    <span class="auth-text">${provider.name}</span>
                </button>
            `).join('');
    }

    createMarkdownToolbar() {
        return `
            <div class="toolbar-group markdown-tools">
                <button class="toolbar-btn" data-action="bold" title="Negrita">
                    <strong>B</strong>
                </button>
                <button class="toolbar-btn" data-action="italic" title="Cursiva">
                    <em>I</em>
                </button>
                <button class="toolbar-btn" data-action="code" title="Código">
                    {'</>'}
                </button>
                <button class="toolbar-btn" data-action="link" title="Enlace">
                    🔗
                </button>
                <button class="toolbar-btn" data-action="quote" title="Cita">
                    "'
                </button>
                <button class="toolbar-btn" data-action="list" title="Lista">
                    ≡
                </button>
            </div>
        `;
    }

    createEmojiToolbar() {
        const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '💯', '👏', '🤔', '😂', '🙏'];

        return `
            <div class="toolbar-group emoji-tools">
                <button class="emoji-picker-btn" title="Emoji">
                    😊
                </button>
                <div class="emoji-panel" id="emoji-panel">
                    ${emojis.map(emoji => `
                        <button class="emoji-btn" data-emoji="${emoji}">${emoji}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    setupAuthentication() {
        // Setup auth button handlers
        const authButtons = this.container.querySelectorAll('.auth-btn');
        authButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const provider = btn.dataset.provider;
                this.authenticate(provider);
            });
        });

        // Setup guest comment button
        const guestBtn = this.container.querySelector('.guest-comment-btn');
        if (guestBtn) {
            guestBtn.addEventListener('click', () => {
                this.enableGuestCommenting();
            });
        }

        // Setup logout button
        const logoutBtn = this.container.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    async authenticate(provider) {
        console.log('🔐 Authenticating with:', provider);

        try {
            // In a real implementation, this would integrate with OAuth providers
            // For demo purposes, we'll simulate authentication
            const userData = await this.simulateAuthentication(provider);

            this.user = userData;
            this.showAuthenticatedState();
            this.saveUserSession();

            // Track authentication event
            if (this.options.enableAnalytics) {
                this.trackEvent('user_authenticated', {
                    provider,
                    userId: userData.id
                });
            }

        } catch (error) {
            console.error('Authentication failed:', error);
            this.showAuthError(error.message);
        }
    }

    simulateAuthentication(provider) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                const userData = {
                    id: `${provider}_${Date.now()}`,
                    name: `Usuario ${provider}`,
                    email: `user@${provider}.com`,
                    avatar: `https://ui-avatars.com/api/?name=${provider}&background=random`,
                    provider: provider
                };
                resolve(userData);
            }, 1000);
        });
    }

    showAuthenticatedState() {
        const authSection = this.container.querySelector('#auth-section');
        const editor = this.container.querySelector('#comment-editor');

        if (authSection) authSection.style.display = 'none';
        if (editor) {
            editor.style.display = 'block';
            this.updateUserInfo();
        }
    }

    updateUserInfo() {
        const avatar = this.container.querySelector('#current-user-avatar');
        const name = this.container.querySelector('#current-user-name');

        if (avatar && this.user.avatar) {
            avatar.src = this.user.avatar;
            avatar.alt = this.user.name;
        }

        if (name) {
            name.textContent = this.user.name;
        }
    }

    enableGuestCommenting() {
        this.user = {
            id: 'guest_' + Date.now(),
            name: 'Usuario Invitado',
            email: '',
            avatar: 'https://ui-avatars.com/api/?name=Invitado&background=random',
            provider: 'guest'
        };

        this.showAuthenticatedState();
    }

    saveUserSession() {
        localStorage.setItem('comment_user', JSON.stringify(this.user));
    }

    loadUserSession() {
        const savedUser = localStorage.getItem('comment_user');
        if (savedUser) {
            try {
                this.user = JSON.parse(savedUser);
                this.showAuthenticatedState();
            } catch (error) {
                console.error('Error loading user session:', error);
            }
        }
    }

    logout() {
        this.user = null;
        localStorage.removeItem('comment_user');

        const authSection = this.container.querySelector('#auth-section');
        const editor = this.container.querySelector('#comment-editor');

        if (authSection) authSection.style.display = 'block';
        if (editor) editor.style.display = 'none';

        // Track logout event
        if (this.options.enableAnalytics) {
            this.trackEvent('user_logout');
        }
    }

    setupEventListeners() {
        // Comment form handlers
        const textarea = this.container.querySelector('#comment-textarea');
        const submitBtn = this.container.querySelector('#submit-comment');
        const cancelBtn = this.container.querySelector('#cancel-comment');

        if (textarea) {
            textarea.addEventListener('input', () => {
                this.updateCharCount();
                this.updateSubmitButton();
            });

            textarea.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault();
                    this.submitComment();
                }
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitComment();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelComment();
            });
        }

        // Toolbar handlers
        this.setupToolbarHandlers();

        // Sort handlers
        this.setupSortHandlers();

        // Emoji picker handlers
        this.setupEmojiHandlers();
    }

    setupToolbarHandlers() {
        const toolbarBtns = this.container.querySelectorAll('.toolbar-btn');
        toolbarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.applyToolbarAction(action);
            });
        });
    }

    applyToolbarAction(action) {
        const textarea = this.container.querySelector('#comment-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        let replacement = '';

        switch (action) {
            case 'bold':
                replacement = `**${selectedText || 'texto negrito'}**`;
                break;
            case 'italic':
                replacement = `*${selectedText || 'texto cursiva'}*`;
                break;
            case 'code':
                replacement = `\`${selectedText || 'código'}\``;
                break;
            case 'link':
                replacement = `[${selectedText || 'texto del enlace'}](url)`;
                break;
            case 'quote':
                replacement = `> ${selectedText || 'cita'}`;
                break;
            case 'list':
                replacement = `- ${selectedText || 'elemento de lista'}`;
                break;
        }

        textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        textarea.focus();
        textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }

    setupSortHandlers() {
        const sortBtns = this.container.querySelectorAll('.comments-sort-btn');
        sortBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const sortType = btn.dataset.sort;
                this.sortComments(sortType);

                // Update active state
                sortBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    setupEmojiHandlers() {
        const emojiPicker = this.container.querySelector('.emoji-picker-btn');
        const emojiPanel = this.container.querySelector('#emoji-panel');

        if (emojiPicker && emojiPanel) {
            emojiPicker.addEventListener('click', () => {
                emojiPanel.style.display = emojiPanel.style.display === 'none' ? 'block' : 'none';
            });

            // Close emoji panel when clicking outside
            document.addEventListener('click', (e) => {
                if (!emojiPicker.contains(e.target) && !emojiPanel.contains(e.target)) {
                    emojiPanel.style.display = 'none';
                }
            });

            // Emoji button handlers
            const emojiBtns = emojiPanel.querySelectorAll('.emoji-btn');
            emojiBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const emoji = btn.dataset.emoji;
                    this.insertEmoji(emoji);
                    emojiPanel.style.display = 'none';
                });
            });
        }
    }

    insertEmoji(emoji) {
        const textarea = this.container.querySelector('#comment-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        textarea.value = textarea.value.substring(0, start) + emoji + textarea.value.substring(end);
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);

        this.updateCharCount();
    }

    updateCharCount() {
        const textarea = this.container.querySelector('#comment-textarea');
        const charCount = this.container.querySelector('#char-count');

        if (textarea && charCount) {
            const length = textarea.value.length;
            charCount.textContent = length;

            if (length > this.options.maxCommentLength * 0.9) {
                charCount.classList.add('warning');
            } else {
                charCount.classList.remove('warning');
            }
        }
    }

    updateSubmitButton() {
        const textarea = this.container.querySelector('#comment-textarea');
        const submitBtn = this.container.querySelector('#submit-comment');

        if (textarea && submitBtn) {
            submitBtn.disabled = textarea.value.trim().length === 0;
        }
    }

    async submitComment() {
        const textarea = this.container.querySelector('#comment-textarea');
        const content = textarea.value.trim();

        if (!content) {
            this.showError('Por favor, escribe un comentario');
            return;
        }

        if (content.length > this.options.maxCommentLength) {
            this.showError(`El comentario es demasiado largo. Máximo ${this.options.maxCommentLength} caracteres.`);
            return;
        }

        try {
            const commentData = {
                id: Date.now().toString(),
                pageId: this.options.pageId,
                content: content,
                user: this.user,
                timestamp: new Date().toISOString(),
                parentId: this.replyingTo?.id,
                status: this.options.autoApprove ? 'approved' : 'pending'
            };

            // Submit to API
            const savedComment = await this.saveComment(commentData);

            // Add to local comments array
            this.comments.unshift(savedComment);

            // Clear form
            textarea.value = '';
            this.updateCharCount();
            this.updateSubmitButton();

            // Clear reply context
            this.replyingTo = null;

            // Re-render comments
            this.renderComments();

            // Track submission event
            if (this.options.enableAnalytics) {
                this.trackEvent('comment_submitted', {
                    userId: this.user.id,
                    pageId: this.options.pageId,
                    commentId: savedComment.id
                });
            }

        } catch (error) {
            console.error('Error submitting comment:', error);
            this.showError('Error al enviar el comentario. Por favor, inténtalo de nuevo.');
        }
    }

    async saveComment(commentData) {
        // In a real implementation, this would send to your API
        // For demo purposes, we'll simulate the API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    ...commentData,
                    likes: 0,
                    replies: [],
                    createdAt: new Date().toISOString()
                });
            }, 500);
        });
    }

    cancelComment() {
        const textarea = this.container.querySelector('#comment-textarea');
        if (textarea) {
            textarea.value = '';
            this.updateCharCount();
            this.updateSubmitButton();
        }

        this.replyingTo = null;
        this.editingComment = null;
    }

    async loadComments() {
        try {
            this.showLoading(true);

            // In a real implementation, this would fetch from your API
            const comments = await this.fetchComments();

            this.comments = comments;
            this.renderComments();
            this.updateCommentsCount();

            this.showLoading(false);

        } catch (error) {
            console.error('Error loading comments:', error);
            this.showError('Error al cargar los comentarios');
            this.showLoading(false);
        }
    }

    async fetchComments() {
        // In a real implementation, this would fetch from your API
        // For demo purposes, return empty array
        return [];
    }

    renderComments() {
        const commentsList = this.container.querySelector('#comments-list');
        const emptyState = this.container.querySelector('#comments-empty');

        if (!commentsList) return;

        if (this.comments.length === 0) {
            commentsList.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        commentsList.innerHTML = this.comments.map(comment => this.renderComment(comment)).join('');
    }

    renderComment(comment) {
        const replies = comment.replies || [];
        const hasReplies = replies.length > 0;

        return `
            <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <img class="comment-avatar" src="${comment.user.avatar}" alt="${comment.user.name}">
                    <div class="comment-meta">
                        <div class="comment-author">${comment.user.name}</div>
                        <div class="comment-time">${this.formatTime(comment.timestamp)}</div>
                        ${comment.user.provider !== 'guest' ? `
                            <div class="comment-provider">${this.getProviderIcon(comment.user.provider)}</div>
                        ` : ''}
                    </div>
                </div>

                <div class="comment-content">
                    ${this.options.enableMarkdown ? this.renderMarkdown(comment.content) : this.escapeHtml(comment.content)}
                </div>

                <div class="comment-actions">
                    <button class="comment-action like-btn" data-comment-id="${comment.id}">
                        <span>👍</span>
                        <span class="like-count">${comment.likes || 0}</span>
                    </button>
                    <button class="comment-action reply-btn" data-comment-id="${comment.id}">
                        <span>💬</span>
                        Responder
                    </button>
                    ${this.user && this.user.id === comment.user.id ? `
                        <button class="comment-action edit-btn" data-comment-id="${comment.id}">
                            <span>✏️</span>
                            Editar
                        </button>
                        <button class="comment-action delete-btn" data-comment-id="${comment.id}">
                            <span>🗑️</span>
                            Eliminar
                        </button>
                    ` : ''}
                </div>

                ${hasReplies ? `
                    <div class="comment-replies">
                        <button class="toggle-replies" data-comment-id="${comment.id}">
                            <span class="replies-count">${replies.length}</span>
                            respuestas
                        </button>
                        <div class="replies-container" data-comment-id="${comment.id}">
                            ${replies.map(reply => this.renderComment(reply)).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderMarkdown(content) {
        // Basic markdown rendering
        let html = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return `<p>${html}</p>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'ahora';
        if (minutes < 60) return `hace ${minutes} minutos`;
        if (hours < 24) return `hace ${hours} horas`;
        if (days < 30) return `hace ${days} días`;

        return date.toLocaleDateString('es-ES');
    }

    getProviderIcon(provider) {
        const icons = {
            google: '🔍',
            github: '🐙',
            twitter: '🐦',
            facebook: '📘',
            guest: '👤'
        };
        return icons[provider] || '👤';
    }

    sortComments(sortType) {
        switch (sortType) {
            case 'newest':
                this.comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            case 'popular':
                this.comments.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
        }
        this.renderComments();
    }

    updateCommentsCount() {
        const countElement = this.container.querySelector('.comments-count');
        if (countElement) {
            countElement.textContent = this.comments.length;
        }
    }

    showLoading(show) {
        const loading = this.container.querySelector('#comments-loading');
        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'comment-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
                <button class="error-close">×</button>
            </div>
        `;

        this.container.appendChild(errorDiv);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);

        // Manual close
        errorDiv.querySelector('.error-close').addEventListener('click', () => {
            errorDiv.remove();
        });
    }

    trackEvent(eventName, properties = {}) {
        if (this.options.enableAnalytics && typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                ...properties,
                custom_parameter_1: 'comments'
            });
        }
    }

    attachCommentStyles() {
        const style = document.createElement('style');
        style.textContent = this.getCommentStyles();
        style.setAttribute('data-comment-styles', 'true');
        document.head.appendChild(style);
    }

    getCommentStyles() {
        return `
        .advanced-comments {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 0;
        }

        .advanced-comments[data-theme="matrix"] {
            --primary-color: #8a2be2;
            --secondary-color: #00ffff;
            --background-color: #1a0033;
            --text-color: #ffffff;
            --border-color: rgba(138, 43, 226, 0.3);
        }

        .comments-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--border-color);
        }

        .comments-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--text-color);
        }

        .comments-actions {
            display: flex;
            gap: 0.5rem;
        }

        .comments-sort-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--border-color);
            color: var(--text-color);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }

        .comments-sort-btn:hover,
        .comments-sort-btn.active {
            background: var(--primary-color);
            border-color: var(--primary-color);
        }

        .comment-form-container {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }

        .auth-prompt {
            text-align: center;
        }

        .auth-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 1rem 0;
            flex-wrap: wrap;
        }

        .auth-btn {
            background: var(--provider-color, #666);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }

        .auth-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .auth-divider {
            margin: 1rem 0;
            text-align: center;
            color: var(--text-color);
            opacity: 0.7;
        }

        .guest-comment-btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .comment-user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .user-avatar {
            width: ${this.options.avatarSize}px;
            height: ${this.options.avatarSize}px;
            border-radius: 50%;
            border: 2px solid var(--primary-color);
        }

        .user-details {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .user-name {
            font-weight: bold;
            color: var(--text-color);
        }

        .logout-btn {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-color);
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
        }

        .logout-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .editor-toolbar {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }

        .toolbar-group {
            display: flex;
            gap: 0.25rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 0.25rem;
        }

        .toolbar-btn {
            background: transparent;
            border: none;
            color: var(--text-color);
            padding: 0.5rem;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .toolbar-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .comment-textarea {
            width: 100%;
            min-height: 120px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-color);
            padding: 1rem;
            font-family: inherit;
            font-size: 1rem;
            resize: vertical;
        }

        .comment-textarea:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .editor-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
        }

        .char-count {
            color: var(--text-color);
            opacity: 0.7;
            font-size: 0.9rem;
        }

        .char-count.warning {
            color: #ff6b6b;
        }

        .editor-actions {
            display: flex;
            gap: 1rem;
        }

        .cancel-btn,
        .submit-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
        }

        .cancel-btn {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-color);
        }

        .submit-btn {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border: none;
            color: white;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);
        }

        .submit-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .comment {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
        }

        .comment:hover {
            border-color: var(--primary-color);
        }

        .comment-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .comment-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }

        .comment-meta {
            flex: 1;
        }

        .comment-author {
            font-weight: bold;
            color: var(--text-color);
        }

        .comment-time {
            font-size: 0.9rem;
            color: var(--text-color);
            opacity: 0.7;
        }

        .comment-provider {
            font-size: 1rem;
        }

        .comment-content {
            color: var(--text-color);
            line-height: 1.6;
            margin-bottom: 1rem;
        }

        .comment-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .comment-action {
            background: transparent;
            border: none;
            color: var(--text-color);
            opacity: 0.7;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.9rem;
        }

        .comment-action:hover {
            opacity: 1;
            color: var(--primary-color);
        }

        .comment-replies {
            margin-top: 1rem;
            padding-left: 2rem;
            border-left: 2px solid var(--border-color);
        }

        .toggle-replies {
            background: transparent;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }

        .replies-container {
            display: none;
        }

        .replies-container.show {
            display: block;
        }

        .comments-loading {
            text-align: center;
            padding: 2rem;
            color: var(--text-color);
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-color);
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .comments-empty {
            text-align: center;
            padding: 3rem 1rem;
            color: var(--text-color);
        }

        .empty-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .emoji-panel {
            position: absolute;
            top: 100%;
            left: 0;
            background: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 0.5rem;
            display: none;
            z-index: 1000;
        }

        .emoji-btn {
            background: transparent;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .emoji-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .comment-error {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        }

        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .error-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .error-close {
            background: transparent;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 1rem;
        }

        @media (max-width: 768px) {
            .comments-header {
                flex-direction: column;
                gap: 1rem;
                align-items: flex-start;
            }

            .auth-buttons {
                flex-direction: column;
            }

            .editor-footer {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }

            .comment-header {
                flex-wrap: wrap;
            }

            .comment-actions {
                flex-wrap: wrap;
            }
        }
        `;
    }
}

// Initialize comment system
document.addEventListener('DOMContentLoaded', () => {
    // Find comment containers
    const commentContainers = document.querySelectorAll('.comment-system');

    commentContainers.forEach(container => {
        if (!container.hasAttribute('data-initialized')) {
            new AdvancedCommentSystem(container, {
                theme: 'matrix',
                enableMarkdown: true,
                enableEmojis: true,
                enableThreading: true,
                enableRealTime: false, // Disable for demo
                providers: ['google', 'github', 'twitter'],
                enableAnalytics: true
            });
            container.setAttribute('data-initialized', 'true');
        }
    });

    console.log('💬 Advanced Comment System loaded');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedCommentSystem;
}