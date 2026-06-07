import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/auth.service";
import { useAuthStore } from "../state/use-auth-store";
import type { LoginRequest, RegisterRequest } from "../types/auth.types";

export function useAuthActions() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
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
      const errorMessage =
        err instanceof Error ? err.message : "Login failed";
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
    try {
      const response = await authService.register(data);

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

      // Redirect based on user role
      if (normalizedUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/workspace", { replace: true });
      }
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Register failed";
      setError(errorMessage);
      console.error("Register error from action:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, handleRegister, isLoading, error };
}
