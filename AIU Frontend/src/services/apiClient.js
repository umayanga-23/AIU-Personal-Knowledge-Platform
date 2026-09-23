/**
 * @deprecated
 * Legacy apiClient.js has been completely replaced by dedicated Supabase services:
 * - profileService
 * - projectService
 * - researchService
 * - articleService
 * - skillService
 * - educationService
 * - awardService
 * - leadershipService
 * - technologyService
 * - videoService
 * - journeyService
 * - cvService
 * - footerService
 * - themeService
 * - mediaService
 * - authService
 * 
 * In-memory state and localStorage.aiu_platform_store have been eliminated.
 */

export const getStore = () => {
  console.warn('Deprecated: getStore() was called. Use dedicated Supabase services.');
  return {};
};

export const updateStore = () => {
  console.warn('Deprecated: updateStore() was called. Use dedicated Supabase services.');
};

export const apiClient = {
  isAuthenticated: () => false,
  getToken: () => null,
  setToken: () => {},
  get: async () => ({}),
  post: async () => ({}),
  put: async () => ({}),
  delete: async () => ({})
};
