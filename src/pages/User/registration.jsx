import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$/;
const contactNumberRegex = /^(?:\+91|91)?[789]\d{9}$/;

export default function Registration() {

  // Used for navigation 
  const navigate = useNavigate();

  // Set the initial State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    contactNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  // Validate inputs, returns errors object
  function validate(data) {
    const err = {};

    if (!data.email) {
      err.email = "Login email is required.";
    } else if (!emailRegex.test(data.email)) {
      err.email = "Email id must be valid.";
    }

    if (!data.password) {
      err.password = "Password is required.";
    } else if (!passwordRegex.test(data.password)) {
      err.password =
        "Password must contain at least one digit, one uppercase letter, one lowercase letter, one special character and be at least 6 characters.";
    }

    if (!data.name) {
      err.name = "Name is required.";
    }

    if (!data.contactNumber) {
      err.contactNumber = "Contact number is required.";
    } else if (!contactNumberRegex.test(data.contactNumber)) {
      err.contactNumber = "Invalid mobile number.";
    }

    if (!data.address) {
      err.address = "Address is required.";
    }

    return err;
  }

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    setApiSuccess("");

    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await authService.register(formData);
      setApiSuccess("Registered successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setApiError(error.message || "Failed to register. Please try again.");
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
          Create Account
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        {apiSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {apiSuccess}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              fullWidth
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
              fullWidth
            />

            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              fullWidth
            />

            <TextField
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              error={!!errors.contactNumber}
              helperText={errors.contactNumber}
              required
              fullWidth
            />

            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              multiline
              rows={3}
              fullWidth
            />

            <Button variant="contained" type="submit" fullWidth>
              Register
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
