# ⚠️ CAMBIOS IMPORTANTES PARA FRONTEND - Enero 2026

## 🚨 Acción Requerida Inmediata

---

## 1️⃣ Categorías de Skills: De 7 a 33 Categorías

### ❌ LO QUE YA NO FUNCIONA

**El frontend NO debe usar categorías hardcodeadas.** Si tienes algo como esto, debe cambiarse:

```typescript
// ❌ ESTO YA NO FUNCIONA - ELIMINAR
const categories = [
  { value: 'programming_languages', label: 'Lenguajes de Programación' },
  { value: 'frameworks_libraries', label: 'Frameworks & Librerías' },
  { value: 'databases', label: 'Bases de Datos' },
  { value: 'cloud_devops', label: 'Cloud & DevOps' },
  { value: 'tools', label: 'Herramientas' },
  { value: 'soft_skills', label: 'Habilidades Blandas' },
  { value: 'other', label: 'Otros' }
];
```

### ✅ LO QUE DEBES HACER AHORA

**Consumir las categorías desde el API dinámicamente:**

```typescript
// ✅ NUEVO - Hacer esto
import { useEffect, useState } from 'react';
import axios from 'axios';

function SkillsForm({ profileId }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/profiles/${profileId}/skills/categories`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );

        setCategories(response.data.data.categories);
      } catch (error) {
        console.error('Error cargando categorías:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, [profileId]);

  return (
    <Select disabled={loading}>
      {categories.map(cat => (
        <MenuItem key={cat.value} value={cat.value}>
          {cat.label}
        </MenuItem>
      ))}
    </Select>
  );
}
```

---

## 2️⃣ Campo de Certificaciones: `issuer` → `issuing_organization`

### ❌ LO QUE YA NO FUNCIONA

```typescript
// ❌ INCORRECTO - Campo ya no existe
const certification = {
  name: "AWS Certified Solutions Architect",
  issuer: "Amazon Web Services",  // ❌ Este campo no existe
  issue_date: "2024-01-15"
};
```

### ✅ LO QUE DEBES HACER AHORA

```typescript
// ✅ CORRECTO - Usar issuing_organization
const certification = {
  name: "AWS Certified Solutions Architect",
  issuing_organization: "Amazon Web Services",  // ✅ Campo correcto
  issue_date: "2024-01-15"
};
```

**Cambios necesarios en tu código:**

```typescript
// Buscar y reemplazar en todo el código de certificaciones:
// issuer → issuing_organization

// Ejemplo en formulario
<TextField
  name="issuing_organization"  // Era: issuer
  label="Organización Emisora"
  value={formData.issuing_organization}
  onChange={handleChange}
/>

// Ejemplo en interfaz TypeScript
interface Certification {
  id: number;
  name: string;
  issuing_organization: string;  // Era: issuer
  issue_date: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
}
```

---

## 📊 Nuevos Endpoints Disponibles

### 1. Obtener todas las categorías

```typescript
GET /api/profiles/:profileId/skills/categories

// Respuesta:
{
  "success": true,
  "data": {
    "categories": [
      {
        "value": "programming_languages",
        "label": "Lenguajes de Programación",
        "description": "Lenguajes como JavaScript, Python, Java, etc.",
        "icon": "code",
        "examples": ["JavaScript", "Python", "Java", "C++"]
      },
      // ... 32 más (33 total)
    ],
    "total": 33
  }
}
```

### 2. Obtener categorías agrupadas (recomendado para mejor UX)

```typescript
GET /api/profiles/:profileId/skills/categories/grouped

// Respuesta:
{
  "success": true,
  "data": {
    "categoriesGrouped": {
      "Tecnología": [
        { "value": "programming_languages", "label": "Lenguajes de Programación", ... },
        { "value": "frameworks_libraries", "label": "Frameworks y Librerías", ... }
      ],
      "Diseño y Creatividad": [
        { "value": "design_tools", "label": "Herramientas de Diseño", ... }
      ],
      // ... 13 grupos total
    },
    "totalGroups": 13
  }
}
```

---

## 🎯 Categorías Ahora Disponibles (33 Total)

El sistema ahora soporta **todas las profesiones**, no solo programación:

### Tecnología (5)
- `programming_languages` - Lenguajes de Programación
- `frameworks_libraries` - Frameworks y Librerías
- `databases` - Bases de Datos
- `cloud_devops` - Cloud y DevOps
- `mobile_development` - Desarrollo Móvil

### Diseño y Creatividad (3)
- `design_tools` - Herramientas de Diseño
- `multimedia` - Multimedia y Video
- `graphic_design` - Diseño Gráfico

### Negocios (4)
- `project_management` - Gestión de Proyectos
- `business_analysis` - Análisis de Negocios
- `marketing_digital` - Marketing Digital
- `sales` - Ventas

### Finanzas (2)
- `accounting` - Contabilidad
- `finance` - Finanzas

### Otros Sectores (16)
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

### General (3)
- `soft_skills` - Habilidades Blandas
- `languages` - Idiomas
- `other` - Otros

---

## 🔄 Checklist de Migración Frontend

### Skills - Categorías

- [ ] **Eliminar** arrays hardcodeados de categorías
- [ ] **Agregar** llamada al endpoint `/skills/categories` al montar componente
- [ ] **Actualizar** Select/Combobox para usar categorías dinámicas
- [ ] **Agregar** loading state mientras carga categorías
- [ ] **Agregar** error handling si falla la carga
- [ ] **Considerar** cachear categorías en localStorage (cambian raramente)
- [ ] **Probar** que funciona con las 33 categorías

### Certificaciones - Campo issuer

- [ ] **Buscar** en todo el código: `issuer` (buscar y reemplazar)
- [ ] **Reemplazar** con: `issuing_organization`
- [ ] **Actualizar** interfaces TypeScript
- [ ] **Actualizar** formularios
- [ ] **Actualizar** validaciones
- [ ] **Actualizar** displays/cards de certificaciones
- [ ] **Probar** creación y edición de certificaciones

---

## 💻 Ejemplo Completo de Integración

### Crear servicio reutilizable:

```typescript
// services/skillCategories.service.ts
import axios from './axios.config';

export interface SkillCategory {
  value: string;
  label: string;
  description: string;
  icon: string;
  examples: string[];
}

export interface GroupedCategories {
  [groupName: string]: SkillCategory[];
}

class SkillCategoriesService {
  private static CACHE_KEY = 'skill_categories';
  private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

  async getCategories(profileId: number): Promise<SkillCategory[]> {
    // Intentar obtener del cache
    const cached = this.getCached();
    if (cached) return cached;

    // Si no hay cache, obtener del API
    const response = await axios.get(`/api/profiles/${profileId}/skills/categories`);
    const categories = response.data.data.categories;

    // Guardar en cache
    this.setCached(categories);

    return categories;
  }

  async getGroupedCategories(profileId: number): Promise<GroupedCategories> {
    const response = await axios.get(`/api/profiles/${profileId}/skills/categories/grouped`);
    return response.data.data.categoriesGrouped;
  }

  private getCached(): SkillCategory[] | null {
    try {
      const cached = localStorage.getItem(SkillCategoriesService.CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // Verificar si el cache expiró
      if (now - timestamp > SkillCategoriesService.CACHE_DURATION) {
        localStorage.removeItem(SkillCategoriesService.CACHE_KEY);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  private setCached(categories: SkillCategory[]): void {
    try {
      localStorage.setItem(
        SkillCategoriesService.CACHE_KEY,
        JSON.stringify({
          data: categories,
          timestamp: Date.now()
        })
      );
    } catch (error) {
      console.error('Error guardando categorías en cache:', error);
    }
  }

  clearCache(): void {
    localStorage.removeItem(SkillCategoriesService.CACHE_KEY);
  }
}

export default new SkillCategoriesService();
```

### Usar en componente:

```typescript
// components/SkillForm.tsx
import { useEffect, useState } from 'react';
import skillCategoriesService, { SkillCategory } from '../services/skillCategories.service';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

interface SkillFormProps {
  profileId: number;
  value: string;
  onChange: (value: string) => void;
}

export function SkillCategorySelect({ profileId, value, onChange }: SkillFormProps) {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await skillCategoriesService.getCategories(profileId);
        setCategories(cats);
      } catch (err) {
        setError('Error cargando categorías');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, [profileId]);

  const selectedCategory = categories.find(cat => cat.value === value);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Categoría</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        label="Categoría"
      >
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={20} /> Cargando...
          </MenuItem>
        ) : (
          categories.map(cat => (
            <MenuItem key={cat.value} value={cat.value}>
              {cat.label}
            </MenuItem>
          ))
        )}
      </Select>
      {selectedCategory && (
        <FormHelperText>
          {selectedCategory.description}
          <br />
          Ejemplos: {selectedCategory.examples.slice(0, 3).join(', ')}
        </FormHelperText>
      )}
    </FormControl>
  );
}
```

---

## 🧪 Cómo Probar

### 1. Verificar que el backend está actualizado

```bash
# Probar endpoint de categorías
curl https://api-cv.servercontrol-mzt.com/api/profiles/1/skills/categories \
  -H "Authorization: Bearer YOUR_TOKEN" | jq '.data.total'

# Debe retornar: 33
```

### 2. Probar creación de skill con nueva categoría

```typescript
// Probar crear skill con categoría de diseño
const newSkill = {
  name: "Figma",
  category: "design_tools",  // Nueva categoría
  proficiency_level: "advanced",
  years_of_experience: 3
};

// POST /api/profiles/:profileId/skills
// Debe responder: 201 Created
```

### 3. Probar certificación con campo correcto

```typescript
const newCertification = {
  name: "AWS Certified Developer",
  issuing_organization: "Amazon Web Services",  // Campo correcto
  issue_date: "2024-01-15"
};

// POST /api/profiles/:profileId/certifications
// Debe responder: 201 Created
```

---

## 📚 Documentación Completa

Para más detalles, consultar:

- **[FRONTEND_QUICK_REFERENCE.md](FRONTEND_QUICK_REFERENCE.md)** - Guía rápida con ejemplos
- **[API_FRONTEND_GUIDE.md](API_FRONTEND_GUIDE.md)** - Documentación completa del API

---

## ❓ FAQ

**Q: ¿Tengo que cambiar todos los skills existentes?**
A: No, los skills existentes con las 7 categorías antiguas siguen funcionando.

**Q: ¿Qué pasa con skills que tienen `category: "tools"`?**
A: Siguen funcionando. `tools` es una categoría válida (aunque ahora hay opciones más específicas).

**Q: ¿Las categorías pueden cambiar en el futuro?**
A: Sí, por eso es importante consumirlas dinámicamente del API, no hardcodearlas.

**Q: ¿Puedo seguir usando `issuer` en certificaciones?**
A: No, el campo se llama `issuing_organization` en la base de datos. Usar `issuer` resultará en error.

**Q: ¿Cuándo se hicieron estos cambios?**
A: 30 de enero de 2026. Ya están en producción en `https://api-cv.servercontrol-mzt.com`.

---

## 🆘 Soporte

Si tienes problemas con la integración:

1. Verifica que estás usando el endpoint correcto
2. Revisa la documentación en `FRONTEND_QUICK_REFERENCE.md`
3. Verifica los ejemplos de código arriba
4. Prueba los endpoints con Postman/curl primero

---

**Última actualización:** 2026-01-30
**Backend versión:** 1.1.0
**URL Producción:** https://api-cv.servercontrol-mzt.com
**Status:** ✅ Cambios ya en producción
