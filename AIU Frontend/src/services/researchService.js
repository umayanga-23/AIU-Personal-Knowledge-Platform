import { supabase } from './supabaseClient';

export const researchService = {
  async getAllPublic() {
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapFromDb);
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Research paper not found');
    return this.mapFromDb(data);
  },

  async getAllAdmin() {
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapFromDb);
  },

  async create(researchData) {
    const id = researchData.id || 'res-' + Date.now();
    const payload = this.mapToDb({ ...researchData, id });

    const { data, error } = await supabase
      .from('research')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapFromDb(data);
  },

  async update(id, researchData) {
    const payload = this.mapToDb(researchData);
    delete payload.id;

    const { data, error } = await supabase
      .from('research')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapFromDb(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('research')
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
      abstract: row.abstract || '',
      publishDate: row.publish_date || '',
      authors: Array.isArray(row.authors) ? row.authors : [row.authors].filter(Boolean),
      publicationInfo: row.publication_info || '',
      documentUrl: row.document_url || '',
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
    if (data.abstract !== undefined) db.abstract = data.abstract;
    if (data.publishDate !== undefined) db.publish_date = data.publishDate;
    if (data.authors !== undefined) db.authors = data.authors;
    if (data.publicationInfo !== undefined) db.publication_info = data.publicationInfo;
    if (data.documentUrl !== undefined) db.document_url = data.documentUrl;
    if (data.tags !== undefined) db.tags = data.tags;
    if (data.status !== undefined) db.status = data.status;
    if (data.featured !== undefined) db.featured = data.featured;
    db.updated_at = new Date().toISOString();
    return db;
  }
};
