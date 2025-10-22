import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info", // success, error, warning, info
    duration: 6000
  });

  const showToast = (message, severity = "info", duration = 6000) => {
    setToast({
      open: true,
      message,
      severity,
      duration
    });
  };

  const showSuccess = (message, duration = 4000) => {
    showToast(message, "success", duration);
  };

  const showError = (message, duration = 6000) => {
    showToast(message, "error", duration);
  };

  const showWarning = (message, duration = 5000) => {
    showToast(message, "warning", duration);
  };

  const showInfo = (message, duration = 4000) => {
    showToast(message, "info", duration);
  };

  const hideToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast(prev => ({ ...prev, open: false }));
  };

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideToast} 
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};