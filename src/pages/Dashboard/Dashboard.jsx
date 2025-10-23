import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { useAuth } from "../../context/AuthContext";
import { libraryService } from "../../services/libraryService";

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchBorrowedBooks = async () => {
    if (selectedTab !== 0) return;

    setLoading(true);
    setError(null);
    try {
      const data = await libraryService.getBorrowedBooks();
      setBorrowedBooks(data);
    } catch (err) {
      setError(err.message);
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (selectedTab !== 1) return;

    setLoading(true);
    setError(null);
    try {
      const data = await libraryService.getHistory();
      setHistoryData(data);
    } catch (err) {
      setError(err.message);
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      await libraryService.returnBorrowedBook(bookId);
      setSnackbar({
        open: true,
        message: "Book returned successfully!",
        severity: "success",
      });
      fetchBorrowedBooks();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ message: "", severity: "success", open: false });
  };

  useEffect(() => {
    if (selectedTab === 0) {
      fetchBorrowedBooks();
    } else if (selectedTab === 1) {
      fetchHistory();
    }
  }, [selectedTab]);

  const activeBorrowedBooksColumns = [
    {
      field: "transactionId",
      headerName: "Txn ID",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "bookTitle",
      headerName: "Book Title",
      width: 300,
      headerAlign: "center",
    },
    {
      field: "borrowDate",
      headerName: "Issue Date",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleReturnBook(params.row.bookId)}
          sx={{
            minWidth: "80px",
            fontSize: "0.75rem",
          }}
        >
          Return
        </Button>
      ),
    },
  ];

  const historyColumns = [
    {
      field: "transactionId",
      headerName: "Txn ID",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "bookTitle",
      headerName: "Book Title",
      width: 250,
      headerAlign: "center",
    },
    {
      field: "borrowDate",
      headerName: "Issue Date",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "returnDate",
      headerName: "Return Date",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fineAmount",
      headerName: "Fine",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
            fontWeight: 600,
            backgroundColor: params.row.returnDate ? "#e8f5e8" : "#fff3cd",
            color: params.row.returnDate ? "#2e7d32" : "#856404",
          }}
        >
          {params.row.returnDate ? "Returned" : "Active"}
        </Box>
      ),
    },
  ];

  const renderCurrentBorrowedBooks = () => (
    <Paper elevation={2} sx={{ p: 3, mt: 3, minHeight: 400 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Active Borrows
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={300}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={borrowedBooks}
            columns={activeBorrowedBooksColumns}
            getRowId={(row) => row.transactionId}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 25]}
            disableSelectionOnClick
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-header": {
                backgroundColor: "#f5f5f5",
                fontWeight: 600,
              },
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f9f9f9",
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </Box>
      )}
    </Paper>
  );

  const renderHistory = () => (
    <Paper elevation={2} sx={{ p: 3, mt: 3, minHeight: 400 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Borrowing History
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={300}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={historyData}
            columns={historyColumns}
            getRowId={(row) => row.transactionId}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 25]}
            disableSelectionOnClick
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-header": {
                backgroundColor: "#f5f5f5",
                fontWeight: 600,
              },
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f9f9f9",
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </Box>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h4" component="h1">
              Library Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome, {user?.userName || "User"}! ({user?.role || "STUDENT"})
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Books Issued
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {borrowedBooks.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Currently borrowed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={1} sx={{ mt: 3 }}>
        <BottomNavigation
          showLabels
          value={selectedTab}
          onChange={(_event, value) => setSelectedTab(value)}
          sx={{
            borderRadius: "8px 8px 0 0",
            "& .MuiBottomNavigationAction-root": {
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
          }}
        >
          <BottomNavigationAction label="Active Borrows" />
          <BottomNavigationAction label="History" />
        </BottomNavigation>
      </Paper>

      {selectedTab === 0 && renderCurrentBorrowedBooks()}
      {selectedTab === 1 && renderHistory()}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
