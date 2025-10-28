import React, { useState, useEffect } from "react";
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
  Alert
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { 
  ShoppingCart as CartIcon,
  Notifications as NotificationsIcon
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { notificationService } from "../../services/notificationService";
import ProfileMenu from "./profilemenu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
// import logoImg from "../../assets/images/logobg.png";
// import {logoImg } from '../../assets/images/webpage.jpg';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const handleCartClick = () => {
    navigate("/cart");
  };

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
  const unreadCount = notifications.filter(n => !n.read).length;

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
          <MenuBookIcon sx={{ color: "warning.main", fontSize: 35,  color: "#ffffffff" }} />
  
          {/* <img 
            src={logoImg}    // path to your image
            alt="Logo" 
            style={{ height: 60, marginRight: 0 ,color: "secondary.main", background: "linear-gradient(45deg, #f9f9f9ff, #cdcdcdff)",}} 
          /> */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              fontSize: 30,
              letterSpacing: 1,
              background: "linear-gradient(45deg, #ffff04ff, #ff763bff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transition: "0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              }
            }}
          >
          <span className="bookHeading" style={{ color: "#ffcc00 !important" }}>BookNest</span>
        </Typography>
        </Box>             

        <Box display="flex" alignItems="center" gap={1}>
          {isAuthenticated ? (
            <>
              <IconButton 
                color="inherit" 
                onClick={handleNotificationClick}
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton 
                color="inherit" 
                onClick={handleCartClick}
                sx={{ mr: 1 }}
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

      {/* Notification Popover */}
      <Popover
        open={isNotificationOpen}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 350,
              maxHeight: 400,
              overflow: 'hidden'
            }
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
        </Box>
        
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {notificationLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Loading notifications...
              </Typography>
            </Box>
          ) : notificationError ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {notificationError}
            </Alert>
          ) : notifications.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" color="text.secondary">
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
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
                          {notification.title || notification.message}
                        </Typography>
                      }
                      secondary={
                        <>
                          {notification.message && notification.title && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {notification.message}
                            </Typography>
                          )}
                          {notification.time && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
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
  );
}