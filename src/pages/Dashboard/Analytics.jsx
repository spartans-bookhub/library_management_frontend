
import React from 'react'
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

export default function Analytics() {



  return (
    <div>
         {/* 🌐 Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* 🔝 Navbar */}
        <Navbar
          bg="white"
          expand="lg"
          className="shadow-sm mb-4 rounded"
          style={{ padding: "0.8rem 1.5rem" }}
        >
          <Navbar.Brand>Dashboard</Navbar.Brand>
          <Nav className="ms-auto d-flex align-items-center">
            <TextField
              size="small"
              placeholder="Search..."
              InputProps={{
                startAdornment: <Search sx={{ color: "gray", mr: 1 }} />,
              }}
            />
            <IconButton sx={{ ml: 2 }}>
              <Settings />
            </IconButton>
          </Nav>
        </Navbar>

       

        {/* Chart */}
        <Row>
          <Col md={6}>
            <Card className="mb-3 shadow-sm">
              <Card.Header>Recent Activity</Card.Header>
              <ListGroup variant="flush">
              
              </ListGroup>
            </Card>
          </Col>
          <Col md={6}>
            {/* <Card className="mb-3 shadow-sm">
              <Card.Header>Borrowing Trends</Card.Header>
              <Card.Body>
                <Line data={chartData} />
              </Card.Body>
            </Card> */}
          </Col>
        </Row>

      </Box>
    </div>
  )
}
