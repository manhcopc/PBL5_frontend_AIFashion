import apiClient from "../../../services/ApiClient";
import type { UpdateUserProfilePayload, User } from "../user.types";

export const fetchListUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserInfo = async (userId: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    const data = response.data as User | { user: User };

    return "user" in data ? data.user : data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const updateUserSubscription = async (
  userId: string,
  credits: number
) => {
  try {
    const response = await apiClient.patch(`/users/${userId}`, {
      available_credits: credits,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  data: UpdateUserProfilePayload
): Promise<User> => {
  try {
    const response = await apiClient.patch(`/users/${userId}`, data);
    const responseData = response.data as User | { user: User };
    return "user" in responseData ? responseData.user : responseData;
  } catch (error) {
    console.error("Error updating user account:", error);
    throw error;
  }
};
