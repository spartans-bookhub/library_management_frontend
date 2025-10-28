import apiClient from "../utils/axiosConfig";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Library Service Functions
export const libraryService = {
  // Get all books
  getAllBooks: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKS.GET_ALL);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch books");
    }
  },

  // Get book by ID
  getBookById: async (id) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.BOOKS.GET_BY_ID.replace(":id", id)
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch book");
    }
  },

  // Search books
  searchBooks: async (query) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKS.SEARCH, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Search failed");
    }
  },

  // Create new book
  createBook: async (bookData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.BOOKS.CREATE,
        bookData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create book");
    }
  },

  // Update book
  updateBook: async (id, bookData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.BOOKS.UPDATE.replace(":id", id),
        bookData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update book");
    }
  },

  // Delete book
  deleteBook: async (id) => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.BOOKS.DELETE.replace(":id", id)
      );
      console.log("Delete Book Response:", response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete book");
    }
  },

  // Issue book
  issueBook: async (bookId, userId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LIBRARY.ISSUE_BOOK, {
        bookId,
        userId,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to issue book");
    }
  },

  // Return book
  returnBook: async (bookId, userId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LIBRARY.RETURN_BOOK, {
        bookId,
        userId,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to return book");
    }
  },

  // Get issued books
  getIssuedBooks: async (userId) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.LIBRARY.GET_ISSUED_BOOKS,
        {
          params: { userId },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch issued books"
      );
    }
  },

  // Borrow multiple books
  borrowBooks: async (bookIds) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.LIBRARY.BORROW_BOOKS,
        {
          bookIds,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Failed to borrow books");
    }
  },

  // Get borrowed books
  getBorrowedBooks: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.LIBRARY.GET_BORROWED_BOOKS
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch borrowed books"
      );
    }
  },

  // Return borrowed book
  returnBorrowedBook: async (bookId) => {
    try {
      const response = await apiClient.post(
        `/api/v1/transactions/book/${bookId}/return`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to return book");
    }
  },

  // Get transaction history
  getHistory: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LIBRARY.GET_HISTORY);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch history"
      );
    }
  },

  // Get all transactions for admin
  getAllTransaction: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LIBRARY.GET_ALL_TRANSACTIONS);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch history"
      );
    }
  },

  // Get borrowing trend for admin
  getBorrowingTrend: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LIBRARY.GET_BORROWING_TREND);
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to borrowing trend"
      );
    }
  },

     // Get category trend for admin
  getCategoryTrend: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LIBRARY.GET_CATEGORY_TREND);
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch category trend"
      );
    }
  },
  
};
