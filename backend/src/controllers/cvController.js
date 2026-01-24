const { query } = require('../config/database');

// Helper para verificar propiedad del perfil
async function verifyProfileOwnership(profileId, userId) {
  const profiles = await query(
    'SELECT id FROM profiles WHERE id = ? AND user_id = ?',
    [profileId, userId]
  );
  return profiles.length > 0;
}

// =============================================
// EDUCACIÓN
// =============================================

async function addEducation(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    const data = req.body;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    const result = await query(
      `INSERT INTO education (profile_id, institution, degree, field, start_date, end_date, gpa, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [profileId, data.institution, data.degree, data.field, data.startDate, data.endDate, data.gpa, data.description]
    );

    res.status(201).json({
      message: 'Educación agregada',
      id: Number(result.insertId),
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ error: 'Error al agregar educación' });
  }
}

async function updateEducation(req, res) {
  try {
    const userId = req.user.id;
    const { profileId, id } = req.params;
    const data = req.body;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await query(
      `UPDATE education SET institution = ?, degree = ?, field = ?, start_date = ?, end_date = ?, gpa = ?, description = ?
       WHERE id = ? AND profile_id = ?`,
      [data.institution, data.degree, data.field, data.startDate, data.endDate, data.gpa, data.description, id, profileId]
    );

    res.json({ message: 'Educación actualizada' });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ error: 'Error al actualizar educación' });
  }
}

async function deleteEducation(req, res) {
  try {
    const userId = req.user.id;
    const { profileId, id } = req.params;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await query('DELETE FROM education WHERE id = ? AND profile_id = ?', [id, profileId]);
    res.json({ message: 'Educación eliminada' });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ error: 'Error al eliminar educación' });
  }
}

// =============================================
// EXPERIENCIA
// =============================================

async function addExperience(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    const data = req.body;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    const result = await query(
      `INSERT INTO experience (profile_id, company, position, location, start_date, end_date, is_current, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [profileId, data.company, data.position, data.location, data.startDate, data.endDate, data.isCurrent || false, data.description]
    );

    res.status(201).json({
      message: 'Experiencia agregada',
      id: Number(result.insertId),
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ error: 'Error al agregar experiencia' });
  }
}

async function updateExperience(req, res) {
  try {
    const userId = req.user.id;
    const { profileId, id } = req.params;
    const data = req.body;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await query(
      `UPDATE experience SET company = ?, position = ?, location = ?, start_date = ?, end_date = ?, is_current = ?, description = ?
       WHERE id = ? AND profile_id = ?`,
      [data.company, data.position, data.location, data.startDate, data.endDate, data.isCurrent || false, data.description, id, profileId]
    );

    res.json({ message: 'Experiencia actualizada' });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Error al actualizar experiencia' });
  }
}

async function deleteExperience(req, res) {
  try {
    const userId = req.user.id;
    const { profileId, id } = req.params;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await query('DELETE FROM experience WHERE id = ? AND profile_id = ?', [id, profileId]);
    res.json({ message: 'Experiencia eliminada' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Error al eliminar experiencia' });
  }
}

// =============================================
// HABILIDADES
// =============================================

async function addSkill(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    const { name, category, level } = req.body;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    const result = await query(
      'INSERT INTO skills (profile_id, name, category, level) VALUES (?, ?, ?, ?)',
      [profileId, name, category || null, level || null]
    );

    res.status(201).json({
      message: 'Habilidad agregada',
      id: Number(result.insertId),
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ error: 'Error al agregar habilidad' });
  }
}

async function deleteSkill(req, res) {
  try {
    const userId = req.user.id;
    const { profileId, id } = req.params;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await query('DELETE FROM skills WHERE id = ? AND profile_id = ?', [id, profileId]);
    res.json({ message: 'Habilidad eliminada' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Error al eliminar habilidad' });
  }
}

// Actualizar todas las habilidades (reemplazar)
async function updateSkills(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    const { skills } = req.body; // Array de strings

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    // Eliminar habilidades existentes
    await query('DELETE FROM skills WHERE profile_id = ?', [profileId]);

    // Insertar nuevas
    if (skills && skills.length > 0) {
      const values = skills.map((name, index) => [profileId, name, index]);
      for (const [pId, name, order] of values) {
        await query('INSERT INTO skills (profile_id, name, display_order) VALUES (?, ?, ?)', [pId, name, order]);
      }
    }

    res.json({ message: 'Habilidades actualizadas' });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ error: 'Error al actualizar habilidades' });
  }
}

// =============================================
// IDIOMAS
// =============================================

async function addLanguage(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    const { name, level } = req.body;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    const result = await query(
      'INSERT INTO languages (profile_id, name, level) VALUES (?, ?, ?)',
      [profileId, name, level]
    );

    res.status(201).json({
      message: 'Idioma agregado',
      id: Number(result.insertId),
    });
  } catch (error) {
    console.error('Add language error:', error);
    res.status(500).json({ error: 'Error al agregar idioma' });
  }
}

async function deleteLanguage(req, res) {
  try {
    const userId = req.user.id;
    const { profileId, id } = req.params;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await query('DELETE FROM languages WHERE id = ? AND profile_id = ?', [id, profileId]);
    res.json({ message: 'Idioma eliminado' });
  } catch (error) {
    console.error('Delete language error:', error);
    res.status(500).json({ error: 'Error al eliminar idioma' });
  }
}

// =============================================
// CERTIFICACIONES
// =============================================

async function addCertification(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    const data = req.body;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    const result = await query(
      `INSERT INTO certifications (profile_id, name, issuer, date, credential_id, credential_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [profileId, data.name, data.issuer, data.date, data.credentialId, data.credentialUrl]
    );

    res.status(201).json({
      message: 'Certificación agregada',
      id: Number(result.insertId),
    });
  } catch (error) {
    console.error('Add certification error:', error);
    res.status(500).json({ error: 'Error al agregar certificación' });
  }
}

async function updateCertification(req, res) {
  try {
    const userId = req.user.id;
    const { profileId, id } = req.params;
    const data = req.body;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await query(
      `UPDATE certifications SET name = ?, issuer = ?, date = ?, credential_id = ?, credential_url = ?
       WHERE id = ? AND profile_id = ?`,
      [data.name, data.issuer, data.date, data.credentialId, data.credentialUrl, id, profileId]
    );

    res.json({ message: 'Certificación actualizada' });
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).json({ error: 'Error al actualizar certificación' });
  }
}

async function deleteCertification(req, res) {
  try {
    const userId = req.user.id;
    const { profileId, id } = req.params;

    if (!(await verifyProfileOwnership(profileId, userId))) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    await query('DELETE FROM certifications WHERE id = ? AND profile_id = ?', [id, profileId]);
    res.json({ message: 'Certificación eliminada' });
  } catch (error) {
    console.error('Delete certification error:', error);
    res.status(500).json({ error: 'Error al eliminar certificación' });
  }
}

module.exports = {
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addSkill,
  deleteSkill,
  updateSkills,
  addLanguage,
  deleteLanguage,
  addCertification,
  updateCertification,
  deleteCertification,
};
