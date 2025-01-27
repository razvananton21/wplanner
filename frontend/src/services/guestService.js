import api from './api';

export const guestService = {
    getGuests: async (weddingId) => {
        console.error('guestService.getGuests called with:', { weddingId });
        try {
            const response = await api.get(`/weddings/${weddingId}/guests`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getGuest: async (weddingId, guestId) => {
        try {
            const response = await api.get(`/weddings/${weddingId}/guests/${guestId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    createGuest: async (weddingId, guestData) => {
        try {
            const response = await api.post(`/weddings/${weddingId}/guests`, guestData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateGuest: async (weddingId, guestId, guestData) => {
        try {
            const response = await api.put(`/weddings/${weddingId}/guests/${guestId}`, guestData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteGuest: async (weddingId, guestId) => {
        try {
            await api.delete(`/weddings/${weddingId}/guests/${guestId}`);
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    bulkCreateGuests: async (weddingId, guestsData) => {
        try {
            const response = await api.post(`/weddings/${weddingId}/guests/bulk`, guestsData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 