// import type { User } from '../user.types';
import apiClient from "../../../services/ApiClient";
import type {
  BillingPlanResponse,
  CreateTransactionRequest,
  TransactionResponse,
} from "../billing.types";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export const getUserInfo = async () => {
//   try {
//     const response = await apiClient.get(`${API_BASE_URL}/users/me`);

//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user info:', error);
//     throw error;
//   }
// };

// src/features/billing/api/billing.service.ts
export const BillingService = {
  getPlans: async (): Promise<BillingPlanResponse[]> => {
    const response = await apiClient.get("/billing/plans");
    return response.data;
  },

  getHistory: async (
    userId: string,
    limit: number = 10
  ): Promise<TransactionResponse[]> => {
    //api chua hoan chinh
    const response = await apiClient.get(
      `/billing/history?user_id=${userId}&limit=${limit}`
    );
    return response.data;
  },

  createTransaction: async (
    data: CreateTransactionRequest
  ): Promise<TransactionResponse> => {
    const response = await apiClient.post("/credit_transactions/", data);
    return response.data;
  },

  getTransactionHistory: async (
    userId: string,
    limit: number = 10
  ): Promise<TransactionResponse[]> => {
    const response = await apiClient.get(
      `/credit_transactions/user/${userId}?limit=${limit}`
    );
    return response.data;
  },

  getTransactionDetail: async (txId: string): Promise<TransactionResponse> => {
    const response = await apiClient.get(`/credit_transactions/user/${txId}`);
    return response.data;
  },

  getUsersTransactions: async (
    userId: string,
    limit: number = 50
  ): Promise<TransactionResponse[]> => {
    const response = await apiClient.get(
      `/credit_transactions/user/${userId}?limit=${limit}`
    );
    return response.data;
  },
};
