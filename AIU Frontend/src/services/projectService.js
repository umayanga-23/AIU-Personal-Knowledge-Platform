import { supabase } from './supabaseClient';

export const projectService = {
  async getAllPublic() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapFromDb);
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Project not found');
    return this.mapFromDb(data);
  },

  async getAllAdmin() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapFromDb);
  },

  async create(projectData) {
    const id = projectData.id || 'proj-' + Date.now();
    const payload = this.mapToDb({ ...projectData, id });

    const { data, error } = await supabase
      .from('projects')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapFromDb(data);
  },

  async update(id, projectData) {
    const payload = this.mapToDb(projectData);
    delete payload.id; // Don't overwrite id

    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapFromDb(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('projects')
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
      shortDescription: row.short_description || '',
      problem: row.problem || '',
      solution: row.solution || '',
      features: Array.isArray(row.features) ? row.features : [],
      myContribution: row.my_contribution || '',
      technologies: Array.isArray(row.technologies) ? row.technologies : [],
      status: row.status || 'PUBLISHED',
      featured: !!row.featured,
      thumbnail: row.thumbnail || '',
      videoId: row.video_id || '',
      githubUrl: row.github_url || '',
      liveUrl: row.live_url || '',
      relatedResearch: Array.isArray(row.related_research) ? row.related_research : [],
      relatedArticles: Array.isArray(row.related_articles) ? row.related_articles : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  },

  mapToDb(data) {
    const db = {};
    if (data.id !== undefined) db.id = data.id;
    if (data.title !== undefined) db.title = data.title;
    if (data.slug !== undefined) db.slug = data.slug;
    if (data.shortDescription !== undefined) db.short_description = data.shortDescription;
    if (data.problem !== undefined) db.problem = data.problem;
    if (data.solution !== undefined) db.solution = data.solution;
    if (data.features !== undefined) db.features = data.features;
    if (data.myContribution !== undefined) db.my_contribution = data.myContribution;
    if (data.technologies !== undefined) db.technologies = data.technologies;
    if (data.status !== undefined) db.status = data.status;
    if (data.featured !== undefined) db.featured = data.featured;
    if (data.thumbnail !== undefined) db.thumbnail = data.thumbnail;
    if (data.videoId !== undefined) db.video_id = data.videoId;
    if (data.githubUrl !== undefined) db.github_url = data.githubUrl;
    if (data.liveUrl !== undefined) db.live_url = data.liveUrl;
    if (data.relatedResearch !== undefined) db.related_research = data.relatedResearch;
    if (data.relatedArticles !== undefined) db.related_articles = data.relatedArticles;
    db.updated_at = new Date().toISOString();
    return db;
  }
};
