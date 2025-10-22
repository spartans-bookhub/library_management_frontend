import apiClient from "../utils/axiosConfig";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (error) {
      console.error("Logout API failed:", error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.USER.UPDATE_PROFILE,
        userData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },
};
