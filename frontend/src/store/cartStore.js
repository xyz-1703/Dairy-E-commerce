import { create } from 'zustand';
import { cartAPI } from '../api/api';

export const useCartStore = create((set) => ({
  items: [],
  totalPrice: 0,
  totalItems: 0,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.list();
      set({
        items: response.data.items || [],
        totalPrice: response.data.total_price || 0,
        totalItems: response.data.total_items || 0,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch cart',
        isLoading: false,
      });
    }
  },

  addItem: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.addItem({ product_id: productId, quantity });
      set({
        items: response.data.items || [],
        totalPrice: response.data.total_price || 0,
        totalItems: response.data.total_items || 0,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to add item',
        isLoading: false,
      });
      return false;
    }
  },

  updateItem: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.updateItem({ item_id: itemId, quantity });
      set({
        items: response.data.items || [],
        totalPrice: response.data.total_price || 0,
        totalItems: response.data.total_items || 0,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to update item',
        isLoading: false,
      });
      return false;
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.removeItem({ item_id: itemId });
      set({
        items: response.data.items || [],
        totalPrice: response.data.total_price || 0,
        totalItems: response.data.total_items || 0,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to remove item',
        isLoading: false,
      });
      return false;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.clear();
      set({
        items: [],
        totalPrice: 0,
        totalItems: 0,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to clear cart',
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
