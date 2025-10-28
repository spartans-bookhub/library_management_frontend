import React, { createContext, useContext, useState, useEffect } from "react";
import { libraryService } from "../services/libraryService";
import { useAuth } from "./AuthContext";

const BookContext = createContext();

export const useCart = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("Bookcart must be used within a bookProvider");
  }
  return context;
};

export const bookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch books from API when user is authenticated
  const fetchBooks = async () => {
    if (!isAuthenticated) {
      setBooks([]);
      return;
    }

    try {
      setLoading(true);
      const data = await libraryService.getAllBooks();
      console.log("getallbooks", data)
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Load cart when authentication status changes
  useEffect(() => {
    fetchBooks();
  }, [isAuthenticated]);

  const addToBook = async (book) => {
    if (!isAuthenticated) {
      throw new Error("Please login to add items to cart");
    }

    try {
      // Check if book is already in cart
      const existingItem = cartItems.find(item => item.bookId === book.bookId);
      if (existingItem) {
        throw new Error("Book is already in your cart");
      }

      await libraryService.addToBook(book.bookId);
      // Refresh cart from API to get updated data
      await fetchBooks();
    } catch (error) {
      throw error;
    }
  };

  const removeBook = async (bookId) => {
    if (!isAuthenticated) {
      throw new Error("Please login to remove items from cart");
    }

    try {
      await cartService.removeBook(bookId);
      // Refresh cart from API to get updated data
      await fetchBooks();
    } catch (error) {
      throw error;
    }
  };

  // const clearCart = async () => {
  //   if (!isAuthenticated) {
  //     throw new Error("Please login to clear cart");
  //   }

  //   try {
  //     await cartService.clearCart();
  //     // Refresh cart from API to get updated data
  //     await fetchBooks();
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  // const getCartItemCount = () => {
  //   return cartItems.length; // Since each book can only have quantity 1
  // };

  // const isInCart = (bookId) => {
  //   return cartItems.some(item => item.bookId === bookId);
  // };

  // const getItemQuantity = (bookId) => {
  //   const item = cartItems.find(item => item.bookId === bookId);
  //   return item ? 1 : 0; // Always 1 if in cart, 0 if not
  // };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    getCartItemCount,
    isInCart,
    getItemQuantity,
    fetchBooks,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};