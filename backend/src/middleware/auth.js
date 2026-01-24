const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que el usuario existe y está activo
    const users = await query(
      'SELECT id, email, first_name, last_name, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || !users[0].is_active) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    req.user = {
      id: users[0].id,
      email: users[0].email,
      firstName: users[0].first_name,
      lastName: users[0].last_name,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Error de autenticación' });
  }
}

module.exports = { authMiddleware };
