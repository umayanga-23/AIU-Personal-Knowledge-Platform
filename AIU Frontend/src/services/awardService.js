import { supabase } from './supabaseClient';

export const awardService = {
  async getAll() {
    const { data, error } = await supabase
      .from('awards')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      issuer: row.issuer,
      year: row.year,
      imageUrl: row.image_url || '',
      credentialUrl: row.credential_url || '',
      orderIndex: row.order_index
    }));
  },

  async create(awardData) {
    const id = awardData.id || 'award-' + Date.now();
    const { data, error } = await supabase
      .from('awards')
      .insert({
        id,
        title: awardData.title,
        issuer: awardData.issuer,
        year: awardData.year,
        image_url: awardData.imageUrl || '',
        credential_url: awardData.credentialUrl || '',
        order_index: awardData.orderIndex || 0,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, awardData) {
    const { data, error } = await supabase
      .from('awards')
      .update({
        title: awardData.title,
        issuer: awardData.issuer,
        year: awardData.year,
        image_url: awardData.imageUrl,
        credential_url: awardData.credentialUrl,
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
      .from('awards')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }
};
