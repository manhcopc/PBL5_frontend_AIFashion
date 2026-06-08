import { useState, useCallback, useEffect } from "react";
import type {
  BillingPlan,
  CreateTransactionRequest,
  Transaction,
} from "../features/billing/billing.types";
import { BillingAPI } from "../features/billing/api";
import { BillingMapper } from "../features/billing/mappers/billingMapper";
import { updateUserSubscription } from "@/features/user/api/user.service";

interface UseBillingState {
  plans: BillingPlan[];
  history: Transaction[];
  loading: boolean;
  error: string | null;
}

export const useBilling = () => {
  const [state, setState] = useState<UseBillingState>({
    plans: [],
    history: [],
    loading: false,
    error: null,
  });

  const fetchPlans = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await BillingAPI.getPlans();
      const plans = BillingMapper.mapPlansResponseToModels(response);
      setState((prev) => ({ ...prev, plans, loading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to fetch plans",
        loading: false,
      }));
    }
  }, []);

  const fetchHistory = useCallback(async (userId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await BillingAPI.getTransactionHistory(userId);
      const history = BillingMapper.mapTransactionsResponseToModels(response);
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

  // this function is a placeholder for the actual subscription logic, which would typically involve calling an API endpoint to create a subscription for the user. For now, it simulates a successful subscription with a timeout.
  // But it now uses user route to update the subscription
  const submitSubscription = useCallback(
    async (userId: string, credits: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        // Implement subscription logic here (e.g., call API to subscribe)
        // For now, we'll just simulate a successful subscription
        const response = await updateUserSubscription(userId, credits);
        console.log("Subscription updated successfully:", response);
        setState((prev) => ({ ...prev, loading: false }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Failed to subscribe to plan",
          loading: false,
        }));
      }
    },
    []
  );

  const createTransaction = useCallback(
    async (request: CreateTransactionRequest) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await BillingAPI.createTransaction(request);
        const transaction =
          BillingMapper.mapTransactionResponseToModel(response);
        setState((prev) => ({
          ...prev,
          history: [transaction, ...prev.history],
          loading: false,
        }));
        return transaction;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create transaction";
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
        throw error;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

  return {
    ...state,
    fetchPlans,
    fetchHistory,
    submitSubscription,
    createTransaction,
    clearError,
  };
};
