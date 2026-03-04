import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh_token = localStorage.getItem('refresh_token');
      try {
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refresh_token,
        });
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Category APIs
export const categoryAPI = {
  list: () => api.get('/categories/'),
  get: (id) => api.get(`/categories/${id}/`),
};

// Product APIs
export const productAPI = {
  list: (params) => api.get('/products/', { params }),
  get: (id) => api.get(`/products/${id}/`),
  featured: () => api.get('/products/featured/'),
  trending: () => api.get('/products/trending/'),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.patch(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post(`/products/${id}/upload_image/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// User APIs
export const userAPI = {
  register: (data) => api.post('/users/register/', data),
  login: (data) => api.post('/token/', data),
  refreshToken: (data) => api.post('/token/refresh/', data),
  profile: () => api.get('/users/profile/'),
  changePassword: (data) => api.post('/users/change_password/', data),
};

// Cart APIs
export const cartAPI = {
  list: () => api.get('/cart/'),
  addItem: (data) => api.post('/cart/add_item/', data),
  updateItem: (data) => api.post('/cart/update_item/', data),
  removeItem: (data) => api.post('/cart/remove_item/', data),
  clear: () => api.post('/cart/clear/'),
};

// Order APIs
export const orderAPI = {
  list: () => api.get('/orders/'),
  get: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/create_from_cart/', data),
  createFromCart: (data) => api.post('/orders/create_from_cart/', data),
  updateStatus: (id, data) => api.patch(`/orders/${id}/update_status/`, data),
};

// Dashboard APIs
export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats/'),
  orders: () => api.get('/dashboard/orders/'),
};

// Subscription APIs
export const subscriptionAPI = {
  plans: () => api.get('/subscription-plans/'),
  getPlan: (id) => api.get(`/subscription-plans/${id}/`),
  list: () => api.get('/subscriptions/'),
  create: (data) => api.post('/subscriptions/', data),
  get: (id) => api.get(`/subscriptions/${id}/`),
  pause: (id) => api.post(`/subscriptions/${id}/pause/`),
  resume: (id) => api.post(`/subscriptions/${id}/resume/`),
  cancel: (id) => api.post(`/subscriptions/${id}/cancel/`),
  addItem: (id, data) => api.post(`/subscriptions/${id}/add_item/`, data),
  removeItem: (id, data) => api.post(`/subscriptions/${id}/remove_item/`, data),
};
