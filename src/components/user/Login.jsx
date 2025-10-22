import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { TextField, Button, Typography, InputAdornment, IconButton } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Login data:", values);
      // Authentication logic here
      navigate("/dashboard");
    },
  });

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100 bg-light"
    >
      <Row className="w-100 justify-content-center mx-0">
        <Col xs={11} sm={9} md={7} lg={5} xl={4}>
          <Card className="p-4 shadow-lg rounded-4 border-0">
            <Typography
              variant="h5"
              className="text-center mb-4 fw-semibold text-primary"
            >
              Login
            </Typography>

            <form onSubmit={formik.handleSubmit} noValidate>
              {/* Email Field */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                margin="normal"
                variant="outlined"
              />

              {/* Password Field with Toggle */}
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                margin="normal"
                variant="outlined"
               
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontWeight: "bold",
                  borderRadius: "10px",
                  fontSize: "1rem",
                }}
              >
                Login
              </Button>

              {/* Register Redirect */}
              <Typography
                variant="body2"
                className="text-center mt-3"
                sx={{ cursor: "pointer", color: "primary.main" }}
                onClick={() => navigate("/register")}
              >
                Don’t have an account? Register here
              </Typography>
            </form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
