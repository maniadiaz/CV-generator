import api from './axios';
import type { CVProfile, ApiResponse } from '@app-types/index';

export const profileService = {
  // Get all profiles for current user
  getProfiles: async (): Promise<CVProfile[]> => {
    const response = await api.get<ApiResponse<CVProfile[]>>('/api/profiles');
    return response.data.data;
  },

  // Get single profile by ID
  getProfileById: async (id: string): Promise<CVProfile> => {
    const response = await api.get<ApiResponse<CVProfile>>(`/api/profiles/${id}`);
    return response.data.data;
  },

  // Create new profile
  createProfile: async (profile: Partial<CVProfile>): Promise<CVProfile> => {
    const response = await api.post<ApiResponse<CVProfile>>('/api/profiles', profile);
    return response.data.data;
  },

  // Update existing profile
  updateProfile: async (id: string, profile: Partial<CVProfile>): Promise<CVProfile> => {
    const response = await api.put<ApiResponse<CVProfile>>(`/api/profiles/${id}`, profile);
    return response.data.data;
  },

  // Delete profile
  deleteProfile: async (id: string): Promise<void> => {
    await api.delete(`/api/profiles/${id}`);
  },

  // Export profile to PDF
  exportToPDF: async (id: string): Promise<Blob> => {
    const response = await api.get(`/api/profiles/${id}/export/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Export profile to Word
  exportToWord: async (id: string): Promise<Blob> => {
    const response = await api.get(`/api/profiles/${id}/export/word`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
