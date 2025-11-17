/**
 * AI Assistant for NachoWeb3 Blog
 * Conversational AI helper powered by intelligent responses
 */

class AIAssistant {
    constructor() {
        this.config = {
            position: 'bottom-right',
            personality: {
                name: 'NachoBot',
                avatar: '🤖',
                mood: 'helpful',
                style: 'professional'
            },
            features: {
                voiceInput: true,
                voiceOutput: true,
                suggestions: true,
                typing: true,
                emotions: true,
                memory: true
            },
            colors: {
                primary: '#8a2be2',
                secondary: '#764ba2',
                success: '#00ff88',
                warning: '#ffaa00',
                error: '#ff4444'
            },
            shortcuts: {
                open: 'ctrl+shift+a',
                close: 'escape',
                send: 'enter',
                voice: 'ctrl+shift+v'
            }
        };

        this.isOpen = false;
        this.isTyping = false;
        this.messages = [];
        this.sessionId = this.generateSessionId();
        this.userProfile = this.loadUserProfile();
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.emotionState = 'neutral';

        this.init();
    }

    init() {
        this.createAssistantInterface();
        this.setupEventListeners();
        this.loadConversationHistory();
        this.startTypingSimulation();

        console.log('NachoBot AI Assistant initialized');
    }

    createAssistantInterface() {
        // Main container
        const assistant = document.createElement('div');
        assistant.className = 'ai-assistant';
        assistant.id = 'ai-assistant';
        assistant.innerHTML = `
            <div class="assistant-bubble" id="assistant-bubble">
                <div class="bubble-avatar">${this.config.personality.avatar}</div>
                <div class="bubble-status"></div>
                <div class="notification-dot" id="notification-dot"></div>
            </div>

            <div class="assistant-chat" id="assistant-chat">
                <div class="chat-header">
                    <div class="header-info">
                        <div class="assistant-name">${this.config.personality.name}</div>
                        <div class="assistant-status">
                            <span class="status-dot online"></span>
                            <span class="status-text">En línea</span>
                        </div>
                    </div>
                    <div class="header-actions">
                        <button class="header-btn" id="voice-toggle" title="Voz">
                            🎤
                        </button>
                        <button class="header-btn" id="assistant-settings" title="Configuración">
                            ⚙️
                        </button>
                        <button class="header-btn" id="assistant-minimize" title="Minimizar">
                            ➖
                        </button>
                        <button class="header-btn" id="assistant-close" title="Cerrar">
                            ✕
                        </button>
                    </div>
                </div>

                <div class="chat-messages" id="chat-messages"></div>

                <div class="chat-suggestions" id="chat-suggestions">
                    <div class="suggestion-item" data-action="blog-info">
                        📝 Cuéntame sobre el blog
                    </div>
                    <div class="suggestion-item" data-action="latest-posts">
                        🆕 ¿Qué hay nuevo?
                    </div>
                    <div class="suggestion-item" data-action="help">
                        ❓ Ayúdame a navegar
                    </div>
                    <div class="suggestion-item" data-action="recommend">
                        🎯 Recomiéndame contenido
                    </div>
                </div>

                <div class="chat-input-container">
                    <div class="input-wrapper">
                        <button class="input-btn" id="voice-input-btn" title="Entrada de voz">
                            🎤
                        </button>
                        <input
                            type="text"
                            id="assistant-input"
                            placeholder="Escribe tu pregunta..."
                            autocomplete="off"
                        >
                        <button class="input-btn" id="emoji-btn" title="Emoji">
                            😊
                        </button>
                        <button class="input-btn" id="send-btn" title="Enviar (Enter)">
                            📤
                        </button>
                    </div>
                    <div class="input-info">
                        <span class="typing-indicator" id="typing-indicator">NachoBot está escribiendo...</span>
                        <span class="char-count" id="char-count">0/1000</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(assistant);
        this.assistant = assistant;
        this.elements = {
            bubble: document.getElementById('assistant-bubble'),
            chat: document.getElementById('assistant-chat'),
            messages: document.getElementById('chat-messages'),
            input: document.getElementById('assistant-input'),
            sendBtn: document.getElementById('send-btn'),
            suggestions: document.getElementById('chat-suggestions'),
            voiceBtn: document.getElementById('voice-input-btn'),
            typingIndicator: document.getElementById('typing-indicator'),
            charCount: document.getElementById('char-count'),
            notificationDot: document.getElementById('notification-dot')
        };
    }

    setupEventListeners() {
        // Bubble click
        this.elements.bubble.addEventListener('click', () => this.open());

        // Close buttons
        document.getElementById('assistant-close').addEventListener('click', () => this.close());
        document.getElementById('assistant-minimize').addEventListener('click', () => this.minimize());

        // Send message
        this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Character count
        this.elements.input.addEventListener('input', (e) => {
            this.updateCharCount(e.target.value.length);
        });

        // Suggestions
        this.elements.suggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleSuggestion(item.dataset.action);
            });
        });

        // Voice features
        if (this.config.features.voiceInput) {
            this.setupVoiceInput();
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.config.shortcuts.open === this.getShortcutKey(e)) {
                e.preventDefault();
                this.toggle();
            } else if (this.config.shortcuts.close === e.key && this.isOpen) {
                e.preventDefault();
                this.close();
            }
        });

        // Window focus
        window.addEventListener('focus', () => {
            this.hideNotificationDot();
        });
    }

    getShortcutKey(e) {
        const parts = this.config.shortcuts.open.split('+');
        const ctrl = parts.includes('ctrl') ? e.ctrlKey : true;
        const shift = parts.includes('shift') ? e.shiftKey : true;
        const key = parts[parts.length - 1].toLowerCase();

        return ctrl && shift && e.key.toLowerCase() === key;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.elements.chat.classList.add('open');
        this.elements.bubble.classList.add('active');
        this.elements.input.focus();

        if (this.messages.length === 0) {
            this.showWelcomeMessage();
        }

        this.trackEvent('assistant_opened');
    }

    close() {
        this.isOpen = false;
        this.elements.chat.classList.remove('open');
        this.elements.bubble.classList.remove('active');

        this.trackEvent('assistant_closed');
    }

    minimize() {
        this.elements.chat.classList.toggle('minimized');
    }

    sendMessage() {
        const message = this.elements.input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.elements.input.value = '';
        this.updateCharCount(0);

        this.processUserMessage(message);
    }

    addMessage(content, sender, metadata = {}) {
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${sender}`;

        const timestamp = new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageEl.innerHTML = `
            <div class="message-content">
                <div class="message-avatar">${sender === 'user' ? '👤' : this.config.personality.avatar}</div>
                <div class="message-bubble">
                    <div class="message-text">${this.formatMessage(content)}</div>
                    <div class="message-time">${timestamp}</div>
                    ${metadata.emotion ? `<div class="message-emotion">${metadata.emotion}</div>` : ''}
                </div>
            </div>
        `;

        this.elements.messages.appendChild(messageEl);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;

        this.messages.push({
            content,
            sender,
            timestamp,
            metadata
        });

        this.saveConversationHistory();
    }

    formatMessage(content) {
        // Format URLs, mentions, code blocks, etc.
        return content
            .replace(/\b(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
            .replace(/\b@\w+/g, '<span class="mention">$&</span>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    }

    async processUserMessage(message) {
        this.showTypingIndicator();

        // Analyze intent and generate response
        const intent = this.analyzeIntent(message);
        const response = await this.generateResponse(intent, message);

        this.hideTypingIndicator();
        this.addMessage(response.text, 'assistant', response.metadata);

        // Update emotion based on conversation
        this.updateEmotionState(intent, response.metadata?.emotion);

        // Update user profile
        this.updateUserProfile(message, intent);

        // Track conversation
        this.trackEvent('assistant_message', {
            intent,
            message_length: message.length,
            response_length: response.text.length
        });
    }

    analyzeIntent(message) {
        const normalizedMessage = message.toLowerCase();

        // Check for specific intents
        if (normalizedMessage.includes('hola') || normalizedMessage.includes('buenos')) {
            return 'greeting';
        } else if (normalizedMessage.includes('gracias') || normalizedMessage.includes('agradec')) {
            return 'thanks';
        } else if (normalizedMessage.includes('adiós') || normalizedMessage.includes('chao')) {
            return 'goodbye';
        } else if (normalizedMessage.includes('blog') || normalizedMessage.includes('sobre ti')) {
            return 'blog_info';
        } else if (normalizedMessage.includes('nuevo') || normalizedMessage.includes('último')) {
            return 'latest_posts';
        } else if (normalizedMessage.includes('busca') || normalizedMessage.includes('encuentra')) {
            return 'search_help';
        } else if (normalizedMessage.includes('recomienda') || normalizedMessage.includes('sugiere')) {
            return 'recommendation';
        } else if (normalizedMessage.includes('aprende') || normalizedMessage.includes('tutorial')) {
            return 'learning_request';
        } else if (normalizedMessage.includes('cryptomoneda') || normalizedMessage.includes('bitcoin')) {
            return 'crypto_topic';
        } else if (normalizedMessage.includes('inteligencia artificial') || normalizedMessage.includes('ia')) {
            return 'ai_topic';
        } else if (normalizedMessage.includes('ayuda') || normalizedMessage.includes('cómo')) {
            return 'help_request';
        } else {
            return 'general';
        }
    }

    async generateResponse(intent, message) {
        const responses = this.knowledgeBase[intent] || this.knowledgeBase.general;

        // Add personalization based on user profile
        const personalizedResponse = this.personalizeResponse(responses, message);

        // Simulate processing time
        await this.delay(Math.random() * 1000 + 500);

        return {
            text: personalizedResponse.text,
            metadata: {
                emotion: personalizedResponse.emotion,
                confidence: personalizedResponse.confidence,
                sources: personalizedResponse.sources
            }
        };
    }

    personalizeResponse(responses, message) {
        const baseResponse = responses[Math.floor(Math.random() * responses.length)];

        // Personalize based on user history
        let personalizedText = baseResponse.text;

        if (this.userProfile.visitCount > 5) {
            personalizedText = personalizedText.replace('{name}', 'amigo');
        } else {
            personalizedText = personalizedText.replace('{name}', 'visitante');
        }

        return {
            text: personalizedText,
            emotion: baseResponse.emotion || 'friendly',
            confidence: baseResponse.confidence || 0.8,
            sources: baseResponse.sources || []
        };
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.elements.typingIndicator.style.display = 'block';
        this.elements.input.disabled = true;
        this.elements.sendBtn.disabled = true;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.elements.typingIndicator.style.display = 'none';
        this.elements.input.disabled = false;
        this.elements.sendBtn.disabled = false;
    }

    handleSuggestion(action) {
        const suggestionMessages = {
            'blog-info': 'Cuéntame sobre el blog NachoWeb3',
            'latest-posts': '¿Cuáles son los artículos más recientes?',
            'help': 'Ayúdame a encontrar información',
            'recommend': '¿Qué me recomiendas leer hoy?'
        };

        const message = suggestionMessages[action];
        if (message) {
            this.elements.input.value = message;
            this.sendMessage();
        }
    }

    setupVoiceInput() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'es-ES';

        this.elements.voiceBtn.addEventListener('click', () => {
            if (this.isListening) {
                this.stopVoiceInput();
            } else {
                this.startVoiceInput();
            }
        });

        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

            this.elements.input.value = transcript;
            this.updateCharCount(transcript.length);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.stopVoiceInput();
        };

        this.recognition.onend = () => {
            this.stopVoiceInput();
        };
    }

    startVoiceInput() {
        if (!this.recognition) return;

        this.isListening = true;
        this.elements.voiceBtn.style.background = this.config.colors.error;
        this.elements.voiceBtn.textContent = '🔴';
        this.elements.input.placeholder = 'Escuchando...';

        this.recognition.start();
    }

    stopVoiceInput() {
        if (!this.recognition || !this.isListening) return;

        this.isListening = false;
        this.elements.voiceBtn.style.background = '';
        this.elements.voiceBtn.textContent = '🎤';
        this.elements.input.placeholder = 'Escribe tu pregunta...';

        this.recognition.stop();
    }

    showWelcomeMessage() {
        const welcomeMessages = [
            `¡Hola! Soy ${this.config.personality.name}, tu asistente personal. ¿En qué puedo ayudarte hoy?`,
            `👋 Bienvenido a NachoWeb3. Soy tu guía IA. ¿Buscas algo específico?`,
            `🎉 ¡Hola! Estoy aquí para ayudarte a navegar por el blog. ¿Qué te interesa?`
        ];

        const message = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        this.addMessage(message, 'assistant', { emotion: 'friendly' });
    }

    updateCharCount(count) {
        this.elements.charCount.textContent = `${count}/1000`;
        if (count > 900) {
            this.elements.charCount.style.color = this.config.colors.warning;
        } else {
            this.elements.charCount.style.color = '';
        }
    }

    showNotificationDot() {
        this.elements.notificationDot.style.display = 'block';
    }

    hideNotificationDot() {
        this.elements.notificationDot.style.display = 'none';
    }

    updateEmotionState(intent, emotion) {
        // Update emotion based on conversation
        this.emotionState = emotion || 'friendly';

        // Update avatar to reflect emotion
        const emotions = {
            'friendly': '😊',
            'excited': '🤗',
            'thinking': '🤔',
            'helpful': '💡',
            'professional': '🤖'
        };

        if (emotions[this.emotionState]) {
            this.elements.bubble.querySelector('.bubble-avatar').textContent = emotions[this.emotionState];
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadUserProfile() {
        const saved = localStorage.getItem('nacho_user_profile');
        return saved ? JSON.parse(saved) : {
            visitCount: 0,
            lastVisit: null,
            interests: [],
            conversationHistory: []
        };
    }

    updateUserProfile(message, intent) {
        this.userProfile.visitCount++;
        this.userProfile.lastVisit = new Date().toISOString();

        // Track interests
        if (intent === 'crypto_topic' && !this.userProfile.interests.includes('crypto')) {
            this.userProfile.interests.push('crypto');
        } else if (intent === 'ai_topic' && !this.userProfile.interests.includes('ai')) {
            this.userProfile.interests.push('ai');
        }

        localStorage.setItem('nacho_user_profile', JSON.stringify(this.userProfile));
    }

    saveConversationHistory() {
        const history = {
            sessionId: this.sessionId,
            messages: this.messages,
            timestamp: new Date().toISOString()
        };

        const savedHistory = JSON.parse(localStorage.getItem('nacho_conversation_history') || '[]');
        savedHistory.push(history);

        // Keep only last 50 conversations
        if (savedHistory.length > 50) {
            savedHistory.splice(0, savedHistory.length - 50);
        }

        localStorage.setItem('nacho_conversation_history', JSON.stringify(savedHistory));
    }

    loadConversationHistory() {
        const savedHistory = JSON.parse(localStorage.getItem('nacho_conversation_history') || '[]');
        if (savedHistory.length > 0) {
            const lastSession = savedHistory[savedHistory.length - 1];
            // Optionally restore last conversation
        }
    }

    initializeKnowledgeBase() {
        return {
            greeting: [
                {
                    text: '¡Hola {name}! ¿En qué puedo ayudarte hoy?',
                    emotion: 'friendly',
                    confidence: 0.9
                },
                {
                    text: '👋 ¡Hola! Soy NachoBot, tu asistente IA. ¿Buscas algo específico?',
                    emotion: 'excited',
                    confidence: 0.9
                }
            ],
            blog_info: [
                {
                    text: 'NachoWeb3 es un blog sobre IA, Blockchain y tutoriales tecnológicos. Contamos con artículos actualizados, herramientas interactivas y análisis expertos.',
                    emotion: 'professional',
                    confidence: 0.95,
                    sources: ['About Page', 'Homepage']
                }
            ],
            latest_posts: [
                {
                    text: 'Los artículos más recientes incluyen guías sobre trading de criptomonedas, tutoriales de Machine Learning y análisis de tendencias de IA. ¿Te gustaría ver algún tema específico?',
                    emotion: 'helpful',
                    confidence: 0.9
                }
            ],
            recommendation: [
                {
                    text: 'Basado en tus intereses, te recomiendo leer sobre "Introducción a Blockchain" y "Machine Learning para Principiantes". Son artículos muy populares.',
                    emotion: 'helpful',
                    confidence: 0.8
                }
            ],
            help_request: [
                {
                    text: 'Puedo ayudarte a: encontrar artículos, buscar información específica, navegar por categorías, entender temas técnicos, y mucho más. ¿Qué necesitas?',
                    emotion: 'friendly',
                    confidence: 0.95
                }
            ],
            crypto_topic: [
                {
                    text: 'Tenemos excelentes artículos sobre criptomonedas, trading, DeFi, NFTs y más. ¿Te interesa algún aspecto específico como trading o tecnología blockchain?',
                    emotion: 'excited',
                    confidence: 0.9
                }
            ],
            ai_topic: [
                {
                    text: 'La IA es uno de nuestros temas principales. Cubrimos Machine Learning, GPT, redes neuronales, aplicaciones prácticas y mucho más. ¿Qué te gustaría aprender?',
                    emotion: 'helpful',
                    confidence: 0.9
                }
            ],
            thanks: [
                {
                    text: '¡De nada {name}! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?',
                    emotion: 'friendly',
                    confidence: 0.95
                }
            ],
            goodbye: [
                {
                    text: '¡Hasta pronto! No dudes en volver si necesitas ayuda. ¡Feliz lectura!',
                    emotion: 'friendly',
                    confidence: 0.9
                }
            ],
            general: [
                {
                    text: 'Interesante pregunta. Déjame pensar en la mejor respuesta para ti... Puedes explorar nuestras categorías de IA, Blockchain y Tutoriales.',
                    emotion: 'thinking',
                    confidence: 0.6
                }
            ]
        };
    }

    startTypingSimulation() {
        // Simulate assistant activity
        setInterval(() => {
            if (this.isOpen && !this.isTyping && Math.random() > 0.8) {
                this.elements.bubble.classList.add('pulse');
                setTimeout(() => {
                    this.elements.bubble.classList.remove('pulse');
                }, 2000);
            }
        }, 10000);
    }

    trackEvent(eventName, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                assistant: 'NachoBot',
                session_id: this.sessionId,
                ...data
            });
        }

        // Custom event
        const event = new CustomEvent('nachoBot_event', {
            detail: { eventName, data }
        });
        document.dispatchEvent(event);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public API
    openWithMessage(message) {
        this.open();
        setTimeout(() => {
            this.elements.input.value = message;
            this.sendMessage();
        }, 500);
    }

    setPersonality(personality) {
        Object.assign(this.config.personality, personality);
    }

    getConversationStats() {
        return {
            session_id: this.sessionId,
            messages_count: this.messages.length,
            session_duration: Date.now() - this.sessionId.split('_')[1],
            user_profile: this.userProfile
        };
    }
}

// AI Assistant Styles
const assistantStyles = `
<style>
/* Main Assistant Container */
.ai-assistant {
    position: fixed;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Assistant Bubble */
.assistant-bubble {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--primary-color, #8a2be2), var(--secondary-color, #764ba2));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(138, 43, 226, 0.4);
    transition: all 0.3s ease;
    z-index: 10001;
}

.assistant-bubble:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(138, 43, 226, 0.6);
}

.assistant-bubble.active {
    transform: scale(0.8);
    opacity: 0;
    pointer-events: none;
}

.assistant-bubble.pulse {
    animation: pulse 2s infinite;
}

.bubble-avatar {
    font-size: 1.8rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.bubble-status {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 12px;
    height: 12px;
    background: #00ff88;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.8);
}

.notification-dot {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 10px;
    height: 10px;
    background: #ff4444;
    border-radius: 50%;
    animation: notification-pulse 1s infinite;
    display: none;
}

/* Chat Window */
.assistant-chat {
    position: fixed;
    bottom: 100px;
    right: 20px;
    width: 380px;
    height: 600px;
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid var(--primary-color, #8a2be2);
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 10000;
    backdrop-filter: blur(20px);
}

.assistant-chat.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.assistant-chat.minimized {
    height: 60px;
}

/* Chat Header */
.chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, var(--primary-color, #8a2be2), var(--secondary-color, #764ba2));
    border-radius: 18px 18px 0 0;
    color: white;
}

.header-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.assistant-name {
    font-size: 1.1rem;
    font-weight: 600;
}

.assistant-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    opacity: 0.9;
}

.status-dot {
    width: 8px;
    height: 8px;
    background: #00ff88;
    border-radius: 50%;
    animation: status-pulse 2s infinite;
}

.status-dot.online {
    background: #00ff88;
}

.header-actions {
    display: flex;
    gap: 0.5rem;
}

.header-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.header-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

/* Messages Container */
.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.chat-messages::-webkit-scrollbar {
    width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}

.chat-messages::-webkit-scrollbar-thumb {
    background: var(--primary-color, #8a2be2);
    border-radius: 3px;
}

/* Message Styles */
.message {
    display: flex;
    gap: 0.75rem;
    animation: messageSlide 0.3s ease;
}

.message-user {
    flex-direction: row-reverse;
}

.message-content {
    display: flex;
    gap: 0.5rem;
    max-width: 80%;
}

.message-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
}

.message-user .message-avatar {
    background: var(--primary-color, #8a2be2);
    color: white;
}

.message-assistant .message-avatar {
    background: rgba(138, 43, 226, 0.2);
    color: var(--primary-color, #8a2be2);
}

.message-bubble {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 18px;
    padding: 0.75rem 1rem;
    position: relative;
}

.message-user .message-bubble {
    background: var(--primary-color, #8a2be2);
    color: white;
}

.message-text {
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 0.25rem;
    word-wrap: break-word;
}

.message-time {
    font-size: 0.7rem;
    opacity: 0.7;
}

.message-emotion {
    font-size: 0.8rem;
    margin-top: 0.25rem;
    opacity: 0.8;
}

/* Suggestions */
.chat-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0 1rem 1rem;
    background: rgba(255, 255, 255, 0.02);
}

.suggestion-item {
    background: rgba(138, 43, 226, 0.1);
    border: 1px solid rgba(138, 43, 226, 0.3);
    border-radius: 15px;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #ddd;
}

.suggestion-item:hover {
    background: rgba(138, 43, 226, 0.2);
    transform: translateY(-2px);
}

/* Input Area */
.chat-input-container {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0 0 18px 18px;
}

.input-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 25px;
    padding: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.input-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.input-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

#assistant-input {
    flex: 1;
    background: none;
    border: none;
    color: white;
    font-size: 0.9rem;
    outline: none;
    padding: 0.5rem;
}

#assistant-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

#assistant-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.input-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
}

.typing-indicator {
    display: none;
    color: var(--primary-color, #8a2be2);
}

.typing-indicator::after {
    content: '';
    animation: typing-dots 1s infinite;
}

.char-count {
    transition: color 0.3s ease;
}

/* Animations */
@keyframes messageSlide {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

@keyframes status-pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

@keyframes notification-pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.2);
    }
}

@keyframes typing-dots {
    0%, 20% {
        content: '.';
    }
    40% {
        content: '..';
    }
    60%, 100% {
        content: '...';
    }
}

/* Responsive Design */
@media (max-width: 480px) {
    .assistant-chat {
        width: calc(100vw - 40px);
        height: 70vh;
        bottom: 80px;
        right: 20px;
        left: 20px;
    }

    .assistant-bubble {
        bottom: 15px;
        right: 15px;
        width: 50px;
        height: 50px;
    }

    .message-content {
        max-width: 90%;
    }

    .chat-suggestions {
        padding: 0 0.5rem 1rem;
    }

    .suggestion-item {
        font-size: 0.75rem;
        padding: 0.4rem 0.8rem;
    }
}

/* Dark theme support */
body.theme-light .assistant-chat {
    background: rgba(255, 255, 255, 0.95);
    color: var(--text-primary, #1a1a1a);
}

body.theme-light .message-bubble {
    background: rgba(0, 0, 0, 0.05);
    color: var(--text-primary, #1a1a1a);
}

body.theme-light .message-user .message-bubble {
    background: var(--primary-color, #8a2be2);
    color: white;
}

body.theme-light .suggestion-item {
    background: rgba(138, 43, 226, 0.1);
    color: var(--text-primary, #1a1a1a);
}

body.theme-light #assistant-input {
    color: var(--text-primary, #1a1a1a);
}

body.theme-light #assistant-input::placeholder {
    color: rgba(0, 0, 0, 0.5);
}

/* Matrix theme support */
body.theme-matrix .assistant-chat {
    border-color: var(--primary-color, #00ff00);
}

body.theme-matrix .chat-header {
    background: linear-gradient(135deg, #00ff00, #00cc00);
}

body.theme-matrix .message-assistant .message-avatar {
    background: rgba(0, 255, 0, 0.2);
    color: var(--primary-color, #00ff00);
}

body.theme-matrix .suggestion-item {
    background: rgba(0, 255, 0, 0.1);
    border-color: rgba(0, 255, 0, 0.3);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    .assistant-bubble,
    .assistant-chat,
    .message,
    .suggestion-item,
    .header-btn,
    .input-btn {
        transition: none;
        animation: none;
    }

    .status-dot {
        animation: none;
    }
}

/* Focus styles */
.assistant-bubble:focus,
.header-btn:focus,
.input-btn:focus,
.suggestion-item:focus,
#assistant-input:focus {
    outline: 2px solid var(--primary-color, #8a2be2);
    outline-offset: 2px;
}

/* Print styles */
@media print {
    .ai-assistant {
        display: none !important;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', assistantStyles);

// Initialize AI Assistant
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.nachoBot = new AIAssistant();
        });
    } else {
        window.nachoBot = new AIAssistant();
    }

    // Global access
    window.openAssistant = (message) => window.nachoBot?.openWithMessage(message);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAssistant;
}