import React, { createContext, useContext, useState, useEffect } from "react";

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

  // Load cart from localStorage on app startup
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.bookId === book.bookId);
      
      if (existingItem) {
        // Book already in cart - no change (only 1 copy can be borrowed)
        return prevItems;
      } else {
        // Add new book to cart with quantity 1 (fixed for library borrowing)
        return [...prevItems, { ...book, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.bookId !== bookId));
  };

  const clearCart = () => {
    setCartItems([]);
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
    addToCart,
    removeFromCart,
    clearCart,
    getCartItemCount,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};