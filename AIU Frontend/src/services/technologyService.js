import { supabase } from './supabaseClient';

export const technologyService = {
  async getAllPublic() {
    const { data, error } = await supabase
      .from('technologies')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('technologies')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Technology not found');
    return data;
  },

  async getAllAdmin() {
    return this.getAllPublic();
  },

  async create(techData) {
    const id = techData.id || techData.slug || 'tech-' + Date.now();
    const { data, error } = await supabase
      .from('technologies')
      .insert({
        id,
        name: techData.name,
        slug: techData.slug || id,
        category: techData.category || 'Programming',
        icon: techData.icon || 'Code2',
        website: techData.website || '',
        description: techData.description || '',
        status: techData.status || 'PRODUCTION',
        featured: techData.featured !== undefined ? techData.featured : true,
        order_index: techData.orderIndex || 0,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, techData) {
    const { data, error } = await supabase
      .from('technologies')
      .update({
        name: techData.name,
        slug: techData.slug,
        category: techData.category,
        icon: techData.icon,
        website: techData.website,
        description: techData.description,
        status: techData.status,
        featured: techData.featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('technologies')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }
};
