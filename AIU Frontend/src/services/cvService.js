import { supabase } from './supabaseClient';
import { mediaService } from './mediaService';

export const cvService = {
  async getPublicCv() {
    const { data, error } = await supabase
      .from('cv_documents')
      .select('*')
      .eq('is_current', true)
      .eq('status', 'PUBLISHED')
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    return this.mapFromDb(data);
  },

  async getAdminCv() {
    const { data, error } = await supabase
      .from('cv_documents')
      .select('*')
      .eq('is_current', true)
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    return this.mapFromDb(data);
  },

  async updateCvMetadata(metadata) {
    const payload = {
      version: metadata.version,
      summary: metadata.summary,
      status: metadata.status || 'PUBLISHED',
      file_name: metadata.fileName,
      file_url: metadata.fileUrl,
      last_updated: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    };

    const current = await this.getAdminCv();
    let res;
    if (current?.id) {
      res = await supabase
        .from('cv_documents')
        .update(payload)
        .eq('id', current.id)
        .select()
        .single();
    } else {
      res = await supabase
        .from('cv_documents')
        .insert({
          id: 'cv-' + Date.now(),
          ...payload,
          is_current: true
        })
        .select()
        .single();
    }

    if (res.error) throw new Error(res.error.message);
    return this.mapFromDb(res.data);
  },

  async uploadAndPublishCv(file, metadata = {}) {
    if (!file) throw new Error('No PDF file provided for upload.');

    // 1. Upload to Supabase Storage 'cv' bucket
    const { publicUrl, storagePath } = await mediaService.uploadFile('cv', file, 'releases');

    // 2. Format file size
    const sizeInKb = (file.size / 1024).toFixed(0);
    const fileSizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    // 3. Mark existing CVs as not current
    await supabase.from('cv_documents').update({ is_current: false }).eq('is_current', true);

    // 4. Insert new current CV document record
    const newId = 'cv-' + Date.now();
    const { data, error } = await supabase
      .from('cv_documents')
      .insert({
        id: newId,
        file_name: file.name,
        version: metadata.version || 'v2.6',
        last_updated: new Date().toISOString().split('T')[0],
        status: metadata.status || 'PUBLISHED',
        file_url: publicUrl,
        file_size: fileSizeStr,
        summary: metadata.summary || 'Induwara Umayanga Alukirthi CV - IT Undergraduate at University of Moratuwa',
        is_current: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapFromDb(data);
  },

  mapFromDb(row) {
    return {
      id: row.id,
      fileName: row.file_name,
      version: row.version,
      lastUpdated: row.last_updated,
      status: row.status,
      fileUrl: row.file_url,
      downloadUrl: row.file_url,
      fileSize: row.file_size || '250 KB',
      summary: row.summary || ''
    };
  }
};
