const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Registrar usuario
async function register(req, res) {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Verificar si el email ya existe
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, is_verified)
       VALUES (?, ?, ?, ?, TRUE)`,
      [email, passwordHash, firstName || null, lastName || null]
    );

    const userId = Number(result.insertId);

    // Crear perfil por defecto
    const profileResult = await query(
      `INSERT INTO profiles (user_id, name, is_default) VALUES (?, 'Mi CV Principal', TRUE)`,
      [userId]
    );

    // Crear registro de info personal vacío
    await query(
      `INSERT INTO personal_info (profile_id) VALUES (?)`,
      [Number(profileResult.insertId)]
    );

    // Generar token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const users = await query(
      'SELECT id, email, password_hash, first_name, last_name, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Usuario desactivado' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Actualizar último login
    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    // Generar token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

// Obtener usuario actual
async function me(req, res) {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
}

// Cambiar contraseña
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Contraseñas requeridas' });
    }

    // Obtener hash actual
    const users = await query('SELECT password_hash FROM users WHERE id = ?', [userId]);

    // Verificar contraseña actual
    const validPassword = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Hash de nueva contraseña
    const newHash = await bcrypt.hash(newPassword, 10);

    // Actualizar
    await query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
}

module.exports = { register, login, me, changePassword };
