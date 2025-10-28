
import React from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
} from "react-bootstrap";
import {
  Box
} from "@mui/material";
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
import { BorrowingChart } from './borrowChart';
import PopularCategoryChart from './popularCategoryChart';

export default function Analytics() {



  return (
    <div>

      <Box sx={{ flexGrow: 1, p: 3 }}>

        <Navbar
          bg="white"
          expand="lg"
          className="shadow-sm mb-4 rounded"
          style={{ padding: "0.8rem 1.5rem" }}
        >
          <Navbar.Brand>Dashboard</Navbar.Brand>
         
        </Navbar>

       

        {/* Chart */}
      <Row>
  <Col xs={12} md={6} lg={6}>
    <Card className="mb-3 shadow-sm">
      <Card.Header>Popular Category</Card.Header>
      <Card.Body>
        <div style={{ height: "400px" }}>
          <PopularCategoryChart />
        </div>
      </Card.Body>
    </Card>
  </Col>

  <Col xs={12} md={6} lg={6}>
    <Card className="mb-3 shadow-sm">
      <Card.Header>Borrowing Trends</Card.Header>
      <Card.Body>
        <div style={{ height: "400px" }}>
          <BorrowingChart />
        </div>
      </Card.Body>
    </Card>
  </Col>
</Row>

      </Box>
    </div>
  )
}
