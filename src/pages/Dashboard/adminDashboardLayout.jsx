
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Nav,
  ListGroup,
} from "react-bootstrap";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  TextField,
  ListItem,
  ListItemIcon,
  
} from "@mui/material";
import {
  MenuBook,
  People,
  TrendingUp,
  ErrorOutline,
  Search,
  Settings,
  SwapHoriz,
  Logout
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Analytics from "./Analytics";
import AdminDashboard from "./adminDashboard";
import TransactionTable from "./TransactionTable";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import { Logout, Settings, Dashboard, DarkMode, LightMode } from "@mui/icons-material";

export default function AdminDashboardLayout() {
 

    const [activePanel, setActivePanel] = useState("analytics-dashboard");
    const {logout} = useAuth();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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

  const handleLogoutClick = () => {
    handleClose();
    handleLogout();
  };

    const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* 🧭 Sidebar */}
      <Box
       sx={{
    width: { xs: 0, sm: 240 }, // hidden on xs, fixed on sm+
    flexShrink: 0,
    bgcolor: "white",
    boxShadow: 1,
  }}
      >
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
           <Typography variant="h5">Library System</Typography>
          <ListGroup variant="flush">
          <ListGroup.Item action onClick={() => setActivePanel("analytics-dashboard")}>
            📊 Dashboard
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setActivePanel("books")}>
            📚 Books
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setActivePanel("transactions")}>
            <SwapHoriz/> Transactions
          </ListGroup.Item> 
           <ListGroup.Item action onClick={handleLogoutClick}>
            <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
              Logout
          </ListGroup.Item> 
         
        </ListGroup>
        </Box>

        
      </Box>

        {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {renderContent()}
      </Box>

   
    </Box>
  );
};