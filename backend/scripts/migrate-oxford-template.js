/**
 * Script para migrar la base de datos y agregar el template 'oxford'
 * Uso: node migrate-oxford-template.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createBackup(connection, dbName) {
  console.log('\n📦 Creating backup...');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupFile = path.join(__dirname, `backup_profiles_template_${timestamp}.sql`);

  const [rows] = await connection.query(`
    SELECT * FROM profiles
  `);

  const backupContent = `-- Backup of profiles table template column
-- Date: ${new Date().toISOString()}
-- Database: ${dbName}

USE ${dbName};

-- Current profiles data
${rows.map(row => `-- ID: ${row.id}, Name: ${row.name}, Template: ${row.template}`).join('\n')}

-- Total records: ${rows.length}
`;

  fs.writeFileSync(backupFile, backupContent);
  console.log(`✅ Backup created: ${backupFile}`);

  return backupFile;
}

async function getCurrentTemplateEnum(connection, dbName) {
  const [rows] = await connection.query(`
    SELECT COLUMN_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'profiles'
      AND COLUMN_NAME = 'template'
  `, [dbName]);

  return rows[0]?.COLUMN_TYPE || 'Not found';
}

async function verifyTemplateEnum(connection, dbName) {
  const columnType = await getCurrentTemplateEnum(connection, dbName);
  return columnType.includes("'oxford'");
}

async function getProfileStats(connection) {
  const [stats] = await connection.query(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN template = 'harvard_classic' THEN 1 ELSE 0 END) as harvard_classic_count,
      SUM(CASE WHEN template = 'harvard_modern' THEN 1 ELSE 0 END) as harvard_modern_count
    FROM profiles
  `);

  return stats[0];
}

async function main() {
  let connection;
  const autoConfirm = process.argv.includes('--yes') || process.argv.includes('-y');

  try {
    console.log('🚀 Oxford Template Migration Script\n');
    console.log('This script will add "oxford" to the template ENUM in the profiles table.\n');

    // Connect to database
    console.log('📡 Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database\n');

    // Show current structure
    console.log('📊 Current template ENUM:');
    const currentEnum = await getCurrentTemplateEnum(connection, config.database);
    console.log(`   ${currentEnum}\n`);

    // Check if already migrated
    const hasOxford = await verifyTemplateEnum(connection, config.database);
    if (hasOxford) {
      console.log('✅ Migration already completed! Oxford template is already in the ENUM.');
      console.log('   No changes needed.\n');
      rl.close();
      await connection.end();
      return;
    }

    // Show current stats
    console.log('📈 Current profiles statistics:');
    const beforeStats = await getProfileStats(connection);
    console.log(`   Total profiles: ${beforeStats.total}`);
    console.log(`   Harvard Classic: ${beforeStats.harvard_classic_count}`);
    console.log(`   Harvard Modern: ${beforeStats.harvard_modern_count}\n`);

    // Create backup
    const backupFile = await createBackup(connection, config.database);

    // Ask for confirmation
    if (!autoConfirm) {
      console.log('\n⚠️  IMPORTANT: This will modify the profiles table structure.');
      console.log('   Backup has been created at:', backupFile);
      const answer = await question('\n   Continue with migration? (yes/no): ');

      if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
        console.log('\n❌ Migration cancelled by user.');
        rl.close();
        await connection.end();
        return;
      }
    } else {
      console.log('\n✅ Auto-confirm enabled (--yes flag)');
      console.log('   Backup created at:', backupFile);
    }

    // Execute migration
    console.log('\n🔄 Executing migration...');

    await connection.query(`
      ALTER TABLE profiles
      MODIFY COLUMN template ENUM('harvard_classic', 'harvard_modern', 'oxford')
      NOT NULL
      DEFAULT 'harvard_classic'
      COMMENT 'Template design chosen'
    `);

    console.log('✅ Migration executed successfully!\n');

    // Verify migration
    console.log('🔍 Verifying migration...');
    const verified = await verifyTemplateEnum(connection, config.database);

    if (verified) {
      console.log('✅ Verification successful!\n');

      const newEnum = await getCurrentTemplateEnum(connection, config.database);
      console.log('📊 New template ENUM:');
      console.log(`   ${newEnum}\n`);

      const afterStats = await getProfileStats(connection);
      console.log('📈 Profiles after migration:');
      console.log(`   Total profiles: ${afterStats.total}`);
      console.log(`   Harvard Classic: ${afterStats.harvard_classic_count}`);
      console.log(`   Harvard Modern: ${afterStats.harvard_modern_count}`);
      console.log(`   Oxford: 0 (ready to use!)\n`);

      console.log('✨ Migration completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('   1. Restart your backend server');
      console.log('   2. Update your frontend to include "oxford" in template selection');
      console.log('   3. Test creating a profile with the Oxford template');
      console.log('   4. Test PDF generation with Oxford template\n');

    } else {
      console.log('❌ Verification failed! Oxford template not found in ENUM.');
      console.log('   Please check the migration manually.\n');
    }

  } catch (error) {
    console.error('\n❌ Error during migration:', error.message);
    console.error('   Stack trace:', error.stack);
    console.log('\n💡 If you need to restore, check the backup file created.\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
    rl.close();
  }
}

// Execute
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
