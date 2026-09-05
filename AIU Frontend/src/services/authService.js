import { apiClient } from './apiClient';

export const authService = {
  async login(username, password) {
    const res = await apiClient.post('/admin/auth/login', { username, password });
    if (res.token) {
      apiClient.setToken(res.token);
      localStorage.setItem('aiu_admin_user', JSON.stringify(res.user));
    }
    return res;
  },

  logout() {
    apiClient.setToken(null);
    localStorage.removeItem('aiu_admin_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('aiu_admin_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    return !!apiClient.getToken();
  }
};
