import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  ThemeProvider,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { notificationService } from "../../services/notificationService";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { typographyTheme } from "../../styles/typography";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");


  const handleNotificationClick = async (event) => {
    setNotificationAnchorEl(event.currentTarget);

    if (notifications.length === 0) {
      setNotificationLoading(true);
      setNotificationError("");

      try {
        const data = await notificationService.getAllNotifications();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        setNotificationError(error.message);
      } finally {
        setNotificationLoading(false);
      }
    }
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const isNotificationOpen = Boolean(notificationAnchorEl);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ThemeProvider theme={typographyTheme}>
      <AppBar
        position="static"
        elevation={2}
        sx={{
          backgroundColor: "primary.main",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              px: 1,
              py: 0.5,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
          >
            <MenuBookIcon sx={{ color: "white", fontSize: 32 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.5,
                color: "white",
                fontSize: "1.5rem",
              }}
            >
              BookNest
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1.5}>
            {isAuthenticated ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleNotificationClick}
                  sx={{
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon sx={{ fontSize: 24 }} />
                  </Badge>
                </IconButton>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  sx={{
                    mr: 1,
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Register
                </Button>

                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "primary.main",
                    fontWeight: 600,
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    boxShadow: "none",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "white",
                      boxShadow: 2,
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>

        {/* Notification Popover */}
        <Popover
          open={isNotificationOpen}
          anchorEl={notificationAnchorEl}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              sx: {
                width: 350,
                maxHeight: 400,
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 3,
              },
            },
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              backgroundColor: "secondary.main",
            }}
          >
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Notifications
            </Typography>
          </Box>

          <Box sx={{ maxHeight: 300, overflow: "auto" }}>
            {notificationLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={4}
              >
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Loading notifications...
                </Typography>
              </Box>
            ) : notificationError ? (
              <Alert severity="error" sx={{ m: 2, borderRadius: 1.5 }}>
                {notificationError}
              </Alert>
            ) : notifications.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  No notifications available
                </Typography>
              </Box>
            ) : (
              <List sx={{ py: 0 }}>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id || index}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 2.5,
                        backgroundColor: notification.read
                          ? "transparent"
                          : "action.hover",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "action.selected",
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            fontWeight={notification.read ? 400 : 600}
                          >
                            {notification.title || notification.message}
                          </Typography>
                        }
                        secondary={
                          <>
                            {notification.message && notification.title && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                {notification.message}
                              </Typography>
                            )}
                            {notification.time && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 0.5, display: "block" }}
                              >
                                {notification.time}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Popover>
      </AppBar>
    </ThemeProvider>
  );
}
