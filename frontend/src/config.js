const getApiUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Use window.location to determine the current domain
    const isProduction = window.location.hostname !== 'localhost';
    if (isProduction) {
      return `https://${window.location.hostname}/api`;
    }
  }
  
  // Development fallback
  return '/api';
};

export const API_URL = getApiUrl();

// Other configuration variables can be added here 