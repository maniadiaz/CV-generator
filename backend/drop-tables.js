require('dotenv').config();
const mysql = require('mysql2/promise');

async function dropTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🔄 Dropping tables...');

    // Deshabilitar foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // Eliminar tablas en orden inverso (hijas primero)
    await connection.query('DROP TABLE IF EXISTS social_networks');
    await connection.query('DROP TABLE IF EXISTS certifications');
    await connection.query('DROP TABLE IF EXISTS languages');
    await connection.query('DROP TABLE IF EXISTS skills');
    await connection.query('DROP TABLE IF EXISTS experience');
    await connection.query('DROP TABLE IF EXISTS education');
    await connection.query('DROP TABLE IF EXISTS personal_info');
    await connection.query('DROP TABLE IF EXISTS profiles');
    await connection.query('DROP TABLE IF EXISTS sessions');
    await connection.query('DROP TABLE IF EXISTS users');

    // Rehabilitar foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ All tables dropped successfully');
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
  } finally {
    await connection.end();
  }
}

dropTables();
