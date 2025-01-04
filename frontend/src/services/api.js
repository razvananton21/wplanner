import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const attendeeService = {
  submitRSVP: async (formData) => {
    try {
      const response = await api.post('/rsvp', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAttendees: async () => {
    try {
      const response = await api.get('/attendees');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  generateLink: async (attendeeEmail) => {
    try {
      const response = await api.post('/generate-link', { email: attendeeEmail });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 