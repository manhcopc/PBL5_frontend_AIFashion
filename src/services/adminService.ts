import type { AdminStatsApiResponse } from "@/features/admin/types/admin.response";
import apiClient from "./ApiClient";
import type {
  AdminUserResponse,
  // AdminStats,
  TopUpRequest,
  PlanChangeRequest,
  CreditLogResponse,
  CreditLogFilters,
} from "@/features/admin/types/admin.types";

export const adminService = {
  // Fetch all users with pagination and filters
  getUsers: async (
    page: number = 1,
    limit: number = 10,
    filters?: { email?: string; plan?: string }
  ) => {
    const response = await apiClient.get<{
      users: AdminUserResponse[];
      total: number;
    }>("/admin/users", {
      params: {
        page,
        limit,
        ...filters,
      },
    });
    return response.data;
  },

  // Fetch admin dashboard stats
  getStats: async () => {
    const response = await apiClient.get<AdminStatsApiResponse>("/admin/stats");
    return response.data;
  },

  // Top-up user credits
  topUpCredits: async (payload: TopUpRequest) => {
    const response = await apiClient.post<{
      success: boolean;
      newBalance: number;
    }>("/admin/users/topup", payload);
    return response.data;
  },

  // Change user plan
  changePlan: async (payload: PlanChangeRequest) => {
    const response = await apiClient.post<{
      success: boolean;
      user: AdminUserResponse;
    }>("/admin/users/change-plan", payload);
    return response.data;
  },

  // Get user details
  getUserById: async (userId: string) => {
    const response = await apiClient.get<AdminUserResponse>(
      `/admin/users/${userId}`
    );
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string) => {
    const response = await apiClient.delete<{ success: boolean }>(
      `/admin/users/${userId}`
    );
    return response.data;
  },

  // Get credit logs with filters, search, and pagination
  getCreditLogs: async (filters?: CreditLogFilters) => {
    const response = await apiClient.get<CreditLogResponse>(
      "/admin/credit-logs",
      {
        params: {
          page: filters?.page || 1,
          limit: filters?.limit || 20,
          ...(filters?.search && { search: filters.search }),
          ...(filters?.type && { type: filters.type }),
        },
      }
    );
    return response.data;
  },
};
