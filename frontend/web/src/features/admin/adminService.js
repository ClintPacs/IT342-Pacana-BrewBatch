import api from '../../shared/services/api';

const adminService = {
  getAll: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  create: async (user) => {
    const response = await api.post('/api/users', user);
    return response.data;
  },

  update: async (id, user) => {
    const response = await api.put(`/api/users/${id}`, user);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.put(`/api/users/${id}/status`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },
};

export default adminService;
