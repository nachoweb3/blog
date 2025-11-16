#!/usr/bin/env python3
"""
Script AUTOMÁTICO para crear posts de blog y subirlos a GitHub.
- 100% GRATIS - NO requiere API keys
- Subida automática a GitHub
- Flujo robusto con manejo de errores
- Imágenes IA automáticas
"""

import os
import json
import urllib.request
import urllib.parse
from datetime import datetime
import subprocess
import sys
import re
import getpass
from pathlib import Path

def load_env_vars():
    """Carga variables de entorno desde archivo .env."""
    try:
        # Buscar archivo .env en el directorio del script
        script_dir = Path(__file__).parent
        env_file = script_dir / '.env'

        if not env_file.exists():
            print("⚠️  Archivo .env no encontrado")
            return False

        print(f"📁 Cargando variables de entorno desde: {env_file}")

        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

        print("✅ Variables de entorno cargadas")
        return True

    except Exception as e:
        print(f"❌ Error cargando variables de entorno: {e}")
        return False

def setup_github_authentication():
    """Configura autenticación con GitHub usando PAT."""
    try:
        print("🔐 Configurando autenticación con GitHub...")

        # Cargar variables de entorno
        if not load_env_vars():
            print("⚠️  No se pudieron cargar variables de entorno")

        # Obtener GitHub PAT
        github_token = os.environ.get('GITHUB_TOKEN')

        if github_token and github_token != 'YOUR_GITHUB_PAT_HERE':
            print("✅ GitHub PAT encontrado en variables de entorno")

            # Configurar el remote con PAT
            repo_url = "https://github.com/nachoweb3/blog.git"
            pat_url = f"https://{github_token}@github.com/nachoweb3/blog.git"

            # Actualizar el remote con el PAT
            result = subprocess.run(
                ["git", "remote", "set-url", "origin", pat_url],
                capture_output=True,
                text=True
            )

            if result.returncode == 0:
                print("✅ Remote configurado con GitHub PAT")
                return True
            else:
                print(f"❌ Error configurando remote con PAT: {result.stderr}")
                return False
        else:
            print("❌ GitHub PAT no configurado")
            print("📋 **Pasos para configurar GitHub PAT:**")
            print("   1. Ve a https://github.com/settings/tokens")
            print("   2. Click en 'Generate new token' -> 'Generate new token (classic)'")
            print("   3. Selecciona scopes: repo, workflow")
            print("   4. Genera el token y agrégalo a scripts/.env")
            print("   5. Reemplaza 'YOUR_GITHUB_PAT_HERE' con tu token")
            return False

    except Exception as e:
        print(f"❌ Error configurando autenticación: {e}")
        return False

def test_git_connection_with_auth():
    """Prueba conexión con GitHub usando la autenticación configurada."""
    try:
        print("🔍 Probando conexión con GitHub...")

        # Intentar conectar con el remote actual
        result = subprocess.run(
            ["git", "ls-remote", "origin"],
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode == 0:
            print("✅ Conexión con GitHub exitosa")
            return True
        else:
            print(f"❌ Error de conexión: {result.stderr}")

            # Si falla, intentar configurar autenticación
            if "Permission denied" in result.stderr or "authentication failed" in result.stderr.lower():
                print("🔧 Intentando configurar autenticación con PAT...")
                if setup_github_authentication():
                    # Reintentar la conexión
                    result = subprocess.run(
                        ["git", "ls-remote", "origin"],
                        capture_output=True,
                        text=True,
                        timeout=30
                    )
                    if result.returncode == 0:
                        print("✅ Conexión restaurada con GitHub PAT")
                        return True
                    else:
                        print(f"❌ Aún falla la conexión: {result.stderr}")

            return False

    except subprocess.TimeoutExpired:
        print("❌ Timeout en la conexión con GitHub")
        return False
    except Exception as e:
        print(f"❌ Error probando conexión: {e}")
        return False

def run_git_command(command, description, critical=True):
    """Ejecuta un comando git con manejo de errores."""
    try:
        print(f"⏳ {description}...")
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )
        print(f"✅ {description} completado")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en {description}: {e.stderr}")
        if critical:
            print(f"   Comando: {' '.join(command)}")
        return False
    except Exception as e:
        print(f"❌ Error inesperado en {description}: {e}")
        return False

def check_git_status():
    """Verifica el estado del repositorio git."""
    try:
        # Verificar si estamos en un repositorio git
        result = subprocess.run(
            ["git", "rev-parse", "--git-dir"],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print("❌ Error: No estás en un repositorio git")
            return False

        print("✅ Repositorio git verificado")

        # Verificar si hay cambios pendientes
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True
        )

        if result.stdout.strip():
            print("⚠️  Hay cambios pendientes en el repositorio:")
            print(result.stdout)

        return True

    except Exception as e:
        print(f"❌ Error verificando git: {e}")
        return False

def check_git_remotes():
    """Verifica la configuración de remotes."""
    try:
        result = subprocess.run(
            ["git", "remote", "-v"],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print("❌ Error: No hay remotes configurados")
            return False

        print("✅ Remotes configurados:")
        for line in result.stdout.strip().split('\n'):
            if line.strip():
                print(f"   {line}")

        return True

    except Exception as e:
        print(f"❌ Error verificando remotes: {e}")
        return False

def setup_git_config():
    """Configura git si es necesario."""
    try:
        # Verificar configuración de usuario
        email_result = subprocess.run(
            ["git", "config", "user.email"],
            capture_output=True,
            text=True
        )

        name_result = subprocess.run(
            ["git", "config", "user.name"],
            capture_output=True,
            text=True
        )

        if email_result.returncode != 0 or not email_result.stdout.strip():
            print("⚙️  Configurando email de git...")
            email = "blog@nachoweb3.com"
            subprocess.run(["git", "config", "user.email", email], check=True)
            print(f"✅ Email configurado: {email}")

        if name_result.returncode != 0 or not name_result.stdout.strip():
            print("⚙️  Configurando nombre de git...")
            name = "Blog Auto-Generator"
            subprocess.run(["git", "config", "user.name", name], check=True)
            print(f"✅ Nombre configurado: {name}")

        return True

    except Exception as e:
        print(f"❌ Error configurando git: {e}")
        return False

def test_git_connection():
    """Prueba la conexión con el remote."""
    try:
        print("🔍 Probando conexión con GitHub...")
        result = subprocess.run(
            ["git", "ls-remote", "origin"],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print("✅ Conexión con GitHub exitosa")
            return True
        else:
            print("❌ Error de conexión con GitHub:")
            print(f"   {result.stderr}")
            return False

    except Exception as e:
        print(f"❌ Error probando conexión: {e}")
        return False

def generate_metadata(topic, category):
    """Genera metadata básica."""

    title = topic[:60]  # Limitar a 60 caracteres

    # Generar tags según categoría
    tags_by_category = {
        'ia': ['ia', 'inteligencia-artificial', 'machine-learning', 'tecnologia'],
        'blockchain': ['blockchain', 'cripto', 'criptomonedas', 'web3'],
        'tutoriales': ['tutorial', 'guia', 'aprendizaje', 'desarrollo']
    }

    tags = tags_by_category.get(category, ['tecnologia', 'actualidad'])

    # Agregar tags específicos del tema
    topic_slug = topic.lower().replace(' ', '-').replace(',', '').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
    if topic_slug not in tags:
        tags.insert(0, topic_slug)

    metadata = {
        "title": title,
        "excerpt": f"Descubre todo sobre {topic} en este artículo completo. Aprende conceptos clave, aplicaciones y las últimas tendencias.",
        "tags": tags[:6]
    }

    return metadata

def generate_content(topic, category):
    """Genera contenido automáticamente."""

    content_templates = {
        'ia': {
            'intro': f"La inteligencia artificial ha revolucionado el mundo tecnológico, y {topic} representa uno de los avances más significativos en este campo.",
            'desarrollo': f"## ¿Qué es {topic}?\n\n{topic} es una tecnología emergente que está transformando la forma en que interactuamos con los sistemas inteligentes.\n\n## Aplicaciones Prácticas\n\nLas aplicaciones de {topic} son numerosas y variadas:\n\n### 1. Automatización de Procesos\n\nPermite optimizar flujos de trabajo y reducir tiempos de respuesta.\n\n### 2. Análisis Predictivo\n\nCapacidad de anticipar tendencias y patrones basados en datos históricos.\n\n### 3. Mejora de Experiencias\n\nPersonalización de servicios y adaptación a necesidades específicas.\n\n## Impacto en la Industria\n\nEl impacto de {topic} se refleja en múltiples sectores:\n\n- **Salud:** Mejora en diagnósticos y tratamientos\n- **Finanzas:** Optimización de riesgos y decisiones\n- **Educación:** Personalización del aprendizaje\n- **Retail:** Experiencias de compra mejoradas\n\n## Tendencias Futuras\n\nEl futuro de {topic} promete avances emocionantes:\n- Integración con otras tecnologías emergentes\n- Mejora en la capacidad de procesamiento\n- Nuevas aplicaciones en diversos campos\n- Mayor accesibilidad para desarrolladores",
            'conclusion': "{topic} representa el futuro de la inteligencia artificial y está posicionado para transformar nuestra sociedad en los próximos años."
        },
        'blockchain': {
            'intro': f"La tecnología blockchain continúa evolucionando, y {topic} emerge como una de las innovaciones más relevantes en el ecosistema cripto.",
            'desarrollo': f"## ¿Qué es {topic}?\n\n{topic} es una solución blockchain que ofrece características únicas para el mundo digital descentralizado.\n\n## Características Principales\n\n### Seguridad y Transparencia\n\nUtiliza criptografía avanzada para garantizar la integridad de las transacciones.\n\n### Descentralización\n\nElimina intermediarios y permite transacciones peer-to-peer directas.\n\n### Inmutabilidad\n\nUna vez registrados, los datos no pueden ser modificados, garantizando confianza.\n\n## Casos de Uso\n\nLas aplicaciones prácticas de {topic} incluyen:\n\n- **Finanzas Descentralizadas (DeFi)**\n- **Tokens No Fungibles (NFTs)**\n- **Gestión de Cadena de Suministro**\n- **Identidad Digital**\n- **Contratos Inteligentes**\n\n## Ventajas Competitivas\n\nComparado con soluciones tradicionales, {topic} ofrece:\n- Menores costos operativos\n- Mayor velocidad de transacción\n- Accesibilidad global\n- Resistencia a la censura\n- Transparencia total\n\n## Desafíos y Soluciones\n\nAunque {topic} presenta desafíos, existen soluciones innovadoras:\n- Escalabilidad mediante Layer 2\n- Reducción de costos con optimizaciones\n- Mejora de la experiencia de usuario\n- Integración con sistemas tradicionales",
            'conclusion': "{topic} representa el futuro de las transacciones digitales y está posicionado para revolucionar múltiples industrias en la próxima década."
        },
        'tutoriales': {
            'intro': f"En este tutorial completo, exploraremos paso a paso cómo implementar {topic}, una habilidad fundamental en el desarrollo tecnológico actual.",
            'desarrollo': f"## ¿Qué aprenderás?\n\nAl finalizar este tutorial, podrás:\n- Comprender los conceptos básicos de {topic}\n- Implementar soluciones prácticas\n- Resolver problemas comunes\n- Aplicar mejores prácticas\n\n## Requisitos Previos\n\nAntes de comenzar, asegúrate de tener:\n- Conocimientos básicos de programación\n- Un entorno de desarrollo configurado\n- Motivación para aprender\n\n## Paso 1: Conceptos Fundamentales\n\n{topic} se basa en principios que debemos entender:\n\n### Nociones Básicas\n\nLos conceptos clave incluyen:\n- Estructuras de datos eficientes\n- Algoritmos optimizados\n- Patrones de diseño correctos\n- Buenas prácticas de desarrollo\n\n## Paso 2: Configuración del Entorno\n\n### Instalación y Configuración\n\nComencemos con la configuración básica:\n\n1. **Prepara tu entorno de desarrollo**\n   - Instala las herramientas necesarias\n   - Configura tu editor de código\n   - Prepara tu espacio de trabajo\n\n2. **Configuración inicial**\n   - Establece variables de entorno\n   - Configura bases de datos\n   - Prepara archivos de configuración\n\n## Paso 3: Implementación Práctica\n\n### Desarrollo Paso a Paso\n\n#### Primera Fase: Fundamentos\n\nEstablezcamos las bases:\n- Definir objetivos claros\n- Planificar la arquitectura\n- Seleccionar herramientas adecuadas\n- Crear estructura de archivos\n\n#### Segunda Fase: Desarrollo\n\nImplementemos la solución:\n- Codificar funcionalidad principal\n- Agregar validaciones necesarias\n- Optimizar el rendimiento\n- Implementar manejo de errores\n\n#### Tercera Fase: Testing\n\nAseguremos la calidad:\n- Realizar pruebas unitarias\n- Verificar funcionamiento completo\n- Testing de integración\n- Validación de casos extremos\n\n## Paso 4: Mejores Prácticas\n\n### Optimización y Mantenimiento\n\nPara garantizar calidad y sostenibilidad:\n- **Optimización de rendimiento**\n- **Documentación clara**\n- **Testing continuo**\n- **Refactorización periódica**\n\n### Seguridad\n\nConsideraciones de seguridad importantes:\n- Validación de entradas\n- Manejo de autenticación\n- Protección contra vulnerabilidades\n- Cifrado de datos sensibles\n\n## Paso 5: Despliegue\n\n### Preparación para Producción\n\nPasos finales para llevar tu proyecto a producción:\n- Configuración del entorno de producción\n- Optimización de recursos\n- Monitoreo y logging\n- Estrategias de respaldo",
            'conclusion': "Has aprendido los fundamentos de {topic} y estás listo para aplicar estos conocimientos en proyectos reales. ¡Sigue practicando y explorando nuevas posibilidades!"
        }
    }

    template = content_templates.get(category, content_templates['ia'])

    # Reemplazar marcadores
    content = template['desarrollo'].replace('{topic}', topic)
    intro = template['intro'].replace('{topic}', topic)
    conclusion = template['conclusion'].replace('{topic}', topic)

    full_content = f"## Introducción\n\n{intro}\n\n{content}\n\n## Conclusión\n\n{conclusion}\n\n## Recursos Adicionales\n\nPara continuar aprendiendo sobre {topic}, te recomendamos:\n\n- **Documentación oficial** - La fuente más actualizada\n- **Comunidades en línea** - Stack Overflow, Reddit, Discord\n- **Proyectos open source** - GitHub con ejemplos prácticos\n- **Cursos especializados** - Plataformas educativas online\n\n- - -\n\n*¿Te gustó este artículo? Comparte tus experiencias y deja tus comentarios abajo*"

    return full_content

def generate_image_url(topic, category):
    """Genera imagen usando Pollinations."""

    category_keywords = {
        'ia': ['artificial intelligence', 'AI technology', 'neural network', 'machine learning'],
        'blockchain': ['blockchain technology', 'cryptocurrency', 'bitcoin', 'ethereum', 'digital finance'],
        'tutoriales': ['programming code', 'technology tutorial', 'computer education', 'software development']
    }

    main_keyword = category_keywords.get(category, ['technology'])[0]
    image_prompt = f"{main_keyword}, {topic}, professional, modern, digital, educational, high quality"
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

def create_post_file(title, content, excerpt, tags, category, date_str, filename, image_url):
    """Crea el archivo markdown del post."""

    front_matter = f"""---
layout: post
title: "{title}"
date: {date_str}
categories: [{category}]
tags: [{', '.join(tags)}]
excerpt: "{excerpt}"
image: "{image_url}"
author: "Blog Auto-Generator"
---

"""

    full_content = front_matter + content
    full_content += f"""

---

*¿Te gustó este artículo? Síguenos en [@nachoweb3__x](https://twitter.com/nachoweb3__x) para más contenido sobre {category}*

*Imagen generada automáticamente con IA gratuita*
*Artículo creado y publicado automáticamente*

**🤖 Generado con POST-AUTO - 100% GRATIS**
"""

    posts_dir = "_posts"
    os.makedirs(posts_dir, exist_ok=True)  # Asegurar que el directorio existe
    filepath = os.path.join(posts_dir, filename)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(full_content)

    return filepath

def upload_to_github(filename, title):
    """Sube el artículo a GitHub con flujo robusto."""

    print(f"\n📤 **INICIANDO SUBIDA A GITHUB**")
    print("=" * 50)

    # 1. Verificar estado del repositorio
    if not check_git_status():
        return False, "Error verificando repositorio git"

    # 2. Configurar git si es necesario
    if not setup_git_config():
        return False, "Error configurando git"

    # 3. Verificar conexión con GitHub y configurar autenticación si es necesario
    if not test_git_connection_with_auth():
        print("\n❌ **PROBLEMA DE AUTENTICACIÓN**")
        print("   No se puede conectar a GitHub. Soluciones automáticas fallaron.")
        print("\n📋 **Solución manual - PASO 1:**")
        print("   1. Ve a https://github.com/settings/tokens")
        print("   2. Click en 'Generate new token' -> 'Generate new token (classic)'")
        print("   3. Selecciona scopes: repo, workflow")
        print("   4. Genera el token")
        print("   5. Edita scripts/.env y reemplaza 'YOUR_GITHUB_PAT_HERE'")
        print("   6. Vuelve a ejecutar el script")
        return False, "Error de autenticación con GitHub"

    # 4. Añadir archivo al staging
    if not run_git_command(["git", "add", f"_posts/{filename}"], "Añadiendo archivo al staging"):
        return False, "Error añadiendo archivo"

    # 5. Verificar cambios
    print("📋 Verificando cambios...")
    result = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
    if not result.stdout.strip():
        print("⚠️  No hay cambios para comitear")
        return True, "Sin cambios para subir"

    # 6. Commit
    commit_message = f"Add: Nuevo artículo '{title}'\n\n🤖 Generado automáticamente con POST-AUTO\n📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n🎨 Imagen IA incluida\n\nCo-Authored-By: Claude <noreply@anthropic.com>"

    if not run_git_command(["git", "commit", "-m", commit_message], "Creando commit"):
        return False, "Error creando commit"

    # 7. Push a GitHub
    if not run_git_command(["git", "push", "origin", "main"], "Subiendo a GitHub"):
        return False, "Error subiendo a GitHub"

    return True, "Subida exitosa"

def main():
    """Función principal del script."""

    print("🚀 **POST-AUTO - Generador Automático de Artículos**")
    print("=" * 60)

    # Obtener argumentos
    if len(sys.argv) < 3:
        print("📋 **Uso:**")
        print("   python3 scripts/post-auto.py --topic 'Tema del artículo' --category ia")
        print("\n📁 **Categorías disponibles:**")
        print("   • ia        - Inteligencia Artificial")
        print("   • blockchain - Blockchain y Criptomonedas")
        print("   • tutoriales - Tutoriales y Guías")
        print("\n✨ **Características:**")
        print("   • 100% GRATIS - NO requiere API keys")
        print("   • Generación automática de contenido")
        print("   • Imágenes IA gratuitas")
        print("   • Subida automática a GitHub")
        print("   • Flujo robusto con manejo de errores")
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

    print(f"\n📋 **Detalles del artículo:**")
    print(f"   🎯 Tema: {topic}")
    print(f"   📁 Categoría: {category}")
    print(f"   💰 Costo: $0.00 (100% GRATIS)")
    print(f"   🎨 Imagen: Automática con IA")
    print(f"   📤 GitHub: Subida automática")

    # 1. Generar metadata
    print(f"\n📝 **PASO 1: Generando metadata...**")
    metadata = generate_metadata(topic, category)
    print(f"✅ Título: {metadata['title']}")
    print(f"✅ Tags: {', '.join(metadata['tags'])}")

    # 2. Generar contenido
    print(f"\n📄 **PASO 2: Generando contenido...**")
    content = generate_content(topic, category)
    print(f"✅ Contenido generado ({len(content)} caracteres)")

    # 3. Generar imagen
    print(f"\n🎨 **PASO 3: Generando imagen...**")
    image_url, image_prompt = generate_image_url(topic, category)
    print(f"✅ Imagen generada: {image_prompt[:50]}...")

    # 4. Crear archivo
    print(f"\n📝 **PASO 4: Creando archivo markdown...**")

    now = datetime.now()
    date_str = now.strftime('%Y-%m-%d %H:%M:%S -0500')
    filename_date = now.strftime('%Y-%m-%d')
    title_slug = slugify(metadata['title'])
    filename = f"{filename_date}-{title_slug}.md"

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

    print(f"✅ Archivo creado: {filepath}")
    print(f"📊 Tamaño del archivo: {os.path.getsize(filepath)} bytes")

    # 5. Subir a GitHub
    print(f"\n📤 **PASO 5: Subiendo a GitHub...**")

    success, message = upload_to_github(filename, metadata['title'])

    if success:
        print(f"\n🎉 **¡ARTÍCULO PUBLICADO EXITOSAMENTE!**")
        print("=" * 60)
        print(f"📋 Título: {metadata['title']}")
        print(f"📁 Archivo: {filename}")
        print(f"🏷️  Tags: {', '.join(metadata['tags'])}")
        print(f"🎨 Imagen: Generada con IA gratuita")
        print(f"💰 Costo: $0.00")
        print(f"📤 GitHub: ✅ Subido exitosamente")
        print(f"⏰ Tiempo: {datetime.now().strftime('%H:%M:%S')}")
        print(f"\n🌐 ¡Tu artículo ya está disponible en el blog!")
        print(f"🔗 Revisa tu sitio web para verlo publicado")
    else:
        print(f"\n⚠️  **ARTÍCULO CREADO PERO NO SUBIDO**")
        print("=" * 50)
        print(f"❌ Error: {message}")
        print(f"📁 Archivo local: {filepath}")
        print(f"\n📋 **Para subirlo manualmente:**")
        print(f"   git add _posts/{filename}")
        print(f"   git commit -m 'Add: Nuevo artículo'")
        print(f"   git push origin main")

    return 0 if success else 1

if __name__ == '__main__':
    exit(main())