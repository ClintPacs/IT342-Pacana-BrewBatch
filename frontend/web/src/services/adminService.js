import api from './api';

const AdminService = {
  getUsers: async () => {
    const response = await api.get('/api/users');
    return response.data?.data || [];
  },

  createUser: async (user) => {
    const response = await api.post('/api/users', user);
    return response.data?.data;
  },

  updateUser: async (id, user) => {
    const response = await api.put(`/api/users/${id}`, user);
    return response.data?.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },
};

export default AdminService;
