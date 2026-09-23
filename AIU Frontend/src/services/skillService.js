import { supabase } from './supabaseClient';

export const skillService = {
  async getAll() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map(row => ({
      id: row.id,
      category: row.category,
      icon: row.icon || 'Code2',
      items: Array.isArray(row.items) ? row.items : []
    }));
  },

  async create(skillCategory) {
    const id = skillCategory.id || 'skill-' + Date.now();
    const { data, error } = await supabase
      .from('skills')
      .insert({
        id,
        category: skillCategory.category,
        icon: skillCategory.icon || 'Code2',
        items: skillCategory.items || [],
        order_index: skillCategory.orderIndex || 0,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, skillCategory) {
    const { data, error } = await supabase
      .from('skills')
      .update({
        category: skillCategory.category,
        icon: skillCategory.icon,
        items: skillCategory.items,
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
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  async saveAll(skillsList) {
    for (let i = 0; i < skillsList.length; i++) {
      const s = skillsList[i];
      const id = s.id || ('skill-' + (i + 1));
      const { error } = await supabase.from('skills').upsert({
        id,
        category: s.category,
        icon: s.icon || 'Code2',
        items: s.items || [],
        order_index: i,
        updated_at: new Date().toISOString()
      });
      if (error) throw new Error(error.message);
    }
    const currentIds = skillsList.map((s, i) => s.id || ('skill-' + (i + 1)));
    const { data: existing } = await supabase.from('skills').select('id');
    if (existing) {
      const toDelete = existing.filter(e => !currentIds.includes(e.id)).map(e => e.id);
      if (toDelete.length > 0) {
        await supabase.from('skills').delete().in('id', toDelete);
      }
    }
    return true;
  }
};
