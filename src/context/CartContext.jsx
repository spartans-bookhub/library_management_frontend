import React, { createContext, useContext, useState, useEffect } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart from API when user is authenticated
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Load cart when authentication status changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (book) => {
    if (!isAuthenticated) {
      throw new Error("Please login to add items to cart");
    }

    try {
      // Check if book is already in cart
      const existingItem = cartItems.find(item => item.bookId === book.bookId);
      if (existingItem) {
        throw new Error("Book is already in your cart");
      }

      await cartService.addToCart(book.bookId);
      // Refresh cart from API to get updated data
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (bookId) => {
    if (!isAuthenticated) {
      throw new Error("Please login to remove items from cart");
    }

    try {
      await cartService.removeFromCart(bookId);
      // Refresh cart from API to get updated data
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      throw new Error("Please login to clear cart");
    }

    try {
      await cartService.clearCart();
      // Refresh cart from API to get updated data
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const getCartItemCount = () => {
    return cartItems.length; // Since each book can only have quantity 1
  };

  const isInCart = (bookId) => {
    return cartItems.some(item => item.bookId === bookId);
  };

  const getItemQuantity = (bookId) => {
    const item = cartItems.find(item => item.bookId === bookId);
    return item ? 1 : 0; // Always 1 if in cart, 0 if not
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    getCartItemCount,
    isInCart,
    getItemQuantity,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};