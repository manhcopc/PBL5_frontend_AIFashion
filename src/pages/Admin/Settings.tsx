import { useState, useEffect } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  DollarSign,
  Shield,
} from "lucide-react";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { SettingSection } from "@/components/admin/SettingSection";
// import type { SystemConfigUpdate } from "@/features/admin/types/admin.types";

// Toast notification component
const Toast = ({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) => {
  const bgColor =
    type === "success"
      ? "bg-emerald-900/20 border-emerald-700/50"
      : "bg-red-900/20 border-red-700/50";
  const textColor = type === "success" ? "text-emerald-300" : "text-red-300";

  return (
    <div
      className={`fixed bottom-6 right-6 p-4 rounded-lg border ${bgColor} ${textColor} backdrop-blur-sm z-50 animate-in slide-in-from-bottom-4 duration-300`}
    >
      {message}
    </div>
  );
};

export const Settings = () => {
  const {
    config,
    loading,
    error,
    isDirty,
    isSaving,
    validationErrors,
    updateSetting,
    saveChanges,
    handleReset,
    getFieldError,
    // clearError,
  } = useSystemSettings();

  const [showApiKey, setShowApiKey] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Show toast on success/error
  useEffect(() => {
    if (error) {
      // setToast({ message: error, type: 'error' });
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-4" />
        <p className="text-zinc-400">Loading system settings...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-red-300">Failed to load system settings</p>
      </div>
    );
  }

  const handleSave = async () => {
    const success = await saveChanges();
    if (success) {
      setToast({ message: "Settings saved successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleApiKeyChange = (value: string) => {
    updateSetting({
      aiModel: {
        apiKey: value,
      },
    });
  };

  const handleModelVersionChange = (version: string) => {
    updateSetting({
      aiModel: {
        version: version as "gpt-4" | "gpt-3.5-turbo" | "claude-3" | "claude-2",
      },
    });
  };

  const handleMaintenanceModeChange = (enabled: boolean) => {
    updateSetting({
      aiModel: {
        maintenanceMode: enabled,
      },
    });
  };

  const handleCreditPriceChange = (value: string) => {
    updateSetting({
      pricing: {
        creditPrice: parseFloat(value) || 0,
      },
    });
  };

  const handleCreditsPerGenerationChange = (value: string) => {
    updateSetting({
      pricing: {
        creditsPerGeneration: parseInt(value) || 0,
      },
    });
  };

  const handleEmailVerificationChange = (enabled: boolean) => {
    updateSetting({
      security: {
        emailVerificationRequired: enabled,
      },
    });
  };

  const handleBonusCreditsChange = (value: string) => {
    updateSetting({
      security: {
        newUserBonusCredits: parseInt(value) || 0,
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Header */}
      <div className="border-b border-zinc-800 px-8 py-6">
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-zinc-400">
          Configure AI models, pricing, and security settings
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 pb-32">
        <div className="max-w-4xl space-y-6">
          {/* Error Alert */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
              <p className="font-medium text-red-300 mb-2">
                Validation Errors:
              </p>
              <ul className="space-y-1">
                {validationErrors.map((err, idx) => (
                  <li key={idx} className="text-sm text-red-200">
                    • {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Model Configuration Section */}
          <SettingSection
            title="AI Model Configuration"
            description="Configure your AI model settings and API keys"
            icon={<Zap className="w-5 h-5" />}
          >
            {/* API Key Input */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={config.aiModel.apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Enter your API key"
                  className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-purple-600/50 focus:ring-1 focus:ring-purple-600/30 transition-colors ${
                    getFieldError("apiKey")
                      ? "border-red-600/50"
                      : "border-zinc-700"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400 transition-colors"
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {getFieldError("apiKey") && (
                <p className="mt-1 text-sm text-red-400">
                  {getFieldError("apiKey")}
                </p>
              )}
            </div>

            {/* Model Version Dropdown */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Model Version
              </label>
              <select
                value={config.aiModel.version}
                onChange={(e) => handleModelVersionChange(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-600/50 focus:ring-1 focus:ring-purple-600/30 transition-colors"
              >
                <option value="gpt-4">GPT-4 (Latest)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3 (Opus)</option>
                <option value="claude-2">Claude 2</option>
              </select>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <div>
                <p className="font-medium text-white">Maintenance Mode</p>
                <p className="text-sm text-zinc-400">
                  Disable API access while performing maintenance
                </p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={config.aiModel.maintenanceMode}
                  onChange={(e) =>
                    handleMaintenanceModeChange(e.target.checked)
                  }
                  className="sr-only"
                />
                <div
                  className={`block w-full h-full rounded-full transition-colors ${
                    config.aiModel.maintenanceMode
                      ? "bg-purple-600"
                      : "bg-zinc-700"
                  }`}
                />
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    config.aiModel.maintenanceMode ? "translate-x-6" : ""
                  }`}
                />
              </label>
            </div>
          </SettingSection>

          {/* Pricing & Credits Section */}
          <SettingSection
            title="Pricing & Credits"
            description="Set credit pricing and generation costs"
            icon={<DollarSign className="w-5 h-5" />}
          >
            {/* Credit Price */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Credit Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={config.pricing.creditPrice}
                onChange={(e) => handleCreditPriceChange(e.target.value)}
                className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-purple-600/50 focus:ring-1 focus:ring-purple-600/30 transition-colors ${
                  getFieldError("creditPrice")
                    ? "border-red-600/50"
                    : "border-zinc-700"
                }`}
              />
              {getFieldError("creditPrice") && (
                <p className="mt-1 text-sm text-red-400">
                  {getFieldError("creditPrice")}
                </p>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                Example: 0.01 = $0.01 per credit
              </p>
            </div>

            {/* Credits Per Generation */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Credits Per Design Generation
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={config.pricing.creditsPerGeneration}
                onChange={(e) =>
                  handleCreditsPerGenerationChange(e.target.value)
                }
                className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-purple-600/50 focus:ring-1 focus:ring-purple-600/30 transition-colors ${
                  getFieldError("creditsPerGeneration")
                    ? "border-red-600/50"
                    : "border-zinc-700"
                }`}
              />
              {getFieldError("creditsPerGeneration") && (
                <p className="mt-1 text-sm text-red-400">
                  {getFieldError("creditsPerGeneration")}
                </p>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                Each design generation will cost this many credits
              </p>
            </div>
          </SettingSection>

          {/* Security Section */}
          <SettingSection
            title="Security"
            description="Configure security and user onboarding settings"
            icon={<Shield className="w-5 h-5" />}
          >
            {/* Email Verification Toggle */}
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <div>
                <p className="font-medium text-white">
                  Email Verification Required
                </p>
                <p className="text-sm text-zinc-400">
                  Require users to verify email before generating designs
                </p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={config.security.emailVerificationRequired}
                  onChange={(e) =>
                    handleEmailVerificationChange(e.target.checked)
                  }
                  className="sr-only"
                />
                <div
                  className={`block w-full h-full rounded-full transition-colors ${
                    config.security.emailVerificationRequired
                      ? "bg-purple-600"
                      : "bg-zinc-700"
                  }`}
                />
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    config.security.emailVerificationRequired
                      ? "translate-x-6"
                      : ""
                  }`}
                />
              </label>
            </div>

            {/* New User Bonus Credits */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                New User Bonus Credits
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={config.security.newUserBonusCredits}
                onChange={(e) => handleBonusCreditsChange(e.target.value)}
                className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-purple-600/50 focus:ring-1 focus:ring-purple-600/30 transition-colors ${
                  getFieldError("newUserBonusCredits")
                    ? "border-red-600/50"
                    : "border-zinc-700"
                }`}
              />
              {getFieldError("newUserBonusCredits") && (
                <p className="mt-1 text-sm text-red-400">
                  {getFieldError("newUserBonusCredits")}
                </p>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                New users will receive this many free credits upon signup
              </p>
            </div>
          </SettingSection>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-zinc-800 backdrop-blur-md px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isDirty && (
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
          <span className="text-sm text-zinc-400">
            {isDirty ? "Unsaved changes" : "All changes saved"}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={!isDirty || isSaving}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:opacity-50 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving || validationErrors.length > 0}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:opacity-50 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};
