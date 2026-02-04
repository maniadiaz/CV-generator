# CV Generator - Aplicación Completa Full Stack

## 📋 Descripción General

**CV Generator** es una aplicación web moderna y completa para la creación, personalización y exportación de CVs profesionales. El proyecto consta de un frontend desarrollado con React + TypeScript y un backend API RESTful construido con Node.js y Express, ambos trabajando en conjunto para ofrecer una experiencia de usuario excepcional.

**Período de Desarrollo:** Enero 2026 - Febrero 2026
**Tipo de Proyecto:** Personal - Full Stack
**Estado:** Completado ✅

---

## 🎯 Características Principales

### Frontend
- ✅ **3 Plantillas Profesionales:** Harvard Classic, Harvard Modern, Oxford
- ✅ **10+ Esquemas de Colores:** Organizados por categorías (Profesional, Moderno, Vibrante)
- ✅ **Sistema Bilingüe:** Español e Inglés (react-i18next)
- ✅ **Tema Claro/Oscuro:** Personalización completa de la interfaz
- ✅ **Exportación a PDF:** Preview en tiempo real y descarga
- ✅ **Dashboard Interactivo:** Estadísticas de perfiles y gestión
- ✅ **Progressive Web App (PWA):** Funcionalidad offline con Workbox
- ✅ **Autenticación JWT:** Con refresh tokens para seguridad
- ✅ **Diseño Responsive:** Optimizado para todos los dispositivos

### Backend
- ✅ **API RESTful Completa:** Arquitectura escalable con Express
- ✅ **Autenticación Robusta:** JWT + Refresh Tokens + Bcrypt
- ✅ **Generación Dinámica de PDFs:** Con Puppeteer
- ✅ **33 Categorías de Skills:** Predefinidas para diferentes industrias
- ✅ **Validación Exhaustiva:** Joi en todos los endpoints
- ✅ **Sistema de Seguridad:** Helmet, CORS, Rate Limiting
- ✅ **Logging Profesional:** Winston para desarrollo y producción
- ✅ **Base de Datos MySQL:** Con Sequelize ORM y migraciones
- ✅ **Despliegue en Producción:** PM2 en VPS configurado

---

## 🛠️ Stack Tecnológico

### Frontend

| Categoría | Tecnologías |
|-----------|-------------|
| **Core** | React 18.3, TypeScript 5.6 |
| **Estado** | Redux Toolkit 2.5 |
| **UI Framework** | Material-UI 6.2 |
| **Build Tool** | Vite |
| **i18n** | react-i18next |
| **PWA** | Workbox |
| **HTTP Client** | Axios |
| **Routing** | React Router |
| **Validación** | Formik + Yup |

### Backend

| Categoría | Tecnologías |
|-----------|-------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Base de Datos** | MySQL |
| **ORM** | Sequelize |
| **Autenticación** | JWT, Bcrypt |
| **PDF Generation** | Puppeteer |
| **Validación** | Joi |
| **Logging** | Winston |
| **Seguridad** | Helmet, CORS, Rate Limiting |
| **Process Manager** | PM2 |

---

## 📁 Arquitectura del Proyecto

### Frontend - Estructura de Carpetas

```
frontend-cv-generator/
├── public/
├── src/
│   ├── api/              # Servicios de API
│   ├── components/       # Componentes reutilizables
│   │   ├── common/      # Botones, inputs, modales
│   │   ├── layout/      # Navbar, Footer, Sidebar
│   │   └── templates/   # Plantillas de CV
│   ├── features/        # Redux slices
│   │   ├── auth/
│   │   ├── profile/
│   │   └── theme/
│   ├── hooks/           # Custom hooks
│   ├── i18n/            # Traducciones
│   ├── pages/           # Páginas principales
│   ├── store/           # Configuración Redux
│   ├── styles/          # Estilos globales
│   ├── types/           # TypeScript types
│   └── utils/           # Funciones utilitarias
├── .env
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Backend - Estructura de Carpetas

```
backend-cv-generator/
├── config/
│   ├── database.js      # Configuración Sequelize
│   └── jwt.js           # Configuración JWT
├── controllers/         # Lógica de negocio
├── middleware/          # Auth, validation, error handling
├── migrations/          # Migraciones de BD
├── models/              # Modelos Sequelize
├── routes/              # Definición de rutas
├── seeders/             # Datos iniciales
├── services/            # Servicios (PDF, Email)
├── utils/               # Utilidades
├── validators/          # Esquemas Joi
├── logs/                # Archivos de log
├── .env
├── package.json
└── server.js            # Punto de entrada
```

---

## 🔑 Funcionalidades Detalladas

### 1. Sistema de Autenticación

**Frontend:**
- Registro de usuarios con validación en tiempo real
- Login con persistencia de sesión
- Refresh token automático
- Rutas protegidas con HOC
- Manejo de expiración de tokens

**Backend:**
- Hash de contraseñas con Bcrypt (10 rounds)
- Generación de JWT (access + refresh tokens)
- Validación de tokens en middleware
- Blacklist de tokens revocados
- Rate limiting en endpoints de auth

### 2. Gestión de Perfiles

**Módulos del Perfil:**
- 📝 **Información Personal:** Nombre, email, teléfono, dirección, foto
- 💼 **Experiencia Laboral:** Empresa, puesto, fechas, descripción, logros
- 🎓 **Educación:** Institución, título, fechas, GPA, honores
- 🛠️ **Habilidades:** 33 categorías (Frontend, Backend, Mobile, etc.)
- 🌍 **Idiomas:** Nivel de competencia (A1-C2)
- 🏆 **Certificaciones:** Nombre, emisor, fecha, URL de verificación
- 🔗 **Enlaces:** GitHub, LinkedIn, Portfolio, otros

**Características:**
- CRUD completo para cada sección
- Validación exhaustiva de datos
- Autoguardado en borrador
- Historial de cambios
- Exportación/Importación de datos

### 3. Plantillas de CV

#### Harvard Classic
- Diseño tradicional y elegante
- Ideal para sectores corporativos
- Énfasis en experiencia profesional
- Formato de una columna

#### Harvard Modern
- Diseño contemporáneo con sidebar
- Layout de dos columnas
- Iconos y elementos visuales modernos
- Perfecto para tech y startups

#### Oxford
- Diseño minimalista y limpio
- Enfoque en contenido
- Espaciado generoso
- Versátil para múltiples industrias

### 4. Sistema de Colores

**Categorías:**

**Profesional:**
- Navy Blue (#1e3a8a)
- Slate Gray (#475569)
- Forest Green (#166534)

**Moderno:**
- Purple (#7c3aed)
- Teal (#0d9488)
- Indigo (#4f46e5)

**Vibrante:**
- Coral (#f43f5e)
- Orange (#ea580c)
- Cyan (#06b6d4)

**Neutral:**
- Charcoal (#374151)

### 5. Generación de PDFs

**Proceso:**
1. Usuario personaliza CV en el editor
2. Preview en tiempo real con React
3. Click en "Exportar PDF"
4. Frontend envía datos al backend
5. Backend genera HTML con template seleccionado
6. Puppeteer renderiza HTML a PDF
7. PDF se devuelve al frontend
8. Usuario descarga archivo

**Optimizaciones:**
- Caché de templates compilados
- Compresión de PDFs
- Generación asíncrona para CVs largos
- Límite de tamaño de respuesta

---

## 🔐 Seguridad

### Medidas Implementadas

**Frontend:**
- Sanitización de inputs
- XSS protection en React
- HTTPS enforcement
- Secure storage de tokens
- CSRF tokens en formularios

**Backend:**
- **Helmet:** Headers de seguridad HTTP
- **CORS:** Configuración restrictiva
- **Rate Limiting:** 100 requests/15min por IP
- **Bcrypt:** Hash de contraseñas (10 rounds)
- **JWT:** Tokens con expiración (15min access, 7d refresh)
- **Joi Validation:** Validación estricta de inputs
- **SQL Injection:** Prevención con Sequelize ORM
- **Error Handling:** No exposición de stack traces

---

## 📊 Base de Datos

### Modelo de Datos

**Tablas Principales:**

```sql
-- Usuarios
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Perfiles
CREATE TABLE profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  photo_url VARCHAR(500),
  summary TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Experiencia
CREATE TABLE experiences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profile_id INT,
  company VARCHAR(200) NOT NULL,
  position VARCHAR(200) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  achievements TEXT,
  order_index INT DEFAULT 0,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Educación
CREATE TABLE education (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profile_id INT,
  institution VARCHAR(200) NOT NULL,
  degree VARCHAR(200) NOT NULL,
  field_of_study VARCHAR(200),
  start_date DATE,
  end_date DATE,
  gpa DECIMAL(3, 2),
  description TEXT,
  order_index INT DEFAULT 0,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Skills
CREATE TABLE skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profile_id INT,
  category VARCHAR(100) NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 5),
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Idiomas
CREATE TABLE languages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profile_id INT,
  language VARCHAR(100) NOT NULL,
  proficiency_level VARCHAR(10) CHECK (proficiency_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native')),
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Certificaciones
CREATE TABLE certifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profile_id INT,
  name VARCHAR(200) NOT NULL,
  issuer VARCHAR(200) NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  credential_url VARCHAR(500),
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🚀 Despliegue

### Frontend

**Ambiente de Producción:**
- Build con Vite: `npm run build`
- Optimización automática de assets
- Code splitting por rutas
- Lazy loading de componentes
- Service Worker para PWA
- Deploy en Netlify/Vercel

**Variables de Entorno:**
```env
VITE_API_BASE_URL=https://api.cvgenerator.com
VITE_ENABLE_ANALYTICS=true
```

### Backend

**Ambiente de Producción:**
- PM2 para process management
- Nginx como reverse proxy
- MySQL en servidor dedicado
- Logs con Winston (archivos rotativos)
- Monitoreo con PM2 Plus

**Configuración PM2:**
```javascript
module.exports = {
  apps: [{
    name: 'cv-generator-api',
    script: './server.js',
    instances: 4,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
}
```

**Variables de Entorno:**
```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cv_generator
DB_USER=cvgen_user
DB_PASSWORD=secure_password
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=https://cvgenerator.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15
```

---

## 📝 API Documentation

### Endpoints Principales

#### Autenticación

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "user": { "id": 1, "email": "user@example.com" },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "user": { "id": 1, "email": "user@example.com" },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Perfiles

```http
GET /api/profiles/me
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": 1,
  "userId": 1,
  "phone": "+52 123 456 7890",
  "address": "Mazatlán, Sinaloa",
  "summary": "Full Stack Developer...",
  "experiences": [...],
  "education": [...],
  "skills": [...],
  "languages": [...],
  "certifications": [...]
}
```

```http
PUT /api/profiles/me
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "phone": "+52 123 456 7890",
  "address": "Mazatlán, Sinaloa",
  "summary": "Experienced developer..."
}

Response: 200 OK
```

#### Generación de PDF

```http
POST /api/cv/generate-pdf
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "template": "harvard-modern",
  "colorScheme": "navy-blue",
  "language": "es"
}

Response: 200 OK
Content-Type: application/pdf
[Binary PDF Data]
```

---

## 🧪 Testing

### Frontend
```bash
npm run test          # Unit tests con Vitest
npm run test:coverage # Coverage report
npm run test:e2e      # E2E tests con Playwright
```

### Backend
```bash
npm run test          # Unit tests con Jest
npm run test:int      # Integration tests
npm run test:api      # API tests con Supertest
npm run test:coverage # Coverage report
```

---

## 📈 Métricas del Proyecto

### Líneas de Código
- **Frontend:** ~8,500 líneas (TypeScript/React)
- **Backend:** ~4,200 líneas (JavaScript/Node.js)
- **Total:** ~12,700 líneas

### Componentes
- **Frontend:** 45+ componentes React
- **Backend:** 25+ endpoints API
- **Database:** 8 tablas principales

### Performance
- **Lighthouse Score:** 95+ (Performance, Accessibility, SEO)
- **API Response Time:** <200ms (avg)
- **PDF Generation:** <3s (avg)
- **Bundle Size:** <500KB (gzipped)

---

## 👨‍💻 Responsabilidades y Aprendizajes

### Frontend

**Desarrollo:**
- ✅ Arquitectura completa de aplicación React + TypeScript
- ✅ Gestión de estado global con Redux Toolkit
- ✅ Implementación de sistema de autenticación con JWT
- ✅ Diseño e implementación de 3 plantillas de CV
- ✅ Sistema de personalización con colores y temas
- ✅ Internacionalización completa (ES/EN)
- ✅ PWA con funcionalidad offline

**Aprendizajes Clave:**
- Patrones de diseño avanzados en React
- Optimización de performance con code splitting
- Gestión compleja de estado con Redux Toolkit
- Implementación de TypeScript en proyecto grande
- Configuración de PWA con Workbox

### Backend

**Desarrollo:**
- ✅ Diseño e implementación de API RESTful escalable
- ✅ Arquitectura de base de datos con MySQL y Sequelize
- ✅ Sistema de autenticación robusto con JWT
- ✅ Generación dinámica de PDFs con Puppeteer
- ✅ Sistema de validación con Joi
- ✅ Implementación de seguridad multi-capa
- ✅ Logging profesional con Winston
- ✅ Despliegue en producción con PM2

**Aprendizajes Clave:**
- Arquitectura de APIs RESTful escalables
- Seguridad web (CORS, Rate Limiting, JWT)
- Generación de PDFs en servidor
- Manejo de bases de datos relacionales
- DevOps básico (PM2, Nginx, VPS)

---

## 🔄 Futuras Mejoras

### Corto Plazo
- [ ] Integración con LinkedIn API para importar datos
- [ ] Sistema de plantillas personalizables por usuario
- [ ] Exportación a múltiples formatos (DOCX, HTML)
- [ ] Análisis de CV con IA para sugerencias

### Mediano Plazo
- [ ] Sistema de colaboración en tiempo real
- [ ] Marketplace de plantillas premium
- [ ] Integración con plataformas de empleo
- [ ] ATS (Applicant Tracking System) compliance check

### Largo Plazo
- [ ] Aplicación móvil nativa (React Native)
- [ ] Sistema de video CV
- [ ] IA para matching de trabajos
- [ ] Blockchain para verificación de credenciales

---

## 📞 Contacto

**Desarrollador:** Miguel Alexis Díaz
**Email:** miguelalexisdi18@gmail.com
**LinkedIn:** [linkedin.com/in/alexisdiaz](https://linkedin.com/in/alexisdiaz)
**GitHub:** [github.com/maniadiaz](https://github.com/maniadiaz)
**Ubicación:** Mazatlán, Sinaloa, México

---

## 📄 Licencia

Este proyecto es de código privado y fue desarrollado como proyecto personal de portafolio.

---

## 🙏 Agradecimientos

- **Material-UI Team** por el excelente framework de componentes
- **Redux Toolkit Team** por simplificar la gestión de estado
- **Puppeteer Team** por la generación de PDFs
- **Comunidad Open Source** por las increíbles herramientas y librerías

---

**Última actualización:** Febrero 2026
**Versión:** 1.0.0
**Estado:** Producción ✅
