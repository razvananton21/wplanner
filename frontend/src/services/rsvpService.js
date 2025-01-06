import api from './api';

export const rsvpService = {
    submitRsvp: async (token, data) => {
        try {
            const response = await api.post(`/rsvp/${token}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getFields: async (token) => {
        try {
            const response = await api.get(`/rsvp/${token}/fields`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getGuest: async (token) => {
        try {
            const response = await api.get(`/rsvp/${token}/guest`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 