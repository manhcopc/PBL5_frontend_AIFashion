// src/features/auth/api/auth.service.ts
// import axios from 'axios';
import apiClient from "../../../services/ApiClient";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
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
  getCurrentUser: async (): Promise<User> => {
    // Lưu ý: Hỏi lại Backend xem endpoint để lấy thông tin user là gì.
    // Thường là /auth/me, /users/me hoặc /profile
    const response = await apiClient.get(`${API_BASE_URL}/auth/me`);
    return response.data;
  },
};
