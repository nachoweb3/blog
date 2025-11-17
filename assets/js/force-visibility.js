/**
 * Force Visibility - Asegura que las mejoras sean visibles
 */

console.log('🔧 Force Visibility iniciado');

// Función para forzar que los elementos sean visibles
function forceVisibility() {
    console.log('👀 Forzando visibilidad de elementos...');

    // 1. Forzar que NachoBot sea visible
    const nachoBot = document.getElementById('ai-assistant');
    if (nachoBot) {
        console.log('🤖 NachoBot encontrado, forzando visibilidad...');
        nachoBot.style.display = 'block';
        nachoBot.style.zIndex = '99999';

        // Asegurar que el bubble esté visible
        const bubble = document.getElementById('assistant-bubble');
        if (bubble) {
            bubble.style.display = 'flex';
            bubble.style.visibility = 'visible';
            bubble.style.opacity = '1';
            bubble.style.zIndex = '99999';
        }
    } else {
        console.error('❌ NachoBot no encontrado');
        // Crear NachoBot si no existe
        createNachoBot();
    }

    // 2. Forzar que la gamificación sea visible
    const gamification = document.querySelector('.gamification-points');
    if (gamification) {
        console.log('🏆 Sistema de gamificación encontrado, forzando visibilidad...');
        gamification.style.display = 'block';
        gamification.style.visibility = 'visible';
        gamification.style.opacity = '1';
        gamification.style.zIndex = '99998';
    } else {
        console.error('❌ Gamificación no encontrada');
        // Crear sistema de gamificación si no existe
        createGamification();
    }

    // 3. Forzar que los botones sociales sean visibles
    const socialButtons = document.querySelectorAll('.share-btn, .social-sharing');
    if (socialButtons.length > 0) {
        console.log(`📱 Encontrados ${socialButtons.length} botones sociales, forzando visibilidad...`);
        socialButtons.forEach((btn, index) => {
            btn.style.display = 'flex';
            btn.style.visibility = 'visible';
            btn.style.opacity = '1';
            btn.style.zIndex = '1000' + index;
        });
    }

    // 4. Forzar que la barra de progreso sea visible
    const progressBar = document.querySelector('.reading-progress-bar');
    if (progressBar) {
        console.log('📊 Barra de progreso encontrada, forzando visibilidad...');
        progressBar.style.display = 'block';
        progressBar.style.visibility = 'visible';
        progressBar.style.opacity = '1';
        progressBar.style.zIndex = '9997';
    }

    // 5. Forzar que la tabla de contenidos sea visible en artículos largos
    const toc = document.querySelector('.table-of-contents');
    if (toc) {
        console.log('📋 Tabla de contenidos encontrada, forzando visibilidad...');
        toc.style.display = 'block';
        toc.style.visibility = 'visible';
        toc.style.opacity = '1';
        toc.style.zIndex = '9996';
    }

    // 6. Añadir botones flotantes de acceso rápido si no existen
    addQuickAccessButtons();

    // 7. Mostrar notificación de características
    showFeaturesNotification();
}

function createNachoBot() {
    console.log('🤖 Creando NachoBot desde cero...');

    const nachoBot = document.createElement('div');
    nachoBot.id = 'ai-assistant';
    nachoBot.innerHTML = `
        <div class="assistant-bubble" id="assistant-bubble">
            <div class="bubble-avatar">🤖</div>
            <div class="bubble-status"></div>
        </div>
        <div class="assistant-chat" id="assistant-chat" style="display: block;">
            <div class="chat-header">
                <div class="header-info">
                    <div class="assistant-name">NachoBot</div>
                    <div class="assistant-status">
                        <span class="status-dot online"></span>
                        <span class="status-text">En línea</span>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="header-btn" onclick="this.parentElement.parentElement.parentElement.classList.toggle('minimized');">
                        ➖
                    </button>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            <div class="chat-input-container">
                <div class="input-wrapper">
                    <input type="text" id="assistant-input" placeholder="Escribe tu pregunta..." />
                    <button class="input-btn" onclick="sendQuickMessage()">
                        📤
                    </button>
                </div>
            </div>
        </div>
    `;

    // Estilos básicos
    const styles = `
        <style>
        .ai-assistant {
            position: fixed;
            z-index: 99999;
        }
        .assistant-bubble {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #8a2be2, #764ba2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(138, 43, 226, 0.4);
            transition: all 0.3s ease;
        }
        .assistant-chat {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #8a2be2;
            border-radius: 15px;
            display: none;
            flex-direction: column;
            z-index: 99998;
        }
        .assistant-chat.minimized {
            height: 60px;
        }
        .chat-header {
            background: linear-gradient(135deg, #8a2be2, #764ba2);
            padding: 1rem;
            border-radius: 13px 13px 0 0;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .chat-messages {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
        }
        .chat-input-container {
            padding: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .input-wrapper {
            display: flex;
            gap: 0.5rem;
        }
        #assistant-input {
            flex: 1;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            color: white;
            font-size: 0.9rem;
        }
        .input-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.appendChild(nachoBot);

    // Event listeners
    document.getElementById('assistant-bubble').addEventListener('click', () => {
        const chat = document.getElementById('assistant-chat');
        chat.style.display = chat.style.display === 'block' ? 'none' : 'block';
    });

    // Mensaje de bienvenida
    setTimeout(() => {
        addBotMessage('¡Hola! Soy NachoBot, tu asistente IA. ¿En qué puedo ayudarte? 🚀');
    }, 1000);
}

function createGamification() {
    console.log('🏆 Creando sistema de gamificación...');

    const gamification = document.createElement('div');
    gamification.className = 'gamification-points';
    gamification.innerHTML = `
        <div class="points-header">
            <div class="points-icon">⭐</div>
            <div class="points-info">
                <div class="points-amount">0</div>
                <div class="points-label">Puntos</div>
            </div>
        </div>
        <div class="streak-info">
            <span class="streak-icon">🔥</span>
            <span class="streak-text">Racha: 1 día</span>
        </div>
    `;

    // Estilos
    const styles = `
        <style>
        .gamification-points {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #8a2be2;
            border-radius: 15px;
            padding: 1rem;
            backdrop-filter: blur(10px);
            z-index: 99998;
            min-width: 200px;
            box-shadow: 0 4px 20px rgba(138, 43, 226, 0.3);
        }
        .points-header {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .points-icon {
            font-size: 1.5rem;
        }
        .points-amount {
            font-size: 1.8rem;
            font-weight: 700;
            color: #8a2be2;
        }
        .points-label {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
        }
        .streak-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.8);
        }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.appendChild(gamification);
}

function addQuickAccessButtons() {
    // Verificar si ya existen botones de acceso rápido
    if (document.querySelector('.quick-access-buttons')) {
        return;
    }

    console.log('🚀 Creando botones de acceso rápido...');

    const quickAccess = document.createElement('div');
    quickAccess.className = 'quick-access-buttons';
    quickAccess.innerHTML = `
        <button onclick="toggleAssistant()" class="quick-btn" title="Asistente IA (Ctrl+Shift+A)">
            <span class="btn-icon">🤖</span>
        </button>
        <button onclick="toggleGamification()" class="quick-btn" title="Logros (Ctrl+Shift+G)">
            <span class="btn-icon">🏆</span>
        </button>
        <button onclick="toggleSocialShare()" class="quick-btn" title="Compartir">
            <span class="btn-icon">📤</span>
        </button>
        <button onclick="toggleTheme()" class="quick-btn" title="Cambiar tema">
            <span class="btn-icon">🎨</span>
        </button>
        <button onclick="toggleAnalytics()" class="quick-btn" title="Analytics">
            <span class="btn-icon">📊</span>
        </button>
    `;

    // Estilos
    const styles = `
        <style>
        .quick-access-buttons {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 1rem;
            z-index: 99997;
            background: rgba(0, 0, 0, 0.9);
            padding: 0.75rem;
            border-radius: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .quick-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 0.75rem;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .quick-btn:hover {
            background: rgba(138, 43, 226, 0.3);
            transform: translateY(-2px);
        }
        .quick-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(138, 43, 226, 0.2);
            border-radius: 50%;
            transform: scale(0);
            transition: transform 0.3s ease;
        }
        .quick-btn:hover::before {
            transform: scale(1);
        }
        .btn-icon {
            position: relative;
            z-index: 1;
        }
        @media (max-width: 768px) {
            .quick-access-buttons {
                bottom: 10px;
                padding: 0.5rem;
                gap: 0.5rem;
            }
            .quick-btn {
                width: 40px;
                height: 40px;
                font-size: 1rem;
            }
        }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.appendChild(quickAccess);
}

function addBotMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message message-assistant';
        messageEl.innerHTML = `
            <div class="message-content">
                <div class="message-avatar">🤖</div>
                <div class="message-bubble">
                    <div class="message-text">${message}</div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function sendQuickMessage() {
    const input = document.getElementById('assistant-input');
    if (input && input.value.trim()) {
        addBotMessage(`Procesando: "${input.value}"`);
        // Simular respuesta
        setTimeout(() => {
            addBotMessage('¡Entendido! Estoy procesando tu solicitud... 🚀');
            input.value = '';
        }, 1000);
    }
}

function toggleAssistant() {
    const chat = document.getElementById('assistant-chat');
    if (chat) {
        chat.style.display = chat.style.display === 'block' ? 'none' : 'block';
    }
}

function toggleGamification() {
    const achievements = document.querySelector('.achievements-panel');
    if (achievements) {
        achievements.style.display = achievements.style.display === 'block' ? 'none' : 'block';
    } else {
        showNotification('Panel de logros en construcción...');
    }
}

function toggleSocialShare() {
    // Buscar y activar botones de compartir
    const shareButtons = document.querySelectorAll('.share-btn');
    if (shareButtons.length > 0) {
        const firstShare = shareButtons[0];
        if (firstShare) {
            firstShare.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Efecto de parpadeo
            firstShare.style.animation = 'pulse 0.5s ease 2';
            setTimeout(() => {
                firstShare.style.animation = '';
            }, 1000);
        }
    } else {
        showNotification('Los botones de compartir aparecerán en cada artículo');
    }
}

function toggleTheme() {
    if (window.themeSystem) {
        // Ciclar entre temas
        const themes = ['dark', 'light', 'matrix'];
        const currentTheme = window.getCurrentTheme?.() || 'dark';
        const currentIndex = themes.indexOf(currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        window.setTheme?.(nextTheme);
    } else {
        // Alternar entre modo oscuro y claro
        document.body.classList.toggle('light-theme');
    }
}

function toggleAnalytics() {
    window.open('/analytics/', '_blank');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #8a2be2, #764ba2);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(138, 43, 226, 0.4);
        z-index: 999999;
        font-size: 14px;
        max-width: 300px;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animación de entrada
const slideInStyles = `
<style>
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', slideInStyles);

// Forzar visibilidad después de que la página cargue
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Página cargada, forzando visibilidad...');
    setTimeout(forceVisibility, 1000);
});

// También verificar después de carga completa
window.addEventListener('load', () => {
    console.log('📄 Ventana cargada completamente, verificando visibilidad...');
    setTimeout(forceVisibility, 2000);
});

// Exponer funciones globales
window.forceVisibility = forceVisibility;
window.checkAllScripts = checkScriptStatus;
window.toggleAssistant = toggleAssistant;
window.toggleGamification = toggleGamification;
window.toggleSocialShare = toggleSocialShare;
window.toggleTheme = toggleTheme;
window.toggleAnalytics = toggleAnalytics;

console.log('✅ Force Visibility listo');