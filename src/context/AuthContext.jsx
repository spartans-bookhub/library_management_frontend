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
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  // const [userId, setUserId] = useState(() => {
  //   const storedUserId = localStorage.getItem("userId");
  //   return storedUserId ? Number(storedUserId) : null;
  // });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {  
      console.log('AuthProvider user state:');
    // Check if token exists in localStorage on app startup
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // Save token to localStorage
     console.log('AuthProvider login:');
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Save user data to context state
    setUser(userData);
    // setUserId(userData.userId)
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    
    // Clear user data from context
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) =>{
    // Merge userId from state with updatedUser data 
    setUser(prevUser => {
    const newUser = {
      ...updatedUser,
      userId: prevUser?.userId,  // get userId from existing user state
    };
     setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return newUser;
    });
   
  }

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
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};