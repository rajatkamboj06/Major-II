import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // We will typically get the token from localStorage or Zustand store
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
       config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
