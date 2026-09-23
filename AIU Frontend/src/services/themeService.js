import { supabase } from './supabaseClient';

export const themeService = {
  async getTheme() {
    const { data, error } = await supabase
      .from('site_theme')
      .select('*')
      .eq('id', 'current')
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return { themeId: 'obsidian-neon', fontPresetId: 'developer', appearance: 'dark' };

    return {
      themeId: data.theme_id || 'obsidian-neon',
      fontPresetId: data.font_preset_id || 'developer',
      appearance: data.appearance || 'dark',
      updatedAt: data.updated_at
    };
  },

  async updateTheme(themeData) {
    const payload = {
      id: 'current',
      theme_id: themeData.themeId,
      font_preset_id: themeData.fontPresetId,
      appearance: themeData.appearance || 'dark',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('site_theme')
      .upsert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
