import api from './api';

const SuppliersService = {
  getAll: async () => {
    const response = await api.get('/api/suppliers');
    return response.data?.data || [];
  },

  create: async (supplier) => {
    const response = await api.post('/api/suppliers', supplier);
    return response.data?.data;
  },

  update: async (id, supplier) => {
    const response = await api.put(`/api/suppliers/${id}`, supplier);
    return response.data?.data;
  },

  archive: async (id) => {
    const response = await api.delete(`/api/suppliers/${id}`);
    return response.data;
  },
};

export default SuppliersService;
