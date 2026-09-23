import { supabase } from './supabaseClient';

export const mediaService = {
  /**
   * Uploads a binary file to a designated Supabase Storage bucket.
   * Returns { storagePath, publicUrl }.
   */
  async uploadFile(bucket, file, folder = '') {
    if (!file) throw new Error('No file provided for upload.');

    // 1. Sanitize file extension and name
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const storagePath = folder ? `${folder}/${cleanFileName}` : cleanFileName;

    // 2. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw new Error(`Storage upload error (${bucket}): ${error.message}`);
    }

    // 3. Resolve public CDN URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    return {
      storagePath,
      publicUrl
    };
  },

  /**
   * Deletes a file from Supabase Storage by path.
   */
  async deleteFile(bucket, storagePath) {
    if (!storagePath) return;
    const { error } = await supabase.storage.from(bucket).remove([storagePath]);
    if (error) {
      console.warn(`Storage delete error (${bucket}/${storagePath}):`, error.message);
    }
  },

  /**
   * Retrieves the public URL for a given path in a bucket.
   */
  getPublicUrl(bucket, storagePath) {
    if (!storagePath) return '';
    if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
      return storagePath;
    }
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);
    return publicUrl;
  }
};
