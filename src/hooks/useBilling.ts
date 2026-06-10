import { useState, useCallback, useEffect, useRef } from "react";
import type {
  BillingPlan,
  CreateTransactionRequest,
  Transaction,
} from "../features/billing/billing.types";
import { BillingAPI } from "../features/billing/api";
import { BillingMapper } from "../features/billing/mappers/billingMapper";
import { updateUserSubscription } from "@/features/user/api/user.service";
import { useAuthStore } from "@/features/auth/state/use-auth-store";

interface UseBillingState {
  plans: BillingPlan[];
  history: Transaction[];
  loading: boolean;
  error: string | null;
  submittingPlanId: string | null;
}

export const useBilling = () => {
  const isSubmittingRef = useRef(false);
  const [state, setState] = useState<UseBillingState>({
    plans: [],
    history: [],
    loading: false,
    error: null,
    submittingPlanId: null,
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
    async (userId: string, credits: number, planId: string) => {
      if (isSubmittingRef.current) return false;
      isSubmittingRef.current = true;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        submittingPlanId: planId,
      }));

      try {
        const currentUser = useAuthStore.getState().user;
        const currentCredits = currentUser?.available_credits ?? 0;
        const nextCredits = currentCredits + credits;

        console.log("[Billing] Top-up requested", {
          userId,
          planId,
          currentCredits,
          creditsToAdd: credits,
          nextCredits,
        });

        const response = await updateUserSubscription(userId, nextCredits);
        const updatedCredits =
          typeof response?.available_credits === "number"
            ? response.available_credits
            : typeof response?.user?.available_credits === "number"
              ? response.user.available_credits
              : nextCredits;

        useAuthStore.getState().updateAvailableCredits(updatedCredits);
        console.log("Subscription updated successfully:", response);
        return true;
      } catch (error) {
        console.error("[Billing] Top-up failed:", error);
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Failed to subscribe to plan",
        }));
        return false;
      } finally {
        isSubmittingRef.current = false;
        setState((prev) => ({
          ...prev,
          loading: false,
          submittingPlanId: null,
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
