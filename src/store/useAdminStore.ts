import { create } from "zustand";
import type { AdminUser, AdminStats } from "@/features/admin/types/admin.types";

interface AdminState {
  // Data
  users: AdminUser[];
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: {
    email: string;
    plan: "All" | "Free" | "Pro" | "Enterprise";
  };

  // Actions
  setUsers: (users: AdminUser[]) => void;
  setStats: (stats: AdminStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: {
    page: number;
    limit: number;
    total: number;
  }) => void;
  setFilters: (filters: {
    email?: string;
    plan?: "All" | "Free" | "Pro" | "Enterprise";
  }) => void;
  updateUserCredits: (userId: string, newCredits: number) => void;
  updateUserPlan: (
    userId: string,
    newPlan: "Free" | "Pro" | "Enterprise"
  ) => void;
  removeUser: (userId: string) => void;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    email: "",
    plan: "All",
  },

  setUsers: (users) => set({ users }),

  setStats: (stats) => set({ stats }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setPagination: (pagination) => set({ pagination }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }, // Reset to page 1 when filtering
    })),

  updateUserCredits: (userId, newCredits) =>
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, creditsRemaining: newCredits } : user
      ),
    })),

  updateUserPlan: (userId, newPlan) =>
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, plan: newPlan } : user
      ),
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user._id !== userId),
      pagination: {
        ...state.pagination,
        total: Math.max(0, state.pagination.total - 1),
      },
    })),

  clearError: () => set({ error: null }),
}));
