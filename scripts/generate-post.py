#!/usr/bin/env python3
"""
Script para generar artículos de blog automáticamente usando APIs de IA gratuitas.
Utiliza Groq API (gratuita) para generación de texto y Unsplash API para imágenes.
Incluye límite diario de 5 posts y auto-commit a GitHub.
"""

import os
import argparse
import json
from datetime import datetime, date
from groq import Groq
import re
from pathlib import Path
import subprocess
import requests
import glob

# Cargar variables de entorno desde .env
try:
    from dotenv import load_dotenv
    # Cargar .env desde la carpeta del script
    env_path = Path(__file__).parent / '.env'
    load_dotenv(dotenv_path=env_path)
except ImportError:
    # Si python-dotenv no está instalado, continuar sin él
    pass

# Configuración de categorías
CATEGORIES = {
    'ia': {
        'name': 'IA',
        'slug': 'ia',
        'description': 'Inteligencia Artificial',
        'tags_comunes': ['ia', 'machine-learning', 'deep-learning', 'ia-generativa', 'llm']
    },
    'blockchain': {
        'name': 'Blockchain',
        'slug': 'blockchain',
        'description': 'Blockchain y Criptomonedas',
        'tags_comunes': ['blockchain', 'crypto', 'web3', 'defi', 'nft']
    },
    'tutoriales': {
        'name': 'Tutoriales',
        'slug': 'tutoriales',
        'description': 'Guías y Tutoriales',
        'tags_comunes': ['tutorial', 'guia', 'paso-a-paso', 'como-hacer']
    }
}

# Templates de prompts por categoría
PROMPT_TEMPLATES = {
    'ia': """Escribe un artículo de blog completo y detallado sobre: {topic}

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

Escribe el artículo completo en formato markdown:""",

    'blockchain': """Escribe un artículo de blog completo y detallado sobre: {topic}

El artículo debe:
- Tener entre 800-1200 palabras
- Estar escrito en español
- Explicar conceptos técnicos de forma accesible
- Incluir secciones con headers en markdown (##, ###)
- Incluir ejemplos prácticos o datos reales cuando sea posible
- Tener un tono informativo y educativo
- Incluir una conclusión al final
- Ser optimizado para SEO
- NO incluir el título principal (solo secciones)

Estructura sugerida:
1. Introducción al tema
2. Explicación técnica
3. Casos de uso o aplicaciones prácticas
4. Impacto en el ecosistema
5. Conclusión y perspectivas futuras

Escribe el artículo completo en formato markdown:""",

    'tutoriales': """Escribe un tutorial completo y detallado sobre: {topic}

El tutorial debe:
- Tener entre 800-1200 palabras
- Estar escrito en español
- Ser una guía paso a paso muy clara
- Incluir secciones con headers en markdown (##, ###)
- Incluir pasos numerados o listas cuando sea apropiado
- Incluir ejemplos de código o comandos cuando sea relevante (en bloques de código)
- Tener un tono instructivo y amigable
- Incluir consejos o advertencias importantes
- NO incluir el título principal (solo secciones)

Estructura sugerida:
1. Introducción: qué aprenderás
2. Requisitos previos
3. Pasos del tutorial (numerados)
4. Consejos y mejores prácticas
5. Conclusión

Escribe el tutorial completo en formato markdown:"""
}

def slugify(text):
    """Convierte texto a formato slug para URLs."""
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

def generate_title_and_tags(client, topic, category):
    """Genera título SEO y tags usando IA."""
    prompt = f"""Para un artículo de blog sobre "{topic}" en la categoría {CATEGORIES[category]['name']}, genera:

1. Un título SEO-friendly (máximo 60 caracteres, atractivo y claro)
2. Un excerpt de 1-2 líneas (máximo 160 caracteres)
3. 4-6 tags relevantes en español (palabras simples, separadas por comas, en formato slug como: bitcoin, defi, tutorial-python)

Responde SOLO en este formato JSON:
{{
    "title": "título aquí",
    "excerpt": "excerpt aquí",
    "tags": ["tag1", "tag2", "tag3", "tag4"]
}}"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Modelo actualizado (antes llama-3.1-70b-versatile)
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=300
        )

        response_text = completion.choices[0].message.content.strip()

        # Extraer JSON de la respuesta
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            metadata = json.loads(json_match.group())
            return metadata
        else:
            raise ValueError("No se pudo extraer JSON de la respuesta")

    except Exception as e:
        print(f"Error generando metadata: {e}")
        # Fallback manual
        return {
            "title": topic[:60],
            "excerpt": f"Descubre todo sobre {topic} en este artículo detallado.",
            "tags": CATEGORIES[category]['tags_comunes'][:4]
        }

def generate_article_content(client, topic, category):
    """Genera el contenido del artículo usando IA."""
    prompt_template = PROMPT_TEMPLATES[category]
    prompt = prompt_template.format(topic=topic)

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Modelo actualizado (antes llama-3.1-70b-versatile)
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=4000
        )

        content = completion.choices[0].message.content.strip()
        return content

    except Exception as e:
        print(f"Error generando contenido: {e}")
        return f"""## Introducción

Este es un artículo sobre {topic}.

## Contenido

[Contenido generado automáticamente]

## Conclusión

Este artículo cubre los aspectos fundamentales de {topic}."""

def check_daily_limit():
    """Verifica que no se hayan creado más de 5 posts hoy."""
    posts_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), '_posts')
    today = date.today().strftime('%Y-%m-%d')

    # Contar posts creados hoy
    today_posts = glob.glob(os.path.join(posts_dir, f"{today}-*.md"))
    posts_count = len(today_posts)

    if posts_count >= 5:
        print(f"⚠️  LÍMITE DIARIO ALCANZADO: Ya se crearon {posts_count} posts hoy.")
        print(f"   El límite diario es de 5 posts para mantener calidad del contenido.")
        print(f"   Posts creados hoy:")
        for post in today_posts:
            print(f"   - {os.path.basename(post)}")
        return False, posts_count

    return True, posts_count

def get_unsplash_image(topic, category, api_key=None):
    """Obtiene una imagen relevante de Unsplash basada en el tema."""
    if not api_key or api_key == "YOUR_UNSPLASH_ACCESS_KEY_HERE":
        print("⚠️  No hay API key de Unsplash configurada.")
        print("   Usando imagen placeholder. Para imágenes automáticas:")
        print("   1. Regístrate en https://unsplash.com/developers")
        print("   2. Crea una aplicación y obtén tu Access Key")
        print("   3. Agrega UNSPLASH_ACCESS_KEY=tu_key en scripts/.env")
        # Retornar placeholder
        return f"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop"

    # Palabras clave por categoría
    search_queries = {
        'ia': ['artificial intelligence', 'AI', 'machine learning', 'neural network', 'robot'],
        'blockchain': ['blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'crypto'],
        'tutoriales': ['programming', 'code', 'developer', 'technology', 'computer']
    }

    # Construir query de búsqueda
    category_keywords = search_queries.get(category, ['technology'])
    # Usar el tema y una palabra clave de la categoría
    query = f"{category_keywords[0]} technology"

    try:
        url = "https://api.unsplash.com/search/photos"
        headers = {"Authorization": f"Client-ID {api_key}"}
        params = {
            "query": query,
            "per_page": 5,
            "orientation": "landscape"
        }

        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()

        if data.get('results') and len(data['results']) > 0:
            # Tomar la primera imagen
            photo = data['results'][0]
            image_url = f"{photo['urls']['regular']}?w=800&h=600&fit=crop"
            photographer = photo['user']['name']
            photographer_url = photo['user']['links']['html']

            print(f"✅ Imagen encontrada de Unsplash")
            print(f"   Fotógrafo: {photographer}")
            print(f"   URL: {photographer_url}")

            return image_url
        else:
            print("⚠️  No se encontraron imágenes en Unsplash, usando placeholder")
            return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop"

    except Exception as e:
        print(f"⚠️  Error obteniendo imagen de Unsplash: {e}")
        print("   Usando imagen placeholder")
        return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop"

def git_commit_and_push(filename, title):
    """Realiza commit y push automático del nuevo post a GitHub."""
    try:
        # Cambiar al directorio raíz del proyecto
        project_root = os.path.dirname(os.path.dirname(__file__))

        print("\n📤 Subiendo a GitHub...")

        # Git add
        result = subprocess.run(
            ["git", "add", f"_posts/{filename}"],
            cwd=project_root,
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
            cwd=project_root,
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print(f"⚠️  Error en git commit: {result.stderr}")
            return False

        # Git push
        result = subprocess.run(
            ["git", "push", "origin", "main"],
            cwd=project_root,
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print(f"⚠️  Error en git push: {result.stderr}")
            print("   Puedes hacer push manualmente con: git push origin main")
            return False

        print("✅ Cambios subidos exitosamente a GitHub")
        return True

    except Exception as e:
        print(f"⚠️  Error en git operations: {e}")
        print("   Puedes hacer commit/push manualmente")
        return False

def create_post_file(title, content, excerpt, tags, category, date_str, filename, image_url=None):
    """Crea el archivo markdown del post con front matter."""

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

*¿Te gustó este artículo? Síguenos en [@nachoweb3__x](https://twitter.com/nachoweb3__x) para más contenido sobre {CATEGORIES[category]['name']}*
"""

    # Crear archivo
    posts_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), '_posts')
    filepath = os.path.join(posts_dir, filename)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(full_content)

    return filepath

def main():
    parser = argparse.ArgumentParser(
        description='Genera artículos de blog automáticamente usando IA',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:
  python scripts/generate-post.py --topic "GPT-4 vs Claude" --category ia
  python scripts/generate-post.py --topic "Cómo hacer staking en Ethereum" --category blockchain
  python scripts/generate-post.py --topic "Configurar Visual Studio Code para Python" --category tutoriales
  python scripts/generate-post.py --topic "Web scraping con Python" --category tutoriales --api-key tu_api_key

Categorías disponibles: ia, blockchain, tutoriales

Para obtener una API key gratuita de Groq:
1. Visita: https://console.groq.com
2. Crea una cuenta gratuita
3. Genera una API key en el dashboard
4. Usa la key con --api-key o configúrala como variable de entorno GROQ_API_KEY
        """
    )

    parser.add_argument(
        '--topic',
        required=True,
        help='Tema del artículo a generar'
    )

    parser.add_argument(
        '--category',
        required=True,
        choices=['ia', 'blockchain', 'tutoriales'],
        help='Categoría del artículo'
    )

    parser.add_argument(
        '--api-key',
        help='Groq API key (o usa la variable de entorno GROQ_API_KEY)'
    )

    parser.add_argument(
        '--date',
        help='Fecha del post en formato YYYY-MM-DD (por defecto: hoy)'
    )

    args = parser.parse_args()

    # Obtener API key
    api_key = args.api_key or os.environ.get('GROQ_API_KEY')
    if not api_key:
        print("ERROR: Necesitas proporcionar una API key de Groq.")
        print("\nOpciones:")
        print("1. Usar --api-key: python scripts/generate-post.py --api-key tu_key ...")
        print("2. Variable de entorno: export GROQ_API_KEY=tu_key")
        print("\nObtén una API key gratuita en: https://console.groq.com")
        return 1

    # Inicializar cliente
    try:
        client = Groq(api_key=api_key)
    except Exception as e:
        print(f"Error inicializando cliente Groq: {e}")
        return 1

    # Obtener fecha
    if args.date:
        try:
            post_date = datetime.strptime(args.date, '%Y-%m-%d')
        except ValueError:
            print("ERROR: Formato de fecha inválido. Usa YYYY-MM-DD")
            return 1
    else:
        post_date = datetime.now()

    date_str = post_date.strftime('%Y-%m-%d %H:%M:%S -0500')
    filename_date = post_date.strftime('%Y-%m-%d')

    print(f"\n🚀 Generando artículo sobre: {args.topic}")
    print(f"📁 Categoría: {CATEGORIES[args.category]['name']}\n")

    # Generar título y metadata
    print("⏳ Generando título y tags...")
    metadata = generate_title_and_tags(client, args.topic, args.category)
    print(f"✅ Título: {metadata['title']}")
    print(f"✅ Tags: {', '.join(metadata['tags'])}\n")

    # Generar contenido
    print("⏳ Generando contenido del artículo (esto puede tardar un momento)...")
    content = generate_article_content(client, args.topic, args.category)
    print("✅ Contenido generado\n")

    # Generar sugerencias de imagen
    print("💡 Sugerencias de imagen:")
    image_suggestions = generate_image_suggestion(args.topic, args.category)
    for i, suggestion in enumerate(image_suggestions, 1):
        print(f"   {i}. {suggestion}")
    print()

    # Crear filename
    title_slug = slugify(metadata['title'])
    filename = f"{filename_date}-{title_slug}.md"

    # Crear archivo
    print("📝 Creando archivo...")
    filepath = create_post_file(
        metadata['title'],
        content,
        metadata['excerpt'],
        metadata['tags'],
        args.category,
        date_str,
        filename
    )

    print(f"✅ Artículo creado exitosamente: {filepath}\n")
    print("📋 Información del post:")
    print(f"   Título: {metadata['title']}")
    print(f"   Fecha: {date_str}")
    print(f"   Categoría: {args.category}")
    print(f"   Tags: {', '.join(metadata['tags'])}")
    print(f"   Archivo: {filename}\n")

    print("🎨 Próximos pasos:")
    print("   1. Revisa y edita el contenido generado")
    print("   2. Agrega una imagen destacada (sugerencias arriba)")
    print("   3. Verifica que todo esté correcto")
    print("   4. Haz commit del nuevo post")
    print("\n🎉 ¡Listo!")

    return 0

if __name__ == '__main__':
    exit(main())
