import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  isTokenExpired,
  getToken,
  setToken,
  setUserId,
  getUserId,
} from "@/services/auth";
import { clearClientSession } from "@/services/session";
import { getUserInfo } from "@/features/user/api/user.service";
import type { User as UserInfoResponse } from "@/features/user/user.types";
import type { User } from "../types/auth.types";

function normalizeUser(user: User | UserInfoResponse): User {
  return {
    id: "id" in user ? user.id : user._id,
    username: user.username,
    email: user.email,
    company_name: user.company_name ?? null,
    available_credits: user.available_credits ?? 0,
    role: user.role.toLowerCase(),
    created_at: user.created_at,
  };
}

interface AuthState {
  user: User | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setAuth: (user: User, token: string) => void;
  updateAvailableCredits: (credits: number) => void;
  refreshCurrentUser: () => Promise<User | null>;
  clearAuth: () => void;
  validateAndRestoreAuth: () => Promise<boolean>;
  logout: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userId: getUserId(),
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setAuth: (user, token) => {
        setToken(token);
        const normalizedUser = normalizeUser(user);
        const uid = normalizedUser.id;
        setUserId(uid);
        set({
          user: normalizedUser,
          userId: uid,
          isAuthenticated: true,
          error: null,
        });
      },

      updateAvailableCredits: (credits) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, available_credits: Math.max(0, credits) }
            : state.user,
        }));
      },

      refreshCurrentUser: async () => {
        try {
          const currentUserId = get().userId || get().user?.id || getUserId();
          if (!currentUserId) {
            throw new Error("User ID not found.");
          }

          const user = await getUserInfo(currentUserId);
          const normalizedUser = normalizeUser(user);
          set({
            user: normalizedUser,
            userId: normalizedUser.id,
            isAuthenticated: true,
            error: null,
          });
          setUserId(normalizedUser.id);
          return normalizedUser;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to refresh user.";
          set({ error: message });
          return null;
        }
      },

      clearAuth: () => {
        clearClientSession();
        set({ user: null, userId: null, isAuthenticated: false, error: null });
        useAuthStore.persist.clearStorage();
      },
      logout: () => {
        clearClientSession();
        set({ user: null, userId: null, isAuthenticated: false, error: null });
        useAuthStore.persist.clearStorage();
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
            get().clearAuth();
            set({ isLoading: false });
            return false;
          }

          if (isTokenExpired(token)) {
            get().clearAuth();
            set({
              isLoading: false,
              error: "Session expired. Please login again.",
            });
            return false;
          }

          const currentUser = get().user;

          if (!currentUser) {
            get().clearAuth();
            set({
              isLoading: false,
              error: "User data not found. Please login again.",
            });
            return false;
          }

          const refreshedUser = await get().refreshCurrentUser();
          if (!refreshedUser) {
            get().clearAuth();
            set({
              isLoading: false,
              error: "Unable to load user profile. Please login again.",
            });
            return false;
          }

          set({
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Auth validation failed";
          get().clearAuth();
          set({ isLoading: false, error: message, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
