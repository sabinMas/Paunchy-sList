import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  getStats: () => client.get('/extensions/stats')
};

// Submissions
export const submissionsAPI = {
  submit: (data) => client.post('/submissions', data),
  getStatus: (id) => client.get(`/submissions/${id}`),
  getRecent: () => client.get('/submissions/recent')
};

export default client;
