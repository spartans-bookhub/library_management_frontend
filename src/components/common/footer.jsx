import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  ThemeProvider,
} from "@mui/material";
import { MenuBook as BookIcon } from "@mui/icons-material";
import { typographyTheme } from "../../styles/typography";

const Footer = () => {
  return (
    <ThemeProvider theme={typographyTheme}>
      <Box
        component="footer"
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          py: 4,
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          {/* Brand Section */}
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <BookIcon sx={{ fontSize: 32 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                BookNest
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                lineHeight: 1.6,
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Your digital library companion. Discover, borrow, and manage your
              favorite books with ease. Building a community of readers, one
              book at a time.
            </Typography>
          </Box>

          <Divider
            sx={{
              my: 3,
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                fontSize: "0.875rem",
              }}
            >
              © 2025 BookNest Library Management System. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;
