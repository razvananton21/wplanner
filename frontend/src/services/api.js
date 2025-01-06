import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/slices/authSlice';

const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment ? 'http://localhost:3000/api' : 'http://localhost/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

// Debug function to check localStorage
const checkToken = () => {
  const token = localStorage.getItem('token');
  // console.log('Current token in localStorage:', token);
  return token;
};

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // console.log('Request interceptor:', {
    //   url: config.url,
    //   method: config.method,
    //   headers: config.headers,
    //   token: token,
    //   baseURL: config.baseURL
    // });
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      // console.log('Token attached to request:', config.headers['Authorization']);
    } else {
      // console.warn('No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    // console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    // console.log('Response interceptor:', {
    //   status: response.status,
    //   headers: response.headers,
    //   data: response.data
    // });
    return response;
  },
  (error) => {
    // console.error('Response interceptor error:', {
    //   status: error.response?.status,
    //   message: error.message,
    //   response: error.response?.data
    // });

    // Handle 401 errors
    if (error.response?.status === 401) {
      // console.log('Unauthorized error detected, logging out');
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export const weddingService = {
  getWeddings: async () => {
    try {
      const response = await api.get('/weddings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getWedding: async (id) => {
    try {
      const response = await api.get(`/weddings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createWedding: async (weddingData) => {
    try {
      const response = await api.post('/weddings', weddingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateWedding: async (id, weddingData) => {
    try {
      const response = await api.put(`/weddings/${id}`, weddingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteWedding: async (id) => {
    try {
      const response = await api.delete(`/weddings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

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

export default api; 