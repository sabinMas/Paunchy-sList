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

export const cerebrasAPI = {
  chat: async (messages) => {
    try {
      const response = await axios.post(`${API_URL}/extensions/chat`, {
        messages
      });

      if (response.data.success) {
        return response.data.data.message;
      } else {
        throw new Error(response.data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat request failed:', error);
      throw error;
    }
  }
};
