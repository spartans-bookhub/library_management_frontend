import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Badge,
  ThemeProvider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  MenuBook as BookIcon,
  ShoppingCart as CartIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { typographyTheme } from "../../styles/typography";

const drawerWidth = 280;

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { getCartItemCount } = useCart();

  const menuItems = [
    {
      text: "My Dashboard",
      icon: <DashboardIcon />,
      path: "/student-dashboard",
    },
    {
      text: "Book List",
      icon: <BookIcon />,
      path: "/books",
    },
    {
      text: "My Cart",
      icon: <CartIcon />,
      path: "/cart",
      badge: getCartItemCount(),
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/userprofile",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    if (onClose) onClose();
  };

  const isSelected = (path) => location.pathname === path;

  const drawerContent = (
    <ThemeProvider theme={typographyTheme}>
      <Box
        sx={{
          width: drawerWidth,
          height: "100%",
          backgroundColor: "#efefef",
          borderRadius: 0,
        }}
      >
        <Box
          sx={{
            p: 3,
            backgroundColor: "#efefef",
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            BookNest
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.5, fontWeight: 500 }}
          >
            Library Management
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
          <List sx={{ pt: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isSelected(item.path)}
                  sx={{
                    mx: 2,
                    borderRadius: 2,
                    minHeight: 48,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                      boxShadow: 1,
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "white",
                      boxShadow: 1,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isSelected(item.path) ? "white" : "text.secondary",
                    }}
                  >
                    {item.badge > 0 ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    slotProps={{
                      primary: {
                        style: {
                          fontWeight: isSelected(item.path) ? 600 : 500,
                          fontSize: "0.95rem",
                        }
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Spacer to push logout to bottom */}
          <Box sx={{ flexGrow: 1 }} />

          <Divider sx={{ my: 2, mx: 2 }} />

          {/* Logout */}
          <List sx={{ pb: 2 }}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  minHeight: 48,
                  "&:hover": {
                    backgroundColor: "error.main",
                    color: "white",
                    boxShadow: 1,
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "error.main",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  slotProps={{
                    primary: {
                      style: {
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        color: "#d32f2f",
                      }
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </ThemeProvider>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
            boxShadow: 2,
            borderRadius: 0,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRadius: 0,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
