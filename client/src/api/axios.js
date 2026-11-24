import axios from 'axios';

export const TOKEN_KEY = 'smartstudy_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If a protected request comes back 401 (expired/invalid token), send the user to /auth.
// Login/register 401s are normal "wrong password" errors, so we ignore those.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const isAuthForm = url.includes('/auth/login') || url.includes('/auth/register');
    if (err.response?.status === 401 && !isAuthForm) {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== '/auth') window.location.assign('/auth');
    }
    return Promise.reject(err);
  }
);

export default api;
