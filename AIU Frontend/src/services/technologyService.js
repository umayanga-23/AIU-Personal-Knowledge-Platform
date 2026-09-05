import { apiClient } from './apiClient';

export const technologyService = {
  getAllPublic() {
    return apiClient.get('/public/technologies');
  },

  getBySlug(slug) {
    return apiClient.get(`/public/technologies/${slug}`);
  },

  getAllAdmin() {
    return apiClient.get('/admin/technologies');
  },

  create(data) {
    return apiClient.post('/admin/technologies', data);
  },

  update(id, data) {
    return apiClient.put(`/admin/technologies/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/admin/technologies/${id}`);
  }
};
