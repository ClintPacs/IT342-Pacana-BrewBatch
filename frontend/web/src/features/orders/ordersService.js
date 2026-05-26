import api from '../../shared/services/api';

const OrdersService = {
  getAll: async () => {
    const response = await api.get('/api/orders');
    return response.data?.data || [];
  },

  create: async (order) => {
    const response = await api.post('/api/orders', order);
    return response.data?.data;
  },

  update: async (id, order) => {
    const response = await api.put(`/api/orders/${id}`, order);
    return response.data?.data;
  },

  approve: async (id) => {
    const response = await api.put(`/api/orders/${id}/approve`);
    return response.data?.data;
  },

  reject: async (id) => {
    const response = await api.put(`/api/orders/${id}/reject`);
    return response.data?.data;
  },

  transit: async (id) => {
    const response = await api.put(`/api/orders/${id}/transit`);
    return response.data?.data;
  },

  deliver: async (id) => {
    const response = await api.put(`/api/orders/${id}/deliver`);
    return response.data?.data;
  },

  cancel: async (id) => {
    const response = await api.put(`/api/orders/${id}/cancel`);
    return response.data?.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/orders/${id}`);
    return response.data;
  },

  getSupplierOrders: async () => {
    const response = await api.get('/api/orders/supplier');
    return response.data?.data || [];
  },
};

export default OrdersService;
