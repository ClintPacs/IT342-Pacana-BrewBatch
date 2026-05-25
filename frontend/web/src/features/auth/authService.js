import api from '../../shared/services/api';

const AuthService = {
  register: async (formData) => {
    const response = await api.post('/api/auth/register', {
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role || 'BARISTA',
      companyName: formData.companyName,
      contactName: formData.contactName,
      phone: formData.phone,
      address: formData.address,
    });
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password });
    const token = response.data?.data?.token || response.data?.token;
    const user = response.data?.data?.user || response.data;
    if (token) {
      localStorage.setItem('bb_token', token);
      localStorage.setItem('bb_user', JSON.stringify(user));
    }
    return user;
  },

  logout: () => {
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/user/me');
    return response.data?.data || response.data;
  },

  isAuthenticated: () => !!localStorage.getItem('bb_token'),

  getStoredUser: () => {
    try { return JSON.parse(localStorage.getItem('bb_user')); }
    catch { return null; }
  },
};

export default AuthService;