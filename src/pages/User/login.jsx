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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import ForgotPasswordDialog from "./forgotpassword";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [openForgot, setOpenForgot] = useState(false);

  function validate(data) {
    alert("validate")
    const err = {};

    if (!data.email) {
      err.email = "Email is required.";
    } else if (!emailRegex.test(data.email)) {
      err.email = "Email must be valid.";
    }

    if (!data.password) {
      err.password = "Password is required.";
    }

    return err;
  }

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const data = await authService.login(formData);
      console.log(data)
      alert(data)
      const { token, userId, userName, email, role, address, contactNumber } = data;
      
      
      // Use AuthContext login method
      login({
        userId,
        userName,
        email,
        role,
        address,
        contactNumber
      }, token);
      
      navigate("/books");
    } catch (error) {
      setApiError("Invalid email or password. Please try again.");
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
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
             <Typography variant="body2">
              <Link
                component="button"
                variant="body2"
                type="button"  
                onClick={()=>setOpenForgot(true) }>
                Forgot Password?
              </Link>   
             </Typography>
                <ForgotPasswordDialog
                  open={openForgot}
                  onClose={() => setOpenForgot(false)}
                />
            <Button variant="contained" type="submit" fullWidth>
              Login
            </Button>

            <Typography variant="body2" align="center">
              Don't have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/register")}
              >
                Register here
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
