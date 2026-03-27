import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => instance.post('/auth/login', { email, password }),
  register: (data) => instance.post('/auth/register', data),
  me: () => instance.get('/auth/me'),
  changePassword: (data) => instance.post('/auth/change-password', data),
  getUsers: (params) => instance.get('/auth/users', { params }),
  updateUser: (id, data) => instance.put(`/auth/users/${id}`, data),
  toggleUserStatus: (id) => instance.patch(`/auth/users/${id}/toggle-status`),
};

// Manufacturer API
export const manufacturerAPI = {
  getAll: (params) => instance.get('/manufacturers', { params }),
  getById: (id) => instance.get(`/manufacturers/${id}`),
  create: (data) => instance.post('/manufacturers', data),
  update: (id, data) => instance.put(`/manufacturers/${id}`, data),
  delete: (id) => instance.delete(`/manufacturers/${id}`),
  verify: (id) => instance.patch(`/manufacturers/${id}/verify`),
  getProducts: (id) => instance.get(`/manufacturers/${id}/products`),
  getStats: (id) => instance.get(`/manufacturers/${id}/stats`),
};

// Supplier API
export const supplierAPI = {
  getAll: (params) => instance.get('/suppliers', { params }),
  getById: (id) => instance.get(`/suppliers/${id}`),
  create: (data) => instance.post('/suppliers', data),
  update: (id, data) => instance.put(`/suppliers/${id}`, data),
  delete: (id) => instance.delete(`/suppliers/${id}`),
  verify: (id) => instance.patch(`/suppliers/${id}/verify`),
};

// Wholesaler API
export const wholesalerAPI = {
  getAll: (params) => instance.get('/wholesalers', { params }),
  getById: (id) => instance.get(`/wholesalers/${id}`),
  create: (data) => instance.post('/wholesalers', data),
  update: (id, data) => instance.put(`/wholesalers/${id}`, data),
  delete: (id) => instance.delete(`/wholesalers/${id}`),
  verify: (id) => instance.patch(`/wholesalers/${id}/verify`),
};

// Retailer API
export const retailerAPI = {
  getAll: (params) => instance.get('/retailers', { params }),
  getById: (id) => instance.get(`/retailers/${id}`),
  create: (data) => instance.post('/retailers', data),
  update: (id, data) => instance.put(`/retailers/${id}`, data),
  delete: (id) => instance.delete(`/retailers/${id}`),
  verify: (id) => instance.patch(`/retailers/${id}/verify`),
};

// Client API
export const clientAPI = {
  getAll: (params) => instance.get('/clients', { params }),
  getById: (id) => instance.get(`/clients/${id}`),
  create: (data) => instance.post('/clients', data),
  update: (id, data) => instance.put(`/clients/${id}`, data),
  delete: (id) => instance.delete(`/clients/${id}`),
  verify: (id) => instance.patch(`/clients/${id}/verify`),
  getOrders: (id) => instance.get(`/clients/${id}/orders`),
  upgradeLoyalty: (id, tier) => instance.patch(`/clients/${id}/loyalty-tier`, { loyalty_tier: tier }),
};

// Product API
export const productAPI = {
  getAll: (params) => instance.get('/products', { params }),
  getById: (id) => instance.get(`/products/${id}`),
  create: (data) => instance.post('/products', data),
  update: (id, data) => instance.put(`/products/${id}`, data),
  delete: (id) => instance.delete(`/products/${id}`),
  getLowStock: () => instance.get('/products/low-stock'),
  getPriceHistory: (id) => instance.get(`/products/${id}/price-history`),
  updatePrice: (id, data) => instance.patch(`/products/${id}/price`, data),
  getByCategory: (categoryId) => instance.get(`/products/category/${categoryId}`),
};

// Category API
export const categoryAPI = {
  getAll: (params) => instance.get('/categories', { params }),
  getById: (id) => instance.get(`/categories/${id}`),
  create: (data) => instance.post('/categories', data),
  update: (id, data) => instance.put(`/categories/${id}`, data),
  delete: (id) => instance.delete(`/categories/${id}`),
  getTree: () => instance.get('/categories/tree'),
};

// Order API
export const orderAPI = {
  getAll: (params) => instance.get('/orders', { params }),
  getById: (id) => instance.get(`/orders/${id}`),
  create: (data) => instance.post('/orders', data),
  update: (id, data) => instance.put(`/orders/${id}`, data),
  delete: (id) => instance.delete(`/orders/${id}`),
  updateStatus: (id, status) => instance.patch(`/orders/${id}/status`, { status }),
  getItems: (id) => instance.get(`/orders/${id}/items`),
  addItem: (id, data) => instance.post(`/orders/${id}/items`, data),
  removeItem: (id, itemId) => instance.delete(`/orders/${id}/items/${itemId}`),
  getByEntity: (params) => instance.get('/orders/entity/list', { params }),
};

// Shipment API
export const shipmentAPI = {
  getAll: (params) => instance.get('/shipments', { params }),
  getById: (id) => instance.get(`/shipments/${id}`),
  create: (data) => instance.post('/shipments', data),
  update: (id, data) => instance.put(`/shipments/${id}`, data),
  delete: (id) => instance.delete(`/shipments/${id}`),
  updateStatus: (id, status) => instance.patch(`/shipments/${id}/status`, { status }),
  addTrackingEvent: (id, data) => instance.post(`/shipments/${id}/tracking-events`, data),
  getByOrder: (orderId) => instance.get(`/shipments/order/${orderId}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => instance.get('/dashboard/stats'),
  getRevenueChart: () => instance.get('/dashboard/revenue-chart'),
  getOrderStatus: () => instance.get('/dashboard/order-status'),
  getTopProducts: () => instance.get('/dashboard/top-products'),
  getTopClients: () => instance.get('/dashboard/top-clients'),
  getSupplyChainFlow: () => instance.get('/dashboard/supply-chain-flow'),
  getRecentActivity: () => instance.get('/dashboard/recent-activity'),
};

export default instance;
