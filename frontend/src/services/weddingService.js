import api from './api';

const weddingService = {
    getWeddings: async () => {
        try {
            const response = await api.get('/weddings');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch weddings');
        }
    },

    getWedding: async (id) => {
        try {
            const response = await api.get(`/weddings/${id}`);
            if (response.data.managed) {
                const wedding = response.data.managed.find(w => w.id === parseInt(id));
                if (!wedding) {
                    throw new Error('Wedding not found');
                }
                return wedding;
            }
            return response.data.wedding;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch wedding details');
        }
    },

    createWedding: async (data) => {
        try {
            const response = await api.post('/weddings', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create wedding');
        }
    },

    updateWedding: async (id, data) => {
        try {
            const response = await api.put(`/weddings/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update wedding');
        }
    },

    deleteWedding: async (id) => {
        try {
            const response = await api.delete(`/weddings/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete wedding');
        }
    },

    uploadInvitation: async (weddingId, formData) => {
        try {
            const response = await api.post(`/weddings/${weddingId}/invitation`, formData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to upload invitation');
        }
    }
};

export default weddingService; 