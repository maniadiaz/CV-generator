/**
 * Script de migración automática para expandir categorías de skills
 * Ejecuta la migración de ENUM en la tabla skills
 *
 * Uso: node migrate-skill-categories.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// SQL de migración
const MIGRATION_SQL = `
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
`;

async function createBackup(connection, dbName) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupFile = path.join(__dirname, `backup_skills_${timestamp}.sql`);

  log('\n📦 Creando backup de la tabla skills...', 'cyan');

  try {
    // Obtener estructura de la tabla
    const [createTable] = await connection.query('SHOW CREATE TABLE skills');
    const createTableSQL = createTable[0]['Create Table'];

    // Obtener datos
    const [rows] = await connection.query('SELECT * FROM skills');

    // Crear archivo de backup
    let backupContent = `-- Backup de tabla skills\n`;
    backupContent += `-- Fecha: ${new Date().toISOString()}\n`;
    backupContent += `-- Base de datos: ${dbName}\n\n`;
    backupContent += `DROP TABLE IF EXISTS \`skills_backup\`;\n\n`;
    backupContent += createTableSQL.replace('CREATE TABLE `skills`', 'CREATE TABLE `skills_backup`') + ';\n\n';

    if (rows.length > 0) {
      backupContent += `-- Datos (${rows.length} registros)\n`;
      backupContent += `INSERT INTO \`skills_backup\` VALUES\n`;

      const values = rows.map(row => {
        const vals = Object.values(row).map(val => {
          if (val === null) return 'NULL';
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
          if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
          return val;
        });
        return `(${vals.join(', ')})`;
      });

      backupContent += values.join(',\n') + ';\n';
    }

    fs.writeFileSync(backupFile, backupContent);
    log(`✅ Backup creado: ${backupFile}`, 'green');

    return backupFile;
  } catch (error) {
    log(`❌ Error creando backup: ${error.message}`, 'red');
    throw error;
  }
}

async function verifyCurrentStructure(connection) {
  log('\n🔍 Verificando estructura actual...', 'cyan');

  try {
    const [createTable] = await connection.query('SHOW CREATE TABLE skills');
    const createTableSQL = createTable[0]['Create Table'];

    // Extraer ENUM actual
    const enumMatch = createTableSQL.match(/`category`\s+enum\((.*?)\)/i);

    if (enumMatch) {
      const currentCategories = enumMatch[1]
        .split(',')
        .map(c => c.trim().replace(/'/g, ''))
        .filter(c => c);

      log(`   Categorías actuales: ${currentCategories.length}`, 'blue');
      currentCategories.forEach(cat => log(`      • ${cat}`, 'blue'));

      return currentCategories;
    }

    return [];
  } catch (error) {
    log(`❌ Error verificando estructura: ${error.message}`, 'red');
    throw error;
  }
}

async function countSkills(connection) {
  try {
    const [result] = await connection.query('SELECT COUNT(*) as total FROM skills');
    return result[0].total;
  } catch (error) {
    log(`❌ Error contando skills: ${error.message}`, 'red');
    return 0;
  }
}

async function runMigration(connection) {
  log('\n🚀 Ejecutando migración...', 'cyan');

  try {
    await connection.query(MIGRATION_SQL);
    log('✅ Migración ejecutada exitosamente', 'green');
    return true;
  } catch (error) {
    log(`❌ Error ejecutando migración: ${error.message}`, 'red');
    throw error;
  }
}

async function verifyMigration(connection, originalCount) {
  log('\n✅ Verificando migración...', 'cyan');

  try {
    // Verificar estructura
    const [createTable] = await connection.query('SHOW CREATE TABLE skills');
    const createTableSQL = createTable[0]['Create Table'];

    const enumMatch = createTableSQL.match(/`category`\s+enum\((.*?)\)/i);

    if (enumMatch) {
      const newCategories = enumMatch[1]
        .split(',')
        .map(c => c.trim().replace(/'/g, ''))
        .filter(c => c);

      log(`   Nuevas categorías: ${newCategories.length}`, 'blue');

      if (newCategories.length === 33) {
        log('   ✅ Cantidad correcta de categorías (33)', 'green');
      } else {
        log(`   ⚠️  Se esperaban 33 categorías, se encontraron ${newCategories.length}`, 'yellow');
      }
    }

    // Verificar que no se perdieron datos
    const newCount = await countSkills(connection);
    log(`   Skills antes: ${originalCount}`, 'blue');
    log(`   Skills después: ${newCount}`, 'blue');

    if (originalCount === newCount) {
      log('   ✅ No se perdieron datos', 'green');
    } else {
      log(`   ❌ ADVERTENCIA: Se perdieron ${originalCount - newCount} registros`, 'red');
      return false;
    }

    // Verificar distribución de categorías
    const [categories] = await connection.query(`
      SELECT category, COUNT(*) as total
      FROM skills
      GROUP BY category
      ORDER BY category
    `);

    if (categories.length > 0) {
      log('\n   📊 Distribución de categorías:', 'blue');
      categories.forEach(cat => {
        log(`      • ${cat.category}: ${cat.total} skills`, 'blue');
      });
    }

    return true;
  } catch (error) {
    log(`❌ Error verificando migración: ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  let connection;
  let backupFile;

  try {
    log('\n' + '='.repeat(60), 'cyan');
    log('  MIGRACIÓN DE CATEGORÍAS DE SKILLS', 'cyan');
    log('  De 7 categorías a 33 categorías', 'cyan');
    log('='.repeat(60), 'cyan');

    // Verificar variables de entorno
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
      log('\n❌ Error: Variables de entorno faltantes', 'red');
      log('   Asegúrate de tener configurado en .env:', 'yellow');
      log('   - DB_HOST', 'yellow');
      log('   - DB_USER', 'yellow');
      log('   - DB_PASSWORD', 'yellow');
      log('   - DB_NAME', 'yellow');
      process.exit(1);
    }

    // Configuración de conexión
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cv_generator_db',
      multipleStatements: true
    };

    log('\n🔌 Conectando a la base de datos...', 'cyan');
    log(`   Host: ${config.host}:${config.port}`, 'blue');
    log(`   Database: ${config.database}`, 'blue');
    log(`   User: ${config.user}`, 'blue');

    connection = await mysql.createConnection(config);
    log('✅ Conexión establecida', 'green');

    // Contar skills actuales
    const originalCount = await countSkills(connection);
    log(`\n📊 Total de skills actuales: ${originalCount}`, 'blue');

    // Verificar estructura actual
    const currentCategories = await verifyCurrentStructure(connection);

    if (currentCategories.length === 33) {
      log('\n⚠️  La migración ya fue ejecutada anteriormente', 'yellow');
      log('   La tabla ya tiene 33 categorías', 'yellow');

      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        readline.question('\n¿Deseas ejecutar la migración de nuevo? (y/N): ', resolve);
      });
      readline.close();

      if (answer.toLowerCase() !== 'y') {
        log('\n✅ Migración cancelada', 'green');
        await connection.end();
        return;
      }
    }

    // Crear backup
    backupFile = await createBackup(connection, config.database);

    // Confirmar ejecución
    log('\n⚠️  Estás a punto de ejecutar la migración', 'yellow');
    log('   Se modificará la estructura de la tabla skills', 'yellow');
    log('   Se ha creado un backup en caso de problemas', 'yellow');

    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const confirm = await new Promise(resolve => {
      readline.question('\n¿Continuar con la migración? (y/N): ', resolve);
    });
    readline.close();

    if (confirm.toLowerCase() !== 'y') {
      log('\n❌ Migración cancelada por el usuario', 'yellow');
      await connection.end();
      return;
    }

    // Ejecutar migración
    await runMigration(connection);

    // Verificar migración
    const success = await verifyMigration(connection, originalCount);

    // Resumen final
    log('\n' + '='.repeat(60), 'cyan');
    if (success) {
      log('  ✅ MIGRACIÓN COMPLETADA EXITOSAMENTE', 'green');
    } else {
      log('  ⚠️  MIGRACIÓN COMPLETADA CON ADVERTENCIAS', 'yellow');
    }
    log('='.repeat(60), 'cyan');

    log('\n📋 Resumen:', 'cyan');
    log(`   ✅ Categorías actualizadas a 33`, 'green');
    log(`   ✅ Datos preservados: ${originalCount} skills`, 'green');
    log(`   ✅ Backup creado: ${backupFile}`, 'green');

    log('\n🚀 Próximos pasos:', 'cyan');
    log('   1. Reiniciar el servidor: pm2 restart cv-generator-api', 'blue');
    log('   2. Probar endpoints: node test-skill-categories.js', 'blue');
    log('   3. Verificar que todo funciona correctamente', 'blue');

    log('\n💡 Si algo sale mal:', 'cyan');
    log(`   Puedes restaurar desde: ${backupFile}`, 'yellow');

  } catch (error) {
    log('\n❌ ERROR FATAL:', 'red');
    log(`   ${error.message}`, 'red');

    if (error.stack) {
      log('\n📋 Stack trace:', 'yellow');
      log(error.stack, 'yellow');
    }

    if (backupFile) {
      log(`\n💡 Backup disponible en: ${backupFile}`, 'cyan');
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      log('\n🔌 Conexión cerrada', 'blue');
    }
  }
}

// Ejecutar
main().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
