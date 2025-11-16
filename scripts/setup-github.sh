#!/bin/bash

echo "🔧 **CONFIGURACIÓN AUTOMÁTICA DE GITHUB**"
echo "========================================"

echo "Esta guía te ayudará a configurar GitHub para que el script funcione automáticamente."
echo ""
echo "Elige una opción:"
echo "1. Configurar SSH Key (Recomendado)"
echo "2. Configurar Personal Access Token"
echo "3. Instalar GitHub CLI"
echo "4. Verificar configuración actual"
echo ""

read -p "Elige una opción (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🔑 **CONFIGURANDO SSH KEY**"
        echo "==========================="

        echo "1. Generando SSH key..."
        ssh-keygen -t ed25519 -C "blog@nachoweb3.com"

        echo "2. Iniciando SSH agent..."
        eval "$(ssh-agent -s)"

        echo "3. Agregando key al agent..."
        ssh-add ~/.ssh/id_ed25519

        echo ""
        echo "4. Copia esta key pública:"
        echo "=========================="
        cat ~/.ssh/id_ed25519.pub
        echo "=========================="

        echo ""
        echo "5. Sigue estos pasos:"
        echo "   a) Ve a https://github.com/settings/keys"
        echo "   b) Clic en 'New SSH key'"
        echo "   c) Pega la key de arriba"
        echo "   d) Dale un nombre: 'Blog Laptop'"

        read -p "Presiona Enter cuando hayas agregado la key a GitHub..."

        echo "6. Configurando remote con SSH..."
        git remote set-url origin git@github.com:nachoweb3/blog.git

        echo "7. Probando conexión..."
        ssh -T git@github.com

        echo "✅ ¡SSH configurado!"
        ;;

    2)
        echo ""
        echo "🎫 **CONFIGURANDO PERSONAL ACCESS TOKEN**"
        echo "========================================"

        echo "1. Ve a https://github.com/settings/tokens"
        echo "2. Clic en 'Generate new token (classic)'"
        echo "3. Selecciona scopes: repo, workflow"
        echo "4. Genera y copia el token"

        read -p "Pega tu token aquí: " token

        echo "3. Configurando remote con token..."
        git remote set-url origin https://$token@github.com/nachoweb3/blog.git

        echo "✅ ¡Token configurado!"
        ;;

    3)
        echo ""
        echo "📱 **INSTALANDO GITHUB CLI**"
        echo "============================"

        # Detectar el sistema operativo
        if command -v apt &> /dev/null; then
            echo "Instalando en Ubuntu/Debian..."
            sudo apt update && sudo apt install gh -y
        elif command -v brew &> /dev/null; then
            echo "Instalando en Mac..."
            brew install gh
        elif command -v pacman &> /dev/null; then
            echo "Instalando en Arch Linux..."
            sudo pacman -S github-cli
        else
            echo "No se detectó el gestor de paquetes. Instala manualmente:"
            echo "https://cli.github.com/manual/installation"
            exit 1
        fi

        echo ""
        echo "Ahora configura GitHub CLI:"
        echo "gh auth login"
        echo "(Sigue las instrucciones: selecciona HTTPS, almacena credenciales)"

        gh auth login

        echo "✅ ¡GitHub CLI configurado!"
        ;;

    4)
        echo ""
        echo "🔍 **VERIFICANDO CONFIGURACIÓN ACTUAL**"
        echo "====================================="

        echo "1. Configuración de usuario git:"
        git config --list | grep user

        echo ""
        echo "2. Remotes configurados:"
        git remote -v

        echo ""
        echo "3. Probando conexión con GitHub..."
        if git ls-remote origin &> /dev/null; then
            echo "✅ Conexión exitosa con GitHub"
        else
            echo "❌ Error de conexión con GitHub"
            echo "   Necesitas configurar la autenticación"
        fi

        echo ""
        echo "4. Probando push..."
        if git push --dry-run origin main &> /dev/null; then
            echo "✅ Push debería funcionar"
        else
            echo "❌ Push fallaría"
        fi
        ;;

    *)
        echo "Opción no válida"
        exit 1
        ;;
esac

echo ""
echo "🧪 **PRUEBA FINAL**"
echo "==================="
echo "Para probar que todo funciona, ejecuta:"
echo "git push origin main"
echo ""
echo "Si funciona, el script post-auto.py subirá artículos automáticamente."