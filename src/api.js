// ============================================================
// ClinicGo API client
// Loaded as a plain <script> before any React component file.
// Exposes window.api with token management + fetch wrapper.
// ============================================================

(function () {
  // Backend base URL — use localhost during dev, Railway in production.
  // The check is based on hostname so the deployed site (GitHub Pages,
  // custom domain, etc.) always hits the live backend.
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  window.API_BASE = isLocal
    ? 'http://localhost:4000/api'
    : 'https://clinicgo-app-production.up.railway.app/api';

  const TOKEN_KEY = 'clinicgo_token';
  const USER_KEY  = 'clinicgo_user';

  const api = {
    // ── Token / user storage ──────────────────────────────
    getToken:   () => localStorage.getItem(TOKEN_KEY),
    setToken:   (t) => localStorage.setItem(TOKEN_KEY, t),
    clearToken: () => localStorage.removeItem(TOKEN_KEY),

    getUser: () => {
      try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    },
    setUser:   (u) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
    clearUser: () => localStorage.removeItem(USER_KEY),

    isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),

    // ── Generic fetch wrapper ─────────────────────────────
    request: async (path, options = {}) => {
      const token = api.getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
        ...(options.headers || {}),
      };
      let res;
      try {
        res = await fetch(window.API_BASE + path, { ...options, headers });
      } catch (err) {
        // Network-level error (e.g. backend not running)
        throw new Error('Cannot reach the server. Is the backend running on http://localhost:4000?');
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.error || ('HTTP ' + res.status);
        const e = new Error(message);
        e.status = res.status;
        e.details = data.details;
        throw e;
      }
      return data;
    },

    get:    (path)        => api.request(path),
    post:   (path, body)  => api.request(path, { method: 'POST',   body: JSON.stringify(body || {}) }),
    put:    (path, body)  => api.request(path, { method: 'PUT',    body: JSON.stringify(body || {}) }),
    delete: (path)        => api.request(path, { method: 'DELETE' }),

    // ── High-level auth helpers ───────────────────────────
    login: async (email, password) => {
      const data = await api.post('/auth/login', { email, password });
      api.setToken(data.token);
      api.setUser(data.user);
      window.dispatchEvent(new Event('auth-changed'));
      return data;
    },

    register: async (payload) => {
      const data = await api.post('/auth/register', payload);
      api.setToken(data.token);
      api.setUser(data.user);
      window.dispatchEvent(new Event('auth-changed'));
      return data;
    },

    logout: () => {
      api.clearToken();
      api.clearUser();
      window.dispatchEvent(new Event('auth-changed'));
    },
  };

  window.api = api;
})();
