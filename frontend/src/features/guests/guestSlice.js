import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { guestService } from '../../services/guestService';

export const fetchGuests = createAsyncThunk(
    'guests/fetchGuests',
    async (weddingId) => {
        const response = await guestService.getGuests(weddingId);
        return response.data;
    }
);

export const createGuest = createAsyncThunk(
    'guests/createGuest',
    async ({ weddingId, guestData }) => {
        const response = await guestService.createGuest(weddingId, guestData);
        return response.data;
    }
);

export const updateGuest = createAsyncThunk(
    'guests/updateGuest',
    async ({ weddingId, guestId, guestData }) => {
        const response = await guestService.updateGuest(weddingId, guestId, guestData);
        return response.data;
    }
);

export const deleteGuest = createAsyncThunk(
    'guests/deleteGuest',
    async ({ weddingId, guestId }) => {
        await guestService.deleteGuest(weddingId, guestId);
        return guestId;
    }
);

export const bulkCreateGuests = createAsyncThunk(
    'guests/bulkCreate',
    async ({ weddingId, guestsData }) => {
        const response = await guestService.bulkCreateGuests(weddingId, guestsData);
        return response.data;
    }
);

const initialState = {
    guests: [],
    loading: false,
    error: null,
    filters: {
        status: 'all',
        category: 'all',
        searchQuery: '',
    }
};

const guestSlice = createSlice({
    name: 'guests',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch guests
            .addCase(fetchGuests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGuests.fulfilled, (state, action) => {
                state.loading = false;
                state.guests = action.payload;
            })
            .addCase(fetchGuests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create guest
            .addCase(createGuest.fulfilled, (state, action) => {
                state.guests.push(action.payload);
            })
            // Update guest
            .addCase(updateGuest.fulfilled, (state, action) => {
                const index = state.guests.findIndex(guest => guest.id === action.payload.id);
                if (index !== -1) {
                    state.guests[index] = action.payload;
                }
            })
            // Delete guest
            .addCase(deleteGuest.fulfilled, (state, action) => {
                state.guests = state.guests.filter(guest => guest.id !== action.payload);
            })
            // Bulk create guests
            .addCase(bulkCreateGuests.fulfilled, (state, action) => {
                state.guests = [...state.guests, ...action.payload];
            });
    }
});

export const { setFilters, clearFilters } = guestSlice.actions;

export const selectGuests = (state) => state.guests.guests;
export const selectGuestLoading = (state) => state.guests.loading;
export const selectGuestError = (state) => state.guests.error;
export const selectGuestFilters = (state) => state.guests.filters;

export const selectFilteredGuests = (state) => {
    const guests = selectGuests(state);
    const filters = selectGuestFilters(state);
    
    return guests.filter(guest => {
        // Filter out deleted guests
        if (guest.deletedAt) {
            return false;
        }
        
        // Status filter
        if (filters.status !== 'all' && guest.status !== filters.status) {
            return false;
        }
        
        // Category filter
        if (filters.category !== 'all' && guest.category !== filters.category) {
            return false;
        }
        
        // Search query
        if (filters.searchQuery) {
            const searchLower = filters.searchQuery.toLowerCase();
            const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
            const email = guest.email?.toLowerCase() || '';
            
            return fullName.includes(searchLower) || email.includes(searchLower);
        }
        
        return true;
    }).map(guest => ({
        ...guest,
        plusOnes: guest.plusOnes ? guest.plusOnes.filter(plusOne => !plusOne.deletedAt) : []
    }));
};

export default guestSlice.reducer; 