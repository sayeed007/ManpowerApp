import auth from '@react-native-firebase/auth';

// Base URL for your API
const BASE_URL = 'https://your-api-endpoint.com/api';

// Headers for authenticated requests
const getAuthHeaders = async () => {
  const user = auth().currentUser;
  if (user) {
    const token = await user.getIdToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }
  return {
    'Content-Type': 'application/json',
  };
};

// API service
export const apiService = {
  // GET request
  get: async (endpoint: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },

  // POST request
  post: async (endpoint: string, data: any) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  },

  // PUT request
  put: async (endpoint: string, data: any) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API PUT error:', error);
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  },
};

export default apiService;
