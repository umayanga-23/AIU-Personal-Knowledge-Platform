import { apiClient } from './apiClient';

export const videoService = {
  extractYouTubeId(url) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  },

  getAllPublic() {
    return apiClient.get('/public/videos');
  },

  getAllAdmin() {
    return apiClient.get('/admin/videos');
  },

  create(data) {
    const formatted = {
      ...data,
      youtubeId: this.extractYouTubeId(data.youtubeUrl || data.youtubeId)
    };
    return apiClient.post('/admin/videos', formatted);
  },

  update(id, data) {
    const formatted = {
      ...data,
      youtubeId: this.extractYouTubeId(data.youtubeUrl || data.youtubeId)
    };
    return apiClient.put(`/admin/videos/${id}`, formatted);
  },

  delete(id) {
    return apiClient.delete(`/admin/videos/${id}`);
  }
};
