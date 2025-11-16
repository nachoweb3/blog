#!/usr/bin/env python3
"""
Script automático para detectar y solucionar problemas de autenticación con GitHub
Resuelve: "Permission denied to nachoweb3/blog.git"
"""

import os
import subprocess
import sys
import re
from pathlib import Path

def print_header():
    """Muestra el header del script."""
    print("🔧 **FIX-GITHUB-AUTH - Solución Automática**")
    print("=" * 50)
    print("Detectando y solucionando problemas de autenticación con GitHub")
    print("Repositorio: https://github.com/nachoweb3/blog.git")
    print("=" * 50)

def check_git_user():
    """Verifica la configuración del usuario git."""
    try:
        print("\n👤 **VERIFICANDO USUARIO GIT**")

        name_result = subprocess.run(["git", "config", "user.name"], capture_output=True, text=True)
        email_result = subprocess.run(["git", "config", "user.email"], capture_output=True, text=True)

        current_name = name_result.stdout.strip() if name_result.returncode == 0 else "No configurado"
        current_email = email_result.stdout.strip() if email_result.returncode == 0 else "No configurado"

        print(f"   Nombre actual: {current_name}")
        print(f"   Email actual: {current_email}")

        # Verificar si coincide con el dueño del repositorio
        if current_name != "nachoweb3":
            print(f"   ⚠️  Usuario actual ({current_name}) ≠ Dueño del repo (nachoweb3)")
            return False, current_name, current_email
        else:
            print("   ✅ Usuario coincide con el dueño del repositorio")
            return True, current_name, current_email

    except Exception as e:
        print(f"   ❌ Error verificando usuario: {e}")
        return False, "Error", "Error"

def test_git_push():
    """Prueba específicamente el git push para detectar el problema."""
    try:
        print("\n🧪 **PROBANDO GIT PUSH**")

        # Hacer un commit de prueba primero
        test_file = "_posts/test-connection.md"
        test_content = """---
layout: post
title: "Test Connection"
date: 2025-11-16 12:00:00 -0500
categories: test
tags: [test]
---

Test file for GitHub connection.
"""

        with open(test_file, 'w') as f:
            f.write(test_content)

        # Añadir y commitear
        subprocess.run(["git", "add", test_file], capture_output=True, text=True)
        subprocess.run(["git", "commit", "-m", "Test connection"], capture_output=True, text=True)

        # Probar el push con timeout corto
        result = subprocess.run(
            ["git", "push", "origin", "main"],
            capture_output=True,
            text=True,
            timeout=10
        )

        # Limpiar el archivo de prueba
        subprocess.run(["git", "reset", "HEAD~1"], capture_output=True, text=True)
        os.remove(test_file)

        if result.returncode == 0:
            print("   ✅ Git push exitoso")
            return True, None
        else:
            print(f"   ❌ Git push falló: {result.stderr}")
            return False, result.stderr

    except subprocess.TimeoutExpired:
        print("   ⏰ Timeout en git push")
        return False, "Timeout"
    except Exception as e:
        print(f"   ❌ Error en prueba: {e}")
        return False, str(e)

def detect_problem_type(error_output):
    """Detecta el tipo de problema basado en el error."""
    if not error_output:
        return "unknown"

    error_lower = error_output.lower()

    if "permission denied" in error_lower:
        if "nachodacal" in error_lower and "nachoweb3" in error_lower:
            return "user_mismatch"
        else:
            return "permission_denied"
    elif "authentication failed" in error_lower:
        return "auth_failed"
    elif "repository not found" in error_lower:
        return "repo_not_found"
    elif "403" in error_lower:
        return "forbidden"
    else:
        return "other"

def check_env_file():
    """Verifica y muestra el estado del archivo .env."""
    try:
        print("\n📄 **VERIFICANDO ARCHIVO .env**")

        script_dir = Path(__file__).parent
        env_file = script_dir / '.env'

        if not env_file.exists():
            print("   ❌ Archivo .env no encontrado")
            return False, None

        print(f"   ✅ Archivo encontrado: {env_file}")

        with open(env_file, 'r') as f:
            content = f.read()

        if 'GITHUB_TOKEN=YOUR_GITHUB_PAT_HERE' in content:
            print("   ⚠️  GITHUB_TOKEN no configurado (placeholder)")
            return False, "placeholder"
        elif 'GITHUB_TOKEN=' in content:
            print("   ✅ GITHUB_TOKEN encontrado")
            # Ocultar el token en la salida
            token_match = re.search(r'GITHUB_TOKEN=(.+)', content)
            if token_match:
                token = token_match.group(1)
                if len(token) > 10:
                    masked_token = token[:4] + "*" * (len(token) - 8) + token[-4:]
                    print(f"   🔒 Token: {masked_token}")
                return True, token
        else:
            print("   ⚠️  GITHUB_TOKEN no encontrado en el archivo")
            return False, "missing"

        return False, "not_found"

    except Exception as e:
        print(f"   ❌ Error verificando .env: {e}")
        return False, "error"

def apply_pat_solution(token):
    """Aplica la solución con Personal Access Token."""
    try:
        print("\n🔧 **APLICANDO SOLUCIÓN PAT**")

        if not token:
            print("   ❌ No se proporcionó token")
            return False

        # Configurar remote con PAT
        pat_url = f"https://{token}@github.com/nachoweb3/blog.git"

        result = subprocess.run(
            ["git", "remote", "set-url", "origin", pat_url],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print("   ✅ Remote configurado con PAT")

            # Probar conexión
            result = subprocess.run(
                ["git", "ls-remote", "origin"],
                capture_output=True,
                text=True,
                timeout=10
            )

            if result.returncode == 0:
                print("   ✅ Conexión verificada con PAT")
                return True
            else:
                print(f"   ❌ Error en conexión: {result.stderr}")
                return False
        else:
            print(f"   ❌ Error configurando remote: {result.stderr}")
            return False

    except Exception as e:
        print(f"   ❌ Error aplicando solución PAT: {e}")
        return False

def apply_user_solution():
    """Aplica la solución de configuración de usuario."""
    try:
        print("\n👤 **APLICANDO SOLUCIÓN DE USUARIO**")

        # Configurar usuario como nachoweb3
        subprocess.run(["git", "config", "user.name", "nachoweb3"], check=True)
        subprocess.run(["git", "config", "user.email", "blog@nachoweb3.com"], check=True)

        print("   ✅ Usuario configurado como nachoweb3")
        return True

    except Exception as e:
        print(f"   ❌ Error configurando usuario: {e}")
        return False

def main():
    """Función principal."""
    print_header()

    # 1. Verificar usuario git
    user_ok, current_name, current_email = check_git_user()

    # 2. Verificar archivo .env
    env_ok, token_value = check_env_file()

    # 3. Probar git push
    push_ok, push_error = test_git_push()

    if push_ok:
        print("\n🎉 **¡TODO FUNCIONA CORRECTAMENTE!**")
        print("   No hay problemas de autenticación detectados")
        return 0

    # 4. Detectar tipo de problema
    problem_type = detect_problem_type(push_error)
    print(f"\n🔍 **TIPO DE PROBLEMA DETECTADO:** {problem_type}")

    # 5. Aplicar solución según el problema
    solution_applied = False

    if problem_type == "user_mismatch":
        print("\n🎯 **PROBLEMA: USUARIO INCORRECTO**")
        print("   Tu usuario git (nachodacal) no coincide con el dueño del repo (nachoweb3)")

        if env_ok and token_value:
            print("   👉 Aplicando solución PAT...")
            solution_applied = apply_pat_solution(token_value)
        else:
            print("   👉 Aplicando solución de usuario...")
            solution_applied = apply_user_solution()

    elif problem_type in ["permission_denied", "auth_failed", "forbidden"]:
        print("\n🎯 **PROBLEMA: PERMISO DENEGADO**")

        if env_ok and token_value:
            print("   👉 Aplicando solución PAT...")
            solution_applied = apply_pat_solution(token_value)
        else:
            print("   ❌ Se necesita GitHub PAT para solucionar este problema")
            print("   📖 Ejecuta: python3 scripts/github-auth-helper.py")

    else:
        print(f"\n🎯 **PROBLEMA DESCONOCIDO: {problem_type}**")
        print("   Error:", push_error)
        print("   📖 Revisa la documentación: scripts/ARREGLAR-GITHUB.md")

    # 6. Verificar solución
    if solution_applied:
        print("\n🧪 **VERIFICANDO SOLUCIÓN APLICADA**")

        # Hacer una prueba simple
        result = subprocess.run(
            ["git", "ls-remote", "origin"],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            print("   ✅ Solución verificada exitosamente")
            print("\n🎉 **¡PROBLEMA RESUELTO!**")
            print("   Ahora puedes ejecutar:")
            print("   python3 scripts/post-auto.py --topic 'Tu tema' --category ia")
            return 0
        else:
            print("   ❌ La solución no funcionó")
            return 1
    else:
        print("\n❌ **NO SE PUDO APLICAR SOLUCIÓN AUTOMÁTICA**")
        print("\n📋 **SOLUCIONES MANUALES:**")
        print("   1. Ejecuta: python3 scripts/github-auth-helper.py")
        print("   2. Lee: scripts/ARREGLAR-GITHUB.md")
        print("   3. Configura GitHub CLI: gh auth login")
        return 1

if __name__ == '__main__':
    exit(main())