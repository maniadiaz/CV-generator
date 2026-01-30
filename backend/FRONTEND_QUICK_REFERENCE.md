# 🚀 Quick Reference: Skill Categories para Frontend

**Última actualización:** 2026-01-30

---

## 📋 TL;DR

**Antes:** 7 categorías hardcodeadas ❌
**Ahora:** 33 categorías dinámicas desde API ✅

**Nuevo endpoint:**
```
GET /api/profiles/:profileId/skills/categories
```

---

## 🎯 Cambio Mínimo Requerido

### **Antes (NO hacer más esto):**
```typescript
// ❌ DEPRECADO
const categories = [
  { value: 'programming_languages', label: 'Lenguajes de Programación' },
  { value: 'frameworks_libraries', label: 'Frameworks & Librerías' },
  // ...
];
```

### **Ahora (hacer esto):**
```typescript
// ✅ CORRECTO
const [categories, setCategories] = useState([]);

useEffect(() => {
  fetch(`${API_URL}/api/profiles/${profileId}/skills/categories`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setCategories(data.data.categories));
}, [profileId]);
```

---

## 📦 Respuesta del API

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
      }
      // ... 31 más (33 total)
    ],
    "total": 33
  }
}
```

---

## 🎨 Ejemplo Material UI

```tsx
import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Chip
} from '@mui/material';
import axios from 'axios';

function SkillCategorySelect({ value, onChange, profileId }) {
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
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, [profileId]);

  const selectedCategory = categories.find(cat => cat.value === value);

  return (
    <FormControl fullWidth disabled={loading}>
      <InputLabel>Categoría</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Categoría"
      >
        {categories.map((cat) => (
          <MenuItem key={cat.value} value={cat.value}>
            {cat.label}
          </MenuItem>
        ))}
      </Select>
      {selectedCategory && (
        <FormHelperText>
          {selectedCategory.description}
          <br />
          <Box mt={0.5} display="flex" gap={0.5} flexWrap="wrap">
            {selectedCategory.examples.slice(0, 3).map(example => (
              <Chip
                key={example}
                label={example}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default SkillCategorySelect;
```

---

## 🎯 Versión con Grupos (Mejor UX)

```tsx
import { ListSubheader } from '@mui/material';

function GroupedSkillCategorySelect({ value, onChange, profileId }) {
  const [groupedCategories, setGroupedCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/profiles/${profileId}/skills/categories/grouped`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
        setGroupedCategories(response.data.data.categoriesGrouped);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, [profileId]);

  return (
    <FormControl fullWidth disabled={loading}>
      <InputLabel>Categoría</InputLabel>
      <Select value={value} onChange={(e) => onChange(e.target.value)} label="Categoría">
        {Object.entries(groupedCategories).map(([groupName, categories]) => [
          <ListSubheader key={groupName}>{groupName}</ListSubheader>,
          categories.map((cat) => (
            <MenuItem key={cat.value} value={cat.value} sx={{ pl: 4 }}>
              {cat.label}
            </MenuItem>
          ))
        ])}
      </Select>
    </FormControl>
  );
}
```

---

## 🔥 Ejemplo con React Hook Form

```tsx
import { Controller } from 'react-hook-form';

function SkillForm({ control, profileId }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Cargar categorías...
  }, [profileId]);

  return (
    <Controller
      name="category"
      control={control}
      rules={{ required: 'La categoría es requerida' }}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel>Categoría</InputLabel>
          <Select {...field} label="Categoría">
            {categories.map(cat => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
```

---

## 🔧 Axios Config Recomendado

```typescript
// api/skillCategories.api.ts
import axios from './axios.config';

export interface SkillCategory {
  value: string;
  label: string;
  description: string;
  icon: string;
  examples: string[];
}

export async function getSkillCategories(profileId: number): Promise<SkillCategory[]> {
  const response = await axios.get(`/api/profiles/${profileId}/skills/categories`);
  return response.data.data.categories;
}

export async function getSkillCategoriesGrouped(profileId: number) {
  const response = await axios.get(`/api/profiles/${profileId}/skills/categories/grouped`);
  return response.data.data.categoriesGrouped;
}
```

---

## 🎨 Redux/Zustand Store (Opcional)

```typescript
// store/skillCategoriesSlice.ts (Redux Toolkit)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSkillCategories } from '../api/skillCategories.api';

export const fetchSkillCategories = createAsyncThunk(
  'skillCategories/fetch',
  async (profileId: number) => {
    return await getSkillCategories(profileId);
  }
);

const skillCategoriesSlice = createSlice({
  name: 'skillCategories',
  initialState: {
    categories: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkillCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSkillCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchSkillCategories.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default skillCategoriesSlice.reducer;

// Uso:
// dispatch(fetchSkillCategories(profileId));
// const categories = useSelector(state => state.skillCategories.categories);
```

---

## 📋 Todas las Categorías Disponibles

| Valor API | Label Español |
|-----------|---------------|
| `programming_languages` | Lenguajes de Programación |
| `frameworks_libraries` | Frameworks y Librerías |
| `databases` | Bases de Datos |
| `cloud_devops` | Cloud y DevOps |
| `mobile_development` | Desarrollo Móvil |
| `design_tools` | Herramientas de Diseño |
| `multimedia` | Multimedia y Video |
| `graphic_design` | Diseño Gráfico |
| `project_management` | Gestión de Proyectos |
| `business_analysis` | Análisis de Negocios |
| `marketing_digital` | Marketing Digital |
| `sales` | Ventas |
| `accounting` | Contabilidad |
| `finance` | Finanzas |
| `human_resources` | Recursos Humanos |
| `healthcare` | Salud |
| `laboratory` | Laboratorio |
| `teaching` | Enseñanza |
| `legal` | Legal |
| `operations` | Operaciones |
| `logistics` | Logística |
| `architecture` | Arquitectura |
| `engineering` | Ingeniería |
| `communication` | Comunicación |
| `social_media` | Redes Sociales |
| `customer_service` | Atención al Cliente |
| `office_tools` | Herramientas de Oficina |
| `soft_skills` | Habilidades Blandas |
| `languages` | Idiomas |
| `other` | Otros |

**Total: 33 categorías** (antes eran 7)

---

## ⚠️ Errores Comunes

### Error 1: Hardcodear categorías
```typescript
// ❌ NO HACER
const category = "Frontend"; // No existe esta categoría
```

**Solución:** Usar valores exactos del API:
```typescript
// ✅ CORRECTO
const category = "frameworks_libraries";
```

### Error 2: No manejar loading state
```typescript
// ❌ MALO - Select vacío mientras carga
<Select>
  {categories.map(...)}
</Select>
```

**Solución:**
```typescript
// ✅ CORRECTO
<Select disabled={loading}>
  {loading ? (
    <MenuItem disabled>Cargando categorías...</MenuItem>
  ) : (
    categories.map(...)
  )}
</Select>
```

### Error 3: No cachear categorías
```typescript
// ❌ INEFICIENTE - Carga en cada render
useEffect(() => {
  loadCategories();
}, []); // Carga cada vez que el componente monta
```

**Solución:** Guardar en Redux/Context o localStorage:
```typescript
// ✅ MEJOR
const cachedCategories = localStorage.getItem('skillCategories');
if (cachedCategories) {
  setCategories(JSON.parse(cachedCategories));
} else {
  loadCategories().then(cats => {
    localStorage.setItem('skillCategories', JSON.stringify(cats));
  });
}
```

---

## 🧪 Testing

```typescript
// __tests__/SkillCategorySelect.test.tsx
import { render, waitFor, screen } from '@testing-library/react';
import SkillCategorySelect from './SkillCategorySelect';
import axios from 'axios';

jest.mock('axios');

test('loads and displays categories', async () => {
  axios.get.mockResolvedValue({
    data: {
      data: {
        categories: [
          { value: 'programming_languages', label: 'Lenguajes de Programación' }
        ]
      }
    }
  });

  render(<SkillCategorySelect value="" onChange={() => {}} profileId={1} />);

  await waitFor(() => {
    expect(screen.getByText('Lenguajes de Programación')).toBeInTheDocument();
  });
});
```

---

## 📞 FAQ

**Q: ¿Tengo que actualizar mi código existente?**
A: Sí, pero es simple. Reemplaza el array hardcodeado con una llamada al API.

**Q: ¿Las categorías antiguas siguen funcionando?**
A: Sí, todas las 7 categorías originales siguen siendo válidas.

**Q: ¿Necesito permisos especiales?**
A: No, solo necesitas estar autenticado (mismo token que usas para crear skills).

**Q: ¿Se puede cachear la respuesta?**
A: Sí, las categorías no cambian frecuentemente. Puedes cachear en localStorage por 24 horas.

**Q: ¿Qué pasa si el endpoint falla?**
A: Implementa un fallback con las 7 categorías originales como backup.

---

## 🚀 Deployment Checklist

- [ ] Reemplazar arrays hardcodeados con llamadas al API
- [ ] Agregar loading states
- [ ] Implementar error handling
- [ ] Agregar caché (opcional pero recomendado)
- [ ] Actualizar tests
- [ ] Verificar que el select/combobox se ve bien con 33 opciones
- [ ] Considerar usar versión agrupada para mejor UX
- [ ] Probar en producción: `https://api-cv.servercontrol-mzt.com`

---

**¿Dudas?** Revisa `API_FRONTEND_GUIDE.md` para más detalles.
