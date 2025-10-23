import React, { useState } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  ListItemIcon
} from "@mui/material";
import { Logout, Settings, Dashboard, DarkMode, LightMode } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../../context/ThemeContext";
import MenuBookIcon from '@mui/icons-material/MenuBook';


export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const {user, logout} = useAuth();
   const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

const getUserInitials = (name) => {
    if (!name) return "U";
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

   const handleLogoutClick = () => {
    handleClose();
    handleLogout();
  };

    const handleLogout = () => {
    logout();
    navigate("/login");
  };

      const handleProfileClick = () => {
    handleClose();
    navigate("/userprofile");
  };

    const handleDashboardClick = () => {
    handleClose();
    navigate("/dashboard");
  };

  const handleBookClick =() => {
    handleClose();
    navigate("/books");
  }

  return (
    <>
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
                onClick={handleClick} >
                {getUserInitials(user?.userName)}
            </Avatar> 
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography sx={{ px: 2, py: 1.2, fontWeight: 500 }}>{user?.userName}</Typography>
        <Divider />

        <MenuItem onClick={handleDashboardClick}>
          <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
          Dashboard
        </MenuItem>

         <MenuItem onClick={handleProfileClick}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          Profile Settings
        </MenuItem>

        <MenuItem onClick={handleBookClick}>
         <ListItemIcon> <MenuBookIcon fontSize="small" /> </ListItemIcon>
          Books
        </MenuItem>


        <MenuItem onClick={() => { toggleTheme(); handleClose(); }}>
          <ListItemIcon>
            {mode === "light" ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
          </ListItemIcon>
          {mode === "light" ? "Dark Mode" : "Light Mode"}
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogoutClick} sx={{ color: "error.main" }}>
          <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}