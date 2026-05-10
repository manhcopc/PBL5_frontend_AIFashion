import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  // decodeToken,
  isTokenExpired,
  getToken,
  setToken,
  removeToken,
} from "@/services/auth";
import type { User } from "../types/auth.types";
import { authService } from "../api/auth.service";

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
        setToken(token); // ✅ Dùng hàm của Utils thay vì tự gọi localStorage
        set({ user, isAuthenticated: true, error: null });
      },

      clearAuth: () => {
        removeToken(); // ✅ Dùng hàm của Utils
        set({ user: null, isAuthenticated: false, error: null });
      },
      logout: () => {
        removeToken(); // ✅ Dùng hàm của Utils
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

          // 1. Kiểm tra có token không
          if (!token) {
            set({ isAuthenticated: false, isLoading: false });
            return false;
          }

          // 2. Kiểm tra token có hết hạn không (Hàm này chạy bình thường vì Token của bạn có chứa 'exp')
          if (isTokenExpired(token)) {
            get().clearAuth();
            set({
              isLoading: false,
              error: "Session expired. Please login again.",
            });
            return false;
          }

          // ✅ CÁCH KHÁC: Lấy trực tiếp thông tin user từ state hiện tại
          // (Do dùng persist, Zustand đã tự động nạp user từ localStorage vào RAM cho bạn rồi)
          const currentUser = get().user;

          // Nếu vì lý do gì đó mà mất data user (người dùng tự vào F12 xóa), thì bắt đăng nhập lại
          if (!currentUser) {
            get().clearAuth();
            set({
              isLoading: false,
              error: "User data not found. Please login again.",
            });
            return false;
          }

          // Mọi thứ hoàn hảo: Token còn hạn, dữ liệu User đã được khôi phục sẵn.
          set({
            isAuthenticated: true,
            isLoading: false,
            error: null,
            // Không cần set lại user vì currentUser đã nằm sẵn trong state rồi
          });
          return true;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Auth validation failed";
          set({ isLoading: false, error: message, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
