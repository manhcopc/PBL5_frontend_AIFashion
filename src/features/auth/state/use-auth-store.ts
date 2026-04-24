// src/features/auth/state/use-auth-store.ts
import { create } from 'zustand';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  
  // Các Actions (giống như các hàm emit state mới trong Cubit)
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('token', token); // Lưu token ở đây
    set({ user, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));