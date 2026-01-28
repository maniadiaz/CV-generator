const express = require('express');
const router = express.Router();

// Health check interno
router.get('/health', (req, res) => {
  res.json({
    status: 'API OK',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Rutas principales
router.use('/auth', require('./auth.routes'));

// Rutas futuras (se agregarán en fases posteriores)
// router.use('/profiles', require('./profile.routes'));
// router.use('/users', require('./user.routes'));

module.exports = router;
