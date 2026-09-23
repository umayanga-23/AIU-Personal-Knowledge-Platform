import { supabase } from './supabaseClient';

export const leadershipService = {
  async getAll() {
    const { data, error } = await supabase
      .from('leadership')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async create(leadData) {
    const id = leadData.id || 'lead-' + Date.now();
    const { data, error } = await supabase
      .from('leadership')
      .insert({
        id,
        title: leadData.title,
        organization: leadData.organization,
        year: leadData.year,
        description: leadData.description,
        order_index: leadData.orderIndex || 0,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, leadData) {
    const { data, error } = await supabase
      .from('leadership')
      .update({
        title: leadData.title,
        organization: leadData.organization,
        year: leadData.year,
        description: leadData.description,
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
      .from('leadership')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }
};
