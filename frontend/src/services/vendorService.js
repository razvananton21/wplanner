import api from './api';

const vendorService = {
    /**
     * Get all vendors for a wedding
     * @param {number} weddingId - The ID of the wedding
     * @returns {Promise<Array>} Vendors list
     */
    getVendors: async (weddingId) => {
        const response = await api.get(`/weddings/${weddingId}/vendors`);
        return response.data;
    },

    /**
     * Get a specific vendor
     * @param {number} weddingId - The ID of the wedding
     * @param {number} vendorId - The ID of the vendor
     * @returns {Promise<Object>} Vendor details
     */
    getVendor: async (weddingId, vendorId) => {
        const response = await api.get(`/weddings/${weddingId}/vendors/${vendorId}`);
        return response.data;
    },

    /**
     * Create a new vendor
     * @param {number} weddingId - The ID of the wedding
     * @param {Object} vendorData - The vendor data
     * @returns {Promise<Object>} Created vendor
     */
    createVendor: async (weddingId, vendorData) => {
        const response = await api.post(`/weddings/${weddingId}/vendors`, vendorData);
        return response.data;
    },

    /**
     * Update a vendor
     * @param {number} weddingId - The ID of the wedding
     * @param {number} vendorId - The ID of the vendor
     * @param {Object} vendorData - The updated vendor data
     * @returns {Promise<Object>} Updated vendor
     */
    updateVendor: async (weddingId, vendorId, vendorData) => {
        const response = await api.put(`/weddings/${weddingId}/vendors/${vendorId}`, vendorData);
        return response.data;
    },

    /**
     * Delete a vendor
     * @param {number} weddingId - The ID of the wedding
     * @param {number} vendorId - The ID of the vendor
     * @returns {Promise<void>}
     */
    deleteVendor: async (weddingId, vendorId) => {
        await api.delete(`/weddings/${weddingId}/vendors/${vendorId}`);
    },

    /**
     * Upload a file for a vendor
     * @param {number} weddingId - The ID of the wedding
     * @param {number} vendorId - The ID of the vendor
     * @param {File} file - The file to upload
     * @param {string} type - The type of file
     * @returns {Promise<Object>} Uploaded file details
     */
    uploadFile: async (weddingId, vendorId, file, type = 'document') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await api.post(
            `/weddings/${weddingId}/vendors/${vendorId}/files`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    /**
     * Delete a vendor file
     * @param {number} weddingId - The ID of the wedding
     * @param {number} vendorId - The ID of the vendor
     * @param {number} fileId - The ID of the file
     * @returns {Promise<void>}
     */
    deleteFile: async (weddingId, vendorId, fileId) => {
        await api.delete(`/weddings/${weddingId}/vendors/${vendorId}/files/${fileId}`);
    },
};

export default vendorService; 