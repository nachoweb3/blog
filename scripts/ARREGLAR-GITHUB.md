# 🔧 SOLUCIÓN COMPLETA AL PROBLEMA DE GITHUB

## Problema Identificado
```
remote: Permission to nachoweb3/blog.git denied to nachodacal.
fatal: unable to access 'https://github.com/nachoweb3/blog.git/': The requested URL returned error: 403
```

**Causa:** Tu usuario local de git (`nachodacal`) no tiene permisos para hacer push al repositorio `nachoweb3/blog.git`.

## Solución 1: Usar Personal Access Token (PAT) - RECOMENDADO

### Paso 1: Generar GitHub PAT
1. Ve a: https://github.com/settings/tokens
2. Click en "Generate new token" → "Generate new token (classic)"
3. Configura:
   - **Note**: Blog Auto Generator
   - **Expiration**: 90 days
   - **Select scopes**: Marca `repo` y `workflow`
4. Click en "Generate token"
5. **COPIA EL TOKEN INMEDIATAMENTE** (solo se muestra una vez)

### Paso 2: Configurar el token
Ejecuta el script de ayuda:
```bash
python3 scripts/github-auth-helper.py
```

O manualmente:

1. Edita `scripts/.env`:
```bash
# Reemplaza YOUR_GITHUB_PAT_HERE con tu token real
GITHUB_TOKEN=ghp_tu_token_aqui
```

2. Configura git con el token:
```bash
git remote set-url origin https://ghp_tu_token_aqui@github.com/nachoweb3/blog.git
```

### Paso 3: Probar
```bash
git push origin main
```

## Solución 2: GitHub CLI - Alternativa

### Instalar GitHub CLI
```bash
# Ubuntu/WSL
sudo apt update
sudo apt install gh

# Verificar instalación
gh --version
```

### Autenticarse
```bash
gh auth login
```

Sigue las instrucciones:
1. ¿What account do you want to log into? → `GitHub.com`
2. ¿What is your preferred protocol? → `HTTPS`
3. ¿Authenticate Git with your GitHub credentials? → `Yes`
4. ¿How would you like to authenticate? → `Login with a web browser`

Luego ejecuta el script normal:
```bash
python3 scripts/post-auto.py --topic "Tu tema" --category ia
```

## Solución 3: Configurar usuario de git correctamente

```bash
# Configurar tu email de GitHub
git config --global user.email "tu-email@github.com"

# Configurar tu nombre de GitHub
git config --global user.name "nachoweb3"

# Verificar configuración
git config --list
```

## Solución 4: Fork del repositorio (si no eres dueño)

Si no eres dueño del repositorio `nachoweb3/blog.git`:

1. **Fork el repositorio** en GitHub
2. **Clonar tu fork**:
```bash
git clone https://github.com/tu-usuario/blog.git
cd blog
```
3. **Configurar upstream**:
```bash
git remote add upstream https://github.com/nachoweb3/blog.git
```

## Verificar qué solución aplicar

### Ejecuta esto para diagnosticar:
```bash
# Verificar usuario actual
git config user.name
git config user.email

# Verificar dueño del repositorio
git remote -v

# Probar conexión
git ls-remote origin
```

### Según el resultado:

- Si `user.name` no es `nachoweb3` → **Solución 3**
- Si eres dueño del repo → **Solución 1** o **2**
- Si no eres dueño → **Solución 4**

## Probar la solución final

Después de aplicar una solución:
```bash
# Crear un post de prueba
python3 scripts/post-auto.py --topic "Prueba de conexión" --category ia

# Si todo funciona, verás:
# 🎉 ¡ARTÍCULO PUBLICADO EXITOSAMENTE!
```

## Soporte

Si ninguna solución funciona:
1. Verifica que tienes acceso al repositorio `nachoweb3/blog.git`
2. Confirma que tienes permisos de escritura
3. Contacta al administrador del repositorio si es necesario

---

*Última actualización: 16 de noviembre de 2025*
*Para soporte adicional, ejecuta: `python3 scripts/github-auth-helper.py`*