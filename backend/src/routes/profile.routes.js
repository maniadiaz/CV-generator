const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middlewares/auth');
const { verifyProfileOwnership } = require('../middlewares/profileOwnership');
const { validate, validateParams } = require('../middlewares/validation');
const {
  createProfileSchema,
  updateProfileSchema,
  personalInfoSchema,
  profileIdSchema
} = require('../validators/profileValidator');

/**
 * Todas las rutas requieren autenticación
 */

/**
 * @route   GET /api/profiles/stats
 * @desc    Obtener estadísticas de perfiles del usuario
 * @access  Private
 * @note    Esta ruta debe ir ANTES de /api/profiles/:id para evitar conflictos
 */
router.get('/stats', authenticate, profileController.getProfileStats);

/**
 * @route   GET /api/profiles
 * @desc    Obtener todos los perfiles del usuario autenticado
 * @access  Private
 */
router.get('/', authenticate, profileController.getUserProfiles);

/**
 * @route   POST /api/profiles
 * @desc    Crear nuevo perfil
 * @access  Private
 */
router.post('/', authenticate, validate(createProfileSchema), profileController.createProfile);

/**
 * @route   GET /api/profiles/:id
 * @desc    Obtener un perfil específico
 * @access  Private
 */
router.get('/:id', authenticate, validateParams(profileIdSchema), profileController.getProfileById);

/**
 * @route   PUT /api/profiles/:id
 * @desc    Actualizar un perfil
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  validateParams(profileIdSchema),
  validate(updateProfileSchema),
  profileController.updateProfile
);

/**
 * @route   DELETE /api/profiles/:id
 * @desc    Eliminar un perfil
 * @access  Private
 */
router.delete('/:id', authenticate, validateParams(profileIdSchema), profileController.deleteProfile);

/**
 * @route   PATCH /api/profiles/:id/set-default
 * @desc    Marcar perfil como default
 * @access  Private
 */
router.patch(
  '/:id/set-default',
  authenticate,
  validateParams(profileIdSchema),
  profileController.setDefaultProfile
);

/**
 * @route   GET /api/profiles/:id/complete
 * @desc    Obtener perfil completo con todas las relaciones
 * @access  Private
 */
router.get(
  '/:id/complete',
  authenticate,
  validateParams(profileIdSchema),
  profileController.getCompleteProfile
);

/**
 * @route   POST /api/profiles/:id/duplicate
 * @desc    Duplicar un perfil existente
 * @access  Private
 */
router.post(
  '/:id/duplicate',
  authenticate,
  validateParams(profileIdSchema),
  profileController.duplicateProfile
);

/**
 * @route   GET /api/profiles/:id/personal
 * @desc    Obtener información personal del perfil
 * @access  Private
 */
router.get(
  '/:id/personal',
  authenticate,
  validateParams(profileIdSchema),
  profileController.getPersonalInfo
);

/**
 * @route   PUT /api/profiles/:id/personal
 * @desc    Actualizar información personal del perfil
 * @access  Private
 */
router.put(
  '/:id/personal',
  authenticate,
  validateParams(profileIdSchema),
  validate(personalInfoSchema),
  profileController.updatePersonalInfo
);

/**
 * Rutas anidadas: Education, Experience, Skills, Languages, Certifications
 * /api/profiles/:profileId/education
 * /api/profiles/:profileId/experience
 * /api/profiles/:profileId/skills
 * /api/profiles/:profileId/languages
 * /api/profiles/:profileId/certifications
 */
router.use('/:profileId/education', require('./education.routes'));
router.use('/:profileId/experience', require('./experience.routes'));
router.use('/:profileId/skills', require('./skill.routes'));
router.use('/:profileId/languages', require('./language.routes'));
router.use('/:profileId/certifications', require('./certification.routes'));

module.exports = router;
