# 🤖 Cómo Funciona el Generador de Artículos con IA

## 📋 Explicación Simple

El script se conecta a **Groq** (una API gratuita de IA) y usa el modelo **Llama 3.1 70B** (muy potente) para escribir artículos completos automáticamente.

---
uso:

python -X utf8 generate-post.py --topic "¿Que es un Rugpull?" --category blockchain 

..............

## 🚀 Tutorial Paso a Paso

### Paso 1: Configurar (Solo 1 vez)

**1. Abre una terminal en la carpeta del blog:**
```bash
cd C:\Users\Usuario\Desktop\blog\scripts
```

**2. Instala las dependencias:**
```bash
pip install groq
```

**3. Obtén tu API Key GRATIS:**

- Ve a: https://console.groq.com
- Haz click en "Sign Up" (registro gratis)
- Usa tu email (no requiere tarjeta de crédito)
- Una vez dentro, ve a la sección **"API Keys"**
- Click en **"Create API Key"**
- Copia la key (algo como: `gsk_xxxxxxxxxxxxxxxxxxx`)

**4. Configura la key en tu computadora:**

En Windows CMD:
```cmd
set GROQ_API_KEY=gsk_tu_key_aqui
```

O si usas PowerShell:
```powershell
$env:GROQ_API_KEY="gsk_tu_key_aqui"
```

**Para que sea permanente (no tener que hacerlo cada vez):**
1. Click derecho en "Este equipo" → Propiedades
2. Configuración avanzada del sistema
3. Variables de entorno
4. Nueva variable de usuario:
   - Nombre: `GROQ_API_KEY`
   - Valor: `gsk_tu_key_aqui`

---

### Paso 2: Generar Artículos (Súper Fácil)

**Sintaxis básica:**
```bash
python generate-post.py --topic "TEMA DEL ARTÍCULO" --category CATEGORÍA
```

**Ejemplos reales:**

**🤖 Artículo sobre IA:**
```bash
python generate-post.py --topic "Claude 3.5 vs GPT-4: ¿Cuál es mejor?" --category ia
```

**⛓️ Artículo sobre Blockchain:**
```bash
python generate-post.py --topic "Cómo comprar Bitcoin de forma segura en 2025" --category blockchain
```

**📚 Tutorial:**
```bash
python generate-post.py --topic "Python desde cero: Guía para principiantes" --category tutoriales
```

---

### Paso 3: ¿Qué Pasa Cuando lo Ejecutas?

El script hace esto automáticamente:

**1. Genera metadata (3-5 segundos):**
```
🤖 Generando metadata del artículo...
✅ Título: "Claude 3.5 vs GPT-4: La batalla de los LLMs en 2025"
✅ Tags: claude, gpt-4, comparacion, llm, ia-generativa
✅ Excerpt: "Comparativa detallada entre Claude 3.5 y GPT-4..."
```

**2. Genera el contenido (10-15 segundos):**
```
🤖 Generando contenido del artículo...
✅ Artículo generado (1,234 palabras)
```

**3. Crea el archivo:**
```
✅ Archivo creado: _posts/2025-11-16-claude-vs-gpt4-batalla-llms.md

💡 Sugerencias de imágenes:
- artificial intelligence comparison
- AI models technology
- language models LLM
```

**4. Resultado:**
```markdown
---
layout: post
title: "Claude 3.5 vs GPT-4: La batalla de los LLMs en 2025"
date: 2025-11-16 14:30:00 -0500
categories: [ia]
tags: [claude, gpt-4, comparacion, llm, ia-generativa]
excerpt: "Comparativa detallada entre Claude 3.5 y GPT-4. Descubre cuál es el mejor modelo de lenguaje para tus necesidades en 2025."
---

## Introducción

En el mundo de la inteligencia artificial, dos gigantes dominan...

[... artículo completo de 800-1200 palabras ...]

## Conclusión

Ambos modelos tienen sus fortalezas...
```

---

## 🎯 Parámetros Disponibles

```bash
python generate-post.py \
  --topic "Tu tema aquí" \           # REQUERIDO: Tema del artículo
  --category ia \                     # REQUERIDO: ia, blockchain, o tutoriales
  --date 2025-11-20 \                # OPCIONAL: Fecha personalizada
  --api-key gsk_xxx                  # OPCIONAL: Si no configuraste variable
```

---

## 💡 Ejemplos de Topics Buenos vs Malos

### ✅ BUENOS (específicos):
- "Cómo usar ChatGPT para programar en Python"
- "Binance vs Coinbase: ¿Cuál exchange es mejor?"
- "Tutorial: Configurar Node.js en Windows 11"
- "Las mejores wallets de Bitcoin en 2025"

### ❌ MALOS (muy generales):
- "IA" (demasiado amplio)
- "Criptomonedas" (muy genérico)
- "Tutorial" (falta especificar qué)

---

## 🔧 Cómo Funciona Técnicamente

**1. Tu comando:**
```bash
python generate-post.py --topic "Web3 para principiantes" --category blockchain
```

**2. El script prepara un prompt especializado:**
```python
prompt = """
Eres un experto en blockchain y criptomonedas.
Escribe un artículo viral y educativo sobre: "Web3 para principiantes"

Estilo:
- Tono casual pero profesional
- Historias y ejemplos reales
- Secciones con ## headers
- 800-1200 palabras

Estructura:
1. Intro pegajosa
2. ¿Qué es Web3?
3. Diferencias con Web2
4. Casos de uso reales
5. Cómo empezar
6. Conclusión
"""
```

**3. Envía el prompt a Groq API:**
```python
response = groq_client.chat.completions.create(
    model="llama-3.1-70b-versatile",  # Modelo de Meta, muy potente
    messages=[{"role": "user", "content": prompt}],
    temperature=0.7  # Creatividad controlada
)
```

**4. Recibe la respuesta de la IA:**
```
"## Introducción\n\nWeb3 está revolucionando internet...\n\n## ¿Qué es Web3?\n\nWeb3 es la evolución..."
```

**5. Crea el archivo .md con front matter:**
```python
filename = f"_posts/2025-11-16-web3-para-principiantes.md"
content = f"""---
layout: post
title: "{titulo}"
date: {fecha}
categories: [blockchain]
tags: {tags}
excerpt: "{excerpt}"
---

{contenido_generado}
"""
```

**6. Guarda el archivo:**
```python
with open(filename, 'w') as f:
    f.write(content)
```

---

## 📊 Límites de la API Gratuita

**Groq Free Tier:**
- ✅ **30 requests por minuto** (más que suficiente)
- ✅ **6,000 tokens por minuto**
- ✅ **Unlimited API calls** (sin límite diario)
- ✅ **Sin tarjeta de crédito requerida**

**En práctica:**
- Puedes generar **30 artículos por minuto**
- Suficiente para generar **1,000+ artículos al día**

---

## 🎨 Personalización del Script

### Cambiar el estilo de escritura:

Abre `scripts/generate-post.py` y modifica:

```python
PROMPT_TEMPLATES = {
    'ia': """
    Eres un experto en IA que escribe de forma SÚPER CASUAL y divertida.
    Usa emojis, memes, y referencias a cultura pop.
    Escribe como si hablaras con un amigo...
    """
}
```

### Cambiar el largo del artículo:

```python
# Busca en el código:
temperature=0.7  # Creatividad (0.1 = conservador, 1.0 = muy creativo)
max_tokens=2000  # Largo máximo (1500-2000 palabras)
```

---

## 🚨 Consejos Importantes

**1. SIEMPRE revisa el contenido:**
```bash
# Después de generar
code _posts/2025-11-16-tu-articulo.md  # Abre en VS Code
```
- La IA puede inventar datos
- Verifica que los ejemplos sean correctos
- Ajusta el tono si es necesario

**2. Agrega imágenes:**
```yaml
# En el front matter del post, agrega:
image: "https://images.unsplash.com/photo-xxxxx?w=800&h=600&fit=crop"
```

**3. Workflow recomendado:**
```bash
# 1. Generar
python generate-post.py --topic "Tu tema" --category ia

# 2. Revisar y editar
code _posts/2025-11-16-tu-tema.md

# 3. Agregar imagen (busca en unsplash.com)

# 4. Previsualizar (opcional, si tienes Jekyll instalado)
bundle exec jekyll serve

# 5. Publicar
git add _posts/
git commit -m "Add: nuevo post sobre [tema]"
git push
```

---

## ❓ Problemas Comunes

**Error: "No module named 'groq'"**
```bash
# Solución:
pip install groq
```

**Error: "No API key provided"**
```bash
# Solución: Configura la variable de entorno
set GROQ_API_KEY=gsk_tu_key_aqui
```

**Error: "Rate limit exceeded"**
```bash
# Solución: Espera 1 minuto, el límite se resetea
```

**El artículo es muy corto o malo:**
```bash
# Usa un topic más específico
# ❌ Malo: "IA"
# ✅ Bueno: "Cómo usar Claude AI para escribir código Python"
```

---

## 🎯 Prueba Rápida

Prueba ahora mismo con este comando:

```bash
cd C:\Users\Usuario\Desktop\blog\scripts
python generate-post.py --topic "Los 5 mejores exchanges de criptomonedas en 2025" --category blockchain
```

En 15 segundos tendrás un artículo completo listo para publicar! 🚀

---

## 📚 Comandos Útiles Rápidos

```bash
# IA - Comparativa de modelos
python generate-post.py --topic "GPT-4 vs Claude vs Gemini: Comparativa completa 2025" --category ia

# IA - Tutorial práctico
python generate-post.py --topic "Cómo usar ChatGPT para automatizar tareas diarias" --category ia

# Blockchain - Guía para principiantes
python generate-post.py --topic "Cómo comprar tu primera criptomoneda paso a paso" --category blockchain

# Blockchain - DeFi
python generate-post.py --topic "Qué es DeFi y cómo empezar a ganar intereses con criptomonedas" --category blockchain

# Tutorial - Programación
python generate-post.py --topic "Python para Data Science: Guía completa desde cero" --category tutoriales

# Tutorial - Herramientas
python generate-post.py --topic "Git y GitHub: Tutorial para principiantes 2025" --category tutoriales
```

---

## 🎓 Recursos Adicionales

- **Groq Console**: https://console.groq.com
- **Groq Documentation**: https://console.groq.com/docs
- **Unsplash (imágenes gratis)**: https://unsplash.com
- **Jekyll Docs**: https://jekyllrb.com/docs/

---

## 📞 Soporte

Si tienes problemas:
1. Lee la sección "Problemas Comunes" arriba
2. Revisa el archivo `scripts/README.md`
3. Contacta en Twitter: [@nachoweb3__x](https://twitter.com/nachoweb3__x)

---

**Última actualización**: Noviembre 2025
**Autor**: NachoWeb3
**Blog**: https://nachoweb3.github.io/blog/
