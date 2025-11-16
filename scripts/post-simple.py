#!/usr/bin/env python3
"""
Script simplificado para crear posts de blog y subirlos automáticamente.
No requiere dependencias externas, solo usa APIs web estándar.
"""

import os
import json
import urllib.request
import urllib.parse
from datetime import datetime
import subprocess
import sys

def call_groq_api(topic, api_key, prompt):
    """Llama a la API de Groq sin dependencias externas."""
    url = "https://api.groq.com/openai/v1/chat/completions"

    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 3000
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}'
            }
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return None

def slugify(text):
    """Convierte texto a formato slug."""
    text = text.lower()
    import re
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
    """Genera un post completo."""

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

    metadata_response = call_groq_api(topic, api_key, metadata_prompt)
    if not metadata_response:
        return None

    import re
    json_match = re.search(r'\{.*\}', metadata_response, re.DOTALL)
    if json_match:
        metadata = json.loads(json_match.group())
    else:
        # Fallback
        metadata = {
            "title": topic[:60],
            "excerpt": f"Descubre todo sobre {topic} en este artículo detallado.",
            "tags": ["ia", "tecnologia", "actualidad"]
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
- Tener un tono profesional pero cercano
- Incluir una conclusión al final
- NO incluir el título principal (solo secciones)

Escribe el artículo completo en formato markdown:"""

    content = call_groq_api(topic, api_key, content_prompt)
    if not content:
        content = f"""## Introducción

Este es un artículo sobre {topic}.

## Contenido

[Contenido generado automáticamente]

## Conclusión

Este artículo cubre los aspectos fundamentales de {topic}."""

    print("✅ Contenido generado")
    return metadata, content

def create_post_file(title, content, excerpt, tags, category, date_str, filename):
    """Crea el archivo markdown del post."""

    # Front matter
    front_matter = f"""---
layout: post
title: "{title}"
date: {date_str}
categories: [{category}]
tags: [{', '.join(tags)}]
excerpt: "{excerpt}"
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop"
---

"""

    # Contenido completo
    full_content = front_matter + content

    # Agregar nota final
    full_content += f"""

---

*¿Te gustó este artículo? Síguenos en [@nachoweb3__x](https://twitter.com/nachoweb3__x) para más contenido sobre {category}*
"""

    # Crear archivo
    posts_dir = "_posts"
    filepath = os.path.join(posts_dir, filename)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(full_content)

    return filepath

def git_commit_and_push(filename, title):
    """Realiza commit y push automático."""
    try:
        print("\n📤 Subiendo a GitHub...")

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
        commit_message = f"Add: Nuevo artículo '{title}'\n\n🤖 Generado automáticamente con IA\n\nCo-Authored-By: Claude <noreply@anthropic.com>"

        result = subprocess.run(
            ["git", "commit", "-m", commit_message],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
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
            return False

        print("✅ Cambios subidos exitosamente a GitHub")
        return True

    except Exception as e:
        print(f"⚠️  Error en git operations: {e}")
        return False

def main():
    # Obtener argumentos
    if len(sys.argv) < 3:
        print("Uso: python3 scripts/post-simple.py --topic 'Tema del artículo' --category ia")
        print("\nCategorías disponibles: ia, blockchain, tutoriales")
        return 1

    topic = None
    category = None

    for i in range(len(sys.argv)):
        if sys.argv[i] == '--topic' and i + 1 < len(sys.argv):
            topic = sys.argv[i + 1]
        elif sys.argv[i] == '--category' and i + 1 < len(sys.argv):
            category = sys.argv[i + 1]

    if not topic or not category:
        print("Error: Debes especificar --topic y --category")
        return 1

    # Obtener API key
    api_key = os.environ.get('GROQ_API_KEY')
    if not api_key:
        # Intentar leer del archivo .env
        try:
            with open('scripts/.env', 'r') as f:
                for line in f:
                    if line.startswith('GROQ_API_KEY='):
                        api_key = line.split('=', 1)[1].strip()
                        break
        except:
            pass

    if not api_key or api_key == 'YOUR_API_KEY_HERE':
        print("❌ ERROR: No se encontró la API key de Groq")
        print("\nPara configurarla:")
        print("1. Obtén tu key gratuita en: https://console.groq.com")
        print("2. Agrégala al archivo scripts/.env:")
        print("   GROQ_API_KEY=tu_key_aqui")
        return 1

    print(f"\n🚀 Generando artículo sobre: {topic}")
    print(f"📁 Categoría: {category}\n")

    # Generar post
    result = generate_post(topic, category, api_key)
    if not result:
        print("❌ Error generando el artículo")
        return 1

    metadata, content = result

    # Crear filename
    now = datetime.now()
    date_str = now.strftime('%Y-%m-%d %H:%M:%S -0500')
    filename_date = now.strftime('%Y-%m-%d')
    title_slug = slugify(metadata['title'])
    filename = f"{filename_date}-{title_slug}.md"

    # Crear archivo
    print("📝 Creando archivo...")
    filepath = create_post_file(
        metadata['title'],
        content,
        metadata['excerpt'],
        metadata['tags'],
        category,
        date_str,
        filename
    )

    print(f"✅ Artículo creado: {filepath}")

    # Subir a GitHub
    success = git_commit_and_push(filename, metadata['title'])

    if success:
        print(f"\n🎉 ¡Artículo publicado exitosamente!")
        print(f"📋 Título: {metadata['title']}")
        print(f"🏷️  Tags: {', '.join(metadata['tags'])}")
        print(f"📁 Archivo: {filename}")
    else:
        print(f"\n⚠️  Artículo creado pero no subido a GitHub")
        print(f"📁 Archivo local: {filepath}")
        print(f"📋 Puedes subirlo manualmente con:")
        print(f"   git add _posts/{filename}")
        print(f"   git commit -m 'Add: Nuevo artículo'")
        print(f"   git push origin main")

    return 0

if __name__ == '__main__':
    exit(main())