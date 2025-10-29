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
  ThemeProvider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import ForgotPasswordDialog from "./forgotpassword";
import { typographyTheme } from "../../styles/typography";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [openForgot, setOpenForgot] = useState(false);

  function validate(data) {
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
      const { token, userId, userName, email, role, address, contactNumber } = data;
      
      
      // Use AuthContext login method
      login({
        userId,
        userName,
        email,
        role,
        address,
        contactNumber,

      }, token);
      
    if(role === 'ADMIN'){
         navigate("/admin-dashboard");
      }else{
      navigate("/books");
      }
    } catch (error) {
      setApiError(error.message || "Invalid email or password. Please try again.");
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
          Welcome Back
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
          Please sign in to your account
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

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
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
            <Box sx={{ textAlign: 'right' }}>
              <Link
                component="button"
                variant="body2"
                type="button"  
                onClick={()=>setOpenForgot(true)}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot Password?
              </Link>   
            </Box>
            <ForgotPasswordDialog
              open={openForgot}
              onClose={() => setOpenForgot(false)}
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
              Sign In
            </Button>

            <Typography 
              variant="body2" 
              align="center"
              sx={{ 
                mt: 3,
                color: 'text.secondary'
              }}
            >
              Don't have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/register")}
                sx={{
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Create Account
              </Link>
            </Typography>
          </Stack>
        </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
