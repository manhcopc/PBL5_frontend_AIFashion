import type {
  BillingPlanResponse,
  CreateTransactionRequest,
  TransactionResponse,
} from "../billing.types";

// Mock billing plans data
const mockBillingPlans: BillingPlanResponse[] = [
  {
    _id: "plan_starter",
    plan_name: "Starter",
    price_per_month: 9.99,
    credits_per_month: 100,
    description: "Perfect for getting started",
    is_popular: false,
    features: ["100 credits/month", "Basic support", "Email notifications"],
    created_at: new Date().toISOString(),
  },
  {
    _id: "plan_professional",
    plan_name: "Professional",
    price_per_month: 29.99,
    credits_per_month: 500,
    description: "Best for professionals",
    is_popular: true,
    features: [
      "500 credits/month",
      "Priority support",
      "Advanced analytics",
      "API access",
    ],
    created_at: new Date().toISOString(),
  },
  {
    _id: "plan_enterprise",
    plan_name: "Enterprise",
    price_per_month: 99.99,
    credits_per_month: 2000,
    description: "For large teams",
    is_popular: false,
    features: [
      "2000 credits/month",
      "24/7 dedicated support",
      "Custom integrations",
      "Team management",
    ],
    created_at: new Date().toISOString(),
  },
];

// Mock transaction history
const mockTransactionHistory: TransactionResponse[] = [
  {
    _id: "tx_001",
    user_id: "user_123",
    transaction_type: "TOP_UP",
    amount: 100,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "tx_002",
    user_id: "user_123",
    transaction_type: "USAGE",
    amount: 50,
    related_request_id: "req_001",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "tx_003",
    user_id: "user_123",
    transaction_type: "USAGE",
    amount: 25,
    related_request_id: "req_002",
    created_at: new Date().toISOString(),
  },
];

export const BillingMockService = {
  getPlans: async (): Promise<BillingPlanResponse[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockBillingPlans), 300);
    });
  },

  getHistory: async (userId: string, limit: number = 10) => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            mockTransactionHistory
              .filter((tx) => tx.user_id === userId)
              .slice(0, limit)
          ),
        300
      );
    });
  },

  createTransaction: async (
    data: CreateTransactionRequest
  ): Promise<TransactionResponse> => {
    const newTransaction: TransactionResponse = {
      ...data,
      _id: `tx_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(newTransaction), 300);
    });
  },

  getTransactionHistory: async (userId: string, limit: number = 10) => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            mockTransactionHistory
              .filter((tx) => tx.user_id === userId)
              .slice(0, limit)
          ),
        300
      );
    });
  },

  getTransactionDetail: async (txId: string): Promise<TransactionResponse> => {
    const transaction = mockTransactionHistory.find((tx) => tx._id === txId);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (transaction) {
          resolve(transaction);
        } else {
          reject(new Error("Transaction not found"));
        }
      }, 300);
    });
  },
};
