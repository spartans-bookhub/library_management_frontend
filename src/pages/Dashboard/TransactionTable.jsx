import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Replace with your real backend API endpoint
  const API_URL = 'http://localhost:9111/api/v1/transactions'; // get
  // const deleteUrl = ''

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(API_URL);
        setTransactions(response.data); // assuming API returns array of transactions
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Transaction Details
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="transaction table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Transaction ID</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Book ID</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Book Title</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>User ID</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Borrow Date</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Due Date</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Return Date</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fine (₹)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((row, index) => (
            <TableRow key={row.transactionId} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.transactionId}</TableCell>
              <TableCell>{row.bookId}</TableCell>
              <TableCell>{row.bookTitle}</TableCell>
              <TableCell>{row.userId}</TableCell>
              <TableCell>{row.borrowDate}</TableCell>
              <TableCell>{row.dueDate}</TableCell>
              <TableCell>
                {row.returnDate ? row.returnDate : <em>Not Returned</em>}
              </TableCell>
              <TableCell>{row.fineAmount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;
