import { apiClient } from './apiClient';

export const projectService = {
  getAllPublic() {
    return apiClient.get('/public/projects');
  },
  
  getBySlug(slug) {
    return apiClient.get(`/public/projects/${slug}`);
  },

  getAllAdmin() {
    return apiClient.get('/admin/projects');
  },

  create(projectData) {
    return apiClient.post('/admin/projects', projectData);
  },

  update(id, projectData) {
    return apiClient.put(`/admin/projects/${id}`, projectData);
  },

  delete(id) {
    return apiClient.delete(`/admin/projects/${id}`);
  },

  togglePublish(id, currentStatus) {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    return apiClient.put(`/admin/projects/${id}`, { status: newStatus });
  }
};
