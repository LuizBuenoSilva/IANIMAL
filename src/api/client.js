import axios from 'axios';

// Detect if we are running on localhost or network
// This assumes the backend is running on the same host as the frontend but on port 8000
const hostname = window.location.hostname;

// Priority:
// 1. Environment Variable (VITE_API_URL) - Used for Production/Vercel
// 2. Local Logic - Used for local development
const baseURL = import.meta.env.VITE_API_URL || `http://${hostname}:8000/api/v1`;

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

export default api;
export { baseURL };
