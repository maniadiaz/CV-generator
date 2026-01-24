const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
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
} = require('../controllers/cvController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Educación
router.post('/:profileId/education', addEducation);
router.put('/:profileId/education/:id', updateEducation);
router.delete('/:profileId/education/:id', deleteEducation);

// Experiencia
router.post('/:profileId/experience', addExperience);
router.put('/:profileId/experience/:id', updateExperience);
router.delete('/:profileId/experience/:id', deleteExperience);

// Habilidades
router.post('/:profileId/skills', addSkill);
router.put('/:profileId/skills', updateSkills); // Actualizar todas
router.delete('/:profileId/skills/:id', deleteSkill);

// Idiomas
router.post('/:profileId/languages', addLanguage);
router.delete('/:profileId/languages/:id', deleteLanguage);

// Certificaciones
router.post('/:profileId/certifications', addCertification);
router.put('/:profileId/certifications/:id', updateCertification);
router.delete('/:profileId/certifications/:id', deleteCertification);

module.exports = router;
