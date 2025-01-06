import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import axios from 'axios';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Initialize auth - Token from localStorage:', token);

      if (!token) {
        console.log('Initialize auth - No token found');
        return rejectWithValue('No token found');
      }

      console.log('Initialize auth - Fetching user data');
      const response = await api.get('/auth/me');
      console.log('Initialize auth - User data:', response.data);

      return { token, user: response.data };
    } catch (error) {
      console.error('Initialize auth - Error:', error.response?.data || error.message);
      localStorage.removeItem('token');
      return rejectWithValue(error.response?.data?.message || 'Failed to initialize auth');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Login thunk - Sending request with credentials:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Login thunk - Response:', response.data);

      if (!response.data.token) {
        console.error('Login thunk - No token in response');
        return rejectWithValue('No token received');
      }

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      console.log('Login thunk - Token stored in localStorage:', response.data.token);

      return response.data;
    } catch (error) {
      console.error('Login thunk - Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Register thunk - Sending request with data:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Register thunk - Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register thunk - Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.errors?.[0] || 
        'Failed to register. Please try again.'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    console.log('Logout thunk - Removing token from localStorage');
    localStorage.removeItem('token');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Initialize
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 