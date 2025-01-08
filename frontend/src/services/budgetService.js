import api from './api';

const budgetService = {
    // Get wedding budget and summary
    getBudget: async (weddingId) => {
        try {
            const response = await api.get(`/weddings/${weddingId}/budget`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return { budget: null, summary: null };
            }
            throw error;
        }
    },

    // Create new budget
    createBudget: async (weddingId, data) => {
        try {
            const response = await api.post(`/weddings/${weddingId}/budget`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update existing budget
    updateBudget: async (weddingId, data) => {
        try {
            const response = await api.put(`/weddings/${weddingId}/budget`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get budget summary
    getBudgetSummary: async (weddingId) => {
        try {
            const response = await api.get(`/weddings/${weddingId}/budget/summary`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return { summary: null };
            }
            throw error;
        }
    },

    // Get all expenses
    getExpenses: async (weddingId) => {
        try {
            const response = await api.get(`/weddings/${weddingId}/expenses`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return { expenses: [] };
            }
            throw error;
        }
    },

    // Create new expense
    createExpense: async (weddingId, data) => {
        try {
            const response = await api.post(`/weddings/${weddingId}/expenses`, data);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Please set up a budget before adding expenses');
            }
            throw error;
        }
    },

    // Update existing expense
    updateExpense: async (weddingId, expenseId, data) => {
        try {
            const response = await api.put(`/weddings/${weddingId}/expenses/${expenseId}`, data);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Please set up a budget before updating expenses');
            }
            throw error;
        }
    },

    // Delete expense
    deleteExpense: async (weddingId, expenseId) => {
        try {
            await api.delete(`/weddings/${weddingId}/expenses/${expenseId}`);
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Please set up a budget before deleting expenses');
            }
            throw error;
        }
    }
};

export default budgetService; 