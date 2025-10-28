
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
} from "@mui/material";
import {
  MenuBook,
  People,
  TrendingUp,
  ErrorOutline,
  Search,
  Settings,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Analytics from "./Analytics";
import AdminDashboard from "./adminDashboard";
import TransactionTable from "./TransactionTable";

export default function AdminDashboardLayout() {
 

    const [activePanel, setActivePanel] = useState("analytics-dashboard");

  const renderContent = () => {
    switch (activePanel) {
      case "analytics-dashboard":
        return <Analytics />;
      case "books":
        return <AdminDashboard />;
      case "transactions":
        return <TransactionTable />;
    //   case "borrowings":
    //     return <Borrowings />;
    //   default:
    //     return <DashboardHome />;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* 🧭 Sidebar */}
      <Box
        sx={{
          width: 240,
          backgroundColor: "white",
          boxShadow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              p: 2,
              fontWeight: "bold",
              borderBottom: "1px solid #e0e0e0",
              color: "#1976d2",
            }}
          >
            Library System
          </Typography>
          <ListGroup variant="flush">
          <ListGroup.Item action onClick={() => setActivePanel("analytics-dashboard")}>
            📊 Dashboard
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setActivePanel("books")}>
            📚 Books
          </ListGroup.Item>
          {/* <ListGroup.Item action onClick={() => setActivePanel("users")}>
            👥 Users
          </ListGroup.Item>*/}
          <ListGroup.Item action onClick={() => setActivePanel("transactions")}>
            🔄 Transactions
          </ListGroup.Item> 
        </ListGroup>
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <ListGroup.Item action href="#settings">
            ⚙️ Settings
          </ListGroup.Item>
        </Box>
      </Box>

        {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {renderContent()}
      </Box>

   
    </Box>
  );
};