// --- Credit Transactions ---
export interface CreateTransactionRequest {
  user_id: string; 
  transaction_type: 'TOP_UP' | 'USAGE'; 
  amount: number; 
  related_request_id?: string; 
}

export interface TransactionResponse extends CreateTransactionRequest {
  _id: string; 
  created_at: string; 
}

// --- Billing Plans ---
export interface BillingPlanResponse {
  _id: string; 
  plan_name: string; 
  price_per_month: number; 
  credits_per_month: number; 
  description: string; 
  is_popular: boolean; 
  features: string[]; 
  created_at: string; 
}