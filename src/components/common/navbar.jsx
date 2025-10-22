import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ShoppingCart as CartIcon } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePDashboardClick = () => {
    handleProfileMenuClose();
    navigate("/dashboard");
  };

    const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate("/userprofile");
  };

  const handleLogoutClick = () => {
    handleProfileMenuClose();
    handleLogout();
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography 
          variant="h6" 
          component="div"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
        >
          Book Nest
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          {isAuthenticated ? (
            <>
              <IconButton 
                color="inherit" 
                onClick={handleCartClick}
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={getCartItemCount()} color="error">
                  <CartIcon />
                </Badge>
              </IconButton>

              <Avatar
                sx={{
                  cursor: "pointer",
                  bgcolor: "secondary.main",
                  width: 36,
                  height: 36,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: "secondary.dark",
                    transform: "scale(1.05)"
                  }
                }}
                onClick={handleProfileMenuOpen}
              >
                {getUserInitials(user?.userName)}
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                 <MenuItem onClick={handlePDashboardClick}>Dashboard</MenuItem>
                <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{ mr: 2 }}
              >
                Register
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}