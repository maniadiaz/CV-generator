# CV Generator - Backend

Backend API para la plataforma de generación de CVs con formato Harvard.

## Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** Express.js 4.x
- **ORM:** Sequelize 6.x
- **Base de Datos:** MariaDB/MySQL
- **Autenticación:** JWT (JSON Web Tokens)
- **Validación:** Joi
- **Logging:** Winston
- **Seguridad:** Helmet, CORS, Bcrypt
- **Generación PDF:** Puppeteer

## Requisitos Previos

- Node.js >= 16.x
- MySQL/MariaDB 10.x
- npm o yarn

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales:

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
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Verificar base de datos

Asegúrate de que:
- El servidor de base de datos está corriendo
- El schema `cv_generator` existe
- Las credenciales en `.env` son correctas

## Scripts Disponibles

```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start

# Linting
npm run lint          # Verificar código
npm run lint:fix      # Corregir automáticamente

# Tests
npm test              # Ejecutar tests con cobertura
npm run test:watch    # Tests en modo watch

# Base de datos (Sequelize CLI)
npm run migrate       # Ejecutar migraciones
npm run migrate:undo  # Revertir última migración
npm run seed          # Ejecutar seeders
```

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/           # Configuraciones (DB, CORS, JWT, etc.)
│   │   ├── app.js        # Configuración de Express
│   │   ├── database.js   # Configuración de Sequelize
│   │   ├── cors.js       # Configuración de CORS
│   │   └── jwt.js        # Configuración de JWT
│   │
│   ├── models/           # Modelos de Sequelize
│   │   └── index.js      # Inicialización de Sequelize
│   │
│   ├── controllers/      # Controladores (lógica de negocio)
│   │
│   ├── middlewares/      # Middlewares de Express
│   │   └── errorHandler.js
│   │
│   ├── routes/           # Definición de rutas API
│   │   └── index.js      # Router principal
│   │
│   ├── services/         # Servicios (lógica compleja)
│   │
│   ├── utils/            # Utilidades y helpers
│   │   ├── logger.js     # Winston logger
│   │   └── response.js   # Helper de respuestas API
│   │
│   ├── validators/       # Validadores con Joi
│   │
│   └── server.js         # Entry point de la aplicación
│
├── templates/            # Templates HTML (emails, PDFs)
│   └── email/
│
├── uploads/              # Archivos subidos (avatares, etc.)
│   └── temp/             # Archivos temporales
│
├── tests/                # Tests
│   ├── unit/             # Tests unitarios
│   ├── integration/      # Tests de integración
│   └── e2e/              # Tests end-to-end
│
├── .env                  # Variables de entorno (no commitear)
├── .env.example          # Template de variables de entorno
├── .eslintrc.js          # Configuración de ESLint
├── .gitignore            # Archivos ignorados por Git
├── package.json          # Dependencias y scripts
└── README.md             # Este archivo
```

## Endpoints API

### Fase 0 - Health Checks

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check del servidor |
| GET | `/api/health` | Health check de la API |

### Fases Futuras

Los endpoints de autenticación, perfiles, CV, y exportación se agregarán en las siguientes fases del desarrollo.

## Desarrollo

### Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5000` (o el puerto especificado en `.env`).

### Verificar que todo funciona:

```bash
# Verificar health check
curl http://localhost:5000/health

# Debería responder:
{
  "status": "OK",
  "timestamp": "2026-01-28T...",
  "uptime": 1.234
}
```

## Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `5000` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `3306` |
| `DB_NAME` | Nombre de la base de datos | `cv_generator` |
| `DB_USER` | Usuario de la base de datos | `root` |
| `DB_PASSWORD` | Contraseña de la base de datos | - |
| `JWT_SECRET` | Secret para tokens JWT | - |
| `JWT_EXPIRE` | Tiempo de expiración del token | `24h` |
| `FRONTEND_URL` | URL del frontend para CORS | `http://localhost:5173` |

## Seguridad

El proyecto incluye las siguientes medidas de seguridad:

- **Helmet**: Headers HTTP seguros
- **CORS**: Control de acceso cross-origin
- **Bcrypt**: Hashing de contraseñas
- **JWT**: Autenticación stateless
- **Express Validator**: Validación de entrada
- **Rate Limiting**: Límite de requests por IP

## Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm test -- --coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## Logging

El proyecto usa Winston para logging con los siguientes niveles:

- `error`: Errores críticos
- `warn`: Advertencias
- `info`: Información general (por defecto)
- `debug`: Información de debugging

Los logs se muestran en consola con colores. Para logs en archivo, descomentar en `src/utils/logger.js`.

## Estado del Proyecto

### Fase Actual: Fase 0 - Setup Completado ✅

- [x] Proyecto Node.js inicializado
- [x] Estructura de carpetas creada
- [x] Dependencias instaladas
- [x] Configuraciones base implementadas
- [x] Servidor Express funcionando
- [x] Conexión a base de datos configurada
- [x] Middlewares de seguridad implementados
- [x] Sistema de logging configurado
- [x] Error handling centralizado

### Próximas Fases

- **Fase 1**: Sistema de Autenticación (Register, Login, JWT)
- **Fase 2**: Gestión de Perfiles CV
- **Fase 3**: Secciones CV - Educación y Experiencia
- **Fase 4**: Secciones CV - Skills, Languages, Certifications
- **Fase 5**: Redes Sociales y Completitud de Perfil
- **Fase 6**: Vista Previa y Plantillas CV
- **Fase 7**: Exportación PDF
- **Fase 8**: Activity Logs y Analytics
- **Fase 9**: Testing y Optimización
- **Fase 10**: Deployment

## Contribución

Este proyecto sigue el estilo de código definido en `.eslintrc.js`. Por favor ejecuta `npm run lint` antes de hacer commits.

## Soporte

Para reportar bugs o solicitar features, por favor crea un issue en el repositorio del proyecto.

## Licencia

ISC
