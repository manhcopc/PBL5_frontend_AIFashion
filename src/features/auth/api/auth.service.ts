// src/features/auth/api/auth.service.ts
// import axios from 'axios';
import apiClient from "../../../services/ApiClient";
import type {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  AuthResponse,
} from "../types/auth.types";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.log("Login data:", data);
    const response = await apiClient.post("/auth/login", data);
    console.log("Login response:", response);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
  changePassword: async (
    user_id: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const response = await apiClient.post(`/auth/change-password/${user_id}`, {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return response.data;
  },
};
