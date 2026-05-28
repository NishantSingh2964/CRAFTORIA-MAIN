import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// We will set up the interceptor in the Provider to have access to Clerk hooks
let authTokenGetter = () => Promise.resolve(null);

export const setTokenGetter = (fn) => {
  authTokenGetter = fn;
};

export const getAuthToken = () => authTokenGetter();

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
