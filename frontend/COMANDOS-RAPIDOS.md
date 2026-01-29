# 🚀 Comandos Rápidos - Frontend

## Desarrollo

```bash
# Iniciar servidor de desarrollo
cd frontend
npm run dev

# El servidor se abrirá en:
# http://localhost:5174 (o siguiente puerto disponible)
```

## Build

```bash
# Compilar para producción
npm run build

# Preview del build
npm run preview
```

## Mantenimiento

```bash
# Limpiar caché de Vite
rm -rf node_modules/.vite .vite

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Actualizar dependencias
npm update
```

## Estructura de Rutas

### Públicas (no requieren autenticación)
- `/login` - Página de inicio de sesión
- `/register` - Página de registro

### Privadas (requieren autenticación)
- `/dashboard` - Panel principal
- `/` - Redirecciona a `/dashboard`

## Variables de Entorno

Editar `.env`:
```env
VITE_API_URL=https://api-cv.servercontrol-mzt.com
VITE_API_TIMEOUT=10000
```

## Troubleshooting

### Puerto en uso
Si el puerto 5174 está ocupado, Vite automáticamente usará el siguiente disponible.

### Errores de TypeScript
```bash
# Limpiar caché de TypeScript
rm -rf node_modules/.tmp
```

### Hot Reload no funciona
```bash
# Reiniciar con caché limpio
rm -rf node_modules/.vite
npm run dev -- --force
```

### Errores de import
Verificar que estés usando los path aliases correctos:
- `@app-types/*` (no `@types/*`)
- `import type` para tipos cuando uses `verbatimModuleSyntax`

## Estado del Servidor

Para verificar si el servidor está corriendo:
```bash
# Ver procesos de Node
tasklist | findstr node

# Matar proceso si es necesario
taskkill /F /IM node.exe
```

## Git

```bash
# Ver estado
git status

# Agregar cambios del frontend
git add frontend/

# Commit
git commit -m "feat: setup inicial del frontend"

# Push
git push origin feat/frontend
```

## Navegación del Proyecto

```bash
# Directorio del proyecto
cd c:/Users/Alexis Diaz/Documents/AlexisD/Trabajos/Nocompila/view-cv

# Frontend
cd frontend

# Ver estructura
tree /F src
```

## Accesos Directos

### URLs Importantes
- **Dev Server:** http://localhost:5177
- **API Backend:** https://api-cv.servercontrol-mzt.com

### Archivos Clave
- Configuración Vite: `vite.config.ts`
- Configuración TS: `tsconfig.app.json`
- Variables de entorno: `.env`
- Entry point: `src/main.tsx`
- App principal: `src/App.tsx`
- Redux store: `src/redux/store.ts`

## Testing Rápido

### Probar Login
1. Ir a http://localhost:5177/login
2. Ingresar email y password
3. Verificar redirección a dashboard

### Probar Tema
1. Hacer clic en icono de sol/luna en navbar
2. Verificar cambio de tema
3. Recargar página y verificar persistencia

### Probar Idioma
1. Hacer clic en icono de idioma
2. Seleccionar Español o Inglés
3. Verificar cambio de textos
4. Recargar y verificar persistencia

## Logs y Debug

### Ver logs del servidor
Los logs se muestran en la terminal donde ejecutaste `npm run dev`

### React DevTools
Instalar extensión de Chrome/Firefox:
- React Developer Tools
- Redux DevTools

### Ver estado de Redux
1. Abrir Redux DevTools en el navegador
2. Inspeccionar `auth` y `theme` slices
3. Ver actions y state changes

## Performance

### Análisis del bundle
```bash
npm run build
# Los archivos se generan en frontend/dist/
```

### Tamaño del bundle
Después del build, ver el tamaño en la terminal o en `dist/`

## Documentación

- **Setup completo:** `README-SETUP.md`
- **Fase 1 completa:** `FASE-1-COMPLETADA.md`
- **Este archivo:** `COMANDOS-RAPIDOS.md`
