import { apiClient } from './apiClient';

export const journeyService = {
  getAllPublic() {
    return apiClient.get('/public/journey');
  },

  getAllAdmin() {
    return apiClient.get('/admin/journey');
  },

  create(data) {
    return apiClient.post('/admin/journey', data);
  },

  update(id, data) {
    return apiClient.put(`/admin/journey/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/admin/journey/${id}`);
  }
};
