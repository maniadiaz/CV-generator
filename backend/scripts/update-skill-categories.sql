-- =====================================================
-- Migración: Expandir categorías de skills
-- Fecha: 2026-01-30
-- Descripción: Agregar 26 nuevas categorías al ENUM
-- =====================================================

-- IMPORTANTE: Este script actualiza el ENUM de la columna 'category'
-- en la tabla 'skills' para incluir las 33 categorías

-- Antes de ejecutar:
-- 1. Hacer backup de la base de datos
-- 2. Verificar que no hay transacciones activas
-- 3. Ejecutar en horario de bajo tráfico si es producción

-- =====================================================
-- PASO 1: Verificar estructura actual
-- =====================================================

-- Ver la estructura actual de la tabla
SHOW CREATE TABLE skills;

-- Ver las categorías actuales en uso
SELECT DISTINCT category, COUNT(*) as total
FROM skills
GROUP BY category
ORDER BY category;

-- =====================================================
-- PASO 2: Modificar la columna category
-- =====================================================

-- IMPORTANTE: En MySQL, ALTER TABLE con ENUM reemplaza todos los valores
-- Este comando agrega todas las nuevas categorías al ENUM

ALTER TABLE skills
MODIFY COLUMN category ENUM(
  -- Tecnología (5)
  'programming_languages',
  'frameworks_libraries',
  'databases',
  'cloud_devops',
  'mobile_development',

  -- Diseño y Creatividad (3)
  'design_tools',
  'multimedia',
  'graphic_design',

  -- Negocios (4)
  'project_management',
  'business_analysis',
  'marketing_digital',
  'sales',

  -- Finanzas (2)
  'accounting',
  'finance',

  -- Otros Sectores (16)
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

-- =====================================================
-- PASO 3: Verificar que la migración fue exitosa
-- =====================================================

-- Ver la nueva estructura
SHOW CREATE TABLE skills;

-- Verificar que no se perdieron datos
SELECT COUNT(*) as total_skills FROM skills;

-- Verificar que las categorías antiguas siguen funcionando
SELECT category, COUNT(*) as total
FROM skills
GROUP BY category
ORDER BY category;

-- =====================================================
-- ROLLBACK (solo si algo sale mal)
-- =====================================================

/*
-- Si necesitas volver atrás (SOLO EN EMERGENCIA):

ALTER TABLE skills
MODIFY COLUMN category ENUM(
  'programming_languages',
  'frameworks_libraries',
  'databases',
  'cloud_devops',
  'tools',
  'soft_skills',
  'other'
) NOT NULL DEFAULT 'other' COMMENT 'Categoría de la habilidad';
*/

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

/*
1. COMPATIBILIDAD:
   - Todas las categorías antiguas (7) siguen siendo válidas
   - Los datos existentes NO se modifican
   - Solo se expande el ENUM para aceptar más valores

2. DATOS EXISTENTES:
   - Skills con 'tools' siguen funcionando
   - No se requiere migración de datos
   - Los valores existentes permanecen intactos

3. IMPACTO EN PRODUCCIÓN:
   - El ALTER TABLE puede bloquear la tabla brevemente
   - En tablas grandes, puede tardar algunos segundos
   - Recomendado ejecutar en horario de bajo tráfico

4. VALIDACIÓN POST-MIGRACIÓN:
   - Verificar que el backend inicia correctamente
   - Probar crear skill con nueva categoría
   - Ejecutar: node test-skill-categories.js

5. SI ALGO SALE MAL:
   - Los datos existentes NO se perderán
   - El ENUM puede revertirse con el script de ROLLBACK
   - Contactar al equipo de desarrollo
*/
