import api from './api';

const taskService = {
    // Get all tasks for a wedding
    getTasks: async (weddingId) => {
        const response = await api.get(`/weddings/${weddingId}/tasks`);
        return response.data;
    },

    // Get incomplete tasks
    getIncompleteTasks: async (weddingId) => {
        const response = await api.get(`/weddings/${weddingId}/tasks/incomplete`);
        return response.data;
    },

    // Get tasks by category
    getTasksByCategory: async (weddingId, category) => {
        const response = await api.get(`/weddings/${weddingId}/tasks/category/${category}`);
        return response.data;
    },

    // Get overdue tasks
    getOverdueTasks: async (weddingId) => {
        const response = await api.get(`/weddings/${weddingId}/tasks/overdue`);
        return response.data;
    },

    // Get upcoming tasks
    getUpcomingTasks: async (weddingId, days = 7) => {
        const response = await api.get(`/weddings/${weddingId}/tasks/upcoming?days=${days}`);
        return response.data;
    },

    // Create a new task
    createTask: async (weddingId, taskData) => {
        const response = await api.post(`/weddings/${weddingId}/tasks`, taskData);
        return response.data;
    },

    // Get a specific task
    getTask: async (weddingId, taskId) => {
        const response = await api.get(`/weddings/${weddingId}/tasks/${taskId}`);
        return response.data;
    },

    // Update a task
    updateTask: async (weddingId, taskId, taskData) => {
        const response = await api.put(`/weddings/${weddingId}/tasks/${taskId}`, taskData);
        return response.data;
    },

    // Delete a task
    deleteTask: async (weddingId, taskId) => {
        await api.delete(`/weddings/${weddingId}/tasks/${taskId}`);
    },

    // Reorder tasks
    reorderTasks: async (weddingId, taskOrders) => {
        const response = await api.put(`/weddings/${weddingId}/tasks/reorder`, { taskOrders });
        return response.data;
    }
};

export default taskService; 