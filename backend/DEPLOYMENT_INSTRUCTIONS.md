# 🚀 Instrucciones de Deployment - Categorías de Skills

**⚠️ ORDEN CRÍTICO:** Debes seguir estos pasos EN ORDEN.

---

## 📋 Pre-requisitos

- [ ] Acceso a la base de datos MySQL
- [ ] Backup de la base de datos realizado
- [ ] Backend corriendo en local para pruebas

---

## 🔴 PASO 1: Actualizar Base de Datos (CRÍTICO)

### ⚠️ HACER ESTO PRIMERO, ANTES DE DEPLOY

**1.1 Hacer backup:**
```bash
# En el servidor de base de datos
mysqldump -u root -p cv_generator_db > backup_skill_categories_$(date +%Y%m%d_%H%M%S).sql
```

**1.2 Ejecutar migración:**

**Opción A - Usando el script SQL:**
```bash
mysql -u root -p cv_generator_db < update-skill-categories.sql
```

**Opción B - Manualmente (conectarse a MySQL):**
```bash
mysql -u root -p cv_generator_db
```

Luego ejecutar:
```sql
ALTER TABLE skills
MODIFY COLUMN category ENUM(
  'programming_languages',
  'frameworks_libraries',
  'databases',
  'cloud_devops',
  'mobile_development',
  'design_tools',
  'multimedia',
  'graphic_design',
  'project_management',
  'business_analysis',
  'marketing_digital',
  'sales',
  'accounting',
  'finance',
  'human_resources',
  'healthcare',
  'laboratory',
  'teaching',
  'legal',
  'operations',
  'logistics',
  'architecture',
  'engineering',
  'communication',
  'social_media',
  'customer_service',
  'office_tools',
  'soft_skills',
  'languages',
  'other'
) NOT NULL DEFAULT 'other' COMMENT 'Categoría de la habilidad (33 categorías disponibles)';
```

**1.3 Verificar:**
```sql
SHOW CREATE TABLE skills\G
SELECT DISTINCT category, COUNT(*) FROM skills GROUP BY category;
```

**Resultado esperado:**
- La columna `category` debe mostrar ENUM con 33 valores
- Todos los skills existentes deben seguir ahí
- No debe haber errores

---

## 🟡 PASO 2: Probar Localmente

**2.1 Iniciar servidor local:**
```bash
cd backend
npm run dev
```

**2.2 Ejecutar script de prueba:**
```bash
node test-skill-categories.js
```

**Resultado esperado:**
```
✨ TODAS LAS PRUEBAS PASARON EXITOSAMENTE
📊 Resumen:
   ✅ 33 categorías disponibles
   ✅ 13 grupos temáticos
   ✅ Endpoint de categorías funciona
   ✅ Endpoint de categorías agrupadas funciona
   ✅ Creación de skill con nueva categoría funciona
   ✅ Validación de categorías funciona
```

**Si hay errores:**
- Verificar que la base de datos fue actualizada correctamente
- Verificar que todos los archivos nuevos están presentes
- Revisar logs del servidor

---

## 🟢 PASO 3: Commit y Push

```bash
git add .

git commit -m "feat: expand skill categories to support all professions (33 categories)

- Updated Skill model ENUM with 33 categories
- Added skillCategories.js with categorization config
- Created skillCategoryController with 2 new endpoints
- Updated skillValidator to use dynamic categories
- Added routes for /skills/categories and /skills/categories/grouped
- Created SQL migration script update-skill-categories.sql
- Created automated test script test-skill-categories.js
- Updated documentation: API_FRONTEND_GUIDE.md
- Created comprehensive docs: CHANGELOG, FRONTEND_QUICK_REFERENCE, DEPLOYMENT_INSTRUCTIONS

BREAKING CHANGE: Database migration required before deployment
Requires: ALTER TABLE skills MODIFY COLUMN category ENUM(...)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git push origin feat/backend
```

---

## 🚀 PASO 4: Deploy a Producción

**4.1 Conectarse al servidor:**
```bash
ssh usuario@api-cv.servercontrol-mzt.com
```

**4.2 Pull del código:**
```bash
cd /path/to/backend
git pull origin feat/backend
```

**4.3 Instalar dependencias (por si acaso):**
```bash
npm install
```

**4.4 Restart del servidor:**
```bash
pm2 restart cv-generator-api
```

**4.5 Verificar logs:**
```bash
pm2 logs cv-generator-api --lines 50
```

**Buscar en logs:**
- ✅ "Server running on..."
- ✅ "Database connected successfully"
- ❌ NO debe haber errores de ENUM

---

## ✅ PASO 5: Verificar en Producción

**5.1 Login y obtener token:**
```bash
curl -X POST https://api-cv.servercontrol-mzt.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "miguelalexisdi18@gmail.com",
    "password": "tu_password"
  }' | jq
```

Copiar el `accessToken` de la respuesta.

**5.2 Probar endpoint de categorías:**
```bash
TOKEN="tu_token_aqui"

curl https://api-cv.servercontrol-mzt.com/api/profiles/1/skills/categories \
  -H "Authorization: Bearer $TOKEN" | jq
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Skill categories retrieved successfully",
  "data": {
    "categories": [ /* 33 categorías */ ],
    "total": 33
  }
}
```

**5.3 Probar crear skill con nueva categoría:**
```bash
curl -X POST https://api-cv.servercontrol-mzt.com/api/profiles/1/skills \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Figma",
    "category": "design_tools",
    "proficiency_level": "advanced",
    "years_of_experience": 3
  }' | jq
```

**Resultado esperado:** `201 Created` con el skill creado.

**5.4 Eliminar skill de prueba:**
```bash
SKILL_ID=123  # ID del skill creado arriba

curl -X DELETE https://api-cv.servercontrol-mzt.com/api/profiles/1/skills/$SKILL_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 📊 Checklist Final

- [ ] Base de datos actualizada con ENUM de 33 categorías
- [ ] Backup de base de datos realizado
- [ ] Tests locales pasaron exitosamente
- [ ] Código comiteado y pusheado
- [ ] Deploy a producción realizado
- [ ] Servidor restarteado correctamente
- [ ] Logs muestran inicio exitoso
- [ ] Endpoint `/skills/categories` responde con 33 categorías
- [ ] Endpoint `/skills/categories/grouped` responde con 13 grupos
- [ ] Creación de skill con nueva categoría funciona
- [ ] Skills existentes siguen funcionando correctamente

---

## 🆘 Troubleshooting

### Error: "Invalid ENUM value for column 'category'"

**Causa:** La base de datos no fue actualizada.

**Solución:**
1. Ejecutar `update-skill-categories.sql`
2. Verificar con `SHOW CREATE TABLE skills\G`
3. Restart del servidor

### Error: "Cannot find module '../config/skillCategories'"

**Causa:** Archivos nuevos no están en el servidor.

**Solución:**
1. Verificar que `git pull` se ejecutó correctamente
2. Verificar que existe `src/config/skillCategories.js`
3. Hacer `ls -la src/config/` para confirmar

### Error: "Route not found: /api/profiles/1/skills/categories"

**Causa:** Rutas no se registraron correctamente.

**Solución:**
1. Verificar que `src/routes/skill.routes.js` tiene las nuevas rutas
2. Restart del servidor: `pm2 restart cv-generator-api`
3. Verificar logs

### Skills existentes desaparecieron

**Causa:** Improbable - el ALTER TABLE no elimina datos.

**Solución:**
1. Verificar con `SELECT COUNT(*) FROM skills;`
2. Si realmente se perdieron, restaurar desde backup:
   ```bash
   mysql -u root -p cv_generator_db < backup_skill_categories_YYYYMMDD_HHMMSS.sql
   ```

---

## 📞 Contacto

Si algo sale mal:
1. NO PÁNICO - tenemos backup
2. Revisar logs: `pm2 logs cv-generator-api`
3. Revisar este documento y los demás docs
4. Si es necesario, hacer rollback con el backup

---

**Última actualización:** 2026-01-30
**Versión:** 1.1.0
**Status:** Listo para deployment
