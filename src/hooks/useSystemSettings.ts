import { useState, useCallback, useEffect } from 'react';
import { configService } from '@/services/configService';
import { useConfigStore } from '@/store/useConfigStore';
import type { SystemConfigUpdate } from '@/features/admin/types/admin.types';

interface ValidationError {
  field: string;
  message: string;
}

export function useSystemSettings() {
  const { config, isDirty, loading, error, setConfig, setLoading, setError, updateConfig, resetConfig, markClean } =
    useConfigStore();

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Fetch system configuration on mount
   */
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const data = await configService.getConfig();
        setConfig(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load configuration';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    void fetchConfig();
  }, [setConfig, setLoading, setError]);

  /**
   * Validate current configuration
   */
  const validate = useCallback((): boolean => {
    const errors: ValidationError[] = [];

    if (!config) return false;

    // Validate API Key (should not be empty and have minimum length)
    if (config.aiModel.apiKey && config.aiModel.apiKey.length < 10) {
      errors.push({
        field: 'apiKey',
        message: 'API Key must be at least 10 characters',
      });
    }

    // Validate credit price (must be positive)
    if (config.pricing.creditPrice <= 0) {
      errors.push({
        field: 'creditPrice',
        message: 'Credit price must be greater than 0',
      });
    }

    // Validate credits per generation (must be positive)
    if (config.pricing.creditsPerGeneration <= 0) {
      errors.push({
        field: 'creditsPerGeneration',
        message: 'Credits per generation must be greater than 0',
      });
    }

    // Validate new user bonus credits (must be non-negative)
    if (config.security.newUserBonusCredits < 0) {
      errors.push({
        field: 'newUserBonusCredits',
        message: 'Bonus credits cannot be negative',
      });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [config]);

  /**
   * Update a specific setting
   */
  const updateSetting = useCallback(
    (updates: SystemConfigUpdate) => {
      updateConfig(updates);
      // Clear validation errors when user makes changes
      setValidationErrors([]);
    },
    [updateConfig]
  );

  /**
   * Save changes to backend
   */
  const saveChanges = useCallback(async () => {
    if (!validate() || !config) {
      return false;
    }

    setIsSaving(true);
    try {
      const updates: SystemConfigUpdate = {
        aiModel: {
          apiKey: config.aiModel.apiKey,
          version: config.aiModel.version,
          maintenanceMode: config.aiModel.maintenanceMode,
        },
        pricing: {
          creditPrice: config.pricing.creditPrice,
          creditsPerGeneration: config.pricing.creditsPerGeneration,
        },
        security: {
          emailVerificationRequired: config.security.emailVerificationRequired,
          newUserBonusCredits: config.security.newUserBonusCredits,
        },
      };

      const updatedConfig = await configService.updateConfig(updates);
      setConfig(updatedConfig);
      markClean();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save configuration';
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [config, validate, setConfig, markClean, setError]);

  /**
   * Reset to original configuration
   */
  const handleReset = useCallback(() => {
    resetConfig();
    setValidationErrors([]);
  }, [resetConfig]);

  /**
   * Check if a specific field has an error
   */
  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      return validationErrors.find((e) => e.field === fieldName)?.message;
    },
    [validationErrors]
  );

  return {
    // State
    config,
    loading,
    error,
    isDirty,
    isSaving,
    validationErrors,

    // Actions
    updateSetting,
    saveChanges,
    handleReset,
    getFieldError,
    clearError: () => setError(null),
  };
}
