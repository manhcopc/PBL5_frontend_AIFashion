import apiClient from "@/services/ApiClient";
import type {
  CreateSubscriptionPlanPayload,
  SubscriptionPlan,
  UpdateSubscriptionPlanPayload,
} from "../subscription.types";

const SUBSCRIPTION_PLANS_ENDPOINT = "/subscription_plans/";

export const subscriptionService = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.get<SubscriptionPlan[]>(
      SUBSCRIPTION_PLANS_ENDPOINT
    );
    return response.data;
  },

  getPlan: async (planId: string): Promise<SubscriptionPlan> => {
    const response = await apiClient.get<SubscriptionPlan>(
      `${SUBSCRIPTION_PLANS_ENDPOINT}${planId}`
    );
    return response.data;
  },

  createPlan: async (
    payload: CreateSubscriptionPlanPayload
  ): Promise<SubscriptionPlan> => {
    const response = await apiClient.post<SubscriptionPlan>(
      SUBSCRIPTION_PLANS_ENDPOINT,
      payload
    );
    return response.data;
  },

  updatePlan: async (
    planId: string,
    payload: UpdateSubscriptionPlanPayload
  ): Promise<SubscriptionPlan> => {
    const response = await apiClient.patch<SubscriptionPlan>(
      `${SUBSCRIPTION_PLANS_ENDPOINT}${planId}`,
      payload
    );
    return response.data;
  },

  deletePlan: async (planId: string): Promise<void> => {
    await apiClient.delete(`${SUBSCRIPTION_PLANS_ENDPOINT}${planId}`);
  },
};
