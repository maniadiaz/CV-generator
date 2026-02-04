require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🔧 Setting up database...');
  console.log(`📍 Host: ${process.env.DB_HOST}`);
  console.log(`👤 User: ${process.env.DB_USER}`);
  console.log(`💾 Database: ${process.env.DB_NAME}`);

  try {
    // Conectar sin especificar database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '..', 'database', 'Database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Executing SQL script...');

    // Ejecutar el script SQL
    await connection.query(sql);

    console.log('✅ Database created successfully!');
    console.log('✅ All tables created successfully!');

    // Verificar las tablas creadas
    await connection.query(`USE ${process.env.DB_NAME}`);
    const [tables] = await connection.query('SHOW TABLES');

    console.log(`\n📊 Tables created (${tables.length}):`);
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });

    await connection.end();
    console.log('\n✅ Setup completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('\nDetails:', error);
    process.exit(1);
  }
}

setupDatabase();
