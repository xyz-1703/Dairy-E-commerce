import { create } from 'zustand';
import { userAPI } from '../api/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token') || null,
  isStaff: false,
  isLoading: false,
  error: null,

  checkAuth: async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await userAPI.profile();
        set({
          user: response.data,
          token,
          isStaff: response.data.is_staff || false,
        });
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ token: null, user: null, isStaff: false });
      }
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.login({ username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      set({ token: access, isLoading: false });
      // Fetch user profile
      const profileResponse = await userAPI.profile();
      set({
        user: profileResponse.data,
        isStaff: profileResponse.data.is_staff || false,
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Login failed',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.register(userData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, token: null, isStaff: false });
  },

  clearError: () => set({ error: null }),
}));
