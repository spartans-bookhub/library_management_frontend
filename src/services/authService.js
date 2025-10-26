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
      console.log(response)
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Login failed");
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


  // Forgot password
  sendResetLink: async ({email}) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {email});
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to send reset link. Try again.");
      throw error;
    }
  },

    // Forgot password
  resetPassword: async ({ resetToken, newPassword }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD,{ resetToken, newPassword } );
      return response.data;
    } catch (error) {
      console.error(error.response?.data || "Failed to send reset link. Try again.");
      throw error;
    }
  },

};
