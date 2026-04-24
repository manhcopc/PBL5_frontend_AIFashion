import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, isAuthenticated: true });
      },
      
      clearAuth: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },
      
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          // Token exists, but we need to validate it
          // For now, just restore auth state
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-store', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
