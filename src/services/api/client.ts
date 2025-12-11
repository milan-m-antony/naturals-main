import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Using JWT Authorization header, not cookies
  withCredentials: false,
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const url = (error.config?.url || '').toLowerCase();
    const isAuthEndpoint = url.endsWith('/login') || url.endsWith('/register');
    const isLeaveRequestsEndpoint = url.includes('/leave-requests');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Only log if it's not the expected leave-requests 401
      if (!isLeaveRequestsEndpoint) {
        console.warn('[API Client] 401 Unauthorized - clearing auth');
      }
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Don't redirect - let the app handle it
    }
    return Promise.reject(error);
  }
);

export default apiClient;
