import { create } from 'zustand';
import type { SystemConfig, SystemConfigUpdate } from '@/features/admin/types/admin.types';

interface ConfigState {
  // Data
  config: SystemConfig | null;
  loading: boolean;
  error: string | null;
  isDirty: boolean;
  originalConfig: SystemConfig | null;

  // Actions
  setConfig: (config: SystemConfig) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateConfig: (updates: SystemConfigUpdate) => void;
  resetConfig: () => void;
  clearError: () => void;
  markClean: () => void;
}

// Default system configuration
const DEFAULT_CONFIG: SystemConfig = {
  id: 'default',
  aiModel: {
    apiKey: '',
    version: 'gpt-4',
    maintenanceMode: false,
  },
  pricing: {
    creditPrice: 0.01,
    creditsPerGeneration: 10,
  },
  security: {
    emailVerificationRequired: true,
    newUserBonusCredits: 50,
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};

export const useConfigStore = create<ConfigState>((set) => ({
  config: DEFAULT_CONFIG,
  loading: false,
  error: null,
  isDirty: false,
  originalConfig: DEFAULT_CONFIG,

  setConfig: (config) =>
    set({
      config,
      originalConfig: JSON.parse(JSON.stringify(config)),
      isDirty: false,
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  updateConfig: (updates) =>
    set((state) => {
      if (!state.config) return state;

      const newConfig = {
        ...state.config,
        aiModel: updates.aiModel ? { ...state.config.aiModel, ...updates.aiModel } : state.config.aiModel,
        pricing: updates.pricing ? { ...state.config.pricing, ...updates.pricing } : state.config.pricing,
        security: updates.security ? { ...state.config.security, ...updates.security } : state.config.security,
      };

      // Check if config has actually changed from original
      const isDirty = JSON.stringify(newConfig) !== JSON.stringify(state.originalConfig);

      return {
        config: newConfig,
        isDirty,
      };
    }),

  resetConfig: () =>
    set((state) => ({
      config: state.originalConfig ? JSON.parse(JSON.stringify(state.originalConfig)) : state.config,
      isDirty: false,
    })),

  clearError: () => set({ error: null }),

  markClean: () => set({ isDirty: false }),
}));
