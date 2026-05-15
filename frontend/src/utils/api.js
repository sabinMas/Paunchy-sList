import axios from 'axios';

// Determine API URL based on environment
const getAPIUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Production (Vercel): backend is at /_/backend
  if (!import.meta.env.DEV) {
    return '/_/backend/api';
  }

  // Development: local backend
  return 'http://localhost:5000/api';
};

const API_URL = getAPIUrl();

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Extensions
export const extensionsAPI = {
  getAll: (params = {}) => client.get('/extensions', { params }),
  getById: (id) => client.get(`/extensions/${id}`),
  getFilters: () => client.get('/extensions/filters'),
  getStats: () => client.get('/extensions/stats'),
  trackVisitor: () => client.post('/extensions/visitors/track')
};

// Submissions
export const submissionsAPI = {
  submit: (data) => client.post('/submissions', data),
  getStatus: (id) => client.get(`/submissions/${id}`),
  getRecent: () => client.get('/submissions/recent')
};

export default client;
