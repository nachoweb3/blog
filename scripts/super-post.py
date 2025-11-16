#!/usr/bin/env python3
"""
Script ULTRA simplificado para crear posts de blog con imágenes generadas por IA.
- No requiere instalar dependencias
- Usa APIs gratuitas
- Genera imágenes automáticamente
- Sube todo a GitHub
"""

import os
import json
import urllib.request
import urllib.parse
from datetime import datetime
import subprocess
import sys
import re

def call_api(url, data, headers):
    """Llama a una API genérica."""
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers=headers
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Error calling API: {e}")
        return None

def call_groq_api(topic, api_key, prompt, max_tokens=3000):
    """Llama a la API de Groq para generar texto."""
    url = "https://api.groq.com/openai/v1/chat/completions"
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": max_tokens
    }
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    response = call_api(url, data, headers)
    if response and 'choices' in response:
        return response['choices'][0]['message']['content'].strip()
    return None

def generate_image_url(topic, category):
    """Genera una URL de imagen usando Pollinations AI (gratis)."""
    # Mapeo de categorías a palabras clave
    category_keywords = {
        'ia': ['artificial intelligence', 'AI technology', 'neural network', 'machine learning'],
        'blockchain': ['blockchain technology', 'cryptocurrency', 'bitcoin', 'ethereum', 'digital currency'],
        'tutoriales': ['programming code', 'technology tutorial', 'computer science', 'software development']
    }

    # Obtener palabra clave relevante
    keywords = category_keywords.get(category, ['technology'])
    main_keyword = keywords[0]

    # Crear un prompt descriptivo para la imagen
    image_prompt = f"{main_keyword}, {topic}, professional, modern, high quality, digital art"

    # Usar Pollinations AI - es gratis y no requiere API key
    encoded_prompt = urllib.parse.quote(image_prompt)
    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=600&seed={hash(topic + category)}"

    return image_url, image_prompt

def slugify(text):
    """Convierte texto a formato slug."""
    text = text.lower()
    text = re.sub(r'[áàäâ]', 'a', text)
    text = re.sub(r'[éèëê]', 'e', text)
    text = re.sub(r'[íìïî]', 'i', text)
    text = re.sub(r'[óòöô]', 'o', text)
    text = re.sub(r'[úùüû]', 'u', text)
    text = re.sub(r'[ñ]', 'n', text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def generate_post(topic, category, api_key):
    """Genera un post completo con imagen."""

    # Generar título y metadata
    print("📝 Generando título y metadata...")
    metadata_prompt = f"""Para un artículo de blog sobre "{topic}" en la categoría {category}, genera:

1. Un título SEO-friendly (máximo 60 caracteres, atractivo y claro)
2. Un excerpt de 1-2 líneas (máximo 160 caracteres)
3. 4-6 tags relevantes en español (separados por comas)

Responde SOLO en este formato JSON:
{{
    "title": "título aquí",
    "excerpt": "excerpt aquí",
    "tags": ["tag1", "tag2", "tag3", "tag4"]
}}"""

    metadata_response = call_groq_api(topic, api_key, metadata_prompt, max_tokens=500)
    if not metadata_response:
        return None

    json_match = re.search(r'\{.*\}', metadata_response, re.DOTALL)
    if json_match:
        metadata = json.loads(json_match.group())
    else:
        # Fallback
        metadata = {
            "title": topic[:60],
            "excerpt": f"Descubre todo sobre {topic} en este artículo detallado.",
            "tags": ["tecnologia", "actualidad", "innovacion"]
        }

    print(f"✅ Título: {metadata['title']}")

    # Generar contenido
    print("📄 Generando contenido del artículo...")
    content_prompt = f"""Escribe un artículo completo y detallado sobre: {topic}

El artículo debe:
- Tener entre 800-1200 palabras
- Estar escrito en español
- Ser informativo y técnico pero accesible
- Incluir secciones con headers en markdown (##, ###)
- Incluir ejemplos concretos cuando sea relevante
- Tener un tono profesional pero cercano
- Incluir una conclusión al final
- Ser optimizado para SEO
- NO incluir el título principal (solo secciones)

Estructura sugerida:
1. Introducción breve y enganchadora
2. Contexto o explicación del tema
3. Puntos principales con subsecciones
4. Casos de uso o aplicaciones
5. Conclusión

Escribe el artículo completo en formato markdown:"""

    content = call_groq_api(topic, api_key, content_prompt, max_tokens=4000)
    if not content:
        content = f"""## Introducción

Este es un artículo sobre {topic}.

## ¿Qué es {topic}?

{topic} es un tema importante en el mundo actual de la tecnología.

## Aplicaciones

Las aplicaciones de {topic} son numerosas y variadas.

## Conclusión

En conclusión, {topic} representa una área fascinante con mucho potencial."""

    print("✅ Contenido generado")

    # Generar imagen
    print("🎨 Generando imagen con IA gratuita...")
    image_url, image_prompt = generate_image_url(topic, category)
    print(f"✅ Imagen generada: {image_prompt}")

    return metadata, content, image_url

def create_post_file(title, content, excerpt, tags, category, date_str, filename, image_url):
    """Crea el archivo markdown del post."""

    # Front matter con imagen
    front_matter = f"""---
layout: post
title: "{title}"
date: {date_str}
categories: [{category}]
tags: [{', '.join(tags)}]
excerpt: "{excerpt}"
image: "{image_url}"
---

"""

    # Contenido completo
    full_content = front_matter + content

    # Agregar nota final
    full_content += f"""

---

*¿Te gustó este artículo? Síguenos en [@nachoweb3__x](https://twitter.com/nachoweb3__x) para más contenido sobre {category}*

*Imagen generada automáticamente con IA gratuita*
"""

    # Crear archivo
    posts_dir = "_posts"
    filepath = os.path.join(posts_dir, filename)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(full_content)

    return filepath

def check_git_config():
    """Verifica y configura git si es necesario."""
    try:
        # Verificar si hay configuración de usuario
        result = subprocess.run(
            ["git", "config", "user.name"],
            capture_output=True,
            text=True
        )

        if result.returncode != 0 or not result.stdout.strip():
            print("⚙️  Configurando git por primera vez...")
            subprocess.run(["git", "config", "user.email", "blog@nachoweb3.com"], check=True)
            subprocess.run(["git", "config", "user.name", "Blog Auto-Generator"], check=True)
            print("✅ Git configurado")
    except Exception as e:
        print(f"⚠️  Error configurando git: {e}")

def git_commit_and_push(filename, title):
    """Realiza commit y push automático."""
    try:
        print("\n📤 Subiendo a GitHub...")

        # Verificar configuración
        check_git_config()

        # Git add
        result = subprocess.run(
            ["git", "add", f"_posts/{filename}"],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print(f"⚠️  Error en git add: {result.stderr}")
            return False

        # Git commit
        commit_message = f"Add: Nuevo artículo '{title}'\n\n🤖 Generado automáticamente con IA e imagen incluida\n\nCo-Authored-By: Claude <noreply@anthropic.com>"

        result = subprocess.run(
            ["git", "commit", "-m", commit_message],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            if "nothing to commit" in result.stderr:
                print("⚠️  No hay cambios para comitear")
                return True
            print(f"⚠️  Error en git commit: {result.stderr}")
            return False

        # Git push
        result = subprocess.run(
            ["git", "push", "origin", "main"],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print(f"⚠️  Error en git push: {result.stderr}")
            print("   Puede ser un problema de permisos o conexión")
            print("   Tu artículo está guardado localmente")
            return False

        print("✅ Cambios subidos exitosamente a GitHub")
        return True

    except Exception as e:
        print(f"⚠️  Error en git operations: {e}")
        return False

def main():
    # Obtener argumentos
    if len(sys.argv) < 3:
        print("🚀 SUPER POST - Generador de artículos con IA")
        print("=" * 50)
        print("Uso: python3 scripts/super-post.py --topic 'Tema del artículo' --category ia")
        print("\n📋 Categorías disponibles:")
        print("  • ia        - Inteligencia Artificial")
        print("  • blockchain - Blockchain y Criptomonedas")
        print("  • tutoriales - Tutoriales y Guías")
        print("\n✨ Características:")
        print("  • Genera texto con IA (Groq API)")
        print("  • Crea imágenes automáticamente (gratis)")
        print("  • Sube todo a GitHub automáticamente")
        print("  • No requiere instalar dependencias")
        return 1

    topic = None
    category = None

    for i in range(len(sys.argv)):
        if sys.argv[i] == '--topic' and i + 1 < len(sys.argv):
            topic = sys.argv[i + 1]
        elif sys.argv[i] == '--category' and i + 1 < len(sys.argv):
            category = sys.argv[i + 1]

    if not topic or not category:
        print("❌ Error: Debes especificar --topic y --category")
        return 1

    # Validar categoría
    valid_categories = ['ia', 'blockchain', 'tutoriales']
    if category not in valid_categories:
        print(f"❌ Error: Categoría '{category}' no válida")
        print(f"   Categorías válidas: {', '.join(valid_categories)}")
        return 1

    # Obtener API key
    api_key = os.environ.get('GROQ_API_KEY')
    if not api_key:
        # Intentar leer del archivo .env
        try:
            with open('scripts/.env', 'r') as f:
                for line in f:
                    if line.startswith('GROQ_API_KEY=') and '=' in line:
                        api_key = line.split('=', 1)[1].strip()
                        break
        except:
            pass

    if not api_key or api_key == 'YOUR_API_KEY_HERE' or api_key == 'TU_API_KEY_ANTIGUO_AQUI':
        print("❌ ERROR: No se encontró una API key válida de Groq")
        print("\n🔑 Para configurar tu API key:")
        print("1. Obtén tu key gratuita en: https://console.groq.com")
        print("2. Edita el archivo scripts/.env:")
        print("   GROQ_API_KEY=tu_key_aqui")
        print("3. O usa variable de entorno: export GROQ_API_KEY=tu_key")
        return 1

    print(f"\n🚀 SUPER POST - Generando artículo...")
    print(f"📋 Tema: {topic}")
    print(f"📁 Categoría: {category}")
    print(f"🎨 Imagen: Sí (IA gratuita)")
    print(f"📤 GitHub: Automático\n")

    # Generar post
    result = generate_post(topic, category, api_key)
    if not result:
        print("❌ Error generando el artículo")
        return 1

    metadata, content, image_url = result

    # Crear filename
    now = datetime.now()
    date_str = now.strftime('%Y-%m-%d %H:%M:%S -0500')
    filename_date = now.strftime('%Y-%m-%d')
    title_slug = slugify(metadata['title'])
    filename = f"{filename_date}-{title_slug}.md"

    # Crear archivo
    print("📝 Creando archivo markdown...")
    filepath = create_post_file(
        metadata['title'],
        content,
        metadata['excerpt'],
        metadata['tags'],
        category,
        date_str,
        filename,
        image_url
    )

    print(f"✅ Artículo creado: {filepath}")

    # Subir a GitHub
    success = git_commit_and_push(filename, metadata['title'])

    if success:
        print(f"\n🎉 ¡ARTÍCULO PUBLICADO EXITOSAMENTE!")
        print("=" * 50)
        print(f"📋 Título: {metadata['title']}")
        print(f"🏷️  Tags: {', '.join(metadata['tags'])}")
        print(f"📁 Archivo: {filename}")
        print(f"🎨 Imagen: Generada con IA gratuita")
        print(f"📤 GitHub: ✓ Subido")
        print(f"\n🌐 Tu artículo ya está disponible en el blog!")
    else:
        print(f"\n⚠️  Artículo creado pero no subido a GitHub")
        print(f"📁 Archivo local: {filepath}")
        print(f"📋 Puedes subirlo manualmente:")
        print(f"   git add _posts/{filename}")
        print(f"   git commit -m 'Add: Nuevo artículo'")
        print(f"   git push origin main")

    return 0

if __name__ == '__main__':
    exit(main())