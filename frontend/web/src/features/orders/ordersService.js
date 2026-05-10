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

  cancel: async (id) => {
    const response = await api.put(`/api/orders/${id}/cancel`);
    return response.data?.data;
  },

  deleteOrder: async (id) => {
    const response = await api.delete(`/api/orders/${id}`);
    return response.data?.data;
  },
};

export default OrdersService;
