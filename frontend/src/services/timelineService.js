import api from './api';

const timelineService = {
  /**
   * Get all timeline events for a wedding
   * @param {number} weddingId - The ID of the wedding
   * @returns {Promise<Array>} Timeline events
   */
  getTimelineEvents: async (weddingId) => {
    const response = await api.get(`/weddings/${weddingId}/timeline`);
    return response.data;
  },

  /**
   * Create a new timeline event
   * @param {number} weddingId - The ID of the wedding
   * @param {Object} eventData - The event data
   * @returns {Promise<Object>} Created event
   */
  createTimelineEvent: async (weddingId, eventData) => {
    const response = await api.post(`/weddings/${weddingId}/timeline`, eventData);
    return response.data;
  },

  /**
   * Update a timeline event
   * @param {number} weddingId - The ID of the wedding
   * @param {number} eventId - The ID of the event to update
   * @param {Object} eventData - The updated event data
   * @returns {Promise<Object>} Updated event
   */
  updateTimelineEvent: async (weddingId, eventId, eventData) => {
    const response = await api.put(`/weddings/${weddingId}/timeline/${eventId}`, eventData);
    return response.data;
  },

  /**
   * Delete a timeline event
   * @param {number} weddingId - The ID of the wedding
   * @param {number} eventId - The ID of the event to delete
   * @returns {Promise<void>}
   */
  deleteTimelineEvent: async (weddingId, eventId) => {
    await api.delete(`/weddings/${weddingId}/timeline/${eventId}`);
  }
};

export default timelineService; 