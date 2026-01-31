# 📢 Mensaje para el Equipo de Frontend

**Fecha:** 30 de enero 2026
**De:** Backend Team
**Para:** Frontend Team
**Asunto:** Cambios Importantes en API - Acción Requerida

---

## 🚨 2 Cambios Importantes que Requieren Actualización

### 1️⃣ Skills: Ahora 33 Categorías (antes eran 7)

**❌ NO hacer más esto:**
```javascript
// Categorías hardcodeadas
const categories = ['programming_languages', 'frameworks_libraries', ...];
```

**✅ Hacer esto ahora:**
```javascript
// Obtener del API dinámicamente
const response = await axios.get(`/api/profiles/${profileId}/skills/categories`);
const categories = response.data.data.categories; // 33 categorías
```

**Nuevo endpoint disponible:**
```
GET /api/profiles/:profileId/skills/categories
```

**Retorna:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "value": "programming_languages",
        "label": "Lenguajes de Programación",
        "description": "...",
        "icon": "code",
        "examples": ["JavaScript", "Python", "Java"]
      },
      // ... 32 más
    ],
    "total": 33
  }
}
```

---

### 2️⃣ Certificaciones: Campo Renombrado

**❌ Campo antiguo (ya NO funciona):**
```javascript
{
  name: "AWS Certified",
  issuer: "Amazon"  // ❌ Este campo no existe
}
```

**✅ Campo nuevo (usar este):**
```javascript
{
  name: "AWS Certified",
  issuing_organization: "Amazon"  // ✅ Campo correcto
}
```

**Acción requerida:**
- Buscar en todo el código: `issuer`
- Reemplazar con: `issuing_organization`

---

## ✅ Checklist Rápido

**Skills:**
- [ ] Eliminar arrays hardcodeados de categorías
- [ ] Agregar llamada al endpoint `/skills/categories`
- [ ] Actualizar Select/Dropdown con categorías dinámicas

**Certificaciones:**
- [ ] Buscar y reemplazar: `issuer` → `issuing_organization`
- [ ] Actualizar interfaces TypeScript
- [ ] Actualizar formularios

---

## 📚 Documentación Detallada

Ver archivos completos con ejemplos de código:
- **[FRONTEND_BREAKING_CHANGES.md](FRONTEND_BREAKING_CHANGES.md)** - Guía de migración completa
- **[FRONTEND_QUICK_REFERENCE.md](FRONTEND_QUICK_REFERENCE.md)** - Ejemplos React/TypeScript

---

## 🎯 Categorías Ahora Soportadas

El sistema ahora soporta **todas las profesiones**:

**Tecnología:** programming_languages, frameworks_libraries, databases, cloud_devops, mobile_development

**Diseño:** design_tools, multimedia, graphic_design

**Negocios:** project_management, business_analysis, marketing_digital, sales

**Finanzas:** accounting, finance

**Otros:** healthcare, legal, teaching, engineering, HR, operations, logistics, architecture, communication, social_media, customer_service, office_tools, soft_skills, languages, other

**Total: 33 categorías** (antes 7)

---

## 🧪 Probar que Funciona

```bash
# 1. Obtener categorías
curl https://api-cv.servercontrol-mzt.com/api/profiles/1/skills/categories \
  -H "Authorization: Bearer TOKEN"

# Debe retornar 33 categorías

# 2. Crear skill con nueva categoría
curl -X POST https://api-cv.servercontrol-mzt.com/api/profiles/1/skills \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Figma",
    "category": "design_tools",
    "proficiency_level": "advanced"
  }'

# Debe responder: 201 Created
```

---

## ❓ Preguntas Frecuentes

**Q: ¿Cuándo se hicieron estos cambios?**
A: Ya están en producción desde el 30 de enero 2026.

**Q: ¿Los skills existentes dejan de funcionar?**
A: No, las 7 categorías antiguas siguen siendo válidas.

**Q: ¿Dónde veo ejemplos de código?**
A: En `FRONTEND_BREAKING_CHANGES.md` hay ejemplos completos de React/TypeScript.

**Q: ¿Necesito actualizar algo más?**
A: Solo estos 2 cambios: categorías dinámicas y campo `issuing_organization`.

---

**Status:** ✅ Cambios ya en producción
**URL Backend:** https://api-cv.servercontrol-mzt.com
**Documentación:** [FRONTEND_BREAKING_CHANGES.md](FRONTEND_BREAKING_CHANGES.md)
