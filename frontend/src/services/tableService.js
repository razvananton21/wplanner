import api from './api';

const tableService = {
    // Get all tables for a wedding
    getTables: async (weddingId) => {
        const response = await api.get(`/weddings/${weddingId}/tables`);
        return response.data;
    },

    // Get a single table with its guests
    getTable: async (tableId) => {
        const response = await api.get(`/tables/${tableId}`);
        return response.data;
    },

    // Create a new table
    createTable: async (weddingId, tableData) => {
        const response = await api.post(`/weddings/${weddingId}/tables`, tableData);
        return response.data;
    },

    // Update a table
    updateTable: async (tableId, tableData) => {
        const response = await api.put(`/tables/${tableId}`, tableData);
        return response.data;
    },

    // Delete a table
    deleteTable: async (tableId) => {
        await api.delete(`/tables/${tableId}`);
    },

    // Assign guests to a table
    assignGuests: async (tableId, guestIds) => {
        const response = await api.put(`/tables/${tableId}/guests`, { guestIds });
        return response.data;
    },

    // Remove a guest from a table
    removeGuest: async (tableId, guestId) => {
        const response = await api.delete(`/tables/${tableId}/guests/${guestId}`);
        return response.data;
    },

    // Validate guest assignments
    validateAssignment: async (tableId, guestIds) => {
        const response = await api.post(`/tables/validate-assignment`, {
            tableId,
            guestIds
        });
        return response.data;
    }
};

export { tableService }; 