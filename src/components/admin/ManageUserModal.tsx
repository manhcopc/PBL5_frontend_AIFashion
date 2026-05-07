import { useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface ManageUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  currentCredits: number;
  currentPlan: "Free" | "Pro" | "Enterprise";
  onTopUp: (amount: number) => Promise<boolean>;
  onPlanChange: (newPlan: "Free" | "Pro" | "Enterprise") => Promise<boolean>;
  isLoading?: boolean;
  error?: string | null;
}

export const ManageUserModal = ({
  isOpen,
  onClose,
  userName,
  currentCredits,
  currentPlan,
  onTopUp,
  onPlanChange,
  isLoading,
  error,
}: ManageUserModalProps) => {
  const [topUpAmount, setTopUpAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<
    "Free" | "Pro" | "Enterprise"
  >(currentPlan);
  const [activeTab, setActiveTab] = useState<"credits" | "plan">("credits");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleTopUp = async () => {
    const amount = parseInt(topUpAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      setLocalError("Please enter a valid positive number");
      return;
    }
    setLocalError(null);
    const success = await onTopUp(amount);
    if (success) {
      setTopUpAmount("");
      onClose();
    }
  };

  const handlePlanChange = async () => {
    if (selectedPlan === currentPlan) {
      setLocalError("Please select a different plan");
      return;
    }
    setLocalError(null);
    const success = await onPlanChange(selectedPlan);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Manage User</h2>
            <p className="text-sm text-zinc-400 mt-1">{userName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {(error || localError) && (
          <div className="mx-6 mt-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg flex items-gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error || localError}</p>
          </div>
        )}

        <div className="p-6">
          <div className="flex gap-2 mb-6 bg-zinc-800/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("credits")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "credits"
                  ? "bg-purple-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Top-Up Credits
            </button>
            <button
              onClick={() => setActiveTab("plan")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "plan"
                  ? "bg-purple-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Change Plan
            </button>
          </div>

          {activeTab === "credits" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Current Credits
                </label>
                <div className="p-3 bg-zinc-800/50 rounded-lg text-lg font-semibold text-purple-400">
                  {currentCredits.toLocaleString()}
                </div>
              </div>

              <div>
                <label
                  htmlFor="topup-amount"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Credits to Add
                </label>
                <input
                  id="topup-amount"
                  type="number"
                  min="1"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
                  disabled={isLoading}
                />
              </div>

              <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                <p className="text-sm text-blue-300">
                  <strong>Preview:</strong> New balance will be{" "}
                  <span className="font-semibold">
                    {(
                      currentCredits + (parseInt(topUpAmount, 10) || 0)
                    ).toLocaleString()}{" "}
                    credits
                  </span>
                </p>
              </div>

              <button
                onClick={handleTopUp}
                disabled={isLoading || !topUpAmount}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? "Processing..." : "Confirm Top-Up"}
              </button>
            </div>
          )}

          {activeTab === "plan" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Current Plan
                </label>
                <div className="p-3 bg-zinc-800/50 rounded-lg text-lg font-semibold text-amber-400">
                  {currentPlan}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Select New Plan
                </label>
                <div className="space-y-2">
                  {(["Free", "Pro", "Enterprise"] as const).map((plan) => (
                    <label
                      key={plan}
                      className="flex items-center p-3 border rounded-lg cursor-pointer transition-all"
                      style={{
                        borderColor:
                          selectedPlan === plan ? "#a78bfa" : "#3f3f46",
                        backgroundColor:
                          selectedPlan === plan ? "#5b21b6" : "transparent",
                      }}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan}
                        checked={selectedPlan === plan}
                        onChange={(e) =>
                          setSelectedPlan(
                            e.target.value as "Free" | "Pro" | "Enterprise"
                          )
                        }
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-medium text-white">
                        {plan}
                      </span>
                      {plan === currentPlan && (
                        <span className="ml-auto text-xs bg-zinc-700 px-2 py-1 rounded text-zinc-300">
                          Current
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePlanChange}
                disabled={isLoading || selectedPlan === currentPlan}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? "Processing..." : "Confirm Change"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
