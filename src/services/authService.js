import { api } from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    if (response.token) {
      api.setToken(response.token);
    }
    return response;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      api.setToken(response.token);
    }
    return response;
  },

  async me() {
    return api.get('/auth/me');
  },

  async changePassword(currentPassword, newPassword) {
    return api.put('/auth/change-password', { currentPassword, newPassword });
  },

  logout() {
    api.removeToken();
  },

  isAuthenticated() {
    return !!api.getToken();
  },
};
