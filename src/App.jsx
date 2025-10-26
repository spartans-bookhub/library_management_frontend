import { useState } from "react";
import "./App.css";
import Registration from "./pages/User/registration";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/navbar";
import Login from "./pages/User/login";
import Dashboard from "./pages/Dashboard/StudentDashboard";
import BookList from "./pages/Books/BookList";
import BookSearch from "./pages/Books/BookSearch";
import Cart from "./pages/Cart/Cart";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserProfile from "./pages/User/userprofile";
import ResetPassword from "./pages/User/resetpassword";
import NotFound from "./pages/OtherPages/NotFound";
import Home from "./components/Home";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
// import TransactionTable from "./pages/Dashboard/TransactionTable";

function App() {
  const port = window.location.port;
  console.log(`Port: ${port}`)
  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute>
                      {/* <Dashboard /> */}
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                 {/* <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <TransactionTable />
                    </ProtectedRoute>
                  }
                /> */}
                 <Route
                  path="/student-dashboard"
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
                      <BookList />
                      {/* <BookSearch /> */}
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
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
                {/* <Route path="/admin" element={ <AdminDashboard/>} /> */}
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </>
  );
}

export default App;
