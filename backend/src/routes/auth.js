const express = require('express');
const router = express.Router();
const { register, login, me, changePassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/me', authMiddleware, me);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
