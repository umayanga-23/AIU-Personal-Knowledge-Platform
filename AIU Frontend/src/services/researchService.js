import { apiClient } from './apiClient';

export const researchService = {
  getAllPublic() {
    return apiClient.get('/public/research');
  },
  
  getBySlug(slug) {
    return apiClient.get(`/public/research/${slug}`);
  },

  getAllAdmin() {
    return apiClient.get('/admin/research');
  },

  create(data) {
    return apiClient.post('/admin/research', data);
  },

  update(id, data) {
    return apiClient.put(`/admin/research/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/admin/research/${id}`);
  },

  togglePublish(id, currentStatus) {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    return apiClient.put(`/admin/research/${id}`, { status: newStatus });
  }
};
