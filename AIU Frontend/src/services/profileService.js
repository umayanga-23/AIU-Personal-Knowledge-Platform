import { supabase } from './supabaseClient';

export const profileService = {
  // Alias for getProfile()
  async get() {
    return this.getProfile();
  },

  // Alias for updateProfile()
  async update(profileData) {
    return this.updateProfile(profileData);
  },

  async getProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      role: data.role,
      tagline: data.tagline || '',
      heroDescription: data.hero_description || '',
      bio: data.bio || '',
      email: data.email || '',
      phone: data.phone || '',
      location: data.location || '',
      github: data.github || '',
      linkedin: data.linkedin || '',
      youtube: data.youtube || '',
      twitter: data.twitter || '',
      profileImage: data.profile_image || '/induwara-profile.png',
      currentFocus: data.current_focus || '',
      direction: data.direction || ''
    };
  },

  async updateProfile(profileData) {
    const payload = {
      name: profileData.name,
      role: profileData.role,
      tagline: profileData.tagline,
      hero_description: profileData.heroDescription,
      bio: profileData.bio,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      github: profileData.github,
      linkedin: profileData.linkedin,
      youtube: profileData.youtube,
      twitter: profileData.twitter,
      profile_image: profileData.profileImage,
      current_focus: profileData.currentFocus,
      direction: profileData.direction,
      updated_at: new Date().toISOString()
    };

    // Check if a profile row exists
    const existing = await this.getProfile();
    let res;
    if (existing?.id) {
      res = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      res = await supabase
        .from('profiles')
        .insert(payload)
        .select()
        .single();
    }

    if (res.error) throw new Error(res.error.message);
    return res.data;
  }
};
