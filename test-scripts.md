---
layout: default
title: Test de Scripts
---

<div id="test-container">
    <h1>🔧 Página de Diagnóstico</h1>
    <div id="test-results">
        <h2>Resultados de la prueba:</h2>
        <div id="script-status"></div>
        <div id="element-status"></div>
    </div>

    <div id="manual-controls">
        <h2>Controles Manuales:</h2>
        <button onclick="forceVisibility()">Forzar Visibilidad</button>
        <button onclick="checkAllScripts()">Verificar Scripts</button>
        <button onclick="createTestElements()">Crear Elementos de Prueba</button>
    </div>

    <div id="test-area">
        <!-- Aquí se crearán los elementos de prueba -->
    </div>
</div>

<script>
console.log('🚀 Página de prueba iniciada');

// Función para verificar scripts
function checkScripts() {
    const results = document.getElementById('script-status');
    const scripts = [
        'force-visibility',
        'ai-assistant',
        'gamification-system',
        'theme-system',
        'contrast-fixer'
    ];

    let html = '<h3>Estado de Scripts:</h3><ul>';

    scripts.forEach(script => {
        if (window[script] || window[script.replace(/-([a-z])/g, (g, m) => m.toUpperCase())]) {
            html += `<li>✅ ${script}: Cargado</li>`;
        } else {
            html += `<li>❌ ${script}: No encontrado</li>`;
        }
    });

    html += '</ul>';
    results.innerHTML = html;
}

// Función para verificar elementos
function checkElements() {
    const elementResults = document.getElementById('element-status');
    const elements = [
        'ai-assistant',
        'assistant-bubble',
        'assistant-chat',
        '.gamification-points',
        '.quick-access-buttons'
    ];

    let html = '<h3>Elementos en la página:</h3><ul>';

    elements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            html += `<li>✅ ${selector}: Encontrado</li>`;
        } else {
            html += `<li>❌ ${selector}: No encontrado</li>`;
        }
    });

    html += '</ul>';
    elementResults.innerHTML = html;
}

// Crear elementos de prueba
function createTestElements() {
    const testArea = document.getElementById('test-area');

    // Crear bot de prueba
    const testBot = document.createElement('div');
    testBot.id = 'test-ai-assistant';
    testBot.style.cssText = `
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
        color: white;
        font-size: 24px;
        cursor: pointer;
        z-index: 99999;
    `;
    testBot.innerHTML = '🤖';
    testBot.onclick = () => alert('Botón de prueba funciona!');
    testArea.appendChild(testBot);

    // Crear gamificación de prueba
    const testGamification = document.createElement('div');
    testGamification.className = 'test-gamification';
    testGamification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid #8a2be2;
        border-radius: 15px;
        padding: 1rem;
        color: white;
        z-index: 99998;
    `;
    testGamification.innerHTML = '⭐ Puntos: 0<br>🔥 Racha: 1 día';
    testArea.appendChild(testGamification);

    alert('Elementos de prueba creados');
}

// Verificar cada 2 segundos
setInterval(() => {
    checkScripts();
    checkElements();
}, 2000);

// Verificación inicial
checkScripts();
checkElements();

console.log('✅ Página de prueba lista');
</script>

<style>
#test-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 15px;
    margin-top: 2rem;
}

#test-results {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 10px;
    margin: 1rem 0;
}

#manual-controls {
    margin: 2rem 0;
}

#manual-controls button {
    background: #8a2be2;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    margin: 0.5rem;
    cursor: pointer;
    font-size: 16px;
}

#manual-controls button:hover {
    background: #764ba2;
}

#test-area {
    min-height: 200px;
    border: 2px dashed #8a2be2;
    border-radius: 10px;
    padding: 1rem;
    margin-top: 2rem;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    padding: 0.5rem;
    margin: 0.25rem 0;
    border-radius: 5px;
}

li:nth-child(even) {
    background: rgba(255, 255, 255, 0.05);
}
</style>