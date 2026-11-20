'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on initial client load
  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const storedToken = localStorage.getItem('equiprent_token');
        const storedUser = localStorage.getItem('equiprent_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token with backend
          try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${storedToken}` }
            });
            const data = await res.json();
            if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem('equiprent_user', JSON.stringify(data.user));
            } else {
              // Token expired or invalid
              localStorage.removeItem('equiprent_token');
              localStorage.removeItem('equiprent_user');
              setToken(null);
              setUser(null);
            }
          } catch (netErr) {
            // Keep storedUser if backend is temporarily unreachable so reload doesn't kick user out
            console.warn('Backend verification warning:', netErr.message);
          }
        }
      } catch (err) {
        console.error('Auth state restoration error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromStorage();
  }, []);

  // Login method
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('equiprent_token', data.token);
      localStorage.setItem('equiprent_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Register method
  const register = async ({ name, email, password, photoURL, role, phone, address }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, photoURL, role, phone, address })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('equiprent_token', data.token);
      localStorage.setItem('equiprent_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Google social login method
  const loginWithGoogle = async (googleData = {}) => {
    try {
      const payload = {
        name: googleData.name || 'Google Customer',
        email: googleData.email || 'customer.google@equiprent.com',
        photoURL: googleData.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      };

      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Google authentication failed.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('equiprent_token', data.token);
      localStorage.setItem('equiprent_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Update profile
  const updateUserProfile = async (updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      setUser(data.user);
      localStorage.setItem('equiprent_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem('equiprent_token');
    localStorage.removeItem('equiprent_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginWithGoogle,
        updateUserProfile,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
        isOwner: user?.role === 'Owner' || user?.role === 'Admin',
        isCustomer: user?.role === 'Customer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
