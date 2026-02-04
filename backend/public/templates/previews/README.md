# Template Preview Images

## Ubicación
Esta carpeta contiene las imágenes de preview de las plantillas de CV.

## Imágenes requeridas

Coloca las siguientes imágenes en esta carpeta:

### 1. harvard_classic.png
- **Nombre del archivo:** `harvard_classic.png`
- **Descripción:** Vista previa de la plantilla Harvard Classic
- **Resolución recomendada:** 800x1100px (formato A4 proporcional)
- **Formato:** PNG
- **URL pública:** `https://api-cv.servercontrol-mzt.com/templates/previews/harvard_classic.png`

### 2. harvard_modern.png
- **Nombre del archivo:** `harvard_modern.png`
- **Descripción:** Vista previa de la plantilla Harvard Modern
- **Resolución recomendada:** 800x1100px (formato A4 proporcional)
- **Formato:** PNG
- **URL pública:** `https://api-cv.servercontrol-mzt.com/templates/previews/harvard_modern.png`

## Cómo generar las imágenes

Puedes generar screenshots de las plantillas usando:

1. **Desde el navegador:**
   - Abre la vista previa del CV: `GET /api/profiles/:id/preview-html`
   - Toma un screenshot de la página completa
   - Redimensiona a 800x1100px

2. **Usando Puppeteer (script automatizado):**
   ```javascript
   const puppeteer = require('puppeteer');

   async function generatePreviewImage() {
     const browser = await puppeteer.launch();
     const page = await browser.newPage();
     await page.setViewport({ width: 800, height: 1100 });
     await page.setContent(htmlContent);
     await page.screenshot({
       path: 'public/templates/previews/harvard_classic.png',
       fullPage: true
     });
     await browser.close();
   }
   ```

## Verificar que las imágenes se sirven correctamente

Después de colocar las imágenes, verifica que se pueden acceder:

```bash
# Local
curl http://localhost:5001/templates/previews/harvard_classic.png

# Producción
curl https://api-cv.servercontrol-mzt.com/templates/previews/harvard_classic.png
```

## Estructura de carpetas

```
backend/
├── public/
│   └── templates/
│       └── previews/
│           ├── harvard_classic.png   ← Coloca aquí
│           ├── harvard_modern.png    ← Coloca aquí
│           └── README.md             ← Este archivo
```
