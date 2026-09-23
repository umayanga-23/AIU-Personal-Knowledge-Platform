import { supabase } from './supabaseClient';

export const journeyService = {
  async getAll() {
    return this.getAllPublic();
  },

  async getAllPublic() {
    const { data, error } = await supabase
      .from('learning_journey')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapFromDb);
  },

  async getAllAdmin() {
    return this.getAllPublic();
  },

  async create(journeyData) {
    const id = journeyData.id || 'jrn-' + Date.now();
    const payload = this.mapToDb({ ...journeyData, id });

    const { data, error } = await supabase
      .from('learning_journey')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapFromDb(data);
  },

  async update(id, journeyData) {
    const payload = this.mapToDb(journeyData);
    delete payload.id;

    const { data, error } = await supabase
      .from('learning_journey')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapFromDb(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('learning_journey')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  mapFromDb(row) {
    return {
      id: row.id,
      date: row.date_range,
      title: row.title,
      learned: row.learned || '',
      built: row.built || '',
      technologies: Array.isArray(row.technologies) ? row.technologies : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  },

  mapToDb(data) {
    return {
      id: data.id,
      date_range: data.date,
      title: data.title,
      learned: data.learned,
      built: data.built,
      technologies: data.technologies || [],
      updated_at: new Date().toISOString()
    };
  }
};
