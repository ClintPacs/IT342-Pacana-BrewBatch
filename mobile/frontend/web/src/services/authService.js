// src/services/authService.js

import api from './api';

const AuthService = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register: async (username, email, password, fullName) => {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password,
      fullName,
    });
    return response.data;
  },

  /**
   * Login and store token
   * POST /api/auth/login
   */
  login: async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password });
    const { token, ...user } = response.data;

    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  },

  /**
   * Logout — clear storage
   */
  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user profile
   * GET /api/user/me
   */
  getCurrentUser: async () => {
    const response = await api.get('/api/user/me');
    return response.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('jwt_token');
  },

  /**
   * Get stored user info (from localStorage, no API call)
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default AuthService;
