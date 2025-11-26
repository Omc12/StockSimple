import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Set up axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in the Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

export const getProducts = () => api.get('/products');

export const createProduct = (product) => api.post('/products', product);

export const updateProduct = (sku, product) => api.put(`/products/${sku}`, product);

export const logStockMovement = (movement) => api.post('/movements', movement);

export const getStockMovements = () => api.get('/movements');

export const getLowStockAlerts = () => api.get('/dashboard/alerts');

export const getTopLowReports = () => api.get('/reports/toplow');

export default api;