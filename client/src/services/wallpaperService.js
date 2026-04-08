import api from './api';

export const wallpaperService = {
  getAll: (params) => api.get('/wallpapers', { params }),
  getById: (id) => api.get(`/wallpapers/${id}`),
  upload: (formData) => api.post('/wallpapers/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/wallpapers/${id}`),
  like: (id) => api.post(`/wallpapers/${id}/like`),
  download: (id) => api.get(`/wallpapers/${id}/download`),
  getCreatorWallpapers: () => api.get('/wallpapers/creator/my'),
};

export const orderService = {
  create: (wallpaperId) => api.post('/orders/create', { wallpaperId }),
  verify: (data) => api.post('/orders/verify', data),
  getUserOrders: () => api.get('/orders/user'),
  checkPurchase: (wallpaperId) => api.get(`/orders/check/${wallpaperId}`),
};

export const userService = {
  getFavorites: () => api.get('/users/favorites'),
  getCreatorStats: () => api.get('/users/creator/stats'),
};
