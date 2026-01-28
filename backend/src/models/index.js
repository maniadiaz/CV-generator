const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

const db = {
  sequelize,
  Sequelize
};

// Importar modelos
db.User = require('./User')(sequelize);
db.Session = require('./Session')(sequelize);

// Configurar relaciones
db.User.hasMany(db.Session, {
  foreignKey: 'user_id',
  as: 'sessions',
  onDelete: 'CASCADE'
});

db.Session.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Sincronizar modelos (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  db.sequelize.sync({ alter: true })
    .then(() => {
      console.log('📊 Database models synchronized');
    })
    .catch(err => {
      console.error('❌ Error synchronizing models:', err);
    });
}

module.exports = db;
