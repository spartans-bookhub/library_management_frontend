import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import { API_BASE_URL, API_ENDPOINTS } from "../../constants/apiEndpoints";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL
  const resetToken = new URLSearchParams(location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`, {
        resetToken,
        newPassword,
      });
      alert(res.data);
      console.log(res)
      setMessage(res.data.message || "Password reset successful!");
      // Redirect to login page after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data || "Failed to reset password.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Change Password
          </Button>
        </form>
        {message && <Alert sx={{ mt: 2 }} severity="success">{message}</Alert>}
        {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
};

export default ResetPassword;