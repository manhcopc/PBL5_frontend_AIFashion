import type {
  BillingPlanResponse,
  TransactionResponse,
  BillingPlan,
  Transaction,
} from "../billing.types";

export const BillingMapper = {
  mapPlanResponseToModel: (response: BillingPlanResponse): BillingPlan => ({
    id: response._id,
    name: response.plan_name,
    pricePerMonth: response.price_per_month,
    creditsPerMonth: response.credits_per_month,
    description: response.description,
    isPopular: response.is_popular,
    features: response.features,
    createdAt: new Date(response.created_at),
  }),

  mapPlansResponseToModels: (responses: BillingPlanResponse[]): BillingPlan[] =>
    responses.map(BillingMapper.mapPlanResponseToModel),

  mapTransactionResponseToModel: (
    response: TransactionResponse
  ): Transaction => ({
    id: response._id,
    userId: response.user_id,
    type: response.transaction_type,
    amount: response.amount,
    relatedRequestId: response.related_request_id,
    createdAt: new Date(response.created_at),
  }),

  mapTransactionsResponseToModels: (
    responses: TransactionResponse[]
  ): Transaction[] =>
    responses.map(BillingMapper.mapTransactionResponseToModel),
};
