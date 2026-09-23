import { supabase } from './supabaseClient';

export const educationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async create(eduData) {
    const id = eduData.id || 'edu-' + Date.now();
    const { data, error } = await supabase
      .from('education')
      .insert({
        id,
        degree: eduData.degree,
        institution: eduData.institution,
        year: eduData.year,
        location: eduData.location,
        details: eduData.details,
        order_index: eduData.orderIndex || 0,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, eduData) {
    const { data, error } = await supabase
      .from('education')
      .update({
        degree: eduData.degree,
        institution: eduData.institution,
        year: eduData.year,
        location: eduData.location,
        details: eduData.details,
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
      .from('education')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }
};
