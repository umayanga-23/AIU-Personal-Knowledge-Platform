import { supabase } from './supabaseClient';

export const footerService = {
  async get() {
    return this.getFooter();
  },

  async update(footerData) {
    return this.updateFooter(footerData);
  },

  async getFooter() {
    const { data, error } = await supabase
      .from('site_footer')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      id: data.id,
      brandName: data.brand_name || 'Induwara Umayanga Alukirthi',
      tagline: data.tagline || '',
      statusText: data.status_text || 'All systems operational',
      statusType: data.status_type || 'OPERATIONAL',
      copyrightText: data.copyright_text || '© 2026 Induwara Umayanga Alukirthi. All rights reserved.',
      githubUrl: data.github_url || 'https://github.com/umayanga-23',
      linkedinUrl: data.linkedin_url || 'https://www.linkedin.com/in/induwara-umayanga',
      youtubeUrl: data.youtube_url || 'https://youtube.com',
      twitterUrl: data.twitter_url || 'https://twitter.com'
    };
  },

  async updateFooter(footerData) {
    const payload = {
      brand_name: footerData.brandName,
      tagline: footerData.tagline,
      status_text: footerData.statusText,
      status_type: footerData.statusType,
      copyright_text: footerData.copyrightText,
      github_url: footerData.githubUrl,
      linkedin_url: footerData.linkedinUrl,
      youtube_url: footerData.youtubeUrl,
      twitter_url: footerData.twitterUrl,
      updated_at: new Date().toISOString()
    };

    const existing = await this.getFooter();
    let res;
    if (existing?.id) {
      res = await supabase
        .from('site_footer')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      res = await supabase
        .from('site_footer')
        .insert(payload)
        .select()
        .single();
    }

    if (res.error) throw new Error(res.error.message);
    return res.data;
  }
};
