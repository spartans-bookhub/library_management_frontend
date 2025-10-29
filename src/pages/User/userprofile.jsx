import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Avatar, 
  Container,
  IconButton,
  Toolbar,
  ThemeProvider
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import EditProfile from "./editprofile";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Sidebar from "../../components/common/sidebar";
import { typographyTheme } from "../../styles/typography";

export default function UserProfile() {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading) {
    return (
      <ThemeProvider theme={typographyTheme}>
        <Typography textAlign="center" sx={{ mt: 4, fontWeight: 500 }}>
          Loading user profile...
        </Typography>
      </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <ThemeProvider theme={typographyTheme}>
        <Typography textAlign="center" sx={{ mt: 4, fontWeight: 500 }}>
          No user data available.
        </Typography>
      </ThemeProvider>
    );
  }

  const avatarContent = user.avatarUrl ? (
    <Avatar alt={user.userName} src={user.avatarUrl} sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
  ) : (
    <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}>
      {user.userName ? user.userName.charAt(0).toUpperCase() : "A"}
    </Avatar>
  );

  return (
    <ThemeProvider theme={typographyTheme}>
      <Box sx={{ display: "flex" }}>
        <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - 280px)` },
            ml: { md: `280px` },
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
          }}
        >
          {/* Mobile Header */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              backgroundColor: "white",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                }}
              >
                My Profile
              </Typography>
            </Toolbar>
          </Box>

          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4} justifyContent="center">
          
              {/* PROFILE */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                {avatarContent}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 0.5
                  }}
                >
                  {user.userName}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "text.secondary",
                    fontWeight: 500,
                    mb: 2
                  }}
                >
                  {user.email}
                </Typography>

                <Box sx={{ mt: 2, textAlign: "left", width: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2, p: 2, backgroundColor: "grey.50", borderRadius: 1.5 }}>
                    <PhoneIcon sx={{ color: "primary.main", mr: 1.5, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                      {user.contactNumber || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", p: 2, backgroundColor: "grey.50", borderRadius: 1.5 }}>
                    <LocationOnIcon sx={{ color: "error.main", mr: 1.5, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                      {user.address || "No address provided"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* RIGHT: EDIT PROFILE */}
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ 
                    mb: 3, 
                    fontWeight: 700, 
                    textAlign: "center",
                    color: "text.primary"
                  }}
                >
                  Edit Profile
                </Typography>
                <EditProfile />
              </Paper>
            </Grid>

            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
