import { supabase } from './supabaseClient';

export const videoService = {
  async getAllPublic() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapFromDb);
  },

  async getAllAdmin() {
    return this.getAllPublic();
  },

  async create(videoData) {
    const id = videoData.id || 'vid-' + Date.now();
    const payload = this.mapToDb({ ...videoData, id });

    const { data, error } = await supabase
      .from('videos')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapFromDb(data);
  },

  async update(id, videoData) {
    const payload = this.mapToDb(videoData);
    delete payload.id;

    const { data, error } = await supabase
      .from('videos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapFromDb(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  mapFromDb(row) {
    return {
      id: row.id,
      title: row.title,
      youtubeId: row.youtube_id || '',
      youtubeUrl: row.youtube_url || (row.youtube_id ? `https://www.youtube.com/watch?v=${row.youtube_id}` : ''),
      description: row.description || '',
      publishDate: row.publish_date || '',
      relatedProject: row.related_project || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  },

  mapToDb(data) {
    let ytId = data.youtubeId || '';
    if (!ytId && data.youtubeUrl) {
      const match = data.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) ytId = match[1];
    }

    return {
      id: data.id,
      title: data.title,
      youtube_id: ytId,
      youtube_url: data.youtubeUrl,
      description: data.description,
      publish_date: data.publishDate,
      related_project: data.relatedProject,
      updated_at: new Date().toISOString()
    };
  }
};
