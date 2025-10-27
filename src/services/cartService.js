import apiClient from "../utils/axiosConfig";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const cartService = {
  getCart: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART.GET);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch cart");
    }
  },

  addToCart: async (bookId) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.CART.ADD.replace(":id", bookId)
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to add book to cart"
      );
    }
  },

  removeFromCart: async (bookId) => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.CART.REMOVE.replace(":id", bookId)
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to remove book from cart"
      );
    }
  },

  clearCart: async () => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CART.CLEAR);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to clear cart");
    }
  },
};
