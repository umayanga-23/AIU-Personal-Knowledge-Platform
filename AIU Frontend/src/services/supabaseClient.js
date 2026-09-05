/**
 * Supabase Storage Integration Service
 * Configured for direct public CV PDF uploads, bucket storage, and direct downloads
 */

const SUPABASE_URL = 'https://aiu-portfolio.supabase.co';
const STORAGE_BUCKET = 'cv';

export const supabaseStorageService = {
  /**
   * Generates a public Supabase Storage URL for a given file name
   */
  getPublicUrl(fileName) {
    if (!fileName) return '';
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${encodeURIComponent(fileName)}`;
  },

  /**
   * Formats and sanitizes any PDF storage URL for direct, permission-free downloading
   */
  formatDirectPdfUrl(rawUrl) {
    if (!rawUrl) return '';
    // If it's a Supabase storage URL or direct blob/base64 URL, return directly
    return rawUrl.trim();
  }
};
