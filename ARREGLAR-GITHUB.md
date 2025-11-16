# 🔧 Cómo solucionar el problema de permisos de GitHub

## ❌ El problema
```
remote: Permission to nachoweb3/blog.git denied to nachodacal
```

## ✅ Soluciones (elige una)

### Opción 1: Usar SSH Key (Recomendado)

1. **Generar SSH Key:**
```bash
ssh-keygen -t ed25519 -C "tu-email@example.com"
# Presiona Enter para aceptar defaults
```

2. **Iniciar SSH agent:**
```bash
eval "$(ssh-agent -s)"
```

3. **Agregar la key al agent:**
```bash
ssh-add ~/.ssh/id_ed25519
```

4. **Copiar la key pública:**
```bash
cat ~/.ssh/id_ed25519.pub
# Copia todo el resultado
```

5. **Agregar a GitHub:**
   - Ve a https://github.com/settings/keys
   - Clic en "New SSH key"
   - Pega la key copiada
   - Dale un nombre (ej: "Blog Laptop")

6. **Cambiar el remote a SSH:**
```bash
git remote set-url origin git@github.com:nachoweb3/blog.git
```

7. **Probar conexión:**
```bash
ssh -T git@github.com
# Debe decir: Hi nachoweb3! You've successfully authenticated...
```

### Opción 2: Personal Access Token

1. **Crear Token en GitHub:**
   - Ve a https://github.com/settings/tokens
   - Clic en "Generate new token (classic)"
   - Selecciona scopes: `repo`, `workflow`
   - Genera y copia el token

2. **Configurar git con token:**
```bash
git remote set-url origin https://tu-token@github.com/nachoweb3/blog.git
```

### Opción 3: GitHub CLI (Más fácil)

1. **Instalar GitHub CLI:**
```bash
# En Ubuntu/Debian:
sudo apt install gh
# En Mac:
brew install gh
```

2. **Autenticarse:**
```bash
gh auth login
# Sigue las instrucciones (elige HTTPS, almacena credenciales)
```

## 🚀 Después de configurar

Una vez resuelto el problema de autenticación, el script funcionará perfectamente:

```bash
python3 scripts/post-auto.py --topic "Tu tema" --category ia
```

## 🧪 Para probar que funciona

Después de configurar la autenticación, prueba:

```bash
# Este comando debe funcionar sin pedir contraseña
git push origin main
```

Si funciona, el script `post-auto.py` subirá los artículos automáticamente.

---

**💡 Recomendación:** Usa la Opción 1 (SSH) si planeas trabajar con GitHub regularmente. Es la más segura y permanente.