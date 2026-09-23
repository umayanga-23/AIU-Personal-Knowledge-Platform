import { supabase } from './supabaseClient';

export const ADMIN_EMAIL = 'induwaraumayangaz04@gmail.com';

let cachedSession = null;
let isInitialized = false;

// Initialize session cache
supabase.auth.getSession().then(({ data: { session } }) => {
  cachedSession = session;
  isInitialized = true;
});

supabase.auth.onAuthStateChange((_event, session) => {
  cachedSession = session;
  isInitialized = true;
});

export const authService = {
  ADMIN_EMAIL,

  /**
   * Real Supabase password login for admin/owner
   */
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    if (error) {
      throw new Error(error.message || 'Invalid administrative credentials.');
    }

    cachedSession = data.session;
    return {
      success: true,
      user: data.user,
      session: data.session
    };
  },

  /**
   * Log out and clear Supabase session
   */
  async logout() {
    cachedSession = null;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Supabase logout error:', error);
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Get active session (async)
   */
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    cachedSession = session;
    return session;
  },

  /**
   * Synchronous session check from memory cache
   */
  getCachedSession() {
    return cachedSession;
  },

  /**
   * Check if user is currently the authorized admin
   */
  async isAuthorizedAdmin() {
    const session = await this.getSession();
    if (!session || !session.user) return false;
    return session.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  },

  /**
   * Check if cached user is the authorized admin (sync)
   */
  isAuthorizedAdminSync() {
    if (!cachedSession || !cachedSession.user) return false;
    return cachedSession.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  },

  /**
   * Listen to auth state transitions
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      cachedSession = session;
      callback(event, session);
    });
  },

  /**
   * Subscribe helper returning unsubscribe function
   */
  subscribe(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      cachedSession = session;
      callback(session?.user || null);
    });
    return () => subscription?.unsubscribe();
  }
};
