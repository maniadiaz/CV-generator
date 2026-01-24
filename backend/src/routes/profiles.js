const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  updatePersonalInfo,
} = require('../controllers/profileController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Perfiles
router.get('/', getProfiles);
router.post('/', createProfile);
router.get('/:id', getProfile);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);

// Info personal
router.put('/:id/personal-info', updatePersonalInfo);

module.exports = router;
