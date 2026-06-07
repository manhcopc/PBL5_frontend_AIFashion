// import type { User } from '../user.types';
import apiClient from "../../../services/ApiClient";

export const fetchListUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await apiClient.get("/users/me");

    return response.data;
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
