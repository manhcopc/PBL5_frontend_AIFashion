export interface SubscriptionPlan {
  _id: string;
  plan_name: string;
  price_per_month: number;
  credits_per_month: number;
  description: string;
  is_popular: boolean;
  features: string[];
  created_at: string;
}

export interface CreateSubscriptionPlanPayload {
  plan_name: string;
  price_per_month: number;
  credits_per_month: number;
  description: string;
  is_popular: boolean;
  features: string[];
}

export interface UpdateSubscriptionPlanPayload {
  plan_name?: string;
  price_per_month?: number;
  credits_per_month?: number;
  description?: string;
  is_popular?: boolean;
  features?: string[];
}
