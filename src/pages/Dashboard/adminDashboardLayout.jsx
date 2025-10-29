import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Toolbar,
  ThemeProvider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Menu as MenuIcon, MenuBook as BookIcon } from "@mui/icons-material";
import {
  Dashboard as DashboardIcon,
  MenuBook,
  SwapHoriz,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import Analytics from "./Analytics";
import AdminDashboard from "./AdminDashboard";
import TransactionTable from "./TransactionTable";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { typographyTheme } from "../../styles/typography";

export default function AdminDashboardLayout() {
  const [activePanel, setActivePanel] = useState("analytics-dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    switch (activePanel) {
      case "analytics-dashboard":
        return <Analytics />;
      case "books":
        return <AdminDashboard />;
      case "transactions":
        return <TransactionTable />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminMenuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      panel: "analytics-dashboard",
    },
    {
      text: "Books Inventory",
      icon: <MenuBook />,
      panel: "books",
    },
    {
      text: "Transactions",
      icon: <SwapHoriz />,
      panel: "transactions",
    },
  ];

  const handleNavigation = (panel) => {
    setActivePanel(panel);
    setMobileOpen(false);
  };

  const isSelected = (panel) => activePanel === panel;

  const drawerWidth = 280;

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BookIcon sx={{ color: "primary.main", fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              BookNest Admin
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.5, fontWeight: 500 }}
          >
            Library Management
          </Typography>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 120px)",
          }}
        >
          <List sx={{ pt: 2 }}>
            {adminMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.panel)}
                  selected={isSelected(item.panel)}
                  sx={{
                    mx: 2,
                    borderRadius: 2,
                    minHeight: 48,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    },
                    "&:hover": {
                      backgroundColor: isSelected(item.panel)
                        ? "primary.dark"
                        : "action.hover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isSelected(item.panel) ? "white" : "primary.main",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    slotProps={{
                      primary: {
                        style: {
                          fontWeight: isSelected(item.panel) ? 600 : 500,
                          fontSize: "0.95rem",
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <List sx={{ pb: 2 }}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  minHeight: 48,
                  "&:hover": {
                    backgroundColor: "error.light",
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
                      },
                    },
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
    <ThemeProvider theme={typographyTheme}>
      <Box sx={{ display: "flex" }}>
        <Box
          component="nav"
          sx={{
            width: { md: drawerWidth },
            flexShrink: { md: 0 },
            borderRadius: 0,
          }}
        >
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                border: "none",
                borderRadius: 0,
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
          }}
        >
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
                Admin Dashboard
              </Typography>
            </Toolbar>
          </Box>

          <Box
            sx={{ display: { xs: "block", md: "none" }, mb: 2, p: 3, pt: 2 }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                p: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>{renderContent()}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
