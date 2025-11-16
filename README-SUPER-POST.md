# 🚀 SUPER POST - Generador Automático de Artículos

Script ultra-simplificado para crear artículos de blog con IA, imágenes y publicación automática.

## ✨ Características

- 🤖 **Generación de texto con IA** usando Groq API (gratis)
- 🎨 **Imágenes automáticas** generadas con IA gratuita (Pollinations)
- 📤 **Publicación automática** en GitHub
- 🚫 **Sin dependencias** - no necesitas instalar nada
- 📱 **Fácil de usar** - un solo comando

## 🚀 Uso Rápido

```bash
python3 scripts/super-post.py --topic "El futuro de las criptomonedas" --category blockchain
```

## 📋 Categorías Disponibles

- `ia` - Inteligencia Artificial
- `blockchain` - Blockchain y Criptomonedas
- `tutoriales` - Tutoriales y Guías

## 🔑 Configuración

1. **Obtener API Key de Groq (gratis):**
   - Ve a https://console.groq.com
   - Crea una cuenta gratuita
   - Genera una API key

2. **Configurar la API key:**
   ```bash
   # Editar el archivo
   nano scripts/.env

   # Agregar tu key:
   GROQ_API_KEY=tu_key_aqui
   ```

## 📝 Ejemplos de Uso

```bash
# Artículo sobre IA
python3 scripts/super-post.py --topic "GPT-4 vs Claude 3" --category ia

# Artículo sobre blockchain
python3 scripts/super-post.py --topic "Staking de Ethereum 2025" --category blockchain

# Tutorial
python3 scripts/super-post.py --topic "Instalar Python en Windows" --category tutoriales
```

## 🎨 ¿Cómo funciona?

1. **Texto:** Genera artículos de 800-1200 palabras con IA
2. **Imágenes:** Crea imágenes relevantes automáticamente (gratis)
3. **SEO:** Optimiza títulos, descriptions y tags
4. **Publicación:** Sube todo a GitHub con un solo comando

## 📁 Archivos Generados

- 📄 `_posts/2025-11-16-titulo-del-articulo.md`
- 🖼️ Imágenes incluidas en el front matter
- 🏷️ Tags automáticos para SEO
- 📤 Commit automático a GitHub

## 🔧 ¿Problemas Comunes?

**"Error: API key no encontrada"**
- Configura tu API key en `scripts/.env`
- Obtén una key gratuita en https://console.groq.com

**"Error: Permiso denegado en GitHub"**
- Verifica que tengas acceso al repositorio
- Configura tus credenciales de Git

**"Error: python3 no encontrado"**
- Instala Python 3: `sudo apt install python3`

## 🎯 Tips para Mejores Artículos

- Sé específico en el tema: "Machine Learning en Python" vs "Programación"
- Usa categorías apropiadas para mejores resultados
- Los artículos se optimizan automáticamente para SEO

## 🌐 Tecnologías Usadas

- **Groq API** - Generación de texto con IA
- **Pollinations AI** - Generación gratuita de imágenes
- **Git** - Control de versiones y publicación
- **Jekyll** - Generador del sitio (formato de posts)

---

✨ ¡Listo! Ahora puedes crear artículos ilimitados con un solo comando.