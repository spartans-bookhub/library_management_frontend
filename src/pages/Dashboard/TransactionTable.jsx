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
import { libraryService } from "../../services/libraryService";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await libraryService.getAllTransaction();
        console.log(response);
        setTransactions(response); 
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

// Fetch all transactions
  // const fetchTransactions = async () => {
  //   try {
  //     const data = await libraryService.getHighFine();
  //     console.log("data==="+JSON.stringify(data))
  //     setTransactions(Array.isArray(data) ? data : []);
  //   } catch (error) {
  //     console.log("Failed to fetch books:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchTransactions();
  // }, []);


  return (
    <TableContainer component={Paper} sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="transaction table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>            
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Book Title</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>User</TableCell>
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
              <TableCell>{row.bookTitle}</TableCell>
              <TableCell>{row.userName}</TableCell>
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



  {/* TRANSACTION TABLE */}
      {/* <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Transaction Data
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Book</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((t) => ( 
                <TableRow key={t.id}>
                  <TableCell>{t.userName}</TableCell>
                  <TableCell>{t.contactNumber}</TableCell>
                  <TableCell>{t.totalFine}</TableCell>
                  <TableCell
                    sx={{
                      color: t.type === "Issued" ? "error.main" : "success.main",
                      fontWeight: "bold",
                    }}
                  >
                    {t.type}
                  </TableCell>
                  <TableCell>{t.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper> */}
