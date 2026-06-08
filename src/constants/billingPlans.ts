export type BillingCycle = "monthly" | "annual";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  credits: string;
  isPopular?: boolean;
  features: string[];
  buttonLabel: string;
}

export const billingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free Starter",
    description: "50 credits/month",
    monthlyPrice: 0,
    annualPrice: 0,
    credits: "50",
    features: [
      "Up to 50 credits per month",
      "Basic AI design generation",
      "Project management",
      "Community support",
      "Single user account",
    ],
    buttonLabel: "Subscribe Now",
  },
  {
    id: "pro",
    name: "Pro Creator",
    description: "500 credits/month",
    monthlyPrice: 29,
    annualPrice: 290,
    credits: "500",
    isPopular: true,
    features: [
      "Up to 500 credits per month",
      "Advanced AI design generation",
      "Unlimited projects",
      "Priority support",
      "Up to 5 team members",
      "Custom style presets",
      "Batch processing",
    ],
    buttonLabel: "Subscribe Now",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Unlimited credits",
    monthlyPrice: 0,
    annualPrice: 0,
    credits: "Unlimited",
    features: [
      "Unlimited credits",
      "Premium AI generation",
      "Unlimited projects & team members",
      "24/7 dedicated support",
      "Custom integrations",
      "Advanced analytics",
      "SLA guarantee",
      "White-label options",
    ],
    buttonLabel: "Contact Sales",
  },
];
