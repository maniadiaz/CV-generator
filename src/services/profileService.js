import { api } from './api';

export const profileService = {
  // Obtener todos los perfiles del usuario
  async getProfiles() {
    return api.get('/profiles');
  },

  // Obtener perfil completo por ID
  async getProfile(id) {
    return api.get(`/profiles/${id}`);
  },

  // Crear nuevo perfil
  async createProfile(name) {
    return api.post('/profiles', { name });
  },

  // Actualizar nombre del perfil
  async updateProfile(id, name) {
    return api.put(`/profiles/${id}`, { name });
  },

  // Eliminar perfil
  async deleteProfile(id) {
    return api.delete(`/profiles/${id}`);
  },

  // Actualizar info personal
  async updatePersonalInfo(profileId, data) {
    return api.put(`/profiles/${profileId}/personal-info`, data);
  },

  // =============================================
  // EDUCACIÓN
  // =============================================
  async addEducation(profileId, data) {
    return api.post(`/cv/${profileId}/education`, data);
  },

  async updateEducation(profileId, id, data) {
    return api.put(`/cv/${profileId}/education/${id}`, data);
  },

  async deleteEducation(profileId, id) {
    return api.delete(`/cv/${profileId}/education/${id}`);
  },

  // =============================================
  // EXPERIENCIA
  // =============================================
  async addExperience(profileId, data) {
    return api.post(`/cv/${profileId}/experience`, data);
  },

  async updateExperience(profileId, id, data) {
    return api.put(`/cv/${profileId}/experience/${id}`, data);
  },

  async deleteExperience(profileId, id) {
    return api.delete(`/cv/${profileId}/experience/${id}`);
  },

  // =============================================
  // HABILIDADES
  // =============================================
  async addSkill(profileId, name) {
    return api.post(`/cv/${profileId}/skills`, { name });
  },

  async updateSkills(profileId, skills) {
    return api.put(`/cv/${profileId}/skills`, { skills });
  },

  async deleteSkill(profileId, id) {
    return api.delete(`/cv/${profileId}/skills/${id}`);
  },

  // =============================================
  // IDIOMAS
  // =============================================
  async addLanguage(profileId, data) {
    return api.post(`/cv/${profileId}/languages`, data);
  },

  async deleteLanguage(profileId, id) {
    return api.delete(`/cv/${profileId}/languages/${id}`);
  },

  // =============================================
  // CERTIFICACIONES
  // =============================================
  async addCertification(profileId, data) {
    return api.post(`/cv/${profileId}/certifications`, data);
  },

  async updateCertification(profileId, id, data) {
    return api.put(`/cv/${profileId}/certifications/${id}`, data);
  },

  async deleteCertification(profileId, id) {
    return api.delete(`/cv/${profileId}/certifications/${id}`);
  },
};
