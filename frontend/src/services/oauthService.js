import axios from 'axios';
import { API_URL } from '../config';

// Create an axios instance with the correct base URL and config
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const getGoogleAuthUrl = async () => {
    try {
        const response = await api.get('/auth/google/url');
        
        if (!response.data?.url) {
            throw new Error('Invalid response from server');
        }
        
        // Ensure the URL is absolute
        const url = new URL(response.data.url, window.location.origin);
        return url.toString();
    } catch (error) {
        console.error('Google Auth URL Error:', error.response || error);
        throw new Error(error.response?.data?.error || 'Failed to get Google authentication URL');
    }
};

const handleGoogleCallback = async (code) => {
    try {
        const response = await api.post('/auth/google/callback', { code });
        return response.data;
    } catch (error) {
        console.error('Google Callback Error:', error.response || error);
        throw new Error(error.response?.data?.error || 'Failed to authenticate with Google');
    }
};

export const oauthService = {
    getGoogleAuthUrl,
    handleGoogleCallback,
}; 