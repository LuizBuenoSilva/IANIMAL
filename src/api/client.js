import axios from 'axios';

// Detect if we are running on localhost or network
// This assumes the backend is running on the same host as the frontend but on port 8000
const hostname = window.location.hostname;

// Priority:
// 1. Environment Variable (VITE_API_URL) - Used for Production/Vercel
// 2. Local Logic - Used for local development
const baseURL = import.meta.env.MODE === 'production' 
  ? (import.meta.env.VITE_API_URL || `/api/v1`)
  : `http://${hostname}:8000/api/v1`;

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handler: if token expirar ou backend reiniciar, volta para login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { baseURL };
