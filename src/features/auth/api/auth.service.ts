// src/features/auth/api/auth.service.ts
// import axios from 'axios';
import apiClient from "../../../services/ApiClient";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../types/auth.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.log(`API_BASE_URL ${API_BASE_URL}/auth/login`);
    console.log("Login data:", data);
    const response = await apiClient.post(`${API_BASE_URL}/auth/login`, data);
    console.log("Login response:", response);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post(
      `${API_BASE_URL}/auth/register`,
      data
    );
    return response.data;
  },
};
