import apiClient from "../utils/axiosConfig";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Notification Service Functions
export const notificationService = {
  // Get all notifications
  getAllNotifications: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch notifications");
    }
  },
};