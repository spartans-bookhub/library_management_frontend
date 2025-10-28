
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

export default function AdminDashboardLayout() {
  // 📊 Dummy chart data
  const chartData = {
    labels: ["Mon", " Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Books Borrowed",
        data: [20, 35, 40, 55, 30, 70, 90],
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
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
            <ListGroup.Item action href="#dashboard">
              📊 Dashboard
            </ListGroup.Item>
            <ListGroup.Item action href="#books">
              📚 Books
            </ListGroup.Item>
            <ListGroup.Item action href="#users">
              👥 Users
            </ListGroup.Item>
            <ListGroup.Item action href="#borrowings">
              🔄 Borrowings
            </ListGroup.Item>
          </ListGroup>
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <ListGroup.Item action href="#settings">
            ⚙️ Settings
          </ListGroup.Item>
        </Box>
      </Box>

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

        {/* 📦 Statistic Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">
                <MenuBook sx={{ color: "#1976d2", mr: 1 }} />
                Total Books
              </Typography>
              <Typography variant="h4">2,543</Typography>
              <Typography color="green">+12%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">
                <People sx={{ color: "#1976d2", mr: 1 }} />
                Active Users
              </Typography>
              <Typography variant="h4">1,234</Typography>
              <Typography color="green">+8%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">
                <TrendingUp sx={{ color: "#1976d2", mr: 1 }} />
                Books Borrowed
              </Typography>
              <Typography variant="h4">456</Typography>
              <Typography color="green">+23%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">
                <ErrorOutline sx={{ color: "#1976d2", mr: 1 }} />
                Overdue Items
              </Typography>
              <Typography variant="h4">12</Typography>
              <Typography color="red">-5%</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* 📊 Recent Activity + Chart */}
        <Row>
          <Col md={6}>
            <Card className="mb-3 shadow-sm">
              <Card.Header>Recent Activity</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>📖 John borrowed "Clean Code"</ListGroup.Item>
                <ListGroup.Item>📕 Priya returned "Atomic Habits"</ListGroup.Item>
                <ListGroup.Item>📗 Rahul borrowed "React Explained"</ListGroup.Item>
                <ListGroup.Item>📘 Neha added "AI for Beginners"</ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-3 shadow-sm">
              <Card.Header>Borrowing Trends</Card.Header>
              <Card.Body>
                {/* <Line data={chartData} /> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 📚 Popular Books */}
        <Card className="shadow-sm">
          <Card.Header>Popular Books</Card.Header>
          <Card.Body>
            <Row>
              {[1, 2, 3, 4].map((book) => (
                <Col key={book} md={3} sm={6} xs={12} className="mb-3">
                  <Card className="shadow-sm border-0">
                    <Card.Img
                      variant="top"
                      src="https://via.placeholder.com/150x200"
                    />
                    <Card.Body>
                      <Card.Title>Book {book}</Card.Title>
                      <Card.Text>
                        Popular among readers this month.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Box>
    </Box>
  );
};


