# CV Generator - API Documentation

## Información General

**Base URL:** `https://api-cv.servercontrol-mzt.com`

**Versión:** 1.0.0

**Stack:** Node.js + Express + Sequelize + MySQL

**Autenticación:** JWT (JSON Web Tokens)

---

## Configuración del Cliente (Frontend)

### Configurar API URL en tu frontend

```javascript
// En tu archivo de configuración (ej: config.js o .env)
const API_URL = 'https://api-cv.servercontrol-mzt.com';

// Configuración de Axios (recomendado)
import axios from 'axios';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
```

### Estructura de Respuestas

Todas las respuestas siguen este formato:

**Éxito:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* resultado */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* detalles de errores */ ]
}
```

---

## 1. Autenticación

### 1.1 Registrar Usuario

**Endpoint:** `POST /api/auth/register`

**Headers:** Ninguno

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123!",
  "name": "Juan Pérez"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "isVerified": false
    }
  }
}
```

### 1.2 Login

**Endpoint:** `POST /api/auth/login`

**Headers:** Ninguno

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123!"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Nota:** Guarda el `accessToken` y `refreshToken` en localStorage o cookies.

### 1.3 Refresh Token

**Endpoint:** `POST /api/auth/refresh-token`

**Headers:** Ninguno

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.4 Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

### 1.5 Verificar Email

**Endpoint:** `GET /api/auth/verify-email/:token`

**Headers:** Ninguno

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null
}
```

### 1.6 Olvidé mi Contraseña

**Endpoint:** `POST /api/auth/forgot-password`

**Headers:** Ninguno

**Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Password reset email sent",
  "data": null
}
```

### 1.7 Resetear Contraseña

**Endpoint:** `POST /api/auth/reset-password/:token`

**Headers:** Ninguno

**Body:**
```json
{
  "password": "NewPassword123!"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": null
}
```

---

## 2. Perfiles de CV

Todas las rutas de perfiles requieren autenticación (Bearer token).

### 2.1 Listar Perfiles del Usuario

**Endpoint:** `GET /api/profiles`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Profiles retrieved successfully",
  "data": {
    "profiles": [
      {
        "id": 1,
        "name": "CV Desarrollador",
        "slug": "cv-desarrollador",
        "template": "harvard_classic",
        "is_default": true,
        "completion_percentage": 85,
        "download_count": 5,
        "last_exported_at": "2026-01-28T10:30:00.000Z",
        "created_at": "2026-01-20T08:00:00.000Z",
        "updated_at": "2026-01-28T10:30:00.000Z"
      }
    ]
  }
}
```

### 2.2 Crear Perfil

**Endpoint:** `POST /api/profiles`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "name": "CV Ingeniero de Software",
  "template": "harvard_modern"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "profile": {
      "id": 2,
      "name": "CV Ingeniero de Software",
      "slug": "cv-ingeniero-de-software",
      "template": "harvard_modern",
      "is_default": false,
      "completion_percentage": 0,
      "user_id": 1
    }
  }
}
```

### 2.3 Obtener Perfil por ID

**Endpoint:** `GET /api/profiles/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "profile": {
      "id": 1,
      "name": "CV Desarrollador",
      "slug": "cv-desarrollador",
      "template": "harvard_classic",
      "is_default": true,
      "completion_percentage": 85,
      "download_count": 5,
      "last_exported_at": "2026-01-28T10:30:00.000Z"
    }
  }
}
```

### 2.4 Actualizar Perfil

**Endpoint:** `PUT /api/profiles/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "name": "CV Senior Developer"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": {
      "id": 1,
      "name": "CV Senior Developer",
      "slug": "cv-senior-developer"
    }
  }
}
```

### 2.5 Eliminar Perfil

**Endpoint:** `DELETE /api/profiles/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Profile deleted successfully",
  "data": null
}
```

### 2.6 Marcar Perfil como Default

**Endpoint:** `PATCH /api/profiles/:id/set-default`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Default profile set successfully",
  "data": {
    "profile": {
      "id": 1,
      "is_default": true
    }
  }
}
```

### 2.7 Duplicar Perfil

**Endpoint:** `POST /api/profiles/:id/duplicate`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Profile duplicated successfully",
  "data": {
    "profile": {
      "id": 3,
      "name": "CV Desarrollador (Copia)",
      "slug": "cv-desarrollador-copia"
    }
  }
}
```

### 2.8 Obtener Perfil Completo (con todas las secciones)

**Endpoint:** `GET /api/profiles/:id/complete`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Complete profile retrieved successfully",
  "data": {
    "profile": {
      "id": 1,
      "name": "CV Desarrollador",
      "template": "harvard_classic",
      "completion_percentage": 85,
      "personalInfo": {
        "full_name": "Juan Pérez",
        "email": "juan@ejemplo.com",
        "phone": "+52 123 456 7890"
      },
      "education": [ /* array de educación */ ],
      "experience": [ /* array de experiencia */ ],
      "skills": [ /* array de habilidades */ ],
      "languages": [ /* array de idiomas */ ],
      "certifications": [ /* array de certificaciones */ ],
      "socialNetworks": [ /* array de redes sociales */ ]
    }
  }
}
```

### 2.9 Obtener Completitud del Perfil

**Endpoint:** `GET /api/profiles/:id/completion`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Profile completion retrieved successfully",
  "data": {
    "completion": {
      "percentage": 85,
      "missingSections": [
        {
          "section": "certifications",
          "message": "Add at least 1 certification",
          "weight": 5
        }
      ]
    }
  }
}
```

### 2.10 Obtener Estadísticas de Perfiles

**Endpoint:** `GET /api/profiles/stats`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Profile stats retrieved successfully",
  "data": {
    "stats": {
      "total": 3,
      "default": 1,
      "avgCompletion": 72,
      "totalExports": 15
    }
  }
}
```

---

## 3. Información Personal

### 3.1 Obtener Información Personal

**Endpoint:** `GET /api/profiles/:profileId/personal`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Personal info retrieved successfully",
  "data": {
    "personalInfo": {
      "id": 1,
      "full_name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "phone": "+52 123 456 7890",
      "location": "Ciudad de México, México",
      "professional_title": "Desarrollador Full Stack",
      "summary": "Desarrollador con 5 años de experiencia..."
    }
  }
}
```

### 3.2 Actualizar Información Personal

**Endpoint:** `PUT /api/profiles/:profileId/personal`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "full_name": "Juan Pérez García",
  "phone": "+52 987 654 3210",
  "professional_title": "Senior Full Stack Developer"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Personal info updated successfully",
  "data": {
    "personalInfo": {
      "id": 1,
      "full_name": "Juan Pérez García",
      "phone": "+52 987 654 3210",
      "professional_title": "Senior Full Stack Developer"
    }
  }
}
```

---

## 4. Educación

### 4.1 Listar Educación

**Endpoint:** `GET /api/profiles/:profileId/education`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Education entries retrieved successfully",
  "data": {
    "education": [
      {
        "id": 1,
        "institution": "Universidad Nacional",
        "degree": "Licenciatura",
        "field_of_study": "Ingeniería en Sistemas",
        "start_date": "2015-08-01",
        "end_date": "2019-06-01",
        "is_current": false,
        "is_visible": true,
        "display_order": 0
      }
    ]
  }
}
```

### 4.2 Crear Educación

**Endpoint:** `POST /api/profiles/:profileId/education`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "institution": "Universidad Tecnológica",
  "degree": "Maestría",
  "field_of_study": "Ciencias de la Computación",
  "start_date": "2020-08-01",
  "end_date": "2022-06-01",
  "is_current": false,
  "gpa": "9.5"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Education entry created successfully",
  "data": {
    "education": {
      "id": 2,
      "institution": "Universidad Tecnológica",
      "degree": "Maestría",
      "field_of_study": "Ciencias de la Computación"
    }
  }
}
```

### 4.3 Actualizar Educación

**Endpoint:** `PUT /api/profiles/:profileId/education/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "gpa": "9.8"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Education entry updated successfully",
  "data": {
    "education": {
      "id": 2,
      "gpa": "9.8"
    }
  }
}
```

### 4.4 Eliminar Educación

**Endpoint:** `DELETE /api/profiles/:profileId/education/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Education entry deleted successfully",
  "data": null
}
```

### 4.5 Reordenar Educación

**Endpoint:** `POST /api/profiles/:profileId/education/reorder`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "ordered_ids": [2, 1, 3]
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Education entries reordered successfully",
  "data": null
}
```

---

## 5. Experiencia Laboral

### 5.1 Listar Experiencia

**Endpoint:** `GET /api/profiles/:profileId/experience`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Experience entries retrieved successfully",
  "data": {
    "experience": [
      {
        "id": 1,
        "project_title": "Sistema de Gestión Empresarial",
        "position": "Desarrollador Full Stack",
        "company": "Tech Solutions S.A.",
        "start_date": "2020-01-01",
        "end_date": "2023-12-31",
        "is_current": false,
        "achievements": "Desarrollé API REST con Node.js...",
        "technologies": "Node.js, React, PostgreSQL",
        "is_visible": true,
        "display_order": 0
      }
    ]
  }
}
```

### 5.2 Crear Experiencia

**Endpoint:** `POST /api/profiles/:profileId/experience`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "project_title": "Plataforma de E-commerce",
  "position": "Senior Developer",
  "company": "Digital Commerce Inc.",
  "start_date": "2024-01-01",
  "is_current": true,
  "achievements": "Implementé arquitectura de microservicios...",
  "technologies": "TypeScript, Next.js, MongoDB"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Experience entry created successfully",
  "data": {
    "experience": {
      "id": 2,
      "project_title": "Plataforma de E-commerce",
      "position": "Senior Developer"
    }
  }
}
```

### 5.3 Actualizar Experiencia

**Endpoint:** `PUT /api/profiles/:profileId/experience/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "is_current": false,
  "end_date": "2025-12-31"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Experience entry updated successfully",
  "data": {
    "experience": {
      "id": 2,
      "is_current": false,
      "end_date": "2025-12-31"
    }
  }
}
```

### 5.4 Eliminar Experiencia

**Endpoint:** `DELETE /api/profiles/:profileId/experience/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Experience entry deleted successfully",
  "data": null
}
```

### 5.5 Reordenar Experiencia

**Endpoint:** `POST /api/profiles/:profileId/experience/reorder`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "ordered_ids": [2, 1, 3]
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Experience entries reordered successfully",
  "data": null
}
```

---

## 6. Habilidades (Skills)

### 6.1 Listar Habilidades

**Endpoint:** `GET /api/profiles/:profileId/skills`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Skills retrieved successfully",
  "data": {
    "skills": [
      {
        "id": 1,
        "name": "JavaScript",
        "category": "Programming",
        "level": "Expert",
        "years_of_experience": 5,
        "is_visible": true,
        "display_order": 0
      }
    ]
  }
}
```

### 6.2 Crear Habilidad

**Endpoint:** `POST /api/profiles/:profileId/skills`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "name": "TypeScript",
  "category": "Programming",
  "level": "Advanced",
  "years_of_experience": 3
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Skill created successfully",
  "data": {
    "skill": {
      "id": 2,
      "name": "TypeScript",
      "category": "Programming",
      "level": "Advanced"
    }
  }
}
```

### 6.3 Actualizar Habilidad

**Endpoint:** `PUT /api/profiles/:profileId/skills/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "level": "Expert",
  "years_of_experience": 4
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Skill updated successfully",
  "data": {
    "skill": {
      "id": 2,
      "level": "Expert",
      "years_of_experience": 4
    }
  }
}
```

### 6.4 Eliminar Habilidad

**Endpoint:** `DELETE /api/profiles/:profileId/skills/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Skill deleted successfully",
  "data": null
}
```

### 6.5 Reordenar Habilidades

**Endpoint:** `POST /api/profiles/:profileId/skills/reorder`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "ordered_ids": [3, 1, 2]
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Skills reordered successfully",
  "data": null
}
```

### 6.6 Obtener Categorías de Habilidades

**Endpoint:** `GET /api/profiles/:profileId/skills/categories`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Skill categories retrieved successfully",
  "data": {
    "categories": ["Programming", "Frameworks", "Databases", "DevOps"]
  }
}
```

### 6.7 Obtener Estadísticas de Habilidades

**Endpoint:** `GET /api/profiles/:profileId/skills/stats`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Skill stats retrieved successfully",
  "data": {
    "stats": {
      "total": 15,
      "byCategory": {
        "Programming": 5,
        "Frameworks": 4,
        "Databases": 3,
        "DevOps": 3
      },
      "byLevel": {
        "Expert": 4,
        "Advanced": 6,
        "Intermediate": 5
      }
    }
  }
}
```

---

## 7. Idiomas

### 7.1 Listar Idiomas

**Endpoint:** `GET /api/profiles/:profileId/languages`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Languages retrieved successfully",
  "data": {
    "languages": [
      {
        "id": 1,
        "name": "Español",
        "level": "Native",
        "certification_name": null,
        "certification_score": null,
        "is_visible": true,
        "display_order": 0
      }
    ]
  }
}
```

### 7.2 Crear Idioma

**Endpoint:** `POST /api/profiles/:profileId/languages`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "name": "Inglés",
  "level": "C1",
  "certification_name": "TOEFL",
  "certification_score": "110"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Language created successfully",
  "data": {
    "language": {
      "id": 2,
      "name": "Inglés",
      "level": "C1"
    }
  }
}
```

### 7.3 Actualizar Idioma

**Endpoint:** `PUT /api/profiles/:profileId/languages/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "level": "C2"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Language updated successfully",
  "data": {
    "language": {
      "id": 2,
      "level": "C2"
    }
  }
}
```

### 7.4 Eliminar Idioma

**Endpoint:** `DELETE /api/profiles/:profileId/languages/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Language deleted successfully",
  "data": null
}
```

### 7.5 Reordenar Idiomas

**Endpoint:** `POST /api/profiles/:profileId/languages/reorder`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "ordered_ids": [2, 1, 3]
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Languages reordered successfully",
  "data": null
}
```

---

## 8. Certificaciones

### 8.1 Listar Certificaciones

**Endpoint:** `GET /api/profiles/:profileId/certifications`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Certifications retrieved successfully",
  "data": {
    "certifications": [
      {
        "id": 1,
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "issue_date": "2023-06-15",
        "expiration_date": "2026-06-15",
        "credential_id": "AWS-SA-12345",
        "credential_url": "https://aws.amazon.com/verify/12345",
        "is_visible": true,
        "display_order": 0
      }
    ]
  }
}
```

### 8.2 Crear Certificación

**Endpoint:** `POST /api/profiles/:profileId/certifications`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "name": "Google Cloud Professional Developer",
  "issuer": "Google Cloud",
  "issue_date": "2024-01-20",
  "expiration_date": "2026-01-20",
  "credential_id": "GCP-DEV-67890",
  "credential_url": "https://cloud.google.com/verify/67890"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Certification created successfully",
  "data": {
    "certification": {
      "id": 2,
      "name": "Google Cloud Professional Developer",
      "issuer": "Google Cloud"
    }
  }
}
```

### 8.3 Actualizar Certificación

**Endpoint:** `PUT /api/profiles/:profileId/certifications/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "expiration_date": "2027-01-20"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Certification updated successfully",
  "data": {
    "certification": {
      "id": 2,
      "expiration_date": "2027-01-20"
    }
  }
}
```

### 8.4 Eliminar Certificación

**Endpoint:** `DELETE /api/profiles/:profileId/certifications/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Certification deleted successfully",
  "data": null
}
```

### 8.5 Reordenar Certificaciones

**Endpoint:** `POST /api/profiles/:profileId/certifications/reorder`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "ordered_ids": [3, 1, 2]
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Certifications reordered successfully",
  "data": null
}
```

---

## 9. Redes Sociales

### 9.1 Listar Redes Sociales

**Endpoint:** `GET /api/profiles/:profileId/social-networks`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Social networks retrieved successfully",
  "data": {
    "socialNetworks": [
      {
        "id": 1,
        "platform": "linkedin",
        "url": "https://linkedin.com/in/juanperez",
        "username": "juanperez",
        "is_visible": true,
        "display_order": 0
      }
    ]
  }
}
```

**Plataformas válidas:** linkedin, github, gitlab, twitter, portfolio, stackoverflow, medium, youtube, behance, dribbble, other

### 9.2 Crear Red Social

**Endpoint:** `POST /api/profiles/:profileId/social-networks`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "platform": "github",
  "url": "https://github.com/juanperez",
  "username": "juanperez"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Social network created successfully",
  "data": {
    "socialNetwork": {
      "id": 2,
      "platform": "github",
      "url": "https://github.com/juanperez"
    }
  }
}
```

### 9.3 Actualizar Red Social

**Endpoint:** `PUT /api/profiles/:profileId/social-networks/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "username": "juan-perez-dev"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Social network updated successfully",
  "data": {
    "socialNetwork": {
      "id": 2,
      "username": "juan-perez-dev"
    }
  }
}
```

### 9.4 Eliminar Red Social

**Endpoint:** `DELETE /api/profiles/:profileId/social-networks/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Social network deleted successfully",
  "data": null
}
```

### 9.5 Reordenar Redes Sociales

**Endpoint:** `POST /api/profiles/:profileId/social-networks/reorder`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "ordered_ids": [2, 1, 3]
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Social networks reordered successfully",
  "data": null
}
```

### 9.6 Toggle Visibility

**Endpoint:** `PATCH /api/profiles/:profileId/social-networks/:id/toggle-visibility`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Social network visibility toggled",
  "data": {
    "socialNetwork": {
      "id": 2,
      "is_visible": false
    }
  }
}
```

### 9.7 Obtener Estadísticas

**Endpoint:** `GET /api/profiles/:profileId/social-networks/stats`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Social network stats retrieved successfully",
  "data": {
    "stats": {
      "total": 5,
      "visible": 4,
      "hidden": 1,
      "byPlatform": {
        "linkedin": 1,
        "github": 1,
        "twitter": 1,
        "portfolio": 1,
        "stackoverflow": 1
      }
    }
  }
}
```

---

## 10. Plantillas (Templates)

### 10.1 Listar Plantillas Disponibles

**Endpoint:** `GET /api/templates`

**Headers:** Ninguno (público)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Templates retrieved successfully",
  "data": {
    "templates": [
      {
        "name": "harvard_classic",
        "displayName": "Harvard Classic",
        "category": "Professional",
        "description": "Diseño tradicional inspirado en el estilo académico de Harvard",
        "colors": {
          "primary": "#A51C30",
          "secondary": "#333333",
          "accent": "#8C1C13"
        },
        "features": [
          "Diseño tradicional",
          "Tipografía serif profesional",
          "Formato académico Harvard"
        ],
        "previewImage": "/templates/previews/harvard_classic.png"
      },
      {
        "name": "harvard_modern",
        "displayName": "Harvard Modern",
        "category": "Modern",
        "description": "Versión contemporánea del estilo Harvard con elementos modernos",
        "colors": {
          "primary": "#A51C30",
          "secondary": "#1a1a1a",
          "accent": "#c41e3a"
        },
        "features": [
          "Diseño contemporáneo",
          "Tipografía sans-serif limpia",
          "Layout moderno con secciones destacadas"
        ],
        "previewImage": "/templates/previews/harvard_modern.png"
      }
    ]
  }
}
```

### 10.2 Cambiar Plantilla del Perfil

**Endpoint:** `PATCH /api/profiles/:id/template`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "template": "harvard_modern"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Template changed successfully",
  "data": {
    "profile": {
      "id": 1,
      "name": "CV Desarrollador",
      "template": "harvard_modern"
    }
  }
}
```

### 10.3 Obtener Preview HTML

**Endpoint:** `GET /api/profiles/:id/preview-html`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Preview HTML generated successfully",
  "data": {
    "html": "<!DOCTYPE html><html>...</html>"
  }
}
```

**Nota:** El HTML devuelto puede ser renderizado directamente en un iframe o guardado como archivo HTML.

---

## 11. Exportación PDF

### 11.1 Validar Perfil para Exportación

**Endpoint:** `GET /api/profiles/:profileId/pdf/validate`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Profile validation completed",
  "data": {
    "validation": {
      "isValid": true,
      "completeness": 85,
      "hasPersonalInfo": true,
      "warnings": [
        {
          "section": "certifications",
          "message": "Considera agregar certificaciones para mejorar tu CV",
          "severity": "low"
        }
      ]
    }
  }
}
```

### 11.2 Exportar PDF (Descarga)

**Endpoint:** `GET /api/profiles/:profileId/pdf/export-pdf`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):** Binario PDF

**Headers de respuesta:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="CV-Juan-Perez-2026-01-28.pdf"
Content-Length: 123456
```

**Ejemplo en JavaScript:**
```javascript
// Fetch API
fetch('https://api-cv.servercontrol-mzt.com/api/profiles/1/pdf/export-pdf', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mi-cv.pdf';
  a.click();
});

// Axios
axios({
  url: 'https://api-cv.servercontrol-mzt.com/api/profiles/1/pdf/export-pdf',
  method: 'GET',
  responseType: 'blob',
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(response => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'mi-cv.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
});
```

### 11.3 Vista Previa PDF (Inline)

**Endpoint:** `GET /api/profiles/:profileId/pdf/preview-pdf`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta (200):** Binario PDF

**Headers de respuesta:**
```
Content-Type: application/pdf
Content-Disposition: inline; filename="CV-Preview.pdf"
```

**Ejemplo en JavaScript (mostrar en iframe):**
```javascript
fetch('https://api-cv.servercontrol-mzt.com/api/profiles/1/pdf/preview-pdf', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const iframe = document.getElementById('pdf-preview');
  iframe.src = url;
});
```

---

## 12. Manejo de Errores

### Códigos de Estado HTTP

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado exitosamente |
| 204 | No Content | Operación exitosa sin contenido |
| 400 | Bad Request | Error de validación o datos inválidos |
| 401 | Unauthorized | Token inválido o expirado |
| 403 | Forbidden | No tienes permisos para este recurso |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: email ya existe) |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Error del servidor |

### Ejemplos de Errores

**Error de Validación (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Email must be a valid email address",
    "Password must be at least 8 characters"
  ]
}
```

**Token Inválido (401):**
```json
{
  "success": false,
  "message": "Invalid token",
  "errors": null
}
```

**Token Expirado (401):**
```json
{
  "success": false,
  "message": "Token expired",
  "errors": null
}
```

**Recurso No Encontrado (404):**
```json
{
  "success": false,
  "message": "Profile not found",
  "errors": null
}
```

**Email Ya Existe (409):**
```json
{
  "success": false,
  "message": "Resource already exists",
  "errors": ["Email already registered"]
}
```

**Rate Limit Excedido (429):**
```json
{
  "success": false,
  "message": "Too many requests",
  "errors": null
}
```

---

## 13. Autenticación - Flujo Completo

### Paso 1: Registrar Usuario
```javascript
POST /api/auth/register
{
  "email": "nuevo@ejemplo.com",
  "password": "Password123!",
  "name": "Nuevo Usuario"
}
```

### Paso 2: Verificar Email
Usuario recibe email con link: `https://api-cv.servercontrol-mzt.com/api/auth/verify-email/{token}`

### Paso 3: Login
```javascript
POST /api/auth/login
{
  "email": "nuevo@ejemplo.com",
  "password": "Password123!"
}

// Respuesta:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Paso 4: Usar Access Token
```javascript
// Guardar tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Hacer requests autenticadas
GET /api/profiles
Headers: {
  Authorization: Bearer {accessToken}
}
```

### Paso 5: Renovar Token (cuando expire)
```javascript
POST /api/auth/refresh-token
{
  "refreshToken": "{refreshToken}"
}

// Respuesta:
{
  "accessToken": "eyJhbGc..." // Nuevo token
}
```

### Paso 6: Logout
```javascript
POST /api/auth/logout
{
  "refreshToken": "{refreshToken}"
}

// Limpiar tokens
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

---

## 14. Rate Limiting

La API implementa rate limiting para prevenir abuso:

**Configuración por defecto:**
- Ventana: 15 minutos
- Máximo de requests: 100 por ventana

**Cuando excedes el límite:**
```json
{
  "success": false,
  "message": "Too many requests",
  "errors": null
}
```

**Headers de respuesta:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706443200
```

---

## 15. CORS (Cross-Origin Resource Sharing)

La API acepta requests desde:
- `http://localhost:5173` (desarrollo frontend)
- Otros orígenes configurados en el servidor

**Headers permitidos:**
- `Content-Type`
- `Authorization`

**Métodos permitidos:**
- GET, POST, PUT, PATCH, DELETE, OPTIONS

---

## 16. Health Check

### Verificar Estado del Servidor

**Endpoint:** `GET /health`

**Headers:** Ninguno

**Respuesta (200):**
```json
{
  "status": "OK",
  "timestamp": "2026-01-28T12:30:45.123Z",
  "uptime": 123456.789
}
```

**Endpoint:** `GET /api/health`

**Headers:** Ninguno

**Respuesta (200):**
```json
{
  "status": "API OK",
  "version": "1.0.0",
  "timestamp": "2026-01-28T12:30:45.123Z"
}
```

---

## 17. Mejores Prácticas

### Manejo de Tokens

```javascript
// Interceptor de Axios para manejar tokens expirados
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          'https://api-cv.servercontrol-mzt.com/api/auth/refresh-token',
          { refreshToken }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh falló, redirigir a login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### Manejo de Errores

```javascript
try {
  const response = await apiClient.get('/api/profiles');
  // Manejar éxito
} catch (error) {
  if (error.response) {
    // El servidor respondió con un código de error
    const { status, data } = error.response;

    switch (status) {
      case 400:
        // Mostrar errores de validación
        showValidationErrors(data.errors);
        break;
      case 401:
        // Redirigir a login
        redirectToLogin();
        break;
      case 404:
        // Mostrar mensaje de recurso no encontrado
        showNotFoundMessage();
        break;
      default:
        // Mostrar error genérico
        showErrorMessage(data.message);
    }
  } else if (error.request) {
    // No hubo respuesta del servidor
    showNetworkError();
  } else {
    // Error al configurar la request
    showGenericError();
  }
}
```

### Auto-guardado

```javascript
import { debounce } from 'lodash';

// Función de auto-guardado con debounce
const autoSave = debounce(async (profileId, data) => {
  try {
    await apiClient.put(`/api/profiles/${profileId}`, data);
    showSaveIndicator('Guardado');
  } catch (error) {
    showSaveIndicator('Error al guardar');
  }
}, 3000); // 3 segundos de delay

// Llamar en cada cambio del formulario
const handleChange = (field, value) => {
  setFormData({ ...formData, [field]: value });
  autoSave(profileId, { ...formData, [field]: value });
};
```

---

## 18. Soporte y Contacto

**Documentación:** Este archivo

**Base URL:** https://api-cv.servercontrol-mzt.com

**Versión:** 1.0.0

**Fase Actual:** Fase 7 completada (70% del proyecto)

**Próximas Fases:**
- Fase 8: Activity Logs y Dashboard Analytics
- Fase 9: Testing y Optimización
- Fase 10: Deployment Final

---

## 19. Changelog

### Versión 1.0.0 (2026-01-28)
- Fase 0: Setup Backend
- Fase 1: Sistema de Autenticación
- Fase 2: Gestión de Perfiles
- Fase 3: Educación y Experiencia
- Fase 4: Skills, Languages, Certifications
- Fase 5: Social Networks y Profile Completion
- Fase 6: Vista Previa y Plantillas
- Fase 7: Exportación PDF

---

**Última actualización:** 2026-01-28

**Autor:** CV Generator Team

**Backend URL:** https://api-cv.servercontrol-mzt.com
