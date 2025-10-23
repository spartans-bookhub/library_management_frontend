import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../constants/apiEndpoints";

const ForgotPasswordDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendResetLink = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, { email });
      setMessage(response.data.message || "Password reset link sent! Check your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setMessage("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          width: "100%",
          maxWidth: 400,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Reset Password
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, textAlign: "center", color: "text.secondary" }}>
          Enter your registered email address and we’ll send you a link to reset your password.
        </Typography>

        <TextField
          label="Email Address"
          type="email"
          fullWidth
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            mb: 2,
          }}
        />

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 3,
          pb: 2,
        }}
      >
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>

        <Button
          onClick={handleSendResetLink}
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            minWidth: 120,
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Send Link"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordDialog;