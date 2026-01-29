# Fases de Desarrollo del Frontend - CV Generator

## Stack Tecnológico
- **React 18** con TypeScript
- **Vite** como build tool
- **Material UI (MUI) v5** para componentes
- **Redux Toolkit** para estado global
- **React Router v6** para navegación
- **Axios** para HTTP requests
- **React Hook Form + Yup** para formularios
- **i18next** para internacionalización
- **Emotion** para CSS-in-JS

## Backend API
- Base URL: `https://api-cv.servercontrol-mzt.com`
- Autenticación: JWT (access + refresh tokens)
- unico solo acepta cors de http://localhost:5173

---

## FASE 1: Setup Inicial y Sistema de Autenticación ✅
**Duración:** 7-10 días
**Estado:** ✅ PLAN DETALLADO COMPLETADO

### Objetivos
- ✅ Configurar proyecto Vite + TypeScript desde cero
- ✅ Implementar sistema de autenticación completo con JWT
- ✅ Configurar Redux Toolkit para estado global
- ✅ Crear tema Material UI con modo oscuro
- ✅ Implementar internacionalización (Español/Inglés)
- ✅ Crear componentes base reutilizables

### Archivos a Crear (~35 archivos)
- Configuración base (6 archivos)
- Internacionalización (3 archivos)
- Tema Material UI (6 archivos)
- Redux (4 archivos)
- Tipos TypeScript (4 archivos)
- API (3 archivos)
- Páginas de Auth (5 archivos)
- Routing (3 archivos)
- Componentes comunes (4 archivos)
- Utilities (1 archivo)
- Archivos principales (3 archivos)

### Endpoints Utilizados
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password/:token
GET  /api/auth/verify-email/:token
```

### Funcionalidades Implementadas
- [x] Registro de usuarios
- [x] Login con JWT
- [x] Logout
- [x] Recuperación de contraseña
- [x] Verificación de email
- [x] Refresh token automático
- [x] Rutas protegidas
- [x] Modo oscuro funcional
- [x] Internacionalización (Español/Inglés)
- [x] Validación de formularios
- [x] Manejo de errores
- [x] Loading states
- [x] Snackbar notifications

### Comando de Inicio
```bash
# 1. Crear proyecto
npm create vite@latest . -- --template react-ts

# 2. Instalar dependencias core
npm install

# 3. Instalar Material UI
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# 4. Instalar estado y routing
npm install @reduxjs/toolkit react-redux react-router-dom

# 5. Instalar HTTP y formularios
npm install axios react-hook-form @hookform/resolvers yup

# 6. Instalar i18n
npm install i18next react-i18next i18next-browser-languagedetector

# 7. Instalar utilidades
npm install date-fns notistack

# 8. Instalar dev dependencies
npm install --save-dev @types/node

# 9. Crear estructura de carpetas
mkdir -p src/{api,components/{common,auth,layout},pages/{Auth,Dashboard},redux/{slices,middleware},types,hooks,utils,theme,routes,i18n/locales/{es,en}}

# 10. Ejecutar
npm run dev
```

### Archivos Críticos
- `vite.config.ts` - Configuración de Vite con aliases
- `tsconfig.json` - TypeScript strict mode
- `package.json` - Todas las dependencias
- `src/theme/ThemeContext.tsx` - Modo oscuro
- `src/i18n/config.ts` - Internacionalización
- `src/redux/store.ts` - Store principal
- `src/api/axios.config.ts` - Interceptors + refresh token
- `src/pages/Auth/Login.tsx` - Página de login
- `src/App.tsx` - App principal

---

## FASE 2: Dashboard y Gestión de Perfiles
**Duración:** 7 días
**Estado:** 📋 PENDIENTE

### Objetivos
- Crear dashboard principal con estadísticas
- Implementar CRUD completo de perfiles de CV
- Formulario de información personal
- Sistema de auto-guardado con debounce
- Indicador de completitud de perfil

### Tareas Principales
- [ ] **Dashboard Principal**
  - Layout con AppBar y Drawer lateral
  - Estadísticas de perfiles en Cards
  - Lista de CVs con Material Table
  - Botón "Crear nuevo CV"

- [ ] **Gestión de Perfiles**
  - Redux Slice: profileSlice.ts
  - API: profile.api.ts (CRUD completo)
  - Componentes: Lista, Crear/Editar, Eliminar

- [ ] **Información Personal**
  - Formulario completo con todos los campos
  - Auto-guardado con debounce
  - Upload de foto de perfil
  - Indicador de progreso

### Endpoints Utilizados
```
GET    /api/profiles
POST   /api/profiles
GET    /api/profiles/:id
PUT    /api/profiles/:id
DELETE /api/profiles/:id
PATCH  /api/profiles/:id/set-default
POST   /api/profiles/:id/duplicate
GET    /api/profiles/:id/personal
PUT    /api/profiles/:id/personal
GET    /api/profiles/:id/completion
GET    /api/profiles/stats
```

### Archivos a Crear (~20 archivos)
- `src/redux/slices/profileSlice.ts`
- `src/api/profile.api.ts`
- `src/pages/Dashboard/Dashboard.tsx`
- `src/pages/CVEditor/PersonalInfo.tsx`
- `src/components/layout/DashboardLayout.tsx`
- `src/types/profile.types.ts`
- Componentes de perfiles (Cards, Dialogs, etc.)

---

## FASE 3: Editor de CV - Educación y Experiencia
**Duración:** 10 días
**Estado:** 📋 PENDIENTE

### Objetivos
- Formularios de Educación
- Formularios de Experiencia Laboral
- Sistema de reordenamiento con Drag & Drop
- Validaciones avanzadas de fechas

### Tareas Principales
- [ ] **Formulario de Educación**
  - Lista de educación existente
  - Formulario completo (institución, título, fechas, etc.)
  - Cards con información resumida
  - Drag & Drop para reordenar

- [ ] **Formulario de Experiencia**
  - Lista de experiencia existente
  - Formulario completo (empresa, posición, fechas, etc.)
  - Timeline visual con MUI
  - Drag & Drop para reordenar

- [ ] **Integración Drag & Drop**
  - Instalar react-beautiful-dnd
  - Implementar reordenamiento
  - Actualizar orden en backend

### Endpoints Utilizados
```
GET    /api/profiles/:profileId/education
POST   /api/profiles/:profileId/education
PUT    /api/profiles/:profileId/education/:id
DELETE /api/profiles/:profileId/education/:id
POST   /api/profiles/:profileId/education/reorder

GET    /api/profiles/:profileId/experience
POST   /api/profiles/:profileId/experience
PUT    /api/profiles/:profileId/experience/:id
DELETE /api/profiles/:profileId/experience/:id
POST   /api/profiles/:profileId/experience/reorder
```

### Archivos a Crear (~15 archivos)
- `src/pages/CVEditor/Education.tsx`
- `src/pages/CVEditor/Experience.tsx`
- `src/components/cv/EducationForm/`
- `src/components/cv/ExperienceForm/`
- `src/api/education.api.ts`
- `src/api/experience.api.ts`

---

## FASE 4: Skills, Idiomas, Certificaciones y Redes Sociales
**Duración:** 10 días
**Estado:** 📋 PENDIENTE

### Objetivos
- Formulario de habilidades con categorías
- Formulario de idiomas con niveles CEFR
- Formulario de certificaciones
- Formulario de redes sociales

### Tareas Principales
- [ ] **Formulario de Habilidades**
  - Vista por categorías (MUI Tabs)
  - Niveles visuales (Rating, LinearProgress)
  - Chips con colores por nivel
  - Estadísticas de skills

- [ ] **Formulario de Idiomas**
  - Niveles CEFR (A1-C2)
  - Niveles detallados (hablar, escribir, leer, escuchar)
  - Certificaciones de idiomas
  - Cards con banderas

- [ ] **Formulario de Certificaciones**
  - Certificaciones/Cursos/Diplomas/Licencias
  - URLs verificables
  - Fechas de emisión y expiración
  - Badge "Activa" / "Expirada"

- [ ] **Formulario de Redes Sociales**
  - Plataformas con iconos
  - Links clickeables
  - Toggle visibilidad
  - Estadísticas

### Endpoints Utilizados
```
GET    /api/profiles/:profileId/skills
POST   /api/profiles/:profileId/skills
PUT    /api/profiles/:profileId/skills/:id
DELETE /api/profiles/:profileId/skills/:id
POST   /api/profiles/:profileId/skills/reorder
GET    /api/profiles/:profileId/skills/categories
GET    /api/profiles/:profileId/skills/stats

GET    /api/profiles/:profileId/languages
POST   /api/profiles/:profileId/languages
PUT    /api/profiles/:profileId/languages/:id
DELETE /api/profiles/:profileId/languages/:id
POST   /api/profiles/:profileId/languages/reorder

GET    /api/profiles/:profileId/certifications
POST   /api/profiles/:profileId/certifications
PUT    /api/profiles/:profileId/certifications/:id
DELETE /api/profiles/:profileId/certifications/:id
POST   /api/profiles/:profileId/certifications/reorder

GET    /api/profiles/:profileId/social-networks
POST   /api/profiles/:profileId/social-networks
PUT    /api/profiles/:profileId/social-networks/:id
DELETE /api/profiles/:profileId/social-networks/:id
POST   /api/profiles/:profileId/social-networks/reorder
PATCH  /api/profiles/:profileId/social-networks/:id/toggle-visibility
GET    /api/profiles/:profileId/social-networks/stats
```

### Archivos a Crear (~15 archivos)
- `src/pages/CVEditor/Skills.tsx`
- `src/pages/CVEditor/Languages.tsx`
- `src/pages/CVEditor/Certifications.tsx`
- `src/pages/CVEditor/SocialNetworks.tsx`
- `src/api/skills.api.ts`
- `src/api/languages.api.ts`
- `src/api/certifications.api.ts`
- `src/api/socialNetworks.api.ts`

---

## FASE 5: Vista Previa y Templates
**Duración:** 7 días
**Estado:** 📋 PENDIENTE

### Objetivos
- Sistema de templates
- Vista previa en tiempo real
- Selector de plantillas
- Personalización de colores

### Tareas Principales
- [ ] **Sistema de Templates**
  - Obtener templates del backend
  - Template Selector con previews
  - Templates: Harvard Classic, Harvard Modern

- [ ] **Vista Previa en Tiempo Real**
  - CVPreview Component
  - Split view: Editor | Preview
  - Responsive (Desktop/Tablet/Mobile)
  - Zoom controls

- [ ] **Obtener Perfil Completo**
  - GET /api/profiles/:id/complete
  - Combinar todas las secciones
  - Loading state

- [ ] **Personalización**
  - Color Picker (primario/secundario)
  - Typography Selector
  - Layout Options (1 columna vs 2 columnas)

- [ ] **Indicador de Completitud**
  - Circular progress con porcentaje
  - Lista de secciones faltantes
  - Warnings y sugerencias

### Endpoints Utilizados
```
GET   /api/templates
PATCH /api/profiles/:id/template
GET   /api/profiles/:id/complete
GET   /api/profiles/:id/completion
GET   /api/profiles/:id/preview-html
```

### Archivos a Crear (~10 archivos)
- `src/pages/Preview/CVPreview.tsx`
- `src/components/preview/TemplateSelector.tsx`
- `src/components/preview/LivePreview.tsx`
- `src/components/layout/EditorLayout.tsx`
- `src/api/templates.api.ts`

---

## FASE 6: Exportación PDF
**Duración:** 5 días
**Estado:** 📋 PENDIENTE

### Objetivos
- Validar perfil antes de exportar
- Exportar PDF desde backend
- Preview antes de descargar
- Opciones de exportación

### Tareas Principales
- [ ] **Validación de Exportación**
  - Llamar a /api/profiles/:id/pdf/validate
  - Mostrar warnings
  - Checklist de validación

- [ ] **Export Options Dialog**
  - MUI Dialog fullscreen
  - Preview del PDF (iframe)
  - Opciones de formato y calidad
  - Incluir/excluir secciones

- [ ] **PDF Download**
  - Axios con responseType: 'blob'
  - Download automático
  - Nombre de archivo: CV-{Nombre}-{Fecha}.pdf

- [ ] **Preview PDF**
  - Mostrar en iframe
  - Zoom in/out
  - Botón "Descargar este preview"

- [ ] **Export Button**
  - Floating Action Button (FAB)
  - Menu de opciones
  - Success feedback

### Endpoints Utilizados
```
GET /api/profiles/:profileId/pdf/validate
GET /api/profiles/:profileId/pdf/export-pdf
GET /api/profiles/:profileId/pdf/preview-pdf
```

### Archivos a Crear (~8 archivos)
- `src/pages/Export/ExportOptions.tsx`
- `src/components/export/PDFExport.tsx`
- `src/api/export.api.ts`

---

## FASE 7: Optimización, Testing y Mejoras
**Duración:** 10 días
**Estado:** 📋 PENDIENTE

### Objetivos
- Optimizar rendimiento
- Implementar testing
- Mejorar UX y accesibilidad
- Documentación

### Tareas Principales
- [ ] **Optimización de Rendimiento**
  - Code Splitting (React.lazy)
  - Bundle Optimization
  - Memoization (useMemo, useCallback, React.memo)

- [ ] **Testing**
  - Unit Tests (Redux slices, utilities, hooks)
  - Component Tests (React Testing Library)
  - E2E Tests (Cypress o Playwright) - opcional

- [ ] **Mejoras de UX**
  - Búsqueda Global
  - Tour Guiado (react-joyride)
  - Atajos de Teclado (Ctrl+S, Ctrl+P, Ctrl+E)

- [ ] **Accesibilidad**
  - ARIA labels
  - Keyboard navigation
  - Screen reader support
  - Color contrast

- [ ] **Documentación**
  - README del frontend
  - Comentarios en código complejo
  - Storybook (opcional)

### Archivos a Crear (~15+ archivos + tests)
- Tests en `src/**/__tests__/`
- `vite.config.ts` - Optimizaciones
- Documentación y guías

---

## Cronograma General

| Fase | Descripción | Duración | Archivos |
|------|-------------|----------|----------|
| 1 | Setup + Autenticación | 7-10 días | ~35 |
| 2 | Dashboard + Perfiles | 7 días | ~20 |
| 3 | Educación + Experiencia | 10 días | ~15 |
| 4 | Skills + Idiomas + Certificaciones | 10 días | ~15 |
| 5 | Vista Previa + Templates | 7 días | ~10 |
| 6 | Exportación PDF | 5 días | ~8 |
| 7 | Optimización + Testing | 10 días | ~15 |
| **TOTAL** | **Proyecto Completo** | **56-59 días (8-9 semanas)** | **~118 archivos** |

---

## Estructura de Carpetas Final

```
frontend/
├── public/
│   ├── vite.svg
│   └── cv-templates/
├── src/
│   ├── api/
│   │   ├── axios.config.ts
│   │   ├── endpoints.ts
│   │   ├── auth.api.ts
│   │   ├── profile.api.ts
│   │   ├── education.api.ts
│   │   ├── experience.api.ts
│   │   ├── skills.api.ts
│   │   ├── languages.api.ts
│   │   ├── certifications.api.ts
│   │   ├── socialNetworks.api.ts
│   │   └── export.api.ts
│   ├── components/
│   │   ├── common/
│   │   ├── auth/
│   │   ├── cv/
│   │   ├── preview/
│   │   └── layout/
│   ├── pages/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── CVEditor/
│   │   ├── Preview/
│   │   └── Export/
│   ├── redux/
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   ├── types/
│   ├── hooks/
│   ├── utils/
│   ├── theme/
│   ├── routes/
│   ├── i18n/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Notas Importantes

1. **La Fase 1 está completamente detallada** en el archivo `bubbly-forging-starfish.md` con código completo de todos los archivos.

2. **Modo oscuro e internacionalización** están incluidos desde la Fase 1.

3. **Seguir el orden de las fases** para evitar dependencias faltantes.

4. **Cada fase debe ser testeada** antes de continuar con la siguiente.

5. **El backend ya está funcionando** en `https://api-cv.servercontrol-mzt.com`

6. **Usar el plan detallado** (`bubbly-forging-starfish.md`) como referencia para la implementación.

---

## Recursos

- **Plan Detallado Fase 1:** `bubbly-forging-starfish.md`
- **Documentación Backend:** `backend.md`
- **Plan General:** `cv-generato-plan.md`
- **Material UI:** https://mui.com/
- **Redux Toolkit:** https://redux-toolkit.js.org/
- **React Hook Form:** https://react-hook-form.com/
- **i18next:** https://www.i18next.com/

---

**Última actualización:** 2026-01-28
**Estado Actual:** Fase 1 - Plan Completado ✅
