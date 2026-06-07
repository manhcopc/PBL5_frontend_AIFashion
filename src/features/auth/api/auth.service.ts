// src/features/auth/api/auth.service.ts
// import axios from 'axios';
import apiClient from "../../../services/ApiClient";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "../types/auth.types";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.log("Login data:", data);
    const response = await apiClient.post("/auth/login", data);
    console.log("Login response:", response);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
  getCurrentUser: async (): Promise<User> => {
    // Lưu ý: Hỏi lại Backend xem endpoint để lấy thông tin user là gì.
    // Thường là /auth/me, /users/me hoặc /profile
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
