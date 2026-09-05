import { apiClient } from './apiClient';

export const articleService = {
  getAllPublic() {
    return apiClient.get('/public/articles');
  },
  
  getBySlug(slug) {
    return apiClient.get(`/public/articles/${slug}`);
  },

  getAllAdmin() {
    return apiClient.get('/admin/articles');
  },

  create(data) {
    return apiClient.post('/admin/articles', data);
  },

  update(id, data) {
    return apiClient.put(`/admin/articles/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/admin/articles/${id}`);
  },

  togglePublish(id, currentStatus) {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    return apiClient.put(`/admin/articles/${id}`, { status: newStatus });
  }
};
