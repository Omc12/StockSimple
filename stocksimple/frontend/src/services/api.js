import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
};

// Function to get all products
export const getProducts = () => api.get('/products');

// Function to create a new product
export const createProduct = (product) => api.post('/products', product);

// Function to update product details
export const updateProduct = (sku, product) => api.put(`/products/${sku}`, product);

// Function to log stock movement
export const logStockMovement = (movement) => api.post('/movements', movement);

// Function to get stock movements
export const getStockMovements = () => api.get('/movements');

// Function to get low-stock alerts
export const getLowStockAlerts = () => api.get('/dashboard/alerts');

// Function to get top and low stock reports
export const getTopLowReports = () => api.get('/reports/toplow');

export default api;