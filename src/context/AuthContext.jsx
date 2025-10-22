import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage on app startup
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // Save token to localStorage
    localStorage.setItem("token", token);
    
    // Save user data to context state
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    
    // Clear user data from context
    setUser(null);
    setIsAuthenticated(false);
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};