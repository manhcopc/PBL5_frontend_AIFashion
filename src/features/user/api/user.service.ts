// import type { User } from '../user.types';
import apiClient from '../../../services/ApiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserInfo = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/users/me`);

    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

