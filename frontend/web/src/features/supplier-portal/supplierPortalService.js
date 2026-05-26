import api from '../../shared/services/api';

const supplierPortalService = {
  // Profile
  getMyProfile: async () => {
    const response = await api.get('/api/suppliers/me');
    return response.data?.data || null;
  },

  updateMyProfile: async (data) => {
    const response = await api.put('/api/suppliers/me', data);
    return response.data?.data;
  },

  // Orders
  getMyOrders: async () => {
    const response = await api.get('/api/orders/supplier');
    return response.data?.data || [];
  },

  confirmOrder: async (id) => {
    const response = await api.put(`/api/orders/${id}/confirm`);
    return response.data?.data;
  },

  // Invoices
  getMyInvoices: async () => {
    const response = await api.get('/api/invoices');
    return response.data?.data || [];
  },

  createInvoice: async (invoice) => {
    const response = await api.post('/api/invoices', invoice);
    return response.data?.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await api.get('/api/notifications/me');
    return response.data?.data || [];
  },

  markNotificationRead: async (id) => {
    const response = await api.put(`/api/notifications/${id}/read`);
    return response.data?.data;
  },

  markAllRead: async () => {
    const response = await api.put('/api/notifications/read-all');
    return response.data;
  },
};

export default supplierPortalService;
