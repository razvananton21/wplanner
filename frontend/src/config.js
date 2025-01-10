const getApiUrl = () => {
  // In development, use the proxy setup
  if (import.meta.env.DEV) {
    return '/api';
  }
  
  // In production, use the environment variable
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
};

export const API_URL = getApiUrl();

// Other configuration variables can be added here 