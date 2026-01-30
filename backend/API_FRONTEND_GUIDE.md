# CV Generator API - Guía para Frontend

**Base URL:** `https://api-cv.servercontrol-mzt.com`

Esta guía está diseñada específicamente para ayudar al equipo de frontend a integrar correctamente todos los endpoints de la API.

---

## Tabla de Contenidos

1. [Skills (Habilidades)](#skills-habilidades)
2. [Idiomas](#idiomas)
3. [Certificaciones](#certificaciones)
4. [Redes Sociales](#redes-sociales)
5. [Toggle Visibility](#toggle-visibility)
6. [Plantillas](#plantillas)
7. [Exportación PDF](#exportación-pdf)

---

## Skills (Habilidades)

### Obtener Categorías Disponibles

**🆕 NUEVO:** En lugar de tener categorías hardcodeadas en el frontend, ahora puedes obtenerlas dinámicamente del backend.

**Endpoint:** `GET /api/profiles/:profileId/skills/categories`

**Headers:**
```javascript
{
  "Authorization": "Bearer {accessToken}"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Skill categories retrieved successfully",
  "data": {
    "categories": [
      {
        "value": "programming_languages",
        "label": "Lenguajes de Programación",
        "description": "Lenguajes como JavaScript, Python, Java, etc.",
        "icon": "code",
        "examples": ["JavaScript", "Python", "Java", "C++", "Ruby", "Go"]
      },
      {
        "value": "design_tools",
        "label": "Herramientas de Diseño",
        "description": "Software de diseño gráfico y UX/UI",
        "icon": "palette",
        "examples": ["Figma", "Adobe Photoshop", "Illustrator", "Sketch"]
      },
      // ... más de 30 categorías
    ],
    "total": 33
  }
}
```

**Endpoint Alternativo (Categorías Agrupadas):** `GET /api/profiles/:profileId/skills/categories/grouped`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Grouped skill categories retrieved successfully",
  "data": {
    "categoriesGrouped": {
      "Tecnología": [
        { "value": "programming_languages", "label": "Lenguajes de Programación", ... },
        { "value": "frameworks_libraries", "label": "Frameworks y Librerías", ... }
      ],
      "Diseño y Creatividad": [
        { "value": "design_tools", "label": "Herramientas de Diseño", ... },
        { "value": "multimedia", "label": "Multimedia y Video", ... }
      ],
      "Negocios": [...],
      "Finanzas": [...],
      // ... más grupos
    },
    "totalGroups": 13
  }
}
```

### Categorías Disponibles (33 Total)

El backend ahora soporta **33 categorías diferentes** para cubrir todos los tipos de profesiones:

#### **Tecnología** (5 categorías)
- `programming_languages` - Lenguajes de Programación
- `frameworks_libraries` - Frameworks y Librerías
- `databases` - Bases de Datos
- `cloud_devops` - Cloud y DevOps
- `mobile_development` - Desarrollo Móvil

#### **Diseño y Creatividad** (3 categorías)
- `design_tools` - Herramientas de Diseño
- `multimedia` - Multimedia y Video
- `graphic_design` - Diseño Gráfico

#### **Negocios** (4 categorías)
- `project_management` - Gestión de Proyectos
- `business_analysis` - Análisis de Negocios
- `marketing_digital` - Marketing Digital
- `sales` - Ventas

#### **Finanzas** (2 categorías)
- `accounting` - Contabilidad
- `finance` - Finanzas

#### **Otros Sectores**
- `human_resources` - Recursos Humanos
- `healthcare` - Salud
- `laboratory` - Laboratorio
- `teaching` - Enseñanza
- `legal` - Legal
- `operations` - Operaciones
- `logistics` - Logística
- `architecture` - Arquitectura
- `engineering` - Ingeniería
- `communication` - Comunicación
- `social_media` - Redes Sociales
- `customer_service` - Atención al Cliente
- `office_tools` - Herramientas de Oficina
- `soft_skills` - Habilidades Blandas
- `languages` - Idiomas
- `other` - Otros

### Implementación Recomendada en Frontend

**1. Cargar categorías al inicio:**

```typescript
// types/skill.types.ts
export interface SkillCategory {
  value: string;
  label: string;
  description: string;
  icon: string;
  examples: string[];
}

// api/skillCategories.api.ts
export async function getSkillCategories(profileId: number): Promise<SkillCategory[]> {
  const response = await axios.get(
    `${API_URL}/api/profiles/${profileId}/skills/categories`,
    {
      headers: { Authorization: `Bearer ${getAccessToken()}` }
    }
  );
  return response.data.data.categories;
}

// Uso en componente:
const [categories, setCategories] = useState<SkillCategory[]>([]);

useEffect(() => {
  async function loadCategories() {
    const cats = await getSkillCategories(profileId);
    setCategories(cats);
  }
  loadCategories();
}, [profileId]);
```

**2. Renderizar en combobox/select:**

```tsx
// Material UI Select
<FormControl fullWidth>
  <InputLabel>Categoría</InputLabel>
  <Select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    {categories.map(cat => (
      <MenuItem key={cat.value} value={cat.value}>
        <Box display="flex" alignItems="center" gap={1}>
          <Icon>{cat.icon}</Icon>
          <Typography>{cat.label}</Typography>
        </Box>
      </MenuItem>
    ))}
  </Select>
  <FormHelperText>{selectedCategoryDescription}</FormHelperText>
</FormControl>
```

**3. Para versión agrupada (mejor UX):**

```tsx
// Usando categorías agrupadas
const [groupedCategories, setGroupedCategories] = useState({});

// Renderizar con optgroups
<Select value={selectedCategory}>
  {Object.entries(groupedCategories).map(([groupName, cats]) => (
    <ListSubheader key={groupName}>{groupName}</ListSubheader>
    {cats.map(cat => (
      <MenuItem key={cat.value} value={cat.value}>
        {cat.label}
      </MenuItem>
    ))}
  ))}
</Select>
```

### Niveles de Proficiencia Válidos

| Valor API | Traducción |
|-----------|-----------|
| `beginner` | Principiante |
| `intermediate` | Intermedio |
| `advanced` | Avanzado |
| `expert` | Experto |

### Crear Skill

**Endpoint:** `POST /api/profiles/:profileId/skills`

**Headers:**
```javascript
{
  "Authorization": "Bearer {accessToken}",
  "Content-Type": "application/json"
}
```

**Body correcto:**
```json
{
  "name": "React",
  "category": "frameworks_libraries",
  "proficiency_level": "expert",
  "years_of_experience": 3
}
```

**❌ Body INCORRECTO (causa error 400):**
```json
{
  "name": "React",
  "category": "Frontend",  // ❌ Este valor no es válido
  "proficiency_level": "expert",
  "years_of_experience": 3
}
```

**Ejemplo en JavaScript/TypeScript:**
```typescript
// Mapeo de categorías para el frontend
const categoryMap = {
  'programming_languages': 'Lenguajes de Programación',
  'frameworks_libraries': 'Frameworks & Librerías',
  'databases': 'Bases de Datos',
  'cloud_devops': 'Cloud & DevOps',
  'tools': 'Herramientas',
  'soft_skills': 'Habilidades Blandas',
  'other': 'Otros'
};

// Función para crear skill
async function createSkill(profileId: number, skillData: any) {
  const response = await fetch(`${API_URL}/api/profiles/${profileId}/skills`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: skillData.name,
      category: skillData.category, // Debe ser uno de los valores válidos
      proficiency_level: skillData.proficiency_level,
      years_of_experience: skillData.years_of_experience || null
    })
  });

  return response.json();
}
```

### Obtener Categorías

**Endpoint:** `GET /api/profiles/:profileId/skills/categories`

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Skill categories retrieved successfully",
  "data": {
    "categories": [
      "programming_languages",
      "frameworks_libraries",
      "databases",
      "cloud_devops",
      "tools",
      "soft_skills",
      "other"
    ]
  }
}
```

**Ejemplo de uso:**
```typescript
async function loadCategories(profileId: number) {
  try {
    const response = await fetch(`${API_URL}/api/profiles/${profileId}/skills/categories`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    return data.data.categories;
  } catch (error) {
    // Si el endpoint falla, usar categorías hardcodeadas
    return [
      'programming_languages',
      'frameworks_libraries',
      'databases',
      'cloud_devops',
      'tools',
      'soft_skills',
      'other'
    ];
  }
}
```

---

## Idiomas

### Niveles de Idioma Válidos

| Valor API | Descripción CEFR | Descripción Común |
|-----------|------------------|-------------------|
| `A1` | Principiante | Básico |
| `A2` | Elemental | Básico |
| `B1` | Intermedio | Intermedio |
| `B2` | Intermedio-Alto | Intermedio-Alto |
| `C1` | Avanzado | Avanzado |
| `C2` | Dominio | Avanzado |
| `Native` | Nativo | Nativo |

### Listar Idiomas

**Endpoint:** `GET /api/profiles/:profileId/languages`

**Headers:**
```javascript
{
  "Authorization": "Bearer {accessToken}"
}
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
        "display_order": 0,
        "created_at": "2026-01-28T10:00:00.000Z",
        "updated_at": "2026-01-28T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Inglés",
        "level": "C1",
        "certification_name": "TOEFL",
        "certification_score": "110",
        "is_visible": true,
        "display_order": 1,
        "created_at": "2026-01-28T11:00:00.000Z",
        "updated_at": "2026-01-28T11:00:00.000Z"
      }
    ]
  }
}
```

### Crear Idioma

**Endpoint:** `POST /api/profiles/:profileId/languages`

**Body:**
```json
{
  "name": "Inglés",
  "level": "C1",
  "certification_name": "TOEFL",
  "certification_score": "110"
}
```

**Campos:**
- `name` (string, required): Nombre del idioma
- `level` (string, required): Uno de: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`, `Native`
- `certification_name` (string, optional): Nombre de la certificación (ej: TOEFL, IELTS, DELE)
- `certification_score` (string, optional): Puntuación obtenida

**Ejemplo en TypeScript:**
```typescript
interface LanguageCreate {
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';
  certification_name?: string;
  certification_score?: string;
}

async function createLanguage(profileId: number, data: LanguageCreate) {
  const response = await fetch(`${API_URL}/api/profiles/${profileId}/languages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
```

### Actualizar Idioma

**Endpoint:** `PUT /api/profiles/:profileId/languages/:id`

**Body:**
```json
{
  "level": "C2",
  "certification_score": "115"
}
```

### Eliminar Idioma

**Endpoint:** `DELETE /api/profiles/:profileId/languages/:id`

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Language deleted successfully",
  "data": null
}
```

### Reordenar Idiomas

**Endpoint:** `POST /api/profiles/:profileId/languages/reorder`

**Body:**
```json
{
  "ordered_ids": [2, 1, 3]
}
```

**Ejemplo de drag & drop:**
```typescript
async function reorderLanguages(profileId: number, orderedIds: number[]) {
  const response = await fetch(`${API_URL}/api/profiles/${profileId}/languages/reorder`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ordered_ids: orderedIds })
  });

  return response.json();
}

// Uso con react-beautiful-dnd o similar
const handleDragEnd = async (result: any) => {
  if (!result.destination) return;

  const items = Array.from(languages);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);

  const orderedIds = items.map(item => item.id);
  await reorderLanguages(profileId, orderedIds);
};
```

---

## Certificaciones

### Listar Certificaciones

**Endpoint:** `GET /api/profiles/:profileId/certifications`

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
        "display_order": 0,
        "created_at": "2026-01-28T10:00:00.000Z",
        "updated_at": "2026-01-28T10:00:00.000Z"
      }
    ]
  }
}
```

### Crear Certificación

**Endpoint:** `POST /api/profiles/:profileId/certifications`

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

**Campos:**
- `name` (string, required): Nombre de la certificación
- `issuer` (string, required): Emisor de la certificación
- `issue_date` (date, required): Fecha de emisión (formato: YYYY-MM-DD)
- `expiration_date` (date, optional): Fecha de expiración (formato: YYYY-MM-DD)
- `credential_id` (string, optional): ID de la credencial
- `credential_url` (string, optional): URL de verificación

**Ejemplo con date picker:**
```typescript
interface CertificationCreate {
  name: string;
  issuer: string;
  issue_date: string; // YYYY-MM-DD
  expiration_date?: string; // YYYY-MM-DD
  credential_id?: string;
  credential_url?: string;
}

async function createCertification(profileId: number, data: CertificationCreate) {
  // Convertir fechas de Date a string YYYY-MM-DD
  const formattedData = {
    ...data,
    issue_date: data.issue_date,
    expiration_date: data.expiration_date || null
  };

  const response = await fetch(`${API_URL}/api/profiles/${profileId}/certifications`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formattedData)
  });

  return response.json();
}

// Helper para formatear fecha
function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}
```

### Actualizar Certificación

**Endpoint:** `PUT /api/profiles/:profileId/certifications/:id`

**Body:**
```json
{
  "expiration_date": "2027-01-20"
}
```

### Eliminar Certificación

**Endpoint:** `DELETE /api/profiles/:profileId/certifications/:id`

### Reordenar Certificaciones

**Endpoint:** `POST /api/profiles/:profileId/certifications/reorder`

**Body:**
```json
{
  "ordered_ids": [3, 1, 2]
}
```

---

## Redes Sociales

### Plataformas Válidas

⚠️ **IMPORTANTE:** El campo `platform` solo acepta estos valores:

| Valor API | Icono sugerido | Descripción |
|-----------|---------------|-------------|
| `linkedin` | LinkedIn icon | LinkedIn |
| `github` | GitHub icon | GitHub |
| `gitlab` | GitLab icon | GitLab |
| `twitter` | X/Twitter icon | Twitter/X |
| `portfolio` | Globe icon | Portafolio personal |
| `stackoverflow` | Stack Overflow icon | Stack Overflow |
| `medium` | Medium icon | Medium |
| `youtube` | YouTube icon | YouTube |
| `behance` | Behance icon | Behance |
| `dribbble` | Dribbble icon | Dribbble |
| `other` | Link icon | Otra red social |

### Listar Redes Sociales

**Endpoint:** `GET /api/profiles/:profileId/social-networks`

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
        "display_order": 0,
        "created_at": "2026-01-28T10:00:00.000Z",
        "updated_at": "2026-01-28T10:00:00.000Z"
      },
      {
        "id": 2,
        "platform": "github",
        "url": "https://github.com/juanperez",
        "username": "juanperez",
        "is_visible": true,
        "display_order": 1,
        "created_at": "2026-01-28T11:00:00.000Z",
        "updated_at": "2026-01-28T11:00:00.000Z"
      }
    ]
  }
}
```

### Crear Red Social

**Endpoint:** `POST /api/profiles/:profileId/social-networks`

**Body:**
```json
{
  "platform": "github",
  "url": "https://github.com/juanperez",
  "username": "juanperez"
}
```

**Campos:**
- `platform` (string, required): Una de las plataformas válidas listadas arriba
- `url` (string, required): URL completa del perfil
- `username` (string, optional): Nombre de usuario (se puede extraer de la URL)

**Ejemplo con selector de plataforma:**
```typescript
type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'gitlab'
  | 'twitter'
  | 'portfolio'
  | 'stackoverflow'
  | 'medium'
  | 'youtube'
  | 'behance'
  | 'dribbble'
  | 'other';

interface SocialNetworkCreate {
  platform: SocialPlatform;
  url: string;
  username?: string;
}

// Configuración de plataformas para el UI
const platformConfig = {
  linkedin: {
    label: 'LinkedIn',
    icon: 'linkedin-icon',
    placeholder: 'https://linkedin.com/in/tu-usuario',
    baseUrl: 'https://linkedin.com/in/'
  },
  github: {
    label: 'GitHub',
    icon: 'github-icon',
    placeholder: 'https://github.com/tu-usuario',
    baseUrl: 'https://github.com/'
  },
  // ... etc
};

async function createSocialNetwork(profileId: number, data: SocialNetworkCreate) {
  const response = await fetch(`${API_URL}/api/profiles/${profileId}/social-networks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
```

### Actualizar Red Social

**Endpoint:** `PUT /api/profiles/:profileId/social-networks/:id`

**Body:**
```json
{
  "url": "https://github.com/juan-perez-dev",
  "username": "juan-perez-dev"
}
```

### Eliminar Red Social

**Endpoint:** `DELETE /api/profiles/:profileId/social-networks/:id`

### Reordenar Redes Sociales

**Endpoint:** `POST /api/profiles/:profileId/social-networks/reorder`

**Body:**
```json
{
  "ordered_ids": [2, 1, 3]
}
```

---

## Toggle Visibility

Varios recursos tienen un campo `is_visible` que controla si se muestra en el CV exportado.

### Toggle Visibility de Red Social

**Endpoint:** `PATCH /api/profiles/:profileId/social-networks/:id/toggle-visibility`

**Headers:**
```javascript
{
  "Authorization": "Bearer {accessToken}"
}
```

**Body:** No requiere body

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Social network visibility toggled",
  "data": {
    "socialNetwork": {
      "id": 2,
      "platform": "github",
      "url": "https://github.com/juanperez",
      "is_visible": false
    }
  }
}
```

**Ejemplo con switch/toggle:**
```typescript
async function toggleVisibility(
  profileId: number,
  resourceType: 'social-networks' | 'skills' | 'languages' | 'certifications',
  resourceId: number
) {
  const response = await fetch(
    `${API_URL}/api/profiles/${profileId}/${resourceType}/${resourceId}/toggle-visibility`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  return response.json();
}

// Uso en un componente React
const handleToggle = async (id: number) => {
  try {
    const result = await toggleVisibility(profileId, 'social-networks', id);
    // Actualizar el estado local
    setSocialNetworks(prev => prev.map(item =>
      item.id === id
        ? { ...item, is_visible: result.data.socialNetwork.is_visible }
        : item
    ));
  } catch (error) {
    console.error('Error toggling visibility:', error);
  }
};
```

### Actualizar is_visible directamente

También puedes actualizar `is_visible` usando el endpoint PUT normal:

**Endpoint:** `PUT /api/profiles/:profileId/social-networks/:id`

**Body:**
```json
{
  "is_visible": false
}
```

---

## Plantillas

### Listar Plantillas Disponibles

**Endpoint:** `GET /api/templates`

**Headers:** No requiere autenticación (endpoint público)

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

**Ejemplo de selector de plantillas:**
```typescript
interface Template {
  name: string;
  displayName: string;
  category: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: string[];
  previewImage: string; // URL relativa: /templates/previews/template_name.png
}

async function getTemplates(): Promise<Template[]> {
  const response = await fetch(`${API_URL}/api/templates`);
  const data = await response.json();
  return data.data.templates;
}

// Las imágenes de preview están disponibles en:
const previewImageUrl = `${API_URL}${template.previewImage}`;
// Ejemplo: https://api-cv.servercontrol-mzt.com/templates/previews/harvard_classic.png

// Componente React de ejemplo
function TemplateSelector() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('harvard_classic');

  useEffect(() => {
    getTemplates().then(setTemplates);
  }, []);

  return (
    <div className="template-grid">
      {templates.map(template => (
        <div
          key={template.name}
          className={`template-card ${selectedTemplate === template.name ? 'selected' : ''}`}
          onClick={() => setSelectedTemplate(template.name)}
        >
          <img src={template.previewImage} alt={template.displayName} />
          <h3>{template.displayName}</h3>
          <p>{template.description}</p>
          <div className="color-palette">
            <span style={{ backgroundColor: template.colors.primary }} />
            <span style={{ backgroundColor: template.colors.secondary }} />
            <span style={{ backgroundColor: template.colors.accent }} />
          </div>
          <ul>
            {template.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### Cambiar Plantilla del Perfil

**Endpoint:** `PATCH /api/profiles/:id/template`

**Headers:**
```javascript
{
  "Authorization": "Bearer {accessToken}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "template": "harvard_modern"
}
```

**Valores válidos para `template`:**
- `harvard_classic`
- `harvard_modern`

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Template changed successfully",
  "data": {
    "profile": {
      "id": 1,
      "name": "CV Desarrollador",
      "template": "harvard_modern",
      "updated_at": "2026-01-29T18:30:00.000Z"
    }
  }
}
```

**Ejemplo:**
```typescript
async function changeTemplate(profileId: number, templateName: string) {
  const response = await fetch(`${API_URL}/api/profiles/${profileId}/template`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ template: templateName })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

// Uso
const handleTemplateChange = async (templateName: string) => {
  try {
    await changeTemplate(profileId, templateName);
    toast.success('Plantilla actualizada correctamente');
    // Actualizar preview
    refreshPreview();
  } catch (error) {
    toast.error('Error al cambiar la plantilla');
  }
};
```

### Obtener Preview HTML

**Endpoint:** `GET /api/profiles/:id/preview-html`

**Headers:**
```javascript
{
  "Authorization": "Bearer {accessToken}"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Preview HTML generated successfully",
  "data": {
    "html": "<!DOCTYPE html><html><head>...</head><body>...</body></html>"
  }
}
```

**Ejemplo para mostrar preview en iframe:**
```typescript
async function getPreviewHtml(profileId: number): Promise<string> {
  const response = await fetch(`${API_URL}/api/profiles/${profileId}/preview-html`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  return data.data.html;
}

// Componente React para preview
function CVPreview({ profileId }: { profileId: number }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadPreview();
  }, [profileId]);

  const loadPreview = async () => {
    try {
      const html = await getPreviewHtml(profileId);

      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;

        if (doc) {
          doc.open();
          doc.write(html);
          doc.close();
        }
      }
    } catch (error) {
      console.error('Error loading preview:', error);
    }
  };

  return (
    <div className="preview-container">
      <iframe
        ref={iframeRef}
        className="cv-preview-iframe"
        title="CV Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
```

---

## Exportación PDF

### Validar Perfil para Exportación

**Endpoint:** `GET /api/profiles/:profileId/pdf/validate`

**Headers:**
```javascript
{
  "Authorization": "Bearer {accessToken}"
}
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

**Ejemplo de validación antes de exportar:**
```typescript
interface ValidationResult {
  isValid: boolean;
  completeness: number;
  hasPersonalInfo: boolean;
  warnings: Array<{
    section: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

async function validateProfile(profileId: number): Promise<ValidationResult> {
  const response = await fetch(`${API_URL}/api/profiles/${profileId}/pdf/validate`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  return data.data.validation;
}

// Uso antes de exportar
const handleExport = async () => {
  const validation = await validateProfile(profileId);

  if (!validation.isValid) {
    alert('Tu perfil está incompleto. Completa la información personal antes de exportar.');
    return;
  }

  if (validation.warnings.length > 0) {
    const proceed = confirm(
      `Tu CV está ${validation.completeness}% completo. ¿Deseas continuar con la exportación?`
    );
    if (!proceed) return;
  }

  // Proceder con la exportación
  await downloadPDF(profileId);
};
```

### Exportar PDF (Descarga)

**Endpoint:** `GET /api/profiles/:profileId/pdf/export-pdf`

**Headers:**
```javascript
{
  "Authorization": "Bearer {accessToken}"
}
```

**Respuesta (200):** Archivo PDF binario

**Headers de respuesta:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="CV-Juan-Perez-2026-01-29.pdf"
Content-Length: 123456
```

**Ejemplo para descargar PDF:**
```typescript
async function downloadPDF(profileId: number) {
  try {
    const response = await fetch(
      `${API_URL}/api/profiles/${profileId}/pdf/export-pdf`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al exportar PDF');
    }

    // IMPORTANTE: El backend ahora envía el PDF como binario correctamente
    // No necesitas hacer conversión manual de JSON a Blob
    // Obtener el blob del PDF directamente
    const blob = await response.blob();

    // Crear URL temporal
    const url = window.URL.createObjectURL(blob);

    // Crear elemento <a> para descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV-${Date.now()}.pdf`;

    // Simular click para descargar
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('PDF descargado correctamente');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    toast.error('Error al descargar el PDF');
  }
}

// Con axios
async function downloadPDFAxios(profileId: number) {
  try {
    const response = await axios({
      url: `${API_URL}/api/profiles/${profileId}/pdf/export-pdf`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CV-${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
}
```

**Ejemplo con botón de descarga:**
```tsx
function ExportButton({ profileId }: { profileId: number }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await downloadPDF(profileId);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="export-button"
    >
      {isExporting ? (
        <>
          <Spinner size="sm" />
          Exportando...
        </>
      ) : (
        <>
          <DownloadIcon />
          Descargar PDF
        </>
      )}
    </button>
  );
}
```

### Vista Previa PDF (Inline)

**Endpoint:** `GET /api/profiles/:profileId/pdf/preview-pdf`

**Headers:**
```javascript
{
  "Authorization": "Bearer {accessToken}"
}
```

**Respuesta (200):** Archivo PDF binario

**Headers de respuesta:**
```
Content-Type: application/pdf
Content-Disposition: inline; filename="CV-Preview.pdf"
```

**Ejemplo para mostrar PDF en navegador:**
```typescript
async function previewPDF(profileId: number) {
  try {
    const response = await fetch(
      `${API_URL}/api/profiles/${profileId}/pdf/preview-pdf`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Opción 1: Abrir en nueva pestaña
    window.open(url, '_blank');

    // Opción 2: Mostrar en iframe
    const iframe = document.getElementById('pdf-preview') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = url;
    }

    // Opción 3: Mostrar en modal
    setPdfUrl(url);
    setShowModal(true);
  } catch (error) {
    console.error('Error previewing PDF:', error);
  }
}

// Componente para modal de preview
function PDFPreviewModal({ profileId, isOpen, onClose }: PDFPreviewModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && profileId) {
      loadPreview();
    }

    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [isOpen, profileId]);

  const loadPreview = async () => {
    const response = await fetch(
      `${API_URL}/api/profiles/${profileId}/pdf/preview-pdf`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalHeader>Vista Previa del CV</ModalHeader>
      <ModalBody>
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            className="w-full h-[80vh]"
            title="PDF Preview"
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Cerrar</Button>
        <Button onClick={() => downloadPDF(profileId)} colorScheme="blue">
          Descargar PDF
        </Button>
      </ModalFooter>
    </Modal>
  );
}
```

---

## Manejo de Errores Comunes

### Error 400: Bad Request

**Causa común:** Datos de validación incorrectos

**Ejemplo de respuesta:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Category must be one of: programming_languages, frameworks_libraries, databases, cloud_devops, tools, soft_skills, other"
  ]
}
```

**Solución:** Verifica que estés enviando los valores correctos según esta documentación.

### Error 401: Unauthorized

**Causa:** Token inválido o expirado

**Solución:**
```typescript
// Interceptor de axios para refresh token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
          refreshToken
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Redirigir a login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### Error 403: Forbidden

**Causa común:** Email no verificado

**Respuesta:**
```json
{
  "success": false,
  "message": "Please verify your email before logging in. Check your inbox for the verification link."
}
```

### Error 404: Not Found

**Causa:** Recurso no existe

**Respuesta:**
```json
{
  "success": false,
  "message": "Profile not found"
}
```

---

## Configuración Recomendada para Frontend

### Archivo de configuración

```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'https://api-cv.servercontrol-mzt.com',
  ENDPOINTS: {
    // Auth
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    VERIFY_EMAIL: '/api/auth/verify-email',

    // Profiles
    PROFILES: '/api/profiles',
    PROFILE_BY_ID: (id: number) => `/api/profiles/${id}`,
    PROFILE_COMPLETE: (id: number) => `/api/profiles/${id}/complete`,

    // Skills
    SKILLS: (profileId: number) => `/api/profiles/${profileId}/skills`,
    SKILL_CATEGORIES: (profileId: number) => `/api/profiles/${profileId}/skills/categories`,

    // Languages
    LANGUAGES: (profileId: number) => `/api/profiles/${profileId}/languages`,

    // Certifications
    CERTIFICATIONS: (profileId: number) => `/api/profiles/${profileId}/certifications`,

    // Social Networks
    SOCIAL_NETWORKS: (profileId: number) => `/api/profiles/${profileId}/social-networks`,

    // Templates
    TEMPLATES: '/api/templates',
    CHANGE_TEMPLATE: (id: number) => `/api/profiles/${id}/template`,
    PREVIEW_HTML: (id: number) => `/api/profiles/${id}/preview-html`,

    // PDF
    VALIDATE_PDF: (profileId: number) => `/api/profiles/${profileId}/pdf/validate`,
    EXPORT_PDF: (profileId: number) => `/api/profiles/${profileId}/pdf/export-pdf`,
    PREVIEW_PDF: (profileId: number) => `/api/profiles/${profileId}/pdf/preview-pdf`,
  }
};

// Valores válidos
export const VALID_VALUES = {
  SKILL_CATEGORIES: [
    'programming_languages',
    'frameworks_libraries',
    'databases',
    'cloud_devops',
    'tools',
    'soft_skills',
    'other'
  ] as const,

  PROFICIENCY_LEVELS: ['beginner', 'intermediate', 'advanced', 'expert'] as const,

  LANGUAGE_LEVELS: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'] as const,

  SOCIAL_PLATFORMS: [
    'linkedin',
    'github',
    'gitlab',
    'twitter',
    'portfolio',
    'stackoverflow',
    'medium',
    'youtube',
    'behance',
    'dribbble',
    'other'
  ] as const,

  TEMPLATES: ['harvard_classic', 'harvard_modern'] as const
};

export type SkillCategory = typeof VALID_VALUES.SKILL_CATEGORIES[number];
export type ProficiencyLevel = typeof VALID_VALUES.PROFICIENCY_LEVELS[number];
export type LanguageLevel = typeof VALID_VALUES.LANGUAGE_LEVELS[number];
export type SocialPlatform = typeof VALID_VALUES.SOCIAL_PLATFORMS[number];
export type TemplateName = typeof VALID_VALUES.TEMPLATES[number];
```

---

**Última actualización:** 2026-01-29

**Versión API:** 1.0.0

**Contacto:** Para reportar problemas o solicitar ayuda, contacta al equipo de backend.
