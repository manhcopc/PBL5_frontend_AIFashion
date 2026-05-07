import axios from 'axios';
import type { SystemConfig, SystemConfigUpdate, SystemConfigResponse } from '@/features/admin/types/admin.types';

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

export const configService = {
  // Fetch current system configuration
  getConfig: async (): Promise<SystemConfig> => {
    const response = await apiClient.get<SystemConfigResponse>('/config');
    return response.data.data;
  },

  // Update system configuration
  updateConfig: async (updates: SystemConfigUpdate): Promise<SystemConfig> => {
    const response = await apiClient.put<SystemConfigResponse>('/config', updates);
    return response.data.data;
  },

  // Reset configuration to defaults
  resetConfig: async (): Promise<SystemConfig> => {
    const response = await apiClient.post<SystemConfigResponse>('/config/reset');
    return response.data.data;
  },

  // Validate API key format
  validateApiKey: async (apiKey: string, version: string): Promise<{ valid: boolean; error?: string }> => {
    const response = await apiClient.post<{ valid: boolean; error?: string }>('/config/validate-key', {
      apiKey,
      version,
    });
    return response.data;
  },
};
