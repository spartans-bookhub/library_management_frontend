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
  Link,
  ThemeProvider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { typographyTheme } from "../../styles/typography";

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
    <ThemeProvider theme={typographyTheme}>
      <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 2 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            textAlign: 'center',
            mb: 2,
            color: 'text.primary'
          }}
        >
          Create Account
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center',
            color: 'text.secondary',
            mb: 4,
            fontWeight: 500
          }}
        >
          Join us and start your journey today
        </Typography>

        {apiError && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 1.5,
              fontWeight: 500
            }}
          >
            {apiError}
          </Alert>
        )}
        {apiSuccess && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: 1.5,
              fontWeight: 500
            }}
          >
            {apiSuccess}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              fullWidth
              sx={{
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                },
              }}
            />

            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              fullWidth
              sx={{
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                },
              }}
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
              sx={{
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                },
              }}
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
              sx={{
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                },
              }}
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
              sx={{
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                },
              }}
            />

            <Button 
              variant="contained" 
              type="submit" 
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 3,
                },
              }}
            >
              Create Account
            </Button>
          </Stack>
        </Box>

        <Typography 
          variant="body2" 
          align="center"
          sx={{ 
            mt: 3,
            color: 'text.secondary'
          }}
        >
          Already have an account?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/login")}
            sx={{
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign In
          </Link>
        </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
