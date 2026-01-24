const { query } = require('../config/database');

// Obtener todos los perfiles del usuario
async function getProfiles(req, res) {
  try {
    const userId = req.user.id;

    const profiles = await query(
      `SELECT p.id, p.name, p.is_default, p.created_at, p.updated_at,
              pi.full_name
       FROM profiles p
       LEFT JOIN personal_info pi ON pi.profile_id = p.id
       WHERE p.user_id = ?
       ORDER BY p.is_default DESC, p.created_at DESC`,
      [userId]
    );

    res.json({ profiles });
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ error: 'Error al obtener perfiles' });
  }
}

// Obtener perfil completo por ID
async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;

    // Verificar que el perfil pertenece al usuario
    const profiles = await query(
      'SELECT * FROM profiles WHERE id = ? AND user_id = ?',
      [profileId, userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    const profile = profiles[0];

    // Obtener info personal
    const personalInfo = await query(
      'SELECT * FROM personal_info WHERE profile_id = ?',
      [profileId]
    );

    // Obtener educación
    const education = await query(
      'SELECT * FROM education WHERE profile_id = ? ORDER BY display_order, id DESC',
      [profileId]
    );

    // Obtener experiencia
    const experience = await query(
      'SELECT * FROM experience WHERE profile_id = ? ORDER BY display_order, id DESC',
      [profileId]
    );

    // Obtener habilidades
    const skills = await query(
      'SELECT * FROM skills WHERE profile_id = ? ORDER BY display_order, id',
      [profileId]
    );

    // Obtener idiomas
    const languages = await query(
      'SELECT * FROM languages WHERE profile_id = ? ORDER BY display_order, id',
      [profileId]
    );

    // Obtener certificaciones
    const certifications = await query(
      'SELECT * FROM certifications WHERE profile_id = ? ORDER BY display_order, id DESC',
      [profileId]
    );

    res.json({
      id: profile.id,
      name: profile.name,
      isDefault: profile.is_default,
      personalInfo: personalInfo[0] || {},
      education,
      experience,
      skills: skills.map(s => s.name),
      languages,
      certifications,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
}

// Crear nuevo perfil
async function createProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    const result = await query(
      'INSERT INTO profiles (user_id, name) VALUES (?, ?)',
      [userId, name || 'Nuevo CV']
    );

    const profileId = Number(result.insertId);

    // Crear registro de info personal vacío
    await query('INSERT INTO personal_info (profile_id) VALUES (?)', [profileId]);

    res.status(201).json({
      message: 'Perfil creado',
      profile: { id: profileId, name: name || 'Nuevo CV' },
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ error: 'Error al crear perfil' });
  }
}

// Actualizar nombre del perfil
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;
    const { name } = req.body;

    const result = await query(
      'UPDATE profiles SET name = ? WHERE id = ? AND user_id = ?',
      [name, profileId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json({ message: 'Perfil actualizado' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
}

// Eliminar perfil
async function deleteProfile(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;

    // Verificar que no sea el único perfil
    const count = await query(
      'SELECT COUNT(*) as count FROM profiles WHERE user_id = ?',
      [userId]
    );

    if (count[0].count <= 1) {
      return res.status(400).json({ error: 'No puedes eliminar tu único perfil' });
    }

    const result = await query(
      'DELETE FROM profiles WHERE id = ? AND user_id = ?',
      [profileId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json({ message: 'Perfil eliminado' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Error al eliminar perfil' });
  }
}

// Actualizar info personal
async function updatePersonalInfo(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;
    const data = req.body;

    // Verificar que el perfil pertenece al usuario
    const profiles = await query(
      'SELECT id FROM profiles WHERE id = ? AND user_id = ?',
      [profileId, userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await query(
      `UPDATE personal_info SET
        full_name = ?, email = ?, phone = ?, address = ?,
        city = ?, country = ?, linkedin = ?, github = ?,
        twitter = ?, portfolio = ?, summary = ?
       WHERE profile_id = ?`,
      [
        data.fullName || null,
        data.email || null,
        data.phone || null,
        data.address || null,
        data.city || null,
        data.country || null,
        data.linkedin || null,
        data.github || null,
        data.twitter || null,
        data.portfolio || null,
        data.summary || null,
        profileId,
      ]
    );

    res.json({ message: 'Información personal actualizada' });
  } catch (error) {
    console.error('Update personal info error:', error);
    res.status(500).json({ error: 'Error al actualizar información personal' });
  }
}

module.exports = {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  updatePersonalInfo,
};
