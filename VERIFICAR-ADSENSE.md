# 🔐 Verificación de AdSense - Guía Rápida

## ❌ Error actual: "No se ha podido verificar su sitio"

## ✅ Solución paso a paso

### Paso 1: Obtén tu código de verificación

1. **Ve a Google AdSense**: https://www.google.com/adsense
2. **Inicia sesión** con tu cuenta
3. **Busca el sitio** que agregaste: `https://nachoweb3.github.io/blog`
4. **Haz clic en "Verificar propiedad"**
5. **Selecciona el método "Meta tag HTML"** (ya está configurado)
6. **Copia el código** que te proporciona AdSense

**El código se verá así:**
```html
<meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
```

### Paso 2: Agrega el código a tu configuración

**Edita el archivo:** `/mnt/c/Users/Usuario/Desktop/blog/_config.yml`

**Reemplaza esta línea:**
```yaml
google_site_verification: ""  # AGREGA AQUÍ TU CÓDIGO DE VERIFICACIÓN DE ADSENSE
```

**Por esto:**
```yaml
google_site_verification: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"  # Tu código real de AdSense
```

### Paso 3: Sube los cambios a GitHub

```bash
# Desde la carpeta del blog
git add _config.yml
git commit -m "Add AdSense site verification code"
git push origin main
```

### Paso 4: Verifica en AdSense

1. **Espera 5-10 minutos** después de subir los cambios
2. **Refresca la página de AdSense**
3. **Haz clic en "Verificar ahora"**
4. **Debería mostrar "✅ Sitio verificado"**

## 🔍 ¿Cómo saber si funcionó?

**Verifica manualmente:**
1. Ve a: https://nachoweb3.github.io/blog
2. Haz clic derecho → "Ver código fuente de la página"
3. Busca (Ctrl+F): `google-site-verification`
4. Deberías ver tu código

**O con comando:**
```bash
curl https://nachoweb3.github.io/blog | grep "google-site-verification"
```

## ⚡ Si sigues teniendo problemas

### Opción 1: Usa Google Search Console primero
1. Ve a: https://search.google.com/search-console
2. Agrega tu sitio: `https://nachoweb3.github.io/blog`
3. Verifica con el mismo método (meta tag)
4. Luego vuelve a AdSense y debería funcionar

### Opción 2: Verifica que el sitio sea accesible
```bash
# Prueba que el sitio responde
curl -I https://nachoweb3.github.io/blog

# Debe mostrar: HTTP/2 200
```

### Opción 3: Espera más tiempo
A veces AdSense tarda hasta 24 horas en verificar, incluso con todo configurado correctamente.

## 📋 Checklist antes de verificar

- [ ] **Código copiado** correctamente de AdSense
- [ ] **Agregado a _config.yml** (sin comillas extra)
- [ ] **Cambios subidos** a GitHub
- [ ] **Sitio accesible** en https://nachoweb3.github.io/blog
- [ ] **Meta tag visible** en el código fuente

## 🚀 Una vez verificado

Después de la verificación:
1. **Espera la aprobación** de AdSense (1-2 semanas)
2. **Los anuncios开始** a aparecer
3. **Configura pagos** en tu panel de AdSense
4. **Monitorea ingresos** desde el dashboard

---

**¿Necesitas ayuda para obtener el código de AdSense?** Dime qué ves en tu panel de AdSense y te ayudo paso a paso.