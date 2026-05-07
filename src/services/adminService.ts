import axios from 'axios';
import type { AdminUserResponse, AdminStats, TopUpRequest, PlanChangeRequest, CreditLogResponse, CreditLogFilters } from '@/features/admin/types/admin.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminService = {
  // Fetch all users with pagination and filters
  getUsers: async (page: number = 1, limit: number = 10, filters?: { email?: string; plan?: string }) => {
    const response = await apiClient.get<{ users: AdminUserResponse[]; total: number }>('/users', {
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
    const response = await apiClient.get<AdminStats>('/stats');
    return response.data;
  },

  // Top-up user credits
  topUpCredits: async (payload: TopUpRequest) => {
    const response = await apiClient.post<{ success: boolean; newBalance: number }>('/users/topup', payload);
    return response.data;
  },

  // Change user plan
  changePlan: async (payload: PlanChangeRequest) => {
    const response = await apiClient.post<{ success: boolean; user: AdminUserResponse }>('/users/change-plan', payload);
    return response.data;
  },

  // Get user details
  getUserById: async (userId: string) => {
    const response = await apiClient.get<AdminUserResponse>(`/users/${userId}`);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string) => {
    const response = await apiClient.delete<{ success: boolean }>(`/users/${userId}`);
    return response.data;
  },

  // Get credit logs with filters, search, and pagination
  getCreditLogs: async (filters?: CreditLogFilters) => {
    const response = await apiClient.get<CreditLogResponse>('/credit-logs', {
      params: {
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        ...(filters?.search && { search: filters.search }),
        ...(filters?.type && { type: filters.type }),
      },
    });
    return response.data;
  },
};
