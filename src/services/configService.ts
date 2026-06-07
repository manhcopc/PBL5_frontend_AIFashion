import apiClient from './ApiClient';
import type { SystemConfig, SystemConfigUpdate, SystemConfigResponse } from '@/features/admin/types/admin.types';

export const configService = {
  // Fetch current system configuration
  getConfig: async (): Promise<SystemConfig> => {
    const response = await apiClient.get<SystemConfigResponse>('/admin/config');
    return response.data.data;
  },

  // Update system configuration
  updateConfig: async (updates: SystemConfigUpdate): Promise<SystemConfig> => {
    const response = await apiClient.put<SystemConfigResponse>('/admin/config', updates);
    return response.data.data;
  },

  // Reset configuration to defaults
  resetConfig: async (): Promise<SystemConfig> => {
    const response = await apiClient.post<SystemConfigResponse>('/admin/config/reset');
    return response.data.data;
  },

  // Validate API key format
  validateApiKey: async (apiKey: string, version: string): Promise<{ valid: boolean; error?: string }> => {
    const response = await apiClient.post<{ valid: boolean; error?: string }>('/admin/config/validate-key', {
      apiKey,
      version,
    });
    return response.data;
  },
};
