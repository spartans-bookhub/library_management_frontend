import { useState } from "react";
import "./App.css";
import Registration from "./components/user/registration";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/navbar";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
// import BookList from "./pages/Books/BookList";
import BookSearch from "./pages/Books/BookSearch";
import Cart from "./pages/Cart/Cart";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserProfile from "./components/user/userprofile";
import ResetPassword from "./components/user/resetpassword";

function App() {
  const [count, setCount] = useState(0);

  const currentUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?img=5',
  bio: 'Frontend developer passionate about React and Material UI.',
};

  return (
    <>
      <ToastProvider>
         <AuthProvider>
         <CartProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                    
                  } 
                />
                <Route 
                  path="/books" 
                  element={
                    <ProtectedRoute>
                      {/* <BookList /> */}
                      <BookSearch />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/cart" 
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } 
                />
             
               <Route 
                  path="/userprofile" 
                  element={
                    <ProtectedRoute>
                      <UserProfile user={currentUser} />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider> 
      </ToastProvider>
    </>
  );
}

export default App;
