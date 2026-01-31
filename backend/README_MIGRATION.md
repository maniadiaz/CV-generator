# 🚀 Migración Automática de Categorías de Skills

## Uso Rápido

```bash
npm run migrate:skills
```

Eso es todo. El script hace todo automáticamente.

---

## ¿Qué hace el script?

El script `migrate-skill-categories.js` realiza estos pasos automáticamente:

1. ✅ **Verifica la conexión** a la base de datos
2. ✅ **Cuenta los skills actuales** para asegurar que no se pierdan datos
3. ✅ **Verifica la estructura actual** de la tabla
4. ✅ **Crea un backup automático** en formato SQL
5. ✅ **Te pide confirmación** antes de ejecutar
6. ✅ **Ejecuta la migración** (ALTER TABLE)
7. ✅ **Verifica que todo salió bien**
8. ✅ **Muestra un resumen** con el resultado

---

## Requisitos Previos

- Node.js instalado
- Base de datos MySQL/MariaDB corriendo
- Archivo `.env` configurado con credenciales de DB:
  ```env
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=tu_password
  DB_NAME=cv_generator_db
  ```

---

## Paso a Paso

### 1. Ejecutar el script

```bash
npm run migrate:skills
```

### 2. Revisar el output

El script mostrará:

```
============================================================
  MIGRACIÓN DE CATEGORÍAS DE SKILLS
  De 7 categorías a 33 categorías
============================================================

🔌 Conectando a la base de datos...
   Host: localhost:3306
   Database: cv_generator_db
   User: root
✅ Conexión establecida

📊 Total de skills actuales: 42

🔍 Verificando estructura actual...
   Categorías actuales: 7
      • programming_languages
      • frameworks_libraries
      • databases
      • cloud_devops
      • tools
      • soft_skills
      • other

📦 Creando backup de la tabla skills...
✅ Backup creado: backup_skills_2026-01-30T15-30-00.sql

⚠️  Estás a punto de ejecutar la migración
   Se modificará la estructura de la tabla skills
   Se ha creado un backup en caso de problemas

¿Continuar con la migración? (y/N):
```

### 3. Confirmar

Escribe `y` y presiona Enter.

### 4. Verificar resultado

```
🚀 Ejecutando migración...
✅ Migración ejecutada exitosamente

✅ Verificando migración...
   Nuevas categorías: 33
   ✅ Cantidad correcta de categorías (33)
   Skills antes: 42
   Skills después: 42
   ✅ No se perdieron datos

   📊 Distribución de categorías:
      • programming_languages: 15 skills
      • frameworks_libraries: 12 skills
      • databases: 5 skills
      • cloud_devops: 4 skills
      • tools: 3 skills
      • soft_skills: 2 skills
      • other: 1 skills

============================================================
  ✅ MIGRACIÓN COMPLETADA EXITOSAMENTE
============================================================

📋 Resumen:
   ✅ Categorías actualizadas a 33
   ✅ Datos preservados: 42 skills
   ✅ Backup creado: backup_skills_2026-01-30T15-30-00.sql

🚀 Próximos pasos:
   1. Reiniciar el servidor: pm2 restart cv-generator-api
   2. Probar endpoints: node test-skill-categories.js
   3. Verificar que todo funciona correctamente

💡 Si algo sale mal:
   Puedes restaurar desde: backup_skills_2026-01-30T15-30-00.sql

🔌 Conexión cerrada
```

---

## ¿Qué pasa si ya migré antes?

El script detecta si ya tienes 33 categorías y te pregunta si quieres ejecutar de nuevo:

```
⚠️  La migración ya fue ejecutada anteriormente
   La tabla ya tiene 33 categorías

¿Deseas ejecutar la migración de nuevo? (y/N):
```

Puedes responder `N` para cancelar.

---

## Restaurar desde Backup (si algo sale mal)

Si necesitas revertir, usa el archivo de backup:

```bash
mysql -u root -p cv_generator_db < backup_skills_2026-01-30T15-30-00.sql
```

O desde MySQL:

```sql
USE cv_generator_db;
SOURCE /path/to/backup_skills_2026-01-30T15-30-00.sql;
```

---

## Verificar que la migración funcionó

### Opción 1: Usar el script de prueba

```bash
npm run test:skills
```

### Opción 2: Manualmente en MySQL

```sql
-- Ver estructura
SHOW CREATE TABLE skills\G

-- Ver categorías en uso
SELECT DISTINCT category, COUNT(*) as total
FROM skills
GROUP BY category
ORDER BY category;

-- Debe mostrar 33 categorías disponibles
```

---

## Troubleshooting

### Error: "Cannot connect to database"

**Solución:**
- Verifica que MySQL está corriendo
- Revisa las credenciales en `.env`
- Verifica que la base de datos existe

### Error: "Variables de entorno faltantes"

**Solución:**
- Asegúrate de tener un archivo `.env` en la raíz del proyecto
- Verifica que tiene las variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

### Error: "Table 'skills' doesn't exist"

**Solución:**
- Asegúrate de estar conectado a la base de datos correcta
- Ejecuta las migraciones de Sequelize primero: `npm run migrate`

### El script no pide confirmación

**Solución:**
- Asegúrate de estar ejecutando desde una terminal interactiva
- No uses pipes o redirecciones: `npm run migrate:skills < input.txt` ❌

---

## Archivos Generados

El script genera archivos de backup con este formato:

```
backup_skills_2026-01-30T15-30-00.sql
```

**Ubicación:** Misma carpeta donde ejecutaste el script (raíz del backend)

**Contenido:**
- CREATE TABLE con la estructura antigua
- INSERT con todos los datos existentes
- Permite restaurar completamente en caso de problemas

---

## Ejecución en Producción

### Paso 1: Hacer backup manual primero

```bash
mysqldump -u root -p cv_generator_db > backup_manual_antes_migracion.sql
```

### Paso 2: Ejecutar migración

```bash
npm run migrate:skills
```

### Paso 3: Reiniciar servidor

```bash
pm2 restart cv-generator-api
```

### Paso 4: Verificar logs

```bash
pm2 logs cv-generator-api --lines 50
```

### Paso 5: Probar endpoints

```bash
npm run test:skills
```

---

## Preguntas Frecuentes

### ¿Puedo ejecutar el script múltiples veces?

Sí, es seguro. Si ya se ejecutó antes, te preguntará si quieres ejecutar de nuevo.

### ¿Se perderán mis datos?

No. La migración solo modifica el ENUM, no elimina ni modifica datos.

### ¿Cuánto tiempo toma?

Usualmente menos de 1 segundo. En tablas muy grandes (100k+ registros) puede tardar unos segundos más.

### ¿Necesito detener el servidor?

Recomendado pero no obligatorio. El ALTER TABLE puede bloquear la tabla brevemente.

### ¿Funciona con MariaDB?

Sí, funciona con MySQL y MariaDB.

### ¿Puedo cancelar durante la ejecución?

Sí, presiona Ctrl+C antes de confirmar. Una vez confirmado, déjalo terminar.

---

## Comandos Útiles

```bash
# Ejecutar migración
npm run migrate:skills

# Probar que funciona
npm run test:skills

# Ver estructura de tabla
mysql -u root -p -e "SHOW CREATE TABLE skills\G" cv_generator_db

# Contar skills
mysql -u root -p -e "SELECT COUNT(*) FROM skills;" cv_generator_db

# Ver distribución de categorías
mysql -u root -p -e "SELECT category, COUNT(*) FROM skills GROUP BY category;" cv_generator_db
```

---

## Soporte

Si tienes problemas:

1. Lee los mensajes de error del script
2. Revisa este README
3. Verifica el archivo de backup creado
4. Revisa los logs del servidor
5. Consulta [DEPLOYMENT_INSTRUCTIONS.md](DEPLOYMENT_INSTRUCTIONS.md)

---

**Última actualización:** 2026-01-30
**Versión del script:** 1.0.0
**Compatibilidad:** MySQL 5.7+, MariaDB 10.2+
