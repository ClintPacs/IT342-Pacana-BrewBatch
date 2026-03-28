// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user session from localStorage on page refresh
    if (AuthService.isAuthenticated()) {
      setUser(AuthService.getStoredUser());
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await AuthService.login(username, password);
    setUser(data);
    return data;
  };

  const register = async (username, email, password, fullName) => {
    return await AuthService.register(username, email, password, fullName);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for convenience
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
