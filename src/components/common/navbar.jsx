import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ShoppingCart as CartIcon } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import ProfileMenu from "./profilemenu";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box 
          display="flex" 
          alignItems="center" 
          gap={1.2} 
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
  >
          <MenuBookIcon sx={{ color: "secondary.main", fontSize: 28 }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              letterSpacing: 1,
              background: "linear-gradient(45deg, #f8f8f8ff, #ffffffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transition: "0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              }
            }}
          >
          Book Nest
        </Typography>
        </Box>             

        <Box display="flex" alignItems="center" gap={1}>
          {isAuthenticated ? (
            <>
              <IconButton 
                color="inherit" 
                onClick={handleCartClick}
                sx={{ mr: 1 }}//color: 'white' ?
              >
                <Badge badgeContent={getCartItemCount()} color="error">
                  <CartIcon />
                </Badge>
              </IconButton>   

            <ProfileMenu/>
            </>
          ) : (
          <>
            <Button
              color="inherit"
              component={RouterLink}
              to="/register"
              sx={{ mr: 2, '&:hover': { backgroundColor: '#90caf9' }, color: '#fff',fontWeight: 'bold' }}
            >
              Register
            </Button>

            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
              sx={{ mr: 2, '&:hover': { backgroundColor: '#90caf9' }, color: '#fff',fontWeight: 'bold' }}
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