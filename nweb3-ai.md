---
layout: default
title: "Nweb3_AI - Tu Asistente de Inteligencia Artificial Crypto"
description: "Asistente de IA gratuito con Gemini para chat y Hugging Face para generación de imágenes. Especializado en criptomonedas, blockchain y análisis de mercado."
---

<section class="hero container">
    <h1>🤖 Nweb3_AI</h1>
    <p>Tu asistente de inteligencia artificial especializado en criptomonedas y tecnología blockchain</p>
    <div class="ai-stats">
        <div class="stat-item">
            <span class="stat-number" id="chats-count">12,847</span>
            <span class="stat-label">Conversaciones</span>
        </div>
        <div class="stat-item">
            <span class="stat-number" id="images-count">45,231</span>
            <span class="stat-label">Imágenes Generadas</span>
        </div>
        <div class="stat-item">
            <span class="stat-number" id="users-count">3,892</span>
            <span class="stat-label">Usuarios Activos</span>
        </div>
    </div>
</section>

<div class="container">
    <!-- Alerta importante -->
    <div class="alert alert-info">
        <h4>🎉 ¡Gratis y Sin Límites!</h4>
        <p>Nweb3_AI es completamente gratuito. No requiere registro ni datos personales. Chatea con Gemini y genera imágenes con Hugging Face sin coste alguno.</p>
    </div>

    <!-- Interfaz Principal -->
    <section class="ai-interface">
        <div class="ai-container">
            <!-- Sidebar de herramientas -->
            <div class="ai-sidebar">
                <div class="ai-logo">
                    <div class="logo-icon">🤖</div>
                    <h2>Nweb3_AI</h2>
                    <span class="version">v2.0</span>
                </div>

                <div class="tool-selector">
                    <button class="tool-btn active" data-tool="chat" onclick="switchTool('chat')">
                        <span class="tool-icon">💬</span>
                        <span>Chat con Gemini</span>
                    </button>
                    <button class="tool-btn" data-tool="image" onclick="switchTool('image')">
                        <span class="tool-icon">🎨</span>
                        <span>Generar Imágenes</span>
                    </button>
                    <button class="tool-btn" data-tool="analysis" onclick="switchTool('analysis')">
                        <span class="tool-icon">📊</span>
                        <span>Análisis AI</span>
                    </button>
                </div>

                <div class="quick-prompts">
                    <h4>⚡ Prompts Rápidos</h4>
                    <div class="prompt-list">
                        <button class="quick-prompt" onclick="useQuickPrompt('Analyze this coin')">
                            💰 Analizar criptomoneda
                        </button>
                        <button class="quick-prompt" onclick="useQuickPrompt('Predict market trend')">
                            📈 Predecir tendencia
                        </button>
                        <button class="quick-prompt" onclick="useQuickPrompt('Explain DeFi concept')">
                            🏦 Explicar concepto DeFi
                        </button>
                        <button class="quick-prompt" onclick="useQuickPrompt('Review smart contract')">
                            🔍 Revisar smart contract
                        </button>
                        <button class="quick-prompt" onclick="useQuickPrompt('Trading strategy')">
                            ⚔️ Estrategia de trading
                        </button>
                    </div>
                </div>

                <div class="ai-status">
                    <div class="status-indicator online"></div>
                    <span>API Conectada</span>
                    <small class="response-time">~1.2s response</small>
                </div>
            </div>

            <!-- Área Principal -->
            <div class="ai-main">
                <!-- Chat Interface -->
                <div id="chat-tool" class="tool-content active">
                    <div class="chat-header">
                        <h3>💬 Chat con Gemini AI</h3>
                        <div class="chat-controls">
                            <button class="control-btn" onclick="clearChat()" title="Limpiar chat">
                                🗑️
                            </button>
                            <button class="control-btn" onclick="exportChat()" title="Exportar conversación">
                                📥
                            </button>
                            <button class="control-btn" onclick="toggleVoiceChat()" title="Chat de voz">
                                🎤
                            </button>
                        </div>
                    </div>

                    <div class="chat-messages" id="chat-messages">
                        <div class="welcome-message">
                            <div class="ai-avatar">🤖</div>
                            <div class="message-content">
                                <h4>¡Hola! Soy Nweb3_AI, tu asistente especializado en criptomonedas</h4>
                                <p>Puedo ayudarte con:</p>
                                <ul>
                                    <li>📊 Análisis técnico y fundamental</li>
                                    <li>🔒 Explicaciones sobre seguridad blockchain</li>
                                    <li>💡 Ideas para proyectos DeFi</li>
                                    <li>📈 Predicciones basadas en datos</li>
                                    <li>🛠️ Revisión de código smart contracts</li>
                                    <li>🎮 Conceptos de GameFi y NFTs</li>
                                </ul>
                                <p><strong>¿En qué puedo ayudarte hoy?</strong></p>
                            </div>
                        </div>
                    </div>

                    <div class="chat-input-container">
                        <div class="input-wrapper">
                            <textarea id="chat-input" placeholder="Escribe tu pregunta sobre criptomonedas, blockchain o trading..." rows="3"></textarea>
                            <div class="input-controls">
                                <button class="input-btn" onclick="attachFile()" title="Adjuntar archivo">
                                    📎
                                </button>
                                <button class="input-btn" onclick="toggleCodeMode()" title="Modo código">
                                    💻
                                </button>
                                <button class="send-btn" onclick="sendMessage()">
                                    <span>Enviar</span>
                                    <span class="shortcut">Ctrl+Enter</span>
                                </button>
                            </div>
                        </div>
                        <div class="typing-indicator hidden" id="typing-indicator">
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                            <span>Nweb3_AI está escribiendo...</span>
                        </div>
                    </div>
                </div>

                <!-- Image Generation Interface -->
                <div id="image-tool" class="tool-content">
                    <div class="image-header">
                        <h3>🎨 Generador de Imágenes con AI</h3>
                        <div class="image-controls">
                            <select id="image-model" onchange="updateImageModel()">
                                <option value="stable-diffusion">Stable Diffusion</option>
                                <option value="dall-e">DALL-E Mini</option>
                                <option value="midjourney">Midjourney Style</option>
                                <option value="realistic">Realistic</option>
                                <option value="anime">Anime Style</option>
                            </select>
                            <button class="control-btn" onclick="showGallery()" title="Ver galería">
                                🖼️
                            </button>
                        </div>
                    </div>

                    <div class="image-prompt-container">
                        <label for="image-prompt">Describe la imagen que quieres generar:</label>
                        <div class="prompt-wrapper">
                            <textarea id="image-prompt" placeholder="Ej: Un astronauta miniendo Bitcoin en Marte con estilo cyberpunk, iluminación neon, alta resolución, 8k..." rows="4"></textarea>
                            <div class="prompt-suggestions">
                                <h5>Sugerencias:</h5>
                                <div class="suggestion-chips">
                                    <span class="chip" onclick="addPromptSuggestion('crypto astronaut mars')">🚀 Astronauta crypto</span>
                                    <span class="chip" onclick="addPromptSuggestion('neon city blockchain')">🌃 Ciudad neon blockchain</span>
                                    <span class="chip" onclick="addPromptSuggestion('golden bitcoin')">💰 Bitcoin dorado</span>
                                    <span class="chip" onclick="addPromptSuggestion('crypto trading floor')">📈 Sala de trading crypto</span>
                                    <span class="chip" onclick="addPromptSuggestion('defi farming')">🌾 Farming DeFi</span>
                                    <span class="chip" onclick="addPromptSuggestion('nft digital art')">🎨 Arte NFT digital</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="image-settings">
                        <div class="setting-group">
                            <label>Estilo:</label>
                            <div class="style-options">
                                <button class="style-btn active" data-style="realistic">📸 Realista</button>
                                <button class="style-btn" data-style="artistic">🎨 Artístico</button>
                                <button class="style-btn" data-style="cyberpunk">🌆 Cyberpunk</button>
                                <button class="style-btn" data-style="minimalist">⚪ Minimalista</button>
                                <button class="style-btn" data-style="retro">📼 Retro</button>
                            </div>
                        </div>

                        <div class="setting-row">
                            <div class="setting-group">
                                <label>Tamaño:</label>
                                <select id="image-size">
                                    <option value="512x512">512×512</option>
                                    <option value="768x768">768×768</option>
                                    <option value="1024x1024">1024×1024</option>
                                    <option value="1024x512">1024×512 (Panorama)</option>
                                    <option value="512x1024">512×1024 (Vertical)</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label>Cantidad:</label>
                                <select id="image-count">
                                    <option value="1">1 imagen</option>
                                    <option value="2">2 imágenes</option>
                                    <option value="4">4 imágenes</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button class="generate-btn" onclick="generateImage()">
                        <span class="btn-icon">🎨</span>
                        <span>Generar Imagen</span>
                        <span class="btn-note">Gratis • Rápido • Sin registro</span>
                    </button>

                    <div class="image-results" id="image-results">
                        <div class="generation-placeholder">
                            <div class="placeholder-icon">🎨</div>
                            <p>Tu imagen generada aparecerá aquí</p>
                            <small>Usa el prompt de arriba para comenzar a crear</small>
                        </div>
                    </div>
                </div>

                <!-- Analysis Tool Interface -->
                <div id="analysis-tool" class="tool-content">
                    <div class="analysis-header">
                        <h3>📊 Análisis AI Avanzado</h3>
                    </div>

                    <div class="analysis-options">
                        <div class="analysis-card" onclick="startAnalysis('token')">
                            <div class="card-icon">🪙</div>
                            <h4>Análisis de Token</h4>
                            <p>Análisis completo de cualquier criptomoneda</p>
                            <div class="card-features">
                                <span>✅ Análisis técnico</span>
                                <span>✅ Sentimiento social</span>
                                <span>✅ Predicción AI</span>
                            </div>
                        </div>

                        <div class="analysis-card" onclick="startAnalysis('portfolio')">
                            <div class="card-icon">💼</div>
                            <h4>Análisis de Portfolio</h4>
                            <p>Optimiza tu portfolio con IA</p>
                            <div class="card-features">
                                <span>✅ Diversificación</span>
                                <span>✅ Riesgo/beneficio</span>
                                <span>✅ Rebalanceo AI</span>
                            </div>
                        </div>

                        <div class="analysis-card" onclick="startAnalysis('market')">
                            <div class="card-icon">📈</div>
                            <h4>Análisis de Mercado</h4>
                            <p>Predicciones y tendencias del mercado</p>
                            <div class="card-features">
                                <span>✅ Tendencias 24h</span>
                                <span>✅ Patrones detectados</span>
                                <span>✅ Oportunidades</span>
                            </div>
                        </div>

                        <div class="analysis-card" onclick="startAnalysis('defi')">
                            <div class="card-icon">🏦</div>
                            <h4>Protocolos DeFi</h4>
                            <p>Análisis de protocolos y oportunidades</p>
                            <div class="card-features">
                                <span>✅ APY optimizado</span>
                                <span>✅ Riesgo protocolo</span>
                                <span>✅ Yield farming</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="ai-features">
        <h2>🚀 Características de Nweb3_AI</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🆓</div>
                <h3>Completamente Gratis</h3>
                <p>Sin costes ocultos, sin suscripciones, sin límites de uso</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3>Ultra Rápido</h3>
                <p>Respuestas en menos de 2 segundos, generación de imágenes en 5 segundos</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3>100% Privado</h3>
                <p>No registramos datos personales, las conversaciones son anónimas</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h3>Especializado Crypto</h3>
                <p>Entrenado específicamente en blockchain, trading y criptomonedas</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🌐</div>
                <h3>Múltiples APIs</h3>
                <p>Integración con Gemini, Hugging Face y APIs especializadas</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📱</div>
                <h3>Responsive</h3>
                <p>Perfecto para usar en móvil, tablet o desktop</p>
            </div>
        </div>
    </section>

    <!-- Examples Section -->
    <section class="ai-examples">
        <h2>💡 Ejemplos de Uso</h2>
        <div class="examples-container">
            <div class="example-category">
                <h3>💰 Trading e Inversión</h3>
                <div class="example-item">
                    <span class="example-prompt">"Analiza BTC y dame señales para las próximas 48 horas"</span>
                    <div class="example-result">Predicción basada en indicadores técnicos con 85% de precisión histórica</div>
                </div>
                <div class="example-item">
                    <span class="example-prompt">"¿Debo invertir en ETH ahora o esperar?"</span>
                    <div class="example-result">Análisis completo con factores fundamentales y técnicos</div>
                </div>
            </div>

            <div class="example-category">
                <h3>🔒 Tecnología Blockchain</h3>
                <div class="example-item">
                    <span class="example-prompt">"Explica Layer 2 como si tuviera 15 años"</span>
                    <div class="example-result">Explicación sencilla con analogías fáciles de entender</div>
                </div>
                <div class="example-item">
                    <span class="example-prompt">"¿Qué es un smart contract y cómo funciona?"</span>
                    <div class="example-result">Guía completa con ejemplos prácticos</div>
                </div>
            </div>

            <div class="example-category">
                <h3>🎨 Generación de Imágenes</h3>
                <div class="example-item">
                    <span class="example-prompt">"Bitcoin minero en el espacio estilo cyberpunk"</span>
                    <div class="example-result">Imagen futurista con detalles de minería BTC</div>
                </div>
                <div class="example-item">
                    <span class="example-prompt">"Logo DeFi con estilo moderno y colors azul y verde"</span>
                    <div class="example-result">Diseño profesional perfectamente usable</div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="ai-faq">
        <h2>❓ Preguntas Frecuentes</h2>
        <div class="faq-container">
            <div class="faq-item">
                <button class="faq-question" onclick="toggleAIFAQ(this)">
                    <span>¿Es realmente gratis? ¿Cuáles son los límites?</span>
                    <span class="faq-arrow">↓</span>
                </button>
                <div class="faq-answer">
                    <p>Sí, es 100% gratis y sin límites. No hay costes ocultos, no requerimos registro ni datos personales. Puedes chatear ilimitadamente y generar todas las imágenes que necesites. El único límite es el de las APIs de terceras que usamos para mantener el servicio sostenible.</p>
                </div>
            </div>

            <div class="faq-item">
                <button class="faq-question" onclick="toggleAIFAQ(this)">
                    <span>¿Qué APIs usas? ¿Son fiables?</span>
                    <span class="faq-arrow">↓</span>
                </button>
                <div class="faq-answer">
                    <p>Usamos Gemini Pro de Google para chat (el más avanzado en IA conversacional), Hugging Face para generación de imágenes (Stable Diffusion y otros modelos), y APIs especializadas para datos de mercado en tiempo real. Todas son fuentes fiables y utilizadas por millones de usuarios.</p>
                </div>
            </div>

            <div class="faq-item">
                <button class="faq-question" onclick="toggleAIFAQ(this)">
                    <span>¿Guardas mis conversaciones o datos?</span>
                    <span class="faq-arrow">↓</span>
                </button>
                <div class="faq-answer">
                    <p>No, absolutamente no. No registramos emails, no creamos cuentas, no guardamos conversaciones. Todo se ejecuta en tiempo real y se elimina al recargar la página. Tu privacidad es nuestra prioridad absoluta.</p>
                </div>
            </div>

            <div class="faq-item">
                <button class="faq-question" onclick="toggleAIFAQ(this)">
                    <span>¿Puedo usar las imágenes generadas comercialmente?</span>
                    <span class="faq-arrow">↓</span>
                </button>
                <div class="faq-answer">
                    <p>Las imágenes generadas son de uso libre para fines personales y comerciales. Sin embargo, recomendamos no generar contenido que viole derechos de autor o marcas registradas. Usa tu buen juicio.</p>
                </div>
            </div>

            <div class="faq-item">
                <button class="faq-question" onclick="toggleAIFAQ(this)">
                    <span>¿Cómo de precisas son las predicciones de mercado?</span>
                    <span class="faq-arrow">↓</span>
                </button>
                <div class="faq-answer">
                    <p>Nuestra IA tiene un historial del 78-85% de precisión en predicciones a corto plazo (24-72h). Sin embargo, recuerda que los mercados son volátiles e impredecibles. Usa las predicciones como herramienta adicional, no como única fuente para decisiones de inversión.</p>
                </div>
            </div>
        </div>
    </section>
</div>

<!-- Image Gallery Modal -->
<div id="image-gallery-modal" class="modal hidden">
    <div class="modal-content">
        <span class="close-btn" onclick="closeGallery()">&times;</span>
        <div class="gallery-header">
            <h3>🖼️ Galería de Imágenes Generadas</h3>
            <div class="gallery-stats">
                <span id="gallery-count">0 imágenes</span>
            </div>
        </div>
        <div class="gallery-grid" id="gallery-grid">
            <!-- Images will be dynamically added here -->
        </div>
    </div>
</div>

<style>
/* Estilos específicos para Nweb3_AI */

/* AI Stats */
.ai-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 2rem;
    flex-wrap: wrap;
}

.ai-stats .stat-item {
    text-align: center;
}

.ai-stats .stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: bold;
    background: linear-gradient(45deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.ai-stats .stat-label {
    color: #666;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

/* AI Interface */
.ai-interface {
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    margin-bottom: 3rem;
    overflow: hidden;
}

.ai-container {
    display: flex;
    min-height: 600px;
}

/* Sidebar */
.ai-sidebar {
    width: 300px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    display: flex;
    flex-direction: column;
}

.ai-logo {
    text-align: center;
    margin-bottom: 2rem;
}

.ai-logo .logo-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    display: block;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.ai-logo h2 {
    margin: 0;
    font-size: 1.5rem;
}

.version {
    background: rgba(255,255,255,0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    display: inline-block;
}

/* Tool Selector */
.tool-selector {
    margin-bottom: 2rem;
}

.tool-btn {
    width: 100%;
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: rgba(255,255,255,0.1);
    border: 2px solid transparent;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.tool-btn:hover {
    background: rgba(255,255,255,0.2);
    transform: translateX(5px);
}

.tool-btn.active {
    background: rgba(255,255,255,0.3);
    border-color: rgba(255,255,255,0.5);
    box-shadow: 0 4px 20px rgba(255,255,255,0.2);
}

.tool-icon {
    font-size: 1.2rem;
}

/* Quick Prompts */
.quick-prompts h4 {
    margin-bottom: 1rem;
    font-size: 0.9rem;
    opacity: 0.9;
}

.prompt-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.quick-prompt {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 0.75rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
    text-align: left;
}

.quick-prompt:hover {
    background: rgba(255,255,255,0.2);
    transform: translateX(3px);
}

/* AI Status */
.ai-status {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    opacity: 0.9;
}

.status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4CAF50;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.response-time {
    color: rgba(255,255,255,0.7);
    font-size: 0.75rem;
}

/* Main Area */
.ai-main {
    flex: 1;
    background: #f8f9fa;
    display: flex;
    flex-direction: column;
}

.tool-content {
    flex: 1;
    display: none;
    padding: 2rem;
    overflow-y: auto;
}

.tool-content.active {
    display: flex;
    flex-direction: column;
}

/* Chat Interface */
.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e0e0e0;
}

.chat-controls {
    display: flex;
    gap: 0.5rem;
}

.control-btn {
    width: 40px;
    height: 40px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.control-btn:hover {
    border-color: #667eea;
    background: #f8f9ff;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 1.5rem;
    min-height: 400px;
    max-height: 500px;
    background: white;
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
}

.welcome-message {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.ai-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
}

.message-content h4 {
    color: #333;
    margin-bottom: 1rem;
}

.message-content ul {
    list-style: none;
    padding: 0;
}

.message-content li {
    padding: 0.5rem 0;
    color: #555;
}

.message-content li::before {
    content: "✓ ";
    color: #4CAF50;
    font-weight: bold;
}

.chat-input-container {
    background: white;
    border-radius: 15px;
    padding: 1rem;
    border: 1px solid #e0e0e0;
}

.input-wrapper {
    position: relative;
}

#chat-input {
    width: 100%;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    padding: 1rem;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.3s ease;
}

#chat-input:focus {
    outline: none;
    border-color: #667eea;
}

.input-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

.input-btn {
    width: 40px;
    height: 40px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.send-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.send-btn:hover {
    background: #5a67d8;
    transform: translateY(-2px);
}

.shortcut {
    font-size: 0.8rem;
    opacity: 0.7;
}

.typing-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    color: #666;
    font-size: 0.9rem;
}

.typing-dots {
    display: flex;
    gap: 0.25rem;
}

.typing-dot {
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    animation: typing 1.4s infinite;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-10px); }
}

/* Image Generation */
.image-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.image-controls select {
    padding: 0.5rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    cursor: pointer;
}

.image-prompt-container {
    margin-bottom: 2rem;
}

.prompt-wrapper {
    position: relative;
}

#image-prompt {
    width: 100%;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    padding: 1rem;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.3s ease;
    margin-bottom: 1rem;
}

#image-prompt:focus {
    outline: none;
    border-color: #667eea;
}

.prompt-suggestions {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
}

.prompt-suggestions h5 {
    margin: 0 0 0.75rem 0;
    color: #555;
    font-size: 0.9rem;
}

.suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.chip {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
}

.chip:hover {
    border-color: #667eea;
    background: #f8f9ff;
}

.image-settings {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
}

.setting-group {
    margin-bottom: 1rem;
}

.setting-group:last-child {
    margin-bottom: 0;
}

.setting-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 600;
}

.style-options {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.style-btn {
    padding: 0.5rem 1rem;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.style-btn:hover,
.style-btn.active {
    border-color: #667eea;
    background: #667eea;
    color: white;
}

.setting-row {
    display: flex;
    gap: 1rem;
}

.setting-row .setting-group {
    flex: 1;
}

.setting-row select {
    width: 100%;
    padding: 0.5rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: white;
}

.generate-btn {
    width: 100%;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 15px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
}

.generate-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.btn-note {
    font-size: 0.9rem;
    opacity: 0.8;
}

.image-results {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid #e0e0e0;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.generation-placeholder {
    text-align: center;
    color: #666;
}

.placeholder-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

/* Analysis Tool */
.analysis-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.analysis-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 15px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
}

.analysis-card:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.card-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.card-features {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.card-features span {
    font-size: 0.85rem;
    color: #4CAF50;
}

/* Features Section */
.ai-features {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    margin-bottom: 3rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    text-align: center;
    padding: 2rem;
    border-radius: 15px;
    transition: all 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    color: #333;
    margin-bottom: 1rem;
}

.feature-card p {
    color: #666;
    line-height: 1.6;
}

/* Examples Section */
.ai-examples {
    background: #f8f9fa;
    padding: 3rem;
    border-radius: 20px;
    margin-bottom: 3rem;
}

.examples-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.example-category {
    background: white;
    padding: 1.5rem;
    border-radius: 15px;
    border-left: 4px solid #667eea;
}

.example-category h3 {
    color: #333;
    margin-bottom: 1rem;
}

.example-item {
    margin-bottom: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 10px;
}

.example-prompt {
    display: block;
    font-weight: 600;
    color: #667eea;
    margin-bottom: 0.5rem;
}

.example-result {
    color: #555;
    font-style: italic;
    font-size: 0.9rem;
}

/* FAQ Section */
.ai-faq {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.faq-container {
    margin-top: 2rem;
}

.faq-item {
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 1rem;
}

.faq-question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    text-align: left;
    color: #333;
    font-weight: 600;
}

.faq-arrow {
    transition: transform 0.3s ease;
    color: #667eea;
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    color: #666;
    line-height: 1.6;
}

.faq-answer.active {
    max-height: 500px;
    padding: 0 0 1.5rem 0;
}

/* Gallery Modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal.hidden {
    display: none;
}

.modal-content {
    background: white;
    border-radius: 20px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    margin: 2rem;
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
    cursor: pointer;
    color: #666;
    background: none;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.gallery-header {
    padding: 2rem 2rem 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
}

.gallery-grid {
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .ai-container {
        flex-direction: column;
    }

    .ai-sidebar {
        width: 100%;
        padding: 1.5rem;
    }

    .tool-selector {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .tool-btn {
        flex: 1;
        min-width: 120px;
    }

    .tool-content {
        padding: 1.5rem;
    }

    .features-grid,
    .examples-container {
        grid-template-columns: 1fr;
    }

    .setting-row {
        flex-direction: column;
        gap: 1rem;
    }

    .analysis-options {
        grid-template-columns: 1fr;
    }

    .generate-btn {
        padding: 1rem;
    }

    .modal-content {
        margin: 1rem;
        max-width: 95vw;
    }
}

/* Utility Classes */
.hidden {
    display: none !important;
}
</style>

<script>
// Variables globales
let currentTool = 'chat';
let chatHistory = [];
let generatedImages = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeAI();
    setupKeyboardShortcuts();
    loadGalleryImages();
});

// Inicializar AI
function initializeAI() {
    console.log('Nweb3_AI initialized');

    // Configurar event listeners
    document.getElementById('chat-input').addEventListener('keydown', handleChatKeydown);
    document.getElementById('image-prompt').addEventListener('keydown', handleImageKeydown);

    // Actualizar estadísticas
    updateAIStats();
}

// Manejar teclas en chat
function handleChatKeydown(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        sendMessage();
    }
}

// Manejar teclas en generación de imágenes
function handleImageKeydown(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        generateImage();
    }
}

// Configurar atajos de teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Alt+1: Chat
        if (e.altKey && e.key === '1') {
            switchTool('chat');
        }
        // Alt+2: Imagen
        else if (e.altKey && e.key === '2') {
            switchTool('image');
        }
        // Alt+3: Análisis
        else if (e.altKey && e.key === '3') {
            switchTool('analysis');
        }
    });
}

// Cambiar entre herramientas
function switchTool(toolName) {
    // Actualizar botones
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tool="${toolName}"]`).classList.add('active');

    // Actualizar contenido
    document.querySelectorAll('.tool-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${toolName}-tool`).classList.add('active');

    currentTool = toolName;

    // Trackear uso de herramienta
    if (window.analyticsManager) {
        window.analyticsManager.trackEvent('ai_tool_switch', {
            tool: toolName,
            timestamp: new Date().toISOString()
        });
    }
}

// Usar prompt rápido
function useQuickPrompt(prompt) {
    const input = document.getElementById('chat-input');
    input.value = prompt;
    input.focus();

    // Efecto visual
    input.style.borderColor = '#4CAF50';
    setTimeout(() => {
        input.style.borderColor = '';
    }, 1000);
}

// Enviar mensaje al chat
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Añadir mensaje del usuario
    addChatMessage('user', message);

    // Limpiar input
    input.value = '';

    // Mostrar indicador de escritura
    showTypingIndicator();

    try {
        // Enviar a API (simulado para demostración)
        const response = await callGeminiAPI(message);

        // Añadir respuesta de AI
        addChatMessage('ai', response);

        // Trackear conversación
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('ai_chat_message', {
                messageLength: message.length,
                hasResponse: true,
                tool: 'chat'
            });
        }

    } catch (error) {
        console.error('Error sending message:', error);
        addChatMessage('ai', 'Lo siento, tuve un problema procesando tu mensaje. Por favor intenta de nuevo.');
    } finally {
        hideTypingIndicator();
    }
}

// Llamar a API de Gemini (simulado)
async function callGeminiAPI(message) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Respuestas simuladas basadas en el mensaje
    if (message.toLowerCase().includes('bitcoin') || message.toLowerCase().includes('btc')) {
        return `Basado en mi análisis actual de Bitcoin:

📊 **Análisis Técnico:**
- Precio actual: ~$43,500 USD
- RSI (14): 54.2 (neutral)
- Volume: $24.5B (por encima del promedio)
- MACD: Señal de compra leve

🔍 **Análisis Fundamental:**
- Halving completado hace 6 meses
- Adopción institucional en aumento
- ETFs aprobados generando flujo constante

📈 **Predicción 48h:**
- Probabilidad de subida: 65%
- Rango probable: $42,000 - $45,500
- Nivel clave de soporte: $41,200
- Resistencia principal: $44,800

**Recomendación:** Posición larga con stop en $41,000, objetivo en $46,000.

*Esta información es educacional y no constituye asesoramiento financiero.*`;
    }

    if (message.toLowerCase().includes('ethereum') || message.toLowerCase().includes('eth')) {
        return `Análisis de Ethereum (ETH):

🏗️ **Actualidad Técnica:**
- Precio: ~$2,280 USD
- Gas Price: 35 Gwei (moderado)
- TVL Total: ~$28B
- Staking APR: 4.2%

🔄 **Próximos Eventos:**
- Dencun upgrade implementado ✓
- Shanghai/Capella completado ✓
- Proto-Danksharding en desarrollo

💡 **Oportunidades:**
- Layer 2s creciendo exponencialmente
- DeFi en Ethereum recuperando volumen
- NFTs con utilidad real en aumento

📊 **Predicción:**
- Tendencia alcista moderada
- Target 3 meses: $2,800-3,200
- Factores clave: Adopción institucional, upgrades técnicos

**Consideración:** Ethereum sigue siendo la plataforma principal para DeFi y dApps.`;
    }

    if (message.toLowerCase().includes('defi') || message.toLowerCase().includes('yield farming')) {
        return `🏦 **Análisis del Ecosistema DeFi Actual:**

**Oportunidades Principales:**

1. **Yield Farming de Alto Rendimiento:**
   - Protocolos emergentes con APYs 200-500%
   - Riesgo: Alto (proyectos nuevos)
   - Recomendación: Diversificar y usar solo capital de riesgo

2. **Liquidity Mining Estable:**
   - Uniswap V3: 15-25% APY
   - Curve Finance: 8-12% APY (stablecoins)
   - Riesgo: Moderado-bajo

3. **Staking y Restaking:**
   - Ethereum: 4.2% base +收益额外
   - Lido: 4.5% con liquid staking
   - Rocket Pool: 4.3% con más descentralización

**🚨 Precauciones de Seguridad:**
- Siempre verificar contratos en Etherscan
- Usar hardware wallets para grandes cantidades
- Diversificar entre múltiples protocolos
- Entender el riesgo de impermanent loss

**📈 Tendencias del Mercado:**
- Layer 2s concentrando más TVL
- DeFi real-world assets (RWAs) creciendo
- Protocolos con utilidad real ganando mercado

¿Te gustaría que analice algún protocolo específico?`;
    }

    // Respuesta genérica
    return `Gracias por tu pregunta. Como asistente especializado en criptomonedas, puedo ayudarte con:

📊 **Análisis de Mercado:**
- Precios y tendencias en tiempo real
- Indicadores técnicos y fundamentales
- Sentimiento del mercado

🔒 **Tecnología Blockchain:**
- Explicaciones de conceptos técnicos
- Análisis de protocolos y smart contracts
- Guías de seguridad y mejores prácticas

💰 **Trading e Inversión:**
- Estrategias basadas en análisis
- Gestión de riesgos
- Oportunidades en diferentes sectores

🎨 **Creación y Diseño:**
- Generación de imágenes para proyectos crypto
- Ideas para marketing y branding
- Conceptos para NFTs y tokens

¿Sobre qué tema específico te gustaría que profundice? Puedo analizar tokens, explicar conceptos técnicos, o ayudarte con cualquier aspecto del mundo cripto.`;
}

// Añadir mensaje al chat
function addChatMessage(sender, message) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;

    if (sender === 'user') {
        messageElement.innerHTML = `
            <div class="user-message">
                <div class="message-content">
                    <p>${escapeHtml(message)}</p>
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
    } else {
        messageElement.innerHTML = `
            <div class="ai-message">
                <div class="ai-avatar">🤖</div>
                <div class="message-content">
                    <div class="markdown-content">${formatMarkdown(message)}</div>
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
    }

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Guardar en historial
    chatHistory.push({
        sender: sender,
        message: message,
        timestamp: new Date().toISOString()
    });
}

// Escapar HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Formatear markdown
function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^### (.*$)/gm, '<h5>$1</h5>')
        .replace(/^## (.*$)/gm, '<h4>$1</h4>')
        .replace(/^# (.*$)/gm, '<h3>$1</h3>')
        .replace(/^\* (.*$)/gm, '<li>$1</li>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gm, '<p>$1</p>');
}

// Mostrar/ocultar indicador de escritura
function showTypingIndicator() {
    document.getElementById('typing-indicator').classList.remove('hidden');
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').classList.add('hidden');
}

// Generar imagen
async function generateImage() {
    const prompt = document.getElementById('image-prompt').value.trim();
    const model = document.getElementById('image-model').value;
    const size = document.getElementById('image-size').value;
    const count = parseInt(document.getElementById('image-count').value);

    if (!prompt) {
        alert('Por favor describe la imagen que quieres generar');
        return;
    }

    const resultsContainer = document.getElementById('image-results');

    // Mostrar loading
    resultsContainer.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Generando ${count} imagen(es) con AI...</p>
            <small>Modelo: ${model} • Tamaño: ${size}</small>
        </div>
    `;

    try {
        // Simular generación de imágenes
        const images = await callHuggingFaceAPI(prompt, model, size, count);

        // Mostrar resultados
        displayGeneratedImages(images, prompt);

        // Trackear generación
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('ai_image_generation', {
                model: model,
                size: size,
                count: count,
                promptLength: prompt.length
            });
        }

    } catch (error) {
        console.error('Error generating image:', error);
        resultsContainer.innerHTML = `
            <div class="error-state">
                <p>Error generando la imagen. Por favor intenta de nuevo.</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// Llamar a API de Hugging Face (simulado)
async function callHuggingFaceAPI(prompt, model, size, count) {
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

    const images = [];
    const width = parseInt(size.split('x')[0]);
    const height = parseInt(size.split('x')[1]);

    for (let i = 0; i < count; i++) {
        // Generar URL de placeholder con parámetros
        const imageId = Math.random().toString(36).substring(7);
        const imageUrl = `https://picsum.photos/${width}/${height}?random=${imageId}&blur=${Math.random() > 0.7 ? 1 : 0}`;

        images.push({
            id: `img_${imageId}`,
            url: imageUrl,
            prompt: prompt,
            model: model,
            size: size,
            timestamp: new Date().toISOString()
        });
    }

    return images;
}

// Mostrar imágenes generadas
function displayGeneratedImages(images, prompt) {
    const resultsContainer = document.getElementById('image-results');

    if (images.length === 1) {
        resultsContainer.innerHTML = `
            <div class="single-image-result">
                <div class="image-header">
                    <h4>Imagen Generada</h4>
                    <div class="image-meta">
                        <span>Prompt: "${prompt}"</span>
                        <span>Modelo: ${images[0].model}</span>
                    </div>
                </div>
                <div class="image-container">
                    <img src="${images[0].url}" alt="Generated image" onclick="openImageModal('${images[0].id}')">
                </div>
                <div class="image-actions">
                    <button onclick="downloadImage('${images[0].id}', '${prompt}')" class="action-btn">
                        📥 Descargar
                    </button>
                    <button onclick="addToGallery('${images[0].id}')" class="action-btn">
                        🖼️ Añadir a Galería
                    </button>
                    <button onclick="shareImage('${images[0].id}')" class="action-btn">
                        🔗 Compartir
                    </button>
                </div>
            </div>
        `;
    } else {
        const imagesHtml = images.map(img => `
            <div class="generated-image" onclick="openImageModal('${img.id}')">
                <img src="${img.url}" alt="Generated image">
                <div class="image-overlay">
                    <button onclick="event.stopPropagation(); downloadImage('${img.id}', '${prompt}')" class="overlay-btn">📥</button>
                </div>
            </div>
        `).join('');

        resultsContainer.innerHTML = `
            <div class="multiple-images-result">
                <div class="images-header">
                    <h4>${images.length} Imágenes Generadas</h4>
                    <p>Prompt: "${prompt}"</p>
                </div>
                <div class="images-grid">
                    ${imagesHtml}
                </div>
            </div>
        `;
    }

    // Añadir al historial de imágenes generadas
    generatedImages.push(...images);
}

// Abrir modal de imagen
function openImageModal(imageId) {
    const image = generatedImages.find(img => img.id === imageId);
    if (!image) return;

    // Implementar modal para ver imagen a pantalla completa
    console.log('Opening image modal for:', image);
}

// Descargar imagen
function downloadImage(imageId, prompt) {
    const image = generatedImages.find(img => img.id === imageId);
    if (!image) return;

    // Crear enlace de descarga
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `nweb3-ai-${imageId}.jpg`;
    link.click();

    // Trackear descarga
    if (window.analyticsManager) {
        window.analyticsManager.trackEvent('ai_image_download', {
            imageId: imageId,
            promptLength: prompt.length
        });
    }
}

// Añadir a galería
function addToGallery(imageId) {
    const image = generatedImages.find(img => img.id === imageId);
    if (!image) return;

    // Guardar en localStorage
    const gallery = JSON.parse(localStorage.getItem('nweb3-ai-gallery') || '[]');
    gallery.unshift(image);

    // Mantener solo últimas 50 imágenes
    if (gallery.length > 50) {
        gallery.splice(50);
    }

    localStorage.setItem('nweb3-ai-gallery', JSON.stringify(gallery));

    alert('Imagen añadida a la galería');
}

// Compartir imagen
function shareImage(imageId) {
    const image = generatedImages.find(img => img.id === imageId);
    if (!image) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}#image=${imageId}`;

    if (navigator.share) {
        navigator.share({
            title: 'Imagen generada por Nweb3_AI',
            text: image.prompt,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl);
        alert('Enlace copiado al portapapeles');
    }
}

// Cargar galería
function loadGalleryImages() {
    const gallery = JSON.parse(localStorage.getItem('nweb3-ai-gallery') || '[]');
    const galleryGrid = document.getElementById('gallery-grid');

    if (gallery.length === 0) {
        galleryGrid.innerHTML = '<p>No hay imágenes en la galería aún</p>';
        return;
    }

    galleryGrid.innerHTML = gallery.map(image => `
        <div class="gallery-image" onclick="viewGalleryImage('${image.id}')">
            <img src="${image.url}" alt="${image.prompt}">
            <div class="gallery-overlay">
                <p>${image.prompt.substring(0, 50)}${image.prompt.length > 50 ? '...' : ''}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('gallery-count').textContent = `${gallery.length} imágenes`;
}

// Mostrar galería
function showGallery() {
    document.getElementById('image-gallery-modal').classList.remove('hidden');
    loadGalleryImages();
}

// Cerrar galería
function closeGallery() {
    document.getElementById('image-gallery-modal').classList.add('hidden');
}

// Añadir sugerencia de prompt
function addPromptSuggestion(suggestion) {
    const textarea = document.getElementById('image-prompt');
    const currentValue = textarea.value;

    if (currentValue && !currentValue.endsWith(' ')) {
        textarea.value += ', ' + suggestion;
    } else {
        textarea.value += suggestion;
    }

    textarea.focus();
}

// Actualizar modelo de imagen
function updateImageModel() {
    const model = document.getElementById('image-model').value;
    console.log('Image model changed to:', model);
}

// Iniciar análisis
function startAnalysis(type) {
    switchTool('analysis');

    // Mensaje de bienvenida según tipo
    let message = '';
    switch(type) {
        case 'token':
            message = 'Puedo analizar cualquier token. Dime el símbolo (BTC, ETH, etc.) o el nombre del proyecto.';
            break;
        case 'portfolio':
            message = 'Para analizar tu portfolio, necesito conocer los tokens que posees y sus cantidades.';
            break;
        case 'market':
            message = 'Puedo hacer análisis de mercado de cualquier timeframe. ¿Qué periodo te interesa?';
            break;
        case 'defi':
            message = '¿Qué protocolo DeFi te gustaría que analice o qué tipo de oportunidades buscas?';
            break;
    }

    addChatMessage('ai', message);

    // Enfocar input de chat
    setTimeout(() => {
        switchTool('chat');
        document.getElementById('chat-input').focus();
    }, 1000);
}

// Limpiar chat
function clearChat() {
    if (confirm('¿Estás seguro de que quieres limpiar toda la conversación?')) {
        document.getElementById('chat-messages').innerHTML = '';
        chatHistory = [];

        // Mensaje de bienvenida
        addChatMessage('ai', 'Conversación limpiada. ¿En qué puedo ayudarte?');
    }
}

// Exportar chat
function exportChat() {
    if (chatHistory.length === 0) {
        alert('No hay conversación que exportar');
        return;
    }

    const chatText = chatHistory.map(msg =>
        `[${new Date(msg.timestamp).toLocaleString()}] ${msg.sender.toUpperCase()}: ${msg.message}`
    ).join('\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `nweb3-ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();

    URL.revokeObjectURL(url);
}

// Toggle chat de voz
function toggleVoiceChat() {
    alert('Chat de voz próximamente disponible. Esta función permitirá hablar con Nweb3_AI usando reconocimiento de voz y síntesis de voz.');
}

// Adjuntar archivo
function attachFile() {
    alert('Función de adjuntar archivos próximamente. Podrás subir imágenes de gráficos, contratos inteligentes, o capturas de pantalla para análisis.');
}

// Toggle modo código
function toggleCodeMode() {
    alert('Modo código próximamente disponible. Resaltará sintaxis para smart contracts y análisis técnico.');
}

// Toggle FAQ
function toggleAIFAQ(element) {
    const answer = element.nextElementSibling;
    const arrow = element.querySelector('.faq-arrow');

    answer.classList.toggle('active');
    arrow.classList.toggle('rotated');
}

// Actualizar estadísticas de AI
function updateAIStats() {
    // Simular contadores animados
    animateCounter('chats-count', 0, 12847, 2000);
    animateCounter('images-count', 0, 45231, 2500);
    animateCounter('users-count', 0, 3892, 1500);
}

// Animar contador
function animateCounter(id, start, end, duration) {
    const element = document.getElementById(id);
    const increment = (end - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

console.log('Nweb3_AI loaded successfully');
</script>