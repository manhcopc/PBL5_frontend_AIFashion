import { useState, useCallback, useEffect } from "react";
import type {
  BillingInfo,
  CreditPackage,
  PurchaseRequest,
  PurchaseResponse,
  BillingHistory,
} from "../features/billing/billing.types";
import { BillingAPI } from "../features/billing/api";
import { BillingMapper } from "../features/billing/mappers/billingMapper";

interface UseBillingState {
  billingInfo: BillingInfo | null;
  packages: CreditPackage[];
  history: BillingHistory[];
  loading: boolean;
  error: string | null;
}

export const useBilling = () => {
  const [state, setState] = useState<UseBillingState>({
    billingInfo: null,
    packages: [],
    history: [],
    loading: false,
    error: null,
  });

  // Fetch billing information
  const fetchBillingInfo = useCallback(async (userId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await BillingAPI.getBillingInfo(userId);
      const billingInfo = BillingMapper.mapBillingInfo(response);
      setState((prev) => ({ ...prev, billingInfo, loading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch billing info",
        loading: false,
      }));
    }
  }, []);

  // Fetch available credit packages
  const fetchPackages = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await BillingAPI.getAvailablePackages();
      const packages = response.map((pkg) =>
        BillingMapper.mapCreditPackage(pkg)
      );
      setState((prev) => ({ ...prev, packages, loading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to fetch packages",
        loading: false,
      }));
    }
  }, []);

  // Purchase credits
  const purchaseCredits = useCallback(
    async (request: PurchaseRequest) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await BillingAPI.purchaseCredits(request);
        const purchase = BillingMapper.mapPurchaseResponse(response);

        // Refresh billing info after purchase
        if (request.userId) {
          await fetchBillingInfo(request.userId);
        }

        return purchase;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to purchase credits";
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
        throw error;
      }
    },
    [fetchBillingInfo]
  );

  // Fetch billing history
  const fetchHistory = useCallback(async (userId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await BillingAPI.getBillingHistory(userId);
      const history = response.map((item) =>
        BillingMapper.mapBillingHistory(item)
      );
      setState((prev) => ({ ...prev, history, loading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to fetch history",
        loading: false,
      }));
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return {
    ...state,
    fetchBillingInfo,
    fetchPackages,
    fetchHistory,
    purchaseCredits,
    clearError,
  };
};
