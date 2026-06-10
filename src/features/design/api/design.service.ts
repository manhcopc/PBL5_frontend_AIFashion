// import type { User } from '../user.types';
import apiClient from "../../../services/ApiClient";
import type { CreateDesignRequest, DesignResponse } from "../design.types";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DesignService = {
  createDesign: async (data: CreateDesignRequest): Promise<DesignResponse> => {
    const response = await apiClient.post(`/generated_designs/`, data);
    return response.data;
  },

  listByRequest: async (reqId: string): Promise<DesignResponse[]> => {
    const response = await apiClient.get(`/generated_designs/request/${reqId}`);
    return response.data;
  },

  getDesign: async (id: string): Promise<DesignResponse> => {
    const response = await apiClient.get(`/generated_designs/${id}`);
    return response.data;
  },

  rateDesign: async (id: string, rating: number): Promise<DesignResponse> => {
    const response = await apiClient.patch(`/generated_designs/${id}/rate`, {
      user_rating: rating,
    });
    return response.data;
  },

  deleteDesign: async (id: string) =>
    apiClient.delete(`/generated_designs/${id}`),
};
