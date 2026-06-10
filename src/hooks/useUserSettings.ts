import { useCallback, useState } from "react";
import axios from "axios";
import { authService } from "@/features/auth/api/auth.service";
import { updateUser } from "@/features/user/api/user.service";
import type { UpdateUserProfilePayload } from "@/features/user/user.types";
import { useAuthStore } from "@/features/auth/state/use-auth-store";

interface SettingsActionState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const initialActionState: SettingsActionState = {
  isLoading: false,
  error: null,
  success: null,
};

function getSettingsErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message =
      typeof error.response?.data === "object" && error.response?.data
        ? (error.response.data as { detail?: string; message?: string })
            .detail ||
          (error.response.data as { detail?: string; message?: string }).message
        : null;

    if (message) return message;
    if (error.response?.status === 400) return "Dữ liệu gửi lên không hợp lệ.";
    if (error.response?.status === 401) return "Phiên đăng nhập đã hết hạn.";
    if (error.response?.status === 403) return "Bạn không có quyền thực hiện thao tác này.";
    if (error.response?.status && error.response.status >= 500) {
      return "Server đang gặp lỗi. Vui lòng thử lại sau.";
    }
    if (!error.response) return "Không thể kết nối server. Vui lòng thử lại.";
  }

  return error instanceof Error ? error.message : fallback;
}

export function useUserSettings() {
  const userId = useAuthStore((state) => state.userId);
  const refreshCurrentUser = useAuthStore((state) => state.refreshCurrentUser);
  const [profileState, setProfileState] =
    useState<SettingsActionState>(initialActionState);
  const [passwordState, setPasswordState] =
    useState<SettingsActionState>(initialActionState);

  const submitProfile = useCallback(
    async (payload: UpdateUserProfilePayload) => {
      if (!userId) {
        setProfileState({
          isLoading: false,
          error: "Không tìm thấy user id.",
          success: null,
        });
        return false;
      }

      setProfileState({ isLoading: true, error: null, success: null });

      try {
        await updateUser(userId, {
          username: payload.username.trim(),
          email: payload.email.trim(),
        });
        await refreshCurrentUser();
        setProfileState({
          isLoading: false,
          error: null,
          success: "Profile updated successfully.",
        });
        return true;
      } catch (error) {
        setProfileState({
          isLoading: false,
          error: getSettingsErrorMessage(error, "Failed to update profile."),
          success: null,
        });
        return false;
      }
    },
    [refreshCurrentUser, userId]
  );

  const submitPassword = useCallback(
    async (payload: {
      current_password: string;
      new_password: string;
      confirm_password: string;
    }) => {
      if (!userId) {
        setPasswordState({
          isLoading: false,
          error: "Không tìm thấy user id.",
          success: null,
        });
        return false;
      }

      if (payload.new_password !== payload.confirm_password) {
        setPasswordState({
          isLoading: false,
          error: "Mật khẩu xác nhận không khớp.",
          success: null,
        });
        return false;
      }

      setPasswordState({ isLoading: true, error: null, success: null });

      try {
        await authService.changePassword(
          userId,
          payload.current_password,
          payload.new_password,
          payload.confirm_password
        );
        setPasswordState({
          isLoading: false,
          error: null,
          success: "Password changed successfully.",
        });
        return true;
      } catch (error) {
        setPasswordState({
          isLoading: false,
          error: getSettingsErrorMessage(error, "Failed to change password."),
          success: null,
        });
        return false;
      }
    },
    [userId]
  );

  const clearProfileMessage = useCallback(
    () => setProfileState((state) => ({ ...state, error: null, success: null })),
    []
  );
  const clearPasswordMessage = useCallback(
    () =>
      setPasswordState((state) => ({ ...state, error: null, success: null })),
    []
  );

  return {
    profileState,
    passwordState,
    submitProfile,
    submitPassword,
    clearProfileMessage,
    clearPasswordMessage,
  };
}

export default useUserSettings;
