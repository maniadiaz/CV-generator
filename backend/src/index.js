require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const cvRoutes = require('./routes/cv');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/cv', cvRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
async function start() {
  // Probar conexión a la base de datos
  await testConnection();

  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║     CV Generator API - Backend         ║
╠════════════════════════════════════════╣
║  Puerto: ${PORT}                           ║
║  URL: http://localhost:${PORT}             ║
╚════════════════════════════════════════╝
    `);
  });
}

start();
