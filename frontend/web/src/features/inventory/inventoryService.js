import api from '../../shared/services/api';

const InventoryService = {
  getAll: async (search, category) => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    const response = await api.get('/api/inventory', { params });
    return response.data?.data || [];
  },

  getAlerts: async () => {
    const response = await api.get('/api/inventory/alerts');
    return response.data?.data || [];
  },

  create: async (item) => {
    const response = await api.post('/api/inventory', item);
    return response.data?.data;
  },

  update: async (id, item) => {
    const response = await api.put(`/api/inventory/${id}`, item);
    return response.data?.data;
  },

  archive: async (id) => {
    const response = await api.delete(`/api/inventory/${id}`);
    return response.data;
  },

  updateThreshold: async (id, threshold) => {
    const response = await api.put(`/api/inventory/${id}/threshold`, {
      reorderThreshold: threshold,
    });
    return response.data?.data;
  },
};

export default InventoryService;