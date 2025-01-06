import api from './api';

export const guestService = {
    getGuests: async (weddingId) => {
        try {
            const response = await api.get(`/weddings/${weddingId}/guests`);
            const guestsResponse = await Promise.all(
                response.data.data.map(async (guest) => {
                    try {
                        const rsvpResponse = await api.get(`/weddings/${weddingId}/guests/${guest.id}/rsvp`);
                        return {
                            ...guest,
                            rsvpResponses: rsvpResponse.data.data || []
                        };
                    } catch (error) {
                        console.error(`Failed to fetch RSVP for guest ${guest.id}:`, error);
                        return {
                            ...guest,
                            rsvpResponses: []
                        };
                    }
                })
            );
            return { data: guestsResponse };
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