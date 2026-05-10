import axios from 'axios';
import AuthService from '../../features/auth/authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bb_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

const isTokenFailure = (error) => {
  const message = String(error.response?.data?.message || '').toLowerCase();
  const url = String(error.config?.url || '').toLowerCase();

  return (
    message.includes('token') ||
    message.includes('jwt') ||
    message.includes('expired') ||
    message.includes('invalid') ||
    url.includes('/api/auth')
  );
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && isTokenFailure(error)) {
      AuthService.logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;