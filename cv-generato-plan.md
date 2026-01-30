# 🎓 CV GENERATOR - HARVARD STYLE
## Planificación Completa del Proyecto
### Backend: JavaScript | Frontend: TypeScript + Vite + Material UI

---

## 📋 ÍNDICE
1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Backend - Estructura (JavaScript)](#backend---estructura)
4. [Frontend - Estructura (TypeScript + Vite + MUI)](#frontend---estructura)
5. [Fases de Desarrollo](#fases-de-desarrollo)
6. [Configuración de Proyectos](#configuración-de-proyectos)

---

## 🎯 VISIÓN GENERAL

### Objetivo
Plataforma web para crear CVs profesionales con formato Harvard, con sistema de autenticación robusto, gestión de múltiples perfiles y generación de documentos en PDF.

### Stack Tecnológico

**Backend (JavaScript):**
- Node.js + Express.js
- MariaDB (MySQL)
- Sequelize ORM
- JWT para autenticación
- Bcrypt para encriptación
- Nodemailer para emails
- Puppeteer para PDF

**Frontend (TypeScript):**
- React 18 + TypeScript
- Vite (Build tool & Dev server)
- Material UI (MUI) v5
- Redux Toolkit (estado global)
- React Router v6
- Axios (HTTP client)
- React Hook Form + Yup
- Emotion (CSS-in-JS de MUI)

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│         FRONTEND (React + TS + Vite + MUI)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Profile  │  │   CV     │  │  Export  │   │
│  │  Module  │  │  Editor  │  │ Preview  │  │   PDF    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Express + JavaScript)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │  Users   │  │   CV     │  │  Export  │   │
│  │Middleware│  │  Routes  │  │  Routes  │  │  Service │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                    ↕ Sequelize ORM                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MariaDB Database                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 BACKEND - ESTRUCTURA (JavaScript)

### Estructura de Carpetas

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de Sequelize
│   │   ├── jwt.js               # Configuración JWT
│   │   ├── email.js             # Configuración Nodemailer
│   │   ├── cors.js              # Configuración CORS
│   │   └── app.js               # Configuración Express
│   │
│   ├── models/
│   │   ├── index.js             # Inicialización Sequelize
│   │   ├── User.js
│   │   ├── Session.js
│   │   ├── Profile.js
│   │   ├── PersonalInfo.js
│   │   ├── SocialNetwork.js
│   │   ├── Education.js
│   │   ├── Experience.js
│   │   ├── Skill.js
│   │   ├── Language.js
│   │   ├── Certification.js
│   │   └── ActivityLog.js
│   │
│   ├── controllers/
│   │   ├── authController.js    # Login, Register, Reset Password
│   │   ├── userController.js    # Perfil de usuario
│   │   ├── profileController.js # CRUD de perfiles CV
│   │   ├── personalInfoController.js
│   │   ├── socialNetworkController.js
│   │   ├── educationController.js
│   │   ├── experienceController.js
│   │   ├── skillController.js
│   │   ├── languageController.js
│   │   ├── certificationController.js
│   │   └── exportController.js  # Generación de PDF
│   │
│   ├── middlewares/
│   │   ├── auth.js              # Verificación JWT
│   │   ├── validation.js        # Validación de datos
│   │   ├── errorHandler.js      # Manejo de errores
│   │   ├── rateLimiter.js       # Rate limiting
│   │   ├── logger.js            # Logging middleware
│   │   └── upload.js            # Manejo de archivos
│   │
│   ├── routes/
│   │   ├── index.js             # Router principal
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── profile.routes.js
│   │   ├── cv.routes.js         # Todas las rutas del CV
│   │   └── export.routes.js
│   │
│   ├── services/
│   │   ├── authService.js       # Lógica de autenticación
│   │   ├── emailService.js      # Envío de emails
│   │   ├── pdfService.js        # Generación de PDFs
│   │   ├── tokenService.js      # Manejo de tokens JWT
│   │   ├── validationService.js # Validaciones complejas
│   │   └── storageService.js    # Manejo de archivos
│   │
│   ├── utils/
│   │   ├── logger.js            # Winston logger
│   │   ├── response.js          # Respuestas estandarizadas
│   │   ├── helpers.js           # Funciones auxiliares
│   │   └── constants.js         # Constantes
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── profileValidator.js
│   │   ├── educationValidator.js
│   │   └── experienceValidator.js
│   │
│   └── server.js                # Punto de entrada
│
├── templates/                   # Templates HTML para PDFs
│   ├── cv-harvard-classic.html
│   ├── cv-harvard-modern.html
│   └── email/
│       ├── welcome.html
│       └── reset-password.html
│
├── uploads/                     # Archivos subidos (avatares, etc.)
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .eslintrc.js
├── .gitignore
├── package.json
└── README.md
```

### Ejemplo de Configuración package.json (Backend)

```json
{
  "name": "cv-generator-backend",
  "version": "1.0.0",
  "description": "Backend para CV Generator - Formato Harvard",
  "main": "src/server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "migrate": "npx sequelize-cli db:migrate",
    "migrate:undo": "npx sequelize-cli db:migrate:undo",
    "seed": "npx sequelize-cli db:seed:all",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.35.0",
    "mysql2": "^3.6.5",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "joi": "^17.11.0",
    "nodemailer": "^6.9.7",
    "puppeteer": "^21.6.1",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "sequelize-cli": "^6.6.2",
    "eslint": "^8.55.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

### Ejemplo de Archivo de Configuración (.env.example)

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cv_generator
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=7d

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@cvgenerator.com
FROM_NAME=CV Generator

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🎨 FRONTEND - ESTRUCTURA (TypeScript + Vite + Material UI)

### Estructura de Carpetas

```
frontend/
├── public/
│   ├── vite.svg
│   └── cv-templates/          # Plantillas estáticas
│
├── src/
│   ├── api/
│   │   ├── axios.config.ts    # Configuración Axios + interceptors
│   │   ├── endpoints.ts       # URLs de endpoints
│   │   ├── auth.api.ts
│   │   ├── profile.api.ts
│   │   ├── cv.api.ts
│   │   └── export.api.ts
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.types.ts
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Loader/
│   │   │   ├── Alert/
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   └── Footer/
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── LoginForm.types.ts
│   │   │   │   └── LoginForm.styles.ts
│   │   │   ├── RegisterForm/
│   │   │   ├── ResetPasswordForm/
│   │   │   └── VerifyEmail/
│   │   │
│   │   ├── cv/
│   │   │   ├── PersonalInfoForm/
│   │   │   ├── EducationForm/
│   │   │   ├── ExperienceForm/
│   │   │   ├── SkillsForm/
│   │   │   ├── LanguagesForm/
│   │   │   ├── CertificationsForm/
│   │   │   └── SocialNetworksForm/
│   │   │
│   │   ├── preview/
│   │   │   ├── CVPreview/
│   │   │   ├── TemplateSelector/
│   │   │   └── LivePreview/
│   │   │
│   │   └── layout/
│   │       ├── DashboardLayout/
│   │       ├── AuthLayout/
│   │       └── EditorLayout/
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── ResetPassword.tsx
│   │   │   └── VerifyEmail.tsx
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── UserProfile.tsx
│   │   │
│   │   ├── CVEditor/
│   │   │   ├── CVEditor.tsx
│   │   │   ├── PersonalInfo.tsx
│   │   │   ├── Education.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Languages.tsx
│   │   │   ├── Certifications.tsx
│   │   │   └── SocialNetworks.tsx
│   │   │
│   │   ├── Preview/
│   │   │   └── CVPreview.tsx
│   │   │
│   │   └── Export/
│   │       └── ExportOptions.tsx
│   │
│   ├── redux/
│   │   ├── store.ts
│   │   ├── hooks.ts              # Typed hooks (useAppDispatch, useAppSelector)
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── profileSlice.ts
│   │   │   ├── cvSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── middleware/
│   │       └── authMiddleware.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── profile.types.ts
│   │   ├── cv.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProfile.ts
│   │   ├── useCV.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useSnackbar.ts
│   │
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── dateUtils.ts
│   │
│   ├── theme/
│   │   ├── theme.ts              # MUI Theme configuration
│   │   ├── palette.ts
│   │   ├── typography.ts
│   │   └── components.ts
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── PublicRoute.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

### Ejemplo de Configuración package.json (Frontend)

```json
{
  "name": "cv-generator-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@reduxjs/toolkit": "^2.0.1",
    "react-redux": "^9.0.4",
    "axios": "^1.6.2",
    "react-hook-form": "^7.49.2",
    "yup": "@hookform/resolvers": "^3.3.3",
    "date-fns": "^3.0.0",
    "react-beautiful-dnd": "^13.1.1",
    "notistack": "^3.0.1",
    "react-pdf": "^7.6.0",
    "jspdf": "^2.5.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/react-beautiful-dnd": "^13.1.8",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5"
  }
}
```

### Configuración de Vite (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@api': path.resolve(__dirname, './src/api'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@theme': path.resolve(__dirname, './src/theme'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### Configuración de TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"],
      "@api/*": ["./src/api/*"],
      "@redux/*": ["./src/redux/*"],
      "@theme/*": ["./src/theme/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Configuración de MUI Theme (src/theme/theme.ts)

```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;
```

### Ejemplo de Tipos (src/types/cv.types.ts)

```typescript
export interface IPersonalInfo {
  id?: number;
  profileId: number;
  fullName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  birthDate?: Date;
  address?: string;
  municipality?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  professionalTitle?: string;
  summary?: string;
  objective?: string;
  photoUrl?: string;
  availableForHire?: boolean;
  preferredWorkMode?: 'presencial' | 'remoto' | 'híbrido' | 'cualquiera';
}

export interface IEducation {
  id?: number;
  profileId: number;
  institution: string;
  institutionType?: 'universidad' | 'instituto' | 'bootcamp' | 'online' | 'otro';
  degree?: string;
  fieldOfStudy?: string;
  specialization?: string;
  startMonth?: string;
  startYear: number;
  endMonth?: string;
  endYear?: number;
  isCurrent?: boolean;
  gpa?: string;
  gpaScale?: string;
  honors?: string;
  relevantCoursework?: string;
  thesisTitle?: string;
  description?: string;
  city?: string;
  country?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface IExperience {
  id?: number;
  profileId: number;
  projectTitle: string;
  position: string;
  company?: string;
  projectType?: 'empresarial' | 'personal' | 'freelance' | 'academico' | 'voluntariado';
  employmentType?: 'tiempo_completo' | 'medio_tiempo' | 'contrato' | 'freelance' | 'practicas';
  startMonth?: string;
  startYear: number;
  endMonth?: string;
  endYear?: number;
  isCurrent?: boolean;
  duration?: string;
  location?: string;
  remote?: boolean;
  description?: string;
  impactDescription?: string;
  achievements?: string[];
  responsibilities?: string[];
  technologies?: string[];
  tools?: string[];
  projectUrl?: string;
  githubUrl?: string;
  displayOrder?: number;
  isVisible?: boolean;
  isFeatured?: boolean;
}

export interface ISkill {
  id?: number;
  profileId: number;
  name: string;
  category?: string;
  subcategory?: string;
  level?: 'basico' | 'intermedio' | 'avanzado' | 'experto';
  levelNumeric?: number;
  yearsOfExperience?: number;
  lastUsedYear?: number;
  isCertified?: boolean;
  displayOrder?: number;
  isVisible?: boolean;
  isHighlighted?: boolean;
}

export interface ILanguage {
  id?: number;
  profileId: number;
  name: string;
  nativeName?: string;
  code?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Nativo';
  levelDescription?: string;
  speakingLevel?: 'basico' | 'intermedio' | 'avanzado' | 'nativo';
  writingLevel?: 'basico' | 'intermedio' | 'avanzado' | 'nativo';
  readingLevel?: 'basico' | 'intermedio' | 'avanzado' | 'nativo';
  listeningLevel?: 'basico' | 'intermedio' | 'avanzado' | 'nativo';
  hasCertification?: boolean;
  certificationName?: string;
  certificationScore?: string;
  certificationDate?: Date;
  displayOrder?: number;
  isVisible?: boolean;
  isNative?: boolean;
}

export interface ICertification {
  id?: number;
  profileId: number;
  name: string;
  issuer: string;
  certificationType?: 'certificacion' | 'curso' | 'diploma' | 'licencia';
  issueMonth?: string;
  issueYear: number;
  expiryMonth?: string;
  expiryYear?: number;
  doesNotExpire?: boolean;
  isActive?: boolean;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skillsGained?: string[];
  durationHours?: number;
  displayOrder?: number;
  isVisible?: boolean;
  isFeatured?: boolean;
}

export interface ISocialNetwork {
  id?: number;
  profileId: number;
  platform: string;
  url: string;
  username?: string;
  displayName?: string;
  iconName?: string;
  description?: string;
  displayOrder?: number;
  isVisible?: boolean;
  isPrimary?: boolean;
}

export interface IProfile {
  id: number;
  userId: number;
  name: string;
  slug?: string;
  template?: string;
  language?: string;
  colorScheme?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  isComplete?: boolean;
  viewCount?: number;
  downloadCount?: number;
  lastExported?: Date;
  completionPercentage?: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relaciones
  personalInfo?: IPersonalInfo;
  education?: IEducation[];
  experience?: IExperience[];
  skills?: ISkill[];
  languages?: ILanguage[];
  certifications?: ICertification[];
  socialNetworks?: ISocialNetwork[];
}
```

### Ejemplo de Redux Slice (src/redux/slices/authSlice.ts)

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@api/auth.api';
import type { IUser, ILoginCredentials, IRegisterData } from '@types/auth.types';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: ILoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: IRegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al registrarse');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cerrar sesión');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      });
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
```

---

## 📅 FASES DE DESARROLLO

### **FASE 1: Setup Inicial y Autenticación (Semanas 1-2)**

#### Backend (JavaScript):
```bash
# Inicializar proyecto
mkdir cv-generator-backend
cd cv-generator-backend
npm init -y

# Instalar dependencias
npm install express sequelize mysql2 jsonwebtoken bcrypt joi nodemailer dotenv cors helmet morgan compression express-validator uuid winston

# Instalar dev dependencies
npm install --save-dev nodemon sequelize-cli eslint

# Estructura básica
mkdir -p src/{config,models,controllers,middlewares,routes,services,utils,validators}
touch src/server.js .env.example
```

**Tareas Backend:**
- ✅ Configurar Express + middlewares
- ✅ Configurar Sequelize + MariaDB
- ✅ Crear modelos: User, Session
- ✅ Implementar JWT (access + refresh tokens)
- ✅ Endpoints de autenticación:
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/logout
  - POST /api/auth/refresh-token
  - POST /api/auth/forgot-password
  - POST /api/auth/reset-password
  - GET /api/auth/verify-email/:token
- ✅ Middleware de autenticación
- ✅ Sistema de validación con Joi
- ✅ Manejo de errores centralizado

#### Frontend (TypeScript + Vite + MUI):
```bash
# Crear proyecto con Vite
npm create vite@latest cv-generator-frontend -- --template react-ts
cd cv-generator-frontend

# Instalar Material UI
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Instalar dependencias
npm install react-router-dom @reduxjs/toolkit react-redux axios react-hook-form @hookform/resolvers yup notistack date-fns

# Instalar dev dependencies
npm install --save-dev @types/react @types/react-dom
```

**Tareas Frontend:**
- ✅ Configurar Vite + TypeScript
- ✅ Configurar MUI Theme personalizado
- ✅ Configurar Redux Toolkit
- ✅ Configurar React Router
- ✅ Configurar Axios (interceptors, auth)
- ✅ Crear tipos TypeScript base
- ✅ Páginas de autenticación:
  - Login
  - Register
  - Forgot Password
  - Reset Password
  - Verify Email
- ✅ Layout de autenticación
- ✅ Componentes comunes (Button, Input, etc.)
- ✅ Sistema de notificaciones (notistack)

**Entregable:**
Sistema de autenticación completo funcionando

---

### **FASE 2: Gestión de Perfiles (Semanas 3-4)**

#### Backend:
- ✅ Modelo Profile + PersonalInfo
- ✅ CRUD de perfiles
- ✅ Validaciones específicas
- ✅ Endpoints:
  - GET /api/profiles
  - POST /api/profiles
  - GET /api/profiles/:id
  - PUT /api/profiles/:id
  - DELETE /api/profiles/:id
  - GET /api/profiles/:id/personal
  - PUT /api/profiles/:id/personal

#### Frontend:
- ✅ Dashboard principal (MUI Grid + Cards)
- ✅ Lista de CVs con Material Table
- ✅ Crear/Editar perfil (MUI Dialog)
- ✅ Formulario información personal (MUI TextField, DatePicker)
- ✅ Redux slice: profileSlice
- ✅ Validación con React Hook Form + Yup
- ✅ Auto-guardado (useDebounce)

**Entregable:**
Dashboard funcional con gestión de perfiles

---

### **FASE 3: Secciones CV - Parte 1 (Semanas 5-6)**

#### Backend:
- ✅ Modelos: Education, Experience, SocialNetwork
- ✅ CRUD para cada sección
- ✅ Sistema de ordenamiento
- ✅ Endpoints completos

#### Frontend:
- ✅ Formularios con MUI:
  - Educación (Autocomplete, DatePicker)
  - Experiencia (TextField multiline, Chips para tecnologías)
  - Redes Sociales (IconButton, Avatar)
- ✅ Editor tipo stepper (MUI Stepper)
- ✅ Drag & Drop para reordenar (react-beautiful-dnd)
- ✅ Validaciones inline
- ✅ Mensajes de confirmación (MUI Dialog)

**Entregable:**
Editor de CV con secciones principales

---

### **FASE 4: Secciones CV - Parte 2 (Semanas 7-8)**

#### Backend:
- ✅ Modelos: Skill, Language, Certification
- ✅ Sistema de categorización
- ✅ Niveles y ratings

#### Frontend:
- ✅ Formularios especializados MUI:
  - Skills (Autocomplete con chips, Rating)
  - Idiomas (Select, LinearProgress para niveles)
  - Certificaciones (DatePicker, Link)
- ✅ Búsqueda y filtrado (MUI TextField + debounce)
- ✅ Categorías visuales (MUI Tabs)
- ✅ Indicadores de nivel (MUI LinearProgress, Rating)

**Entregable:**
CV completo editable

---

### **FASE 5: Vista Previa y Templates (Semanas 9-10)**

#### Backend:
- ✅ Endpoint GET /api/profiles/:id/complete
- ✅ Optimización de queries (eager loading)
- ✅ Caché de datos (opcional: Redis)

#### Frontend:
- ✅ Sistema de templates con MUI
- ✅ Template Harvard Classic
- ✅ Vista previa en tiempo real (MUI Paper, Grid)
- ✅ Selector de plantillas (MUI ImageList)
- ✅ Panel dividido: Editor | Preview (MUI Grid)
- ✅ Modo responsive preview (MUI useMediaQuery)
- ✅ Personalización de colores (MUI ColorPicker)

**Entregable:**
Visualización profesional del CV

---

### **FASE 6: Exportación PDF (Semanas 11-12)**

#### Backend:
- ✅ Servicio PDF con Puppeteer
- ✅ Templates HTML optimizados
- ✅ Endpoint POST /api/export/:id/pdf
- ✅ Rate limiting para exportaciones
- ✅ Almacenamiento temporal

#### Frontend:
- ✅ Botón de exportación (MUI Fab)
- ✅ Opciones de exportación (MUI Menu)
- ✅ Loading state (MUI CircularProgress)
- ✅ Descarga automática
- ✅ Preview antes de exportar (MUI Dialog fullscreen)

**Entregable:**
Sistema completo de exportación PDF

---

### **FASE 7: Optimización y Testing (Semanas 13-14)**

#### Backend:
- ✅ Logging con Winston
- ✅ Tests unitarios con Jest
- ✅ Tests de integración
- ✅ Documentación API (Swagger)

#### Frontend:
- ✅ Lazy loading de componentes
- ✅ Code splitting
- ✅ Optimización de bundle
- ✅ MUI Theme switching (modo oscuro)
- ✅ Internacionalización (i18n)
- ✅ Tests con React Testing Library

**Entregable:**
Aplicación optimizada y testeada

---

## 🚀 COMANDOS DE INICIO RÁPIDO

### Backend (JavaScript)
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run migrate
npm run seed
npm run dev
# Server corriendo en http://localhost:5000
```

### Frontend (TypeScript + Vite + MUI)
```bash
cd frontend
npm install
cp .env.example .env
# Editar .env
npm run dev
# App corriendo en http://localhost:5173
```

---

## 📦 CARACTERÍSTICAS ESPECIALES CON MUI

### 1. **Dashboard Interactivo**
- Material Cards con elevación
- Grid responsivo
- Iconos de Material Icons
- Estadísticas con Charts (opcional: recharts)

### 2. **Editor de CV Intuitivo**
- Stepper para guiar al usuario
- Formularios con validación inline
- Tooltips informativos
- Snackbar para feedback

### 3. **Vista Previa Profesional**
- Zoom in/out
- Modo tablet/móvil/desktop
- Colores personalizables
- Tipografías Harvard

### 4. **Experiencia de Usuario**
- Auto-guardado con indicador
- Confirmaciones elegantes
- Transiciones suaves
- Loading states consistentes

---

## 🎨 PALETA DE COLORES HARVARD

```typescript
// theme/palette.ts
export const harvardPalette = {
  primary: {
    main: '#A51C30',     // Harvard Crimson
    light: '#C90016',
    dark: '#8E1728',
  },
  secondary: {
    main: '#1E1E1E',     // Negro Harvard
    light: '#424242',
    dark: '#000000',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1E1E1E',
    secondary: '#666666',
  },
};
```

---

## ✨ VENTAJAS DE ESTE STACK

**Backend JavaScript:**
- ✅ Rápido desarrollo
- ✅ Ecosistema maduro
- ✅ Sequelize ORM robusto
- ✅ Fácil debugging

**Frontend TypeScript + Vite + MUI:**
- ✅ Type safety total
- ✅ Dev server ultrarrápido
- ✅ Hot Module Replacement
- ✅ Componentes profesionales out-of-the-box
- ✅ Responsive por defecto
- ✅ Accesibilidad integrada
- ✅ Documentación excelente

---

## 🎯 PRÓXIMOS PASOS

1. **Crear estructura de carpetas**
2. **Inicializar proyectos**
3. **Configurar bases de datos**
4. **Implementar FASE 1**
5. **Iterar sobre cada fase**

**Tiempo estimado:** 14-16 semanas