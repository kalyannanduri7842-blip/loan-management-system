import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    const token = localStorage.getItem('loan_auth_token');
    const storedUser = localStorage.getItem('loan_auth_user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Verify with server
        const res = await api.auth.me();
        setUser(res.user);
        localStorage.setItem('loan_auth_user', JSON.stringify(res.user));
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        localStorage.removeItem('loan_auth_token');
        localStorage.removeItem('loan_auth_user');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email, password, requiredRole) => {
    const res = await api.auth.login({ email, password, requiredRole });
    localStorage.setItem('loan_auth_token', res.token);
    localStorage.setItem('loan_auth_user', JSON.stringify(res.user));
    setUser(res.user);
    return res;
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    localStorage.setItem('loan_auth_token', res.token);
    localStorage.setItem('loan_auth_user', JSON.stringify(res.user));
    setUser(res.user);
    return res;
  };

  const logout = () => {
    try {
      api.auth.logout().catch(() => {});
    } catch (e) {}
    localStorage.removeItem('loan_auth_token');
    localStorage.removeItem('loan_auth_user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('loan_auth_user', JSON.stringify(updated));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER',
    isEmployee: user?.role === 'EMPLOYEE',
    isCustomer: user?.role === 'CUSTOMER',
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
