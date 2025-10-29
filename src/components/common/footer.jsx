import React from "react";
import { Box, Container, Typography, Link, ThemeProvider } from "@mui/material";
import { MenuBook as BookIcon } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { typographyTheme } from "../../styles/typography";

const Footer = () => {
  const location = useLocation();

  const pagesWithoutSidebar = ["/", "/login", "/register", "/reset-password"];
  const showBranding = pagesWithoutSidebar.includes(location.pathname);

  return (
    <ThemeProvider theme={typographyTheme}>
      <Box
        component="footer"
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          py: 2,
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          {showBranding ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                px: { xs: 2, md: 0 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BookIcon sx={{ fontSize: 28 }} />
                <Typography
                  variant="h6"
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
                  opacity: 0.8,
                  fontSize: "0.875rem",
                }}
              >
                © 2025 BookNest Library Management System. All rights reserved.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                py: 1,
                ml: { md: "280px" },
                px: { xs: 2, md: 0 },
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
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;
