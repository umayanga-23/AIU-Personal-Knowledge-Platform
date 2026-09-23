import { supabase } from './supabaseClient';

export const articleService = {
  async getAllPublic() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapFromDb);
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Article not found');
    return this.mapFromDb(data);
  },

  async getAllAdmin() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapFromDb);
  },

  async create(articleData) {
    const id = articleData.id || 'art-' + Date.now();
    const payload = this.mapToDb({ ...articleData, id });

    const { data, error } = await supabase
      .from('articles')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapFromDb(data);
  },

  async update(id, articleData) {
    const payload = this.mapToDb(articleData);
    delete payload.id;

    const { data, error } = await supabase
      .from('articles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapFromDb(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  async togglePublish(id, currentStatus) {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    return this.update(id, { status: newStatus });
  },

  mapFromDb(row) {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt || '',
      content: row.content || '',
      documentUrl: row.document_url || '',
      coverImage: row.cover_image || '',
      readingTime: row.reading_time || '5 min read',
      publishDate: row.publish_date || '',
      technology: row.technology || '',
      tags: Array.isArray(row.tags) ? row.tags : [],
      status: row.status || 'PUBLISHED',
      featured: !!row.featured,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  },

  mapToDb(data) {
    const db = {};
    if (data.id !== undefined) db.id = data.id;
    if (data.title !== undefined) db.title = data.title;
    if (data.slug !== undefined) db.slug = data.slug;
    if (data.excerpt !== undefined) db.excerpt = data.excerpt;
    if (data.content !== undefined) db.content = data.content;
    if (data.documentUrl !== undefined) db.document_url = data.documentUrl;
    if (data.coverImage !== undefined) db.cover_image = data.coverImage;
    if (data.readingTime !== undefined) db.reading_time = data.readingTime;
    if (data.publishDate !== undefined) db.publish_date = data.publishDate;
    if (data.technology !== undefined) db.technology = data.technology;
    if (data.tags !== undefined) db.tags = data.tags;
    if (data.status !== undefined) db.status = data.status;
    if (data.featured !== undefined) db.featured = data.featured;
    db.updated_at = new Date().toISOString();
    return db;
  }
};
