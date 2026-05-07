import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { decodeToken, isTokenExpired, getToken } from '@/services/auth';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  validateAndRestoreAuth: () => Promise<boolean>;
  logout: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, isAuthenticated: true, error: null });
      },
      
      clearAuth: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, error: null });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, error: null });
      },
      
      setError: (error) => {
        set({ error });
      },
      
      /**
       * Validate token on app initialization
       * Decodes token and checks expiration
       */
      validateAndRestoreAuth: async () => {
        set({ isLoading: true });
        try {
          const token = getToken();
          
          if (!token) {
            set({ isAuthenticated: false, isLoading: false });
            return false;
          }
          
          // Check if token is expired
          if (isTokenExpired(token)) {
            get().clearAuth();
            set({ isLoading: false, error: 'Session expired. Please login again.' });
            return false;
          }
          
          // Decode token and extract user info
          const decoded = decodeToken(token);
          if (!decoded) {
            get().clearAuth();
            set({ isLoading: false, error: 'Invalid token' });
            return false;
          }
          
          // Reconstruct user from token with normalized role
          const user: User = {
            id: decoded.sub,
            email: decoded.email,
            username: decoded.email.split('@')[0], // Extract username from email
            role: decoded.role.toLowerCase(), // Normalize role to lowercase
          };
          
          set({ user, isAuthenticated: true, isLoading: false, error: null });
          return true;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Auth validation failed';
          set({ isLoading: false, error: message, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
