import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject the Clerk JWT token
api.interceptors.request.use(async (config) => {
  try {
    const token = await authTokenGetter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('API Interceptor Error:', error);
  }
  return config;
});

// This will be set in AuthProvider or a similar root component
let authTokenGetter = () => Promise.resolve(null);

export const setTokenGetter = (fn) => {
  authTokenGetter = fn;
};

export default api;
