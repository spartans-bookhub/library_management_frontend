import React from 'react'
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
    Container,
    // Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { libraryService } from "../../services/libraryService";

// const historyApiUrl = 'http://localhost:9111/api/v1/transactions/history'; // get

// const historydata = [
//     {
//         transactionId: 'T001',
//         bookId: 'B001',
//         userId: 'U001',
//         borrowDate: '2023-09-01',
//         dueDate: '2023-09-15',
//         returnDate: '2023-09-14',
//         fineAmount: 0,
//     },
//     {
//         transactionId: 'T002',
//         bookId: 'B002',
//         userId: 'U002',
//         borrowDate: '2023-09-05',
//         dueDate: '2023-09-19',
//         returnDate: '2023-09-20',
//         fineAmount: 10,
//     },
    // Add more sample transactions as needed
// ];

export default function BorrowReturnHistory() {

    const [transactions, setTransactions] = useState([]);

  const getBorrowReturnHistory = async () => {  
                    try {
                        const transactions = await libraryService.getHistory();
                        console.log("Borrow/Return History:", transactions);
                        //  console.log("data==="+JSON.stringify(data))
                        setTransactions(Array.isArray(transactions) ? transactions : []);
                    } catch (error) {
                        console.error("Error fetching borrow/return history:", error);
                    }
                };

  // Fetch history on component mount
  useEffect(() => {
    getBorrowReturnHistory();
  }, []);




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
    <div>
      
     <Container>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
             {/* <h1 className='Heading-paper'>
        Borrow/Return
      </h1> */}
            <Typography
        startDecorator={
          <Typography textColor="text.secondary" sx={{ fontSize: 'lg' }}>
            $
          </Typography>
        }
        sx={{ fontSize: 'xl4', lineHeight: 1, alignItems: 'flex-start' }}
      >
        History
      </Typography>
      <Typography level="title-lg">Borrow/Return History</Typography>
           <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f4f8' }}>
                <TableCell><strong>Transaction ID</strong></TableCell>
                <TableCell><strong>Book ID</strong></TableCell>
                <TableCell><strong>User ID</strong></TableCell>
                <TableCell><strong>Borrow Date</strong></TableCell>
                <TableCell><strong>Due Date</strong></TableCell>
                <TableCell><strong>Return Date</strong></TableCell>
                <TableCell align="right"><strong>Fine (₹)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(transactions.length > 0 ? transactions : []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No history records found.</TableCell>
                </TableRow>
              ) : (
                (transactions.length > 0 ? transactions : []).map((transaction, index) => (
                  <TableRow key={transaction.transactionId || index}>
                    <TableCell>{transaction.transactionId}</TableCell>
                    <TableCell>{transaction.bookId}</TableCell>
                    <TableCell>{transaction.userId}</TableCell>
                    <TableCell>{transaction.borrowDate}</TableCell>
                    <TableCell>{transaction.dueDate}</TableCell>
                    <TableCell>{transaction.returnDate || '-'}</TableCell>
                    <TableCell align="right">{transaction.fineAmount ?? 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        </Paper>
     </Container>

    </div>
  )
}

