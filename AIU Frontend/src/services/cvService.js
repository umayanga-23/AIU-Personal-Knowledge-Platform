import { apiClient } from './apiClient';

export const cvService = {
  getCurrentPublic() {
    return apiClient.get('/public/cv/current');
  },

  getAdminCv() {
    return apiClient.get('/admin/cv');
  },

  uploadNewCv(fileData) {
    // API endpoint enforcing single current active CV
    return apiClient.post('/admin/cv/upload', fileData);
  },

  updateCvMetadata(data) {
    return apiClient.put('/admin/cv', data);
  }
};
