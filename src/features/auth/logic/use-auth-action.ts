import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../api/auth.service";
import { useAuthStore } from "../state/use-auth-store";
import type { LoginRequest, RegisterRequest } from "../types/auth.types";

function getAuthErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const responseMessage =
      typeof err.response?.data === "object" && err.response?.data
        ? (err.response.data as { detail?: string; message?: string }).detail ||
          (err.response.data as { detail?: string; message?: string }).message
        : null;

    if (status === 400 || status === 401 || status === 404) {
      return responseMessage || "Email hoặc mật khẩu không đúng.";
    }

    if (status === 403) {
      return responseMessage || "Tài khoản không có quyền truy cập.";
    }

    if (status && status >= 500) {
      return "Server đang gặp lỗi. Vui lòng thử lại sau.";
    }

    if (err.code === "ECONNABORTED" || !err.response) {
      return "Không thể kết nối server. Kiểm tra mạng hoặc thử lại sau.";
    }
  }

  return err instanceof Error ? err.message : fallback;
}

export function useAuthActions() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await authService.login(credentials);
      console.log("Login response from service:", response);
      console.log("User data:", response.user);
      console.log("User token:", response.token);

      if (!response || !response.token || !response.user) {
        throw new Error("Invalid response from server");
      }

      // Normalize role to lowercase to ensure consistent comparison
      const normalizedUser = {
        ...response.user,
        role: response.user.role.toLowerCase(),
      };

      // Store auth state (token + user)
      setAuth(normalizedUser, response.token);
      console.log("Auth state after setAuth:", useAuthStore.getState());

      // Redirect based on user role
      if (normalizedUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/workspace", {
          replace: true,
          state: {
            userId: response.user.id,
          },
        });
      }
      return true;
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err, "Login failed");
      setError(errorMessage);
      console.error("Login error from action:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await authService.register(data);

      if (!response || !response.id || !response.email) {
        throw new Error("Invalid response from server");
      }

      setSuccess("Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.");
      return true;
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err, "Register failed");
      setError(errorMessage);
      console.error("Register error from action:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    handleLogin,
    handleRegister,
    clearAuthMessages,
    isLoading,
    error,
    success,
  };
}
