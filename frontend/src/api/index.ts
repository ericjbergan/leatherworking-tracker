import axios from 'axios';

// Determine the base URL based on the environment
const getBaseUrl = () => {
  // In production, use the AWS API endpoint
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL;
  }
  // In development, default to localhost
  return 'http://localhost:3000/api';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const customerApi = {
  getAll: () => api.get('/customers'),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const materialApi = {
  getAll: () => api.get('/materials'),
  getById: (id: string) => api.get(`/materials/${id}`),
  create: (data: any) => api.post('/materials', data),
  update: (id: string, data: any) => api.put(`/materials/${id}`, data),
  delete: (id: string) => api.delete(`/materials/${id}`),
};

export const projectApi = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/projects/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const orderApi = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/orders/${id}`),
};

export default api; 