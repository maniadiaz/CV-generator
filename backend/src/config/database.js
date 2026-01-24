const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cv_generator',
  connectionLimit: 10,
  acquireTimeout: 30000,
});

async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result;
  } finally {
    if (conn) conn.release();
  }
}

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✓ Conexión a MariaDB exitosa');
    conn.release();
    return true;
  } catch (err) {
    console.error('✗ Error conectando a MariaDB:', err.message);
    return false;
  }
}

module.exports = { pool, query, testConnection };
