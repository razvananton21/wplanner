import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchRsvps = createAsyncThunk(
  'rsvps/fetchRsvps',
  async (weddingId) => {
    const response = await axios.get(`/api/weddings/${weddingId}/rsvps`);
    return response.data;
  }
);

export const createRsvp = createAsyncThunk(
  'rsvps/createRsvp',
  async ({ weddingId, ...rsvpData }) => {
    const response = await axios.post(`/api/weddings/${weddingId}/rsvps`, rsvpData);
    return response.data;
  }
);

export const updateRsvp = createAsyncThunk(
  'rsvps/updateRsvp',
  async ({ id, ...rsvpData }) => {
    const response = await axios.put(`/api/rsvps/${id}`, rsvpData);
    return response.data;
  }
);

export const deleteRsvp = createAsyncThunk(
  'rsvps/deleteRsvp',
  async (rsvpId) => {
    await axios.delete(`/api/rsvps/${rsvpId}`);
    return rsvpId;
  }
);

const initialState = {
  rsvps: [],
  loading: false,
  error: null,
};

const rsvpSlice = createSlice({
  name: 'rsvps',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch RSVPs
    builder
      .addCase(fetchRsvps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRsvps.fulfilled, (state, action) => {
        state.loading = false;
        state.rsvps = action.payload;
      })
      .addCase(fetchRsvps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

    // Create RSVP
    builder
      .addCase(createRsvp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRsvp.fulfilled, (state, action) => {
        state.loading = false;
        state.rsvps.push(action.payload);
      })
      .addCase(createRsvp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

    // Update RSVP
    builder
      .addCase(updateRsvp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRsvp.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rsvps.findIndex(rsvp => rsvp.id === action.payload.id);
        if (index !== -1) {
          state.rsvps[index] = action.payload;
        }
      })
      .addCase(updateRsvp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

    // Delete RSVP
    builder
      .addCase(deleteRsvp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRsvp.fulfilled, (state, action) => {
        state.loading = false;
        state.rsvps = state.rsvps.filter(rsvp => rsvp.id !== action.payload);
      })
      .addCase(deleteRsvp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = rsvpSlice.actions;

export default rsvpSlice.reducer; 