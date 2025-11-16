#!/usr/bin/env python3
"""
Script de ayuda para configurar GitHub Personal Access Token (PAT)
Resuelve problemas de autenticación con el repositorio nachoweb3/blog.git
"""

import os
import subprocess
import sys
from pathlib import Path

def print_banner():
    """Muestra el banner del script."""
    print("🔐 **GITHUB AUTH HELPER - Configuración de PAT**")
    print("=" * 60)
    print("Este script te ayudará a configurar la autenticación con GitHub")
    print("para resolver el problema: 'Permission denied to nachoweb3/blog.git'")
    print("=" * 60)

def check_git_config():
    """Verifica la configuración actual de git."""
    try:
        print("\n📋 **VERIFICANDO CONFIGURACIÓN ACTUAL**")

        # Verificar remote
        result = subprocess.run(["git", "remote", "-v"], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Remotes configurados:")
            for line in result.stdout.strip().split('\n'):
                if line.strip():
                    print(f"   {line}")
        else:
            print("❌ No hay remotes configurados")
            return False

        # Verificar usuario
        email_result = subprocess.run(["git", "config", "user.email"], capture_output=True, text=True)
        name_result = subprocess.run(["git", "config", "user.name"], capture_output=True, text=True)

        if email_result.returncode == 0 and name_result.returncode == 0:
            print(f"✅ Usuario configurado: {name_result.stdout.strip()} <{email_result.stdout.strip()}>")
        else:
            print("⚠️  Usuario git no configurado")

        return True

    except Exception as e:
        print(f"❌ Error verificando configuración: {e}")
        return False

def test_current_connection():
    """Prueba la conexión actual con GitHub."""
    try:
        print("\n🔍 **PROBANDO CONEXIÓN ACTUAL**")

        result = subprocess.run(
            ["git", "ls-remote", "origin"],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            print("✅ Conexión con GitHub exitosa")
            print("   No necesitas configurar PAT, ya tienes acceso")
            return True
        else:
            print(f"❌ Error de conexión:")
            print(f"   {result.stderr}")

            if "Permission denied" in result.stderr:
                print("   👉 Este es el problema que resolveremos con PAT")
            elif "authentication failed" in result.stderr.lower():
                print("   👉 Problema de autenticación, lo resolveremos con PAT")

            return False

    except subprocess.TimeoutExpired:
        print("❌ Timeout en la conexión")
        return False
    except Exception as e:
        print(f"❌ Error probando conexión: {e}")
        return False

def show_pat_instructions():
    """Muestra las instrucciones para generar PAT."""
    print("\n📖 **PASOS PARA GENERAR GITHUB PAT**")
    print("=" * 50)

    steps = [
        ("1", "Ve a GitHub Settings", "https://github.com/settings/tokens"),
        ("2", "Click en 'Generate new token'", "Luego 'Generate new token (classic)'"),
        ("3", "Configura el token:", ""),
        ("", "• Note: Blog Auto Generator", ""),
        ("", "• Expiration: 90 days (recomendado)", ""),
        ("", "• Scopes: Selecciona 'repo' y 'workflow'", ""),
        ("4", "Click en 'Generate token'", ""),
        ("5", "Copia el token INMEDIATAMENTE", "Solo se muestra una vez"),
        ("6", "Vuelve a este script y pega el token", "")
    ]

    for num, desc, detail in steps:
        if num:
            print(f"{num}. {desc}")
        if detail:
            print(f"   {detail}")
        print()

def configure_env_file(token):
    """Configura el archivo .env con el token."""
    try:
        print("\n⚙️ **CONFIGURANDO ARCHIVO .env**")

        # Buscar archivo .env
        script_dir = Path(__file__).parent
        env_file = script_dir / '.env'

        if not env_file.exists():
            print("❌ Archivo .env no encontrado en:", script_dir)
            print("   Asegúrate de estar en el directorio correcto del blog")
            return False

        # Leer archivo actual
        with open(env_file, 'r') as f:
            content = f.read()

        # Reemplazar el token placeholder
        if 'GITHUB_TOKEN=YOUR_GITHUB_PAT_HERE' in content:
            content = content.replace('GITHUB_TOKEN=YOUR_GITHUB_PAT_HERE', f'GITHUB_TOKEN={token}')
        elif 'GITHUB_TOKEN=' in content:
            # Reemplazar token existente
            import re
            content = re.sub(r'GITHUB_TOKEN=.*', f'GITHUB_TOKEN={token}', content)
        else:
            # Agregar al final
            content += f'\n# GitHub Personal Access Token\nGITHUB_TOKEN={token}\n'

        # Escribir archivo actualizado
        with open(env_file, 'w') as f:
            f.write(content)

        print(f"✅ Token configurado en: {env_file}")
        print("   🔒 El token está guardado de forma segura")
        return True

    except Exception as e:
        print(f"❌ Error configurando .env: {e}")
        return False

def setup_git_remote_with_token(token):
    """Configura el remote de git con el token."""
    try:
        print("\n🔧 **CONFIGURANDO GIT REMOTE CON PAT**")

        # Crear URL con token
        pat_url = f"https://{token}@github.com/nachoweb3/blog.git"

        # Configurar el remote
        result = subprocess.run(
            ["git", "remote", "set-url", "origin", pat_url],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print("✅ Remote configurado con PAT")
            return True
        else:
            print(f"❌ Error configurando remote: {result.stderr}")
            return False

    except Exception as e:
        print(f"❌ Error configurando remote: {e}")
        return False

def test_pat_connection():
    """Prueba la conexión con el PAT configurado."""
    try:
        print("\n🧪 **PROBANDO CONEXIÓN CON PAT**")

        result = subprocess.run(
            ["git", "ls-remote", "origin"],
            capture_output=True,
            text=True,
            timeout=15
        )

        if result.returncode == 0:
            print("✅ ¡Conexión exitosa con PAT!")
            print("   Ya puedes hacer push y pull del repositorio")
            return True
        else:
            print(f"❌ Error con PAT:")
            print(f"   {result.stderr}")
            return False

    except subprocess.TimeoutExpired:
        print("❌ Timeout en la conexión con PAT")
        return False
    except Exception as e:
        print(f"❌ Error probando PAT: {e}")
        return False

def get_token_from_user():
    """Obtiene el token del usuario de forma segura."""
    while True:
        try:
            print("\n🔑 **INGRESA TU GITHUB PAT**")
            print("   (Pega el token que generaste en GitHub)")

            # Usar getpass para ocultar el token
            token = getpass.getpass("GitHub PAT: ").strip()

            if not token:
                print("❌ El token no puede estar vacío")
                continue

            if len(token) < 20:
                print("❌ El token parece demasiado corto")
                continue

            # Verificar formato básico (ghp_ para tokens clásicos)
            if not token.startswith('ghp_') and not token.startswith('github_pat_'):
                print("⚠️  El token no parece tener el formato correcto")
                print("   Los tokens clásicos empiezan con 'ghp_'")
                confirm = input("¿Continuar de todos modos? (s/N): ").lower()
                if confirm != 's':
                    continue

            return token

        except KeyboardInterrupt:
            print("\n\n❌ Operación cancelada")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error leyendo token: {e}")

def main():
    """Función principal."""
    print_banner()

    # 1. Verificar configuración actual
    if not check_git_config():
        return 1

    # 2. Probar conexión actual
    if test_current_connection():
        print("\n🎉 **YA TIENES ACCESO A GITHUB**")
        print("   No necesitas configurar PAT en este momento")
        return 0

    # 3. Mostrar instrucciones para generar PAT
    show_pat_instructions()

    # 4. Preguntar si ya tiene el token
    has_token = input("\n❓ ¿Ya generaste tu GitHub PAT? (s/N): ").lower()

    if has_token != 's':
        print("\n📖 **Genera tu PAT primero y luego ejecuta este script nuevamente**")
        print("   Abre: https://github.com/settings/tokens")
        return 1

    # 5. Obtener token
    token = get_token_from_user()

    # 6. Configurar archivo .env
    if not configure_env_file(token):
        print("\n❌ Error configurando .env, intentando configuración temporal...")

    # 7. Configurar git remote con token
    if not setup_git_remote_with_token(token):
        print("\n❌ Error configurando remote con PAT")
        return 1

    # 8. Probar conexión
    if test_pat_connection():
        print("\n🎉 **¡CONFIGURACIÓN COMPLETA!**")
        print("=" * 50)
        print("✅ GitHub PAT configurado correctamente")
        print("✅ Archivo .env actualizado")
        print("✅ Git remote configurado")
        print("✅ Conexión con GitHub verificada")
        print("\n🚀 **YA PUEDES USAR POST-AUTO SIN ERRORES**")
        print("   Ejecuta: python3 scripts/post-auto.py --topic 'Tema' --category ia")
        return 0
    else:
        print("\n❌ **FALLO EN LA CONFIGURACIÓN**")
        print("   Revisa tu token e intenta nuevamente")
        return 1

if __name__ == '__main__':
    exit(main())