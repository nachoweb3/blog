/**
 * Debug Loader - Verifica que todos los scripts se carguen correctamente
 */

console.log('🔍 Debug Loader iniciado');

function checkScriptStatus() {
    console.log('📋 Verificando estado de los scripts...');

    // Lista de scripts que deberían estar cargados
    const requiredScripts = [
        'contrast-fixer',
        'theme-system',
        'social-sharing',
        'table-of-contents',
        'reading-progress',
        'ai-assistant',
        'gamification-system',
        'advanced-analytics-dashboard',
        'analytics-api-simulation'
    ];

    const status = {
        loaded: [],
        missing: [],
        errors: []
    };

    requiredScripts.forEach(scriptName => {
        const globalVar = window[scriptName] ||
                         window[scriptName.replace(/-([a-z])/g, (g, m) => m.toUpperCase())] ||
                         window[scriptName.replace(/-/g, '')];

        if (globalVar) {
            status.loaded.push(scriptName);
            console.log(`✅ ${scriptName}: Cargado correctamente`);
        } else {
            status.missing.push(scriptName);
            console.error(`❌ ${scriptName}: NO SE CARGÓ`);
        }
    });

    // Mostrar resumen
    console.log('📊 Resumen de carga:');
    console.log(`✅ Scripts cargados: ${status.loaded.length}`);
    console.log(`❌ Scripts faltantes: ${status.missing.length}`);

    if (status.missing.length > 0) {
        console.error('⚠️ Scripts que no se cargaron:', status.missing);
        showMissingScriptsNotification(status.missing);
    } else {
        console.log('🎉 ¡Todos los scripts están cargados!');
        showSuccessNotification();
    }

    return status;
}

function showMissingScriptsNotification(missing) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff4444, #cc0000);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(255, 68, 68, 0.5);
        z-index: 999999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 400px;
        text-align: center;
    `;

    notification.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>⚠️ Error de carga</strong>
        </div>
        <div>No se pudieron cargar ${missing.length} scripts:</div>
        <ul style="margin: 1rem 0; padding-left: 1.5rem; text-align: left;">
            ${missing.map(script => `<li>${script}.js</li>`).join('')}
        </ul>
        <div style="margin-top: 1rem;">
            <button onclick="this.parentElement.parentElement.remove(); location.reload();"
                    style="background: white; color: #ff4444; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-weight: bold;">
                Reintentar carga
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-eliminar después de 10 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00ff88, #00cc6a);
        color: #000;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 255, 136, 0.5);
        z-index: 999999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">🎉</span>
            <span>¡Todos los sistemas listos!</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function forceLoadMissingScripts() {
    console.log('🔄 Forzando carga de scripts faltantes...');

    const scriptsToForceLoad = [
        { name: 'ai-assistant', path: '/assets/js/ai-assistant.js' },
        { name: 'gamification-system', path: '/assets/js/gamification-system.js' }
    ];

    scriptsToForceLoad.forEach(script => {
        console.log(`📦 Cargando ${script.name}...`);

        const scriptElement = document.createElement('script');
        scriptElement.src = script.path;
        scriptElement.onload = () => {
            console.log(`✅ ${script.name} cargado forzadamente`);
        };
        scriptElement.onerror = () => {
            console.error(`❌ Error cargando ${script.name}`);
        };
        document.head.appendChild(scriptElement);
    });
}

// Forzar carga inmediata
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que todos los scripts intenten cargar
    setTimeout(checkScriptStatus, 2000);

    // Si después de 5 segundos aún faltan scripts, forzar carga
    setTimeout(() => {
        const status = checkScriptStatus();
        if (status.missing.length > 0) {
            forceLoadMissingScripts();
        }
    }, 5000);
});

// También verificar después de que la página cargue completamente
window.addEventListener('load', () => {
    setTimeout(checkScriptStatus, 1000);
});

// Exponer función global para verificar estado
window.checkAllScripts = checkScriptStatus;

console.log('✅ Debug Loader listo');