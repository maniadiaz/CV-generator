require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  console.log('🔧 Creating database...');
  console.log(`📍 Host: ${process.env.DB_HOST}`);
  console.log(`👤 User: ${process.env.DB_USER}`);
  console.log(`💾 Database: ${process.env.DB_NAME}`);

  try {
    // Conectar sin especificar database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('✅ Connected to MySQL server');

    // Crear base de datos si no existe
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci
    `);

    console.log(`✅ Database '${process.env.DB_NAME}' created successfully!`);

    // Verificar que existe
    const [databases] = await connection.query('SHOW DATABASES');
    const dbExists = databases.some(db => Object.values(db)[0] === process.env.DB_NAME);

    if (dbExists) {
      console.log(`✅ Database '${process.env.DB_NAME}' is ready to use!`);
    }

    await connection.end();
    console.log('\n✅ Setup completed successfully!');
    console.log('\n📝 Note: Database tables will be created automatically by Sequelize models in Phase 1.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    console.error('\nDetails:', error);
    process.exit(1);
  }
}

createDatabase();
