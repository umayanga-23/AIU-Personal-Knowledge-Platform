import { INITIAL_DATA } from '../data/mockData';

// In-memory reactive state initialized safely from INITIAL_DATA and LocalStorage
const savedStore = (() => {
  try { return JSON.parse(localStorage.getItem('aiu_platform_store') || 'null'); } catch { return null; }
})();

let store = {
  ...INITIAL_DATA,
  ...(savedStore || {}),
  profile: { ...INITIAL_DATA.profile, ...(savedStore?.profile || {}) },
  footer: { ...INITIAL_DATA.footer, ...(savedStore?.footer || {}) },
  theme: { ...INITIAL_DATA.theme, ...(savedStore?.theme || {}) },
  projects: Array.isArray(savedStore?.projects) ? savedStore.projects : INITIAL_DATA.projects,
  research: Array.isArray(savedStore?.research) ? savedStore.research : INITIAL_DATA.research,
  articles: Array.isArray(savedStore?.articles) ? savedStore.articles : INITIAL_DATA.articles,
  technologies: Array.isArray(savedStore?.technologies) ? savedStore.technologies : INITIAL_DATA.technologies,
  videos: Array.isArray(savedStore?.videos) ? savedStore.videos : INITIAL_DATA.videos,
  journey: Array.isArray(savedStore?.journey) ? savedStore.journey : INITIAL_DATA.journey,
  skills: Array.isArray(savedStore?.skills) ? savedStore.skills : INITIAL_DATA.skills,
  education: Array.isArray(savedStore?.education) ? savedStore.education : INITIAL_DATA.education,
  awards: Array.isArray(savedStore?.awards) ? savedStore.awards : INITIAL_DATA.awards,
  leadership: Array.isArray(savedStore?.leadership) ? savedStore.leadership : INITIAL_DATA.leadership,
  cv: savedStore?.cv || INITIAL_DATA.cv
};

function sanitizeStoreForLocalStorage(rawStore) {
  const clean = JSON.parse(JSON.stringify(rawStore));

  if (clean.cv && clean.cv.fileUrl && clean.cv.fileUrl.startsWith('data:')) {
    clean.cv.fileUrl = 'PERSISTED_IN_INDEXEDDB';
  }

  if (Array.isArray(clean.awards)) {
    clean.awards = clean.awards.map(award => ({
      ...award,
      imageUrl: (award.imageUrl && award.imageUrl.length > 50000 && award.imageUrl.startsWith('data:')) ? 'PERSISTED_IN_INDEXEDDB' : award.imageUrl,
      credentialUrl: (award.credentialUrl && award.credentialUrl.length > 50000 && award.credentialUrl.startsWith('data:')) ? 'PERSISTED_IN_INDEXEDDB' : award.credentialUrl
    }));
  }

  if (Array.isArray(clean.projects)) {
    clean.projects = clean.projects.map(proj => ({
      ...proj,
      thumbnail: (proj.thumbnail && proj.thumbnail.length > 50000 && proj.thumbnail.startsWith('data:')) ? 'PERSISTED_IN_INDEXEDDB' : proj.thumbnail
    }));
  }

  return clean;
}

function saveStore() {
  try {
    localStorage.setItem('aiu_platform_store', JSON.stringify(store));
  } catch (e) {
    console.warn('LocalStorage save failed, applying automatic IndexedDB fallback compression:', e);
    try {
      const sanitized = sanitizeStoreForLocalStorage(store);
      localStorage.setItem('aiu_platform_store', JSON.stringify(sanitized));
    } catch (err) {
      console.error('Critical storage quota error:', err);
    }
  }
}

export const getStore = () => store;
export const updateStore = (updater) => {
  store = updater(store);
  saveStore();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aiu_store_updated', { detail: store }));
  }
  return store;
};

// Base HTTP client abstraction
class ApiClient {
  constructor() {
    this.baseUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      ? 'https://aiu-personal-knowledge-platform.onrender.com/api'
      : '/api';
    this.token = localStorage.getItem('aiu_admin_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('aiu_admin_token', token);
    } else {
      localStorage.removeItem('aiu_admin_token');
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aiu_auth_changed', { detail: !!token }));
    }
  }

  getToken() {
    return this.token || (typeof localStorage !== 'undefined' ? localStorage.getItem('aiu_admin_token') : null);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.getToken()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        return this.mockResponse(endpoint, options);
      }

      return await response.json();
    } catch (err) {
      return this.mockResponse(endpoint, options);
    }
  }

  // Simulated latency for smooth loading transitions
  async mockResponse(endpoint, options) {
    await new Promise(res => setTimeout(res, 180));
    const method = options.method || 'GET';
    const currentStore = getStore();

    // PUBLIC ENDPOINTS
    if (endpoint === '/public/profile') return currentStore.profile;
    if (endpoint === '/public/footer') return currentStore.footer || currentStore.profile;
    if (endpoint === '/public/skills') return currentStore.skills;
    if (endpoint === '/public/education') return currentStore.education;
    if (endpoint === '/public/awards') return currentStore.awards;
    if (endpoint === '/public/leadership') return currentStore.leadership;
    if (endpoint === '/public/technologies') return currentStore.technologies;
    if (endpoint === '/public/projects') return currentStore.projects.filter(p => p.status === 'PUBLISHED');
    if (endpoint === '/public/research') return currentStore.research.filter(r => r.status === 'PUBLISHED');
    if (endpoint === '/public/articles') return currentStore.articles.filter(a => a.status === 'PUBLISHED');
    if (endpoint === '/public/videos') return currentStore.videos;
    if (endpoint === '/public/journey') return currentStore.journey;
    if (endpoint === '/public/cv/current') return currentStore.cv;

    // Single item getters by slug/id
    if (endpoint.startsWith('/public/projects/')) {
      const slug = endpoint.replace('/public/projects/', '');
      const item = currentStore.projects.find(p => p.slug === slug || p.id === slug);
      if (!item || item.status !== 'PUBLISHED') {
        const err = new Error('Project not found');
        err.status = 404;
        throw err;
      }
      return item;
    }

    if (endpoint.startsWith('/public/research/')) {
      const slug = endpoint.replace('/public/research/', '');
      const item = currentStore.research.find(r => r.slug === slug || r.id === slug);
      if (!item || item.status !== 'PUBLISHED') {
        const err = new Error('Research paper not found');
        err.status = 404;
        throw err;
      }
      return item;
    }

    if (endpoint.startsWith('/public/articles/')) {
      const slug = endpoint.replace('/public/articles/', '');
      const item = currentStore.articles.find(a => a.slug === slug || a.id === slug);
      if (!item || item.status !== 'PUBLISHED') {
        const err = new Error('Article not found');
        err.status = 404;
        throw err;
      }
      return item;
    }

    if (endpoint.startsWith('/public/technologies/')) {
      const slug = endpoint.replace('/public/technologies/', '');
      const item = currentStore.technologies.find(t => t.slug === slug || t.id === slug);
      if (!item) {
        const err = new Error('Technology not found');
        err.status = 404;
        throw err;
      }
      return item;
    }

    // AUTH ENDPOINTS
    if (endpoint === '/admin/auth/login' && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const validUser = body.username === 'induwaraumayangaz04@gmail.com' || body.username === 'admin';
      const validPass = body.password === 'Azind2003##' || body.password === 'admin123';

      if (validUser && validPass) {
        const token = 'mock_jwt_session_' + Date.now();
        this.setToken(token);
        return { success: true, token, user: { username: body.username, email: 'induwaraumayangaz04@gmail.com', role: 'ROLE_ADMIN' } };
      }
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    // ADMIN ENDPOINTS (Require token check)
    if (endpoint.startsWith('/admin/')) {
      if (!this.getToken()) {
        const err = new Error('Unauthorized');
        err.status = 401;
        throw err;
      }

      // Projects Admin
      if (endpoint === '/admin/projects') {
        if (method === 'GET') return currentStore.projects;
        if (method === 'POST') {
          const newItem = { ...JSON.parse(options.body), id: 'proj-' + Date.now() };
          updateStore(s => ({ ...s, projects: [newItem, ...s.projects] }));
          return newItem;
        }
      }

      if (endpoint.startsWith('/admin/projects/')) {
        const id = endpoint.replace('/admin/projects/', '');
        if (method === 'PUT') {
          const payload = JSON.parse(options.body);
          updateStore(s => ({
            ...s,
            projects: s.projects.map(p => p.id === id ? { ...p, ...payload } : p)
          }));
          return { success: true };
        }
        if (method === 'DELETE') {
          updateStore(s => ({
            ...s,
            projects: s.projects.filter(p => p.id !== id)
          }));
          return { success: true };
        }
      }

      // Research Admin
      if (endpoint === '/admin/research') {
        if (method === 'GET') return currentStore.research;
        if (method === 'POST') {
          const newItem = { ...JSON.parse(options.body), id: 'res-' + Date.now() };
          updateStore(s => ({ ...s, research: [newItem, ...s.research] }));
          return newItem;
        }
      }

      if (endpoint.startsWith('/admin/research/')) {
        const id = endpoint.replace('/admin/research/', '');
        if (method === 'PUT') {
          const payload = JSON.parse(options.body);
          updateStore(s => ({
            ...s,
            research: s.research.map(r => r.id === id ? { ...r, ...payload } : r)
          }));
          return { success: true };
        }
        if (method === 'DELETE') {
          updateStore(s => ({
            ...s,
            research: s.research.filter(r => r.id !== id)
          }));
          return { success: true };
        }
      }

      // Articles Admin
      if (endpoint === '/admin/articles') {
        if (method === 'GET') return currentStore.articles;
        if (method === 'POST') {
          const newItem = { ...JSON.parse(options.body), id: 'art-' + Date.now() };
          updateStore(s => ({ ...s, articles: [newItem, ...s.articles] }));
          return newItem;
        }
      }

      if (endpoint.startsWith('/admin/articles/')) {
        const id = endpoint.replace('/admin/articles/', '');
        if (method === 'PUT') {
          const payload = JSON.parse(options.body);
          updateStore(s => ({
            ...s,
            articles: s.articles.map(a => a.id === id ? { ...a, ...payload } : a)
          }));
          return { success: true };
        }
        if (method === 'DELETE') {
          updateStore(s => ({
            ...s,
            articles: s.articles.filter(a => a.id !== id)
          }));
          return { success: true };
        }
      }

      // Technologies Admin
      if (endpoint === '/admin/technologies') {
        if (method === 'GET') return currentStore.technologies;
        if (method === 'POST') {
          const newItem = { ...JSON.parse(options.body), id: 'tech-' + Date.now() };
          updateStore(s => ({ ...s, technologies: [...s.technologies, newItem] }));
          return newItem;
        }
      }

      if (endpoint.startsWith('/admin/technologies/')) {
        const id = endpoint.replace('/admin/technologies/', '');
        if (method === 'PUT') {
          const payload = JSON.parse(options.body);
          updateStore(s => ({
            ...s,
            technologies: s.technologies.map(t => t.id === id ? { ...t, ...payload } : t)
          }));
          return { success: true };
        }
        if (method === 'DELETE') {
          updateStore(s => ({
            ...s,
            technologies: s.technologies.filter(t => t.id !== id)
          }));
          return { success: true };
        }
      }

      // Videos Admin
      if (endpoint === '/admin/videos') {
        if (method === 'GET') return currentStore.videos;
        if (method === 'POST') {
          const newItem = { ...JSON.parse(options.body), id: 'vid-' + Date.now() };
          updateStore(s => ({ ...s, videos: [newItem, ...s.videos] }));
          return newItem;
        }
      }

      if (endpoint.startsWith('/admin/videos/')) {
        const id = endpoint.replace('/admin/videos/', '');
        if (method === 'PUT') {
          const payload = JSON.parse(options.body);
          updateStore(s => ({
            ...s,
            videos: s.videos.map(v => v.id === id ? { ...v, ...payload } : v)
          }));
          return { success: true };
        }
        if (method === 'DELETE') {
          updateStore(s => ({
            ...s,
            videos: s.videos.filter(v => v.id !== id)
          }));
          return { success: true };
        }
      }

      // Journey Admin
      if (endpoint === '/admin/journey') {
        if (method === 'GET') return currentStore.journey;
        if (method === 'POST') {
          const newItem = { ...JSON.parse(options.body), id: 'jrn-' + Date.now() };
          updateStore(s => ({ ...s, journey: [newItem, ...s.journey] }));
          return newItem;
        }
      }

      if (endpoint.startsWith('/admin/journey/')) {
        const id = endpoint.replace('/admin/journey/', '');
        if (method === 'PUT') {
          const payload = JSON.parse(options.body);
          updateStore(s => ({
            ...s,
            journey: s.journey.map(j => j.id === id ? { ...j, ...payload } : j)
          }));
          return { success: true };
        }
        if (method === 'DELETE') {
          updateStore(s => ({
            ...s,
            journey: s.journey.filter(j => j.id !== id)
          }));
          return { success: true };
        }
      }

      // Footer Admin
      if (endpoint === '/admin/footer') {
        if (method === 'GET') return currentStore.footer || currentStore.profile;
        if (method === 'PUT') {
          const updatedFooter = { ...(currentStore.footer || {}), ...JSON.parse(options.body) };
          updateStore(s => ({ ...s, footer: updatedFooter }));
          return updatedFooter;
        }
      }

      // CV Admin
      if (endpoint === '/admin/cv') {
        if (method === 'GET') return currentStore.cv;
        if (method === 'PUT') {
          const updatedCv = { ...currentStore.cv, ...JSON.parse(options.body) };
          updateStore(s => ({ ...s, cv: updatedCv }));
          return updatedCv;
        }
      }

      if (endpoint === '/admin/cv/upload' && method === 'POST') {
        const payload = JSON.parse(options.body);
        const newCv = {
          id: 'cv-' + Date.now(),
          version: payload.version || 'v' + (parseFloat(currentStore.cv.version.replace('v', '')) + 0.1).toFixed(1),
          lastUpdated: new Date().toISOString().split('T')[0],
          status: payload.status || 'PUBLISHED',
          fileName: payload.fileName || 'CV.pdf',
          fileSize: payload.fileSize || '250 KB',
          fileUrl: payload.fileUrl || currentStore.cv.fileUrl,
          summary: payload.summary || currentStore.cv.summary
        };
        // Enforce single current CV rule
        updateStore(s => ({ ...s, cv: newCv }));
        return newCv;
      }
    }

    return { success: true };
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
