# CV Generator Frontend - Fase 1 Completada

## Stack Tecnológico Implementado

### Core
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server

### UI Framework
- **Material UI (MUI)** - Componentes de interfaz
- **Emotion** - CSS-in-JS para styling
- **MUI Icons** - Iconos

### State Management
- **Redux Toolkit** - Gestión de estado global
- **React Redux** - Integración React-Redux

### Routing
- **React Router DOM** - Navegación y routing

### HTTP Client
- **Axios** - Cliente HTTP con interceptores

### Forms
- **React Hook Form** - Gestión de formularios
- **Yup** - Validación de esquemas
- **@hookform/resolvers** - Integración de validaciones

### Internacionalización
- **i18next** - Framework de traducción
- **react-i18next** - Integración React
- **i18next-browser-languagedetector** - Detección automática de idioma

### Utilities
- **date-fns** - Manipulación de fechas
- **notistack** - Sistema de notificaciones

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.ts              # Configuración de Axios con interceptores
│   ├── components/
│   │   ├── auth/                 # Componentes de autenticación
│   │   ├── common/               # Componentes reutilizables
│   │   └── layout/
│   │       └── MainLayout.tsx    # Layout principal con navbar
│   ├── hooks/
│   │   ├── useAppDispatch.ts     # Hook tipado para dispatch
│   │   └── useAppSelector.ts     # Hook tipado para selectors
│   ├── i18n/
│   │   ├── config.ts             # Configuración de i18next
│   │   └── locales/
│   │       ├── es/               # Traducciones en español
│   │       └── en/               # Traducciones en inglés
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.tsx         # Página de login
│   │   │   └── Register.tsx      # Página de registro
│   │   └── Dashboard/
│   │       └── Dashboard.tsx     # Dashboard principal
│   ├── redux/
│   │   ├── slices/
│   │   │   ├── authSlice.ts      # Estado de autenticación
│   │   │   └── themeSlice.ts     # Estado del tema
│   │   ├── middleware/
│   │   └── store.ts              # Configuración del store
│   ├── routes/
│   │   ├── AppRoutes.tsx         # Definición de rutas
│   │   └── ProtectedRoute.tsx    # HOC para rutas protegidas
│   ├── theme/
│   │   └── theme.ts              # Temas claro/oscuro de MUI
│   ├── types/
│   │   └── index.ts              # Definiciones de TypeScript
│   ├── utils/                    # Utilidades
│   ├── App.tsx                   # Componente principal
│   └── main.tsx                  # Entry point
├── .env                          # Variables de entorno
├── .env.example                  # Ejemplo de variables
├── vite.config.ts                # Configuración de Vite
├── tsconfig.json                 # Configuración de TypeScript
└── package.json                  # Dependencias

```

## Características Implementadas

### ✅ Autenticación
- Login con email y password
- Registro de nuevos usuarios
- Verificación de autenticación al cargar la app
- Logout
- Protección de rutas con ProtectedRoute
- Manejo de tokens JWT en localStorage
- Interceptores de Axios para inyectar token

### ✅ Tema (Dark/Light Mode)
- Tema claro y oscuro
- Persistencia en localStorage
- Detección automática de preferencia del sistema
- Toggle en navbar

### ✅ Internacionalización (i18n)
- Soporte para Español e Inglés
- Detección automática del idioma del navegador
- Persistencia de preferencia en localStorage
- Selector de idioma en navbar
- Traducciones para:
  - Autenticación
  - Dashboard
  - Componentes comunes

### ✅ Validación de Formularios
- React Hook Form para gestión de formularios
- Validación con Yup
- Mensajes de error traducidos
- UX optimizada

### ✅ UI/UX
- Material Design con MUI
- Responsive design
- Loading states
- Error handling
- Notificaciones con notistack
- Layout con AppBar y navegación

## Configuración de Variables de Entorno

Edita el archivo `.env`:

```env
# API Configuration
VITE_API_URL=https://api-cv.servercontrol-mzt.com
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=CV Generator
VITE_APP_VERSION=1.0.0
```

## Path Aliases Configurados

Los siguientes alias están disponibles para imports:

- `@/*` → `./src/*`
- `@api/*` → `./src/api/*`
- `@components/*` → `./src/components/*`
- `@pages/*` → `./src/pages/*`
- `@redux/*` → `./src/redux/*`
- `@types/*` → `./src/types/*`
- `@hooks/*` → `./src/hooks/*`
- `@utils/*` → `./src/utils/*`
- `@theme/*` → `./src/theme/*`
- `@routes/*` → `./src/routes/*`
- `@i18n/*` → `./src/i18n/*`

## Comandos Disponibles

```bash
# Instalar dependencias (ya ejecutado)
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## Próximos Pasos (Fase 2)

1. Crear el módulo de gestión de perfiles CV
2. Implementar formularios para:
   - Información personal
   - Experiencia laboral
   - Educación
   - Habilidades
   - Idiomas
   - Certificados
   - Proyectos
3. Sistema de progreso de completitud
4. Vista previa del CV

## Notas Técnicas

- El proyecto usa **TypeScript estricto** con todas las validaciones habilitadas
- **Redux Toolkit** para estado global simplificado
- **Axios interceptors** maneja automáticamente tokens y errores 401
- **Protected routes** redirigen a login si no hay autenticación
- **i18n** carga traducciones de forma dinámica
- **Material UI** proporciona componentes accesibles y consistentes
