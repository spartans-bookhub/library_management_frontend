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
  Toolbar,
  IconButton,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Menu as MenuIcon,
  Warning as WarningIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";
import { libraryService } from "../../services/libraryService";
import Sidebar from "../../components/common/sidebar";
import { typographyTheme } from "../../styles/typography";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [dashboardCounts, setDashboardCounts] = useState({
    currentlyBorrowed: 0,
    overdue: 0,
    totalBorrowed: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fineModal, setFineModal] = useState({
    open: false,
    bookData: null,
    fineAmount: 0,
    paymentCompleted: false,
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Calculate dashboard counts from data
  const calculateCounts = (borrowedBooks, historyData) => {
    const currentlyBorrowed = borrowedBooks.length;

    // Calculate overdue books (due date passed and still active)
    const today = new Date();
    const overdue = borrowedBooks.filter((book) => {
      const dueDate = new Date(book.dueDate);
      return dueDate < today;
    }).length;

    // Total borrowed = currently borrowed + all returned books from history
    const returnedBooks = historyData.filter((item) => item.returnDate).length;
    const totalBorrowed = currentlyBorrowed + returnedBooks;

    return {
      currentlyBorrowed,
      overdue,
      totalBorrowed,
    };
  };

  // Helper function to check if a book is overdue
  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  // Calculate fine amount based on overdue days
  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const finePerDay = 5; // $5 per day
    return diffDays > 0 ? diffDays * finePerDay : 0;
  };

  // Fetch all data needed for dashboard counts
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [borrowedData, historyData] = await Promise.all([
        libraryService.getBorrowedBooks(),
        libraryService.getHistory(),
      ]);

      setBorrowedBooks(borrowedData);
      setHistoryData(historyData);

      // Calculate and set counts
      const counts = calculateCounts(borrowedData, historyData);
      setDashboardCounts(counts);
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
    const bookData = borrowedBooks.find((book) => book.bookId === bookId);

    if (!bookData) {
      setSnackbar({
        open: true,
        message: "Book data not found",
        severity: "error",
      });
      return;
    }

    if (isOverdue(bookData.dueDate)) {
      const fineAmount = calculateFine(bookData.dueDate);
      setFineModal({
        open: true,
        bookData,
        fineAmount,
        paymentCompleted: false,
      });
      return;
    }

    try {
      await libraryService.returnBorrowedBook(bookId);
      setSnackbar({
        open: true,
        message: "Book returned successfully!",
        severity: "success",
      });
      fetchDashboardData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  const handlePayFine = () => {
    setFineModal((prev) => ({
      ...prev,
      paymentCompleted: true,
    }));
  };

  const handleFinalReturn = async () => {
    try {
      await libraryService.returnBorrowedBook(fineModal.bookData.bookId);
      setSnackbar({
        open: true,
        message: "Book returned successfully! Fine payment processed.",
        severity: "success",
      });
      setFineModal({
        open: false,
        bookData: null,
        fineAmount: 0,
        paymentCompleted: false,
      });
      fetchDashboardData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  const handleCloseFineModal = () => {
    setFineModal({
      open: false,
      bookData: null,
      fineAmount: 0,
      paymentCompleted: false,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ message: "", severity: "success", open: false });
  };

  // Initial load of dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (selectedTab === 0) {
      fetchBorrowedBooks();
    } else if (selectedTab === 1) {
      fetchHistory();
    }
  }, [selectedTab]);

  const activeBorrowedBooksColumns = [
    {
      field: "serialNo",
      headerName: "Serial no.",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const index = borrowedBooks.findIndex(book => book.transactionId === params.row.transactionId);
        return index + 1;
      },
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
      renderCell: (params) => (
        <Box
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.875rem",
            fontWeight: isOverdue(params.value) ? 600 : 400,
            backgroundColor: isOverdue(params.value)
              ? "#ffebee"
              : "transparent",
            color: isOverdue(params.value) ? "#d32f2f" : "inherit",
          }}
        >
          {params.value}
        </Box>
      ),
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
            fontWeight: 600,
            borderRadius: 1.5,
            textTransform: "none",
            boxShadow: 1,
            "&:hover": {
              boxShadow: 2,
            },
          }}
        >
          Return
        </Button>
      ),
    },
  ];

  const historyColumns = [
    {
      field: "serialNo",
      headerName: "Serial no.",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const index = historyData.findIndex(item => item.transactionId === params.row.transactionId);
        return index + 1;
      },
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
      renderCell: (params) => (
        <Box
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.875rem",
            fontWeight:
              isOverdue(params.value) && !params.row.returnDate ? 600 : 400,
            backgroundColor:
              isOverdue(params.value) && !params.row.returnDate
                ? "#ffebee"
                : "transparent",
            color:
              isOverdue(params.value) && !params.row.returnDate
                ? "#d32f2f"
                : "inherit",
          }}
        >
          {params.value}
        </Box>
      ),
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
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mt: 3,
        minHeight: 400,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "text.primary",
        }}
      >
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
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 1.5,
          }}
        >
          {error}
        </Alert>
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={borrowedBooks}
            columns={activeBorrowedBooksColumns}
            getRowId={(row) => row.transactionId}
            getRowClassName={(params) =>
              isOverdue(params.row.dueDate) ? "overdue-row" : ""
            }
            pageSize={5}
            rowsPerPageOptions={[5, 10, 25]}
            disableSelectionOnClick
            disableRowSelectionOnClick
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1.5,
              "& .MuiDataGrid-header": {
                backgroundColor: "#f8fafc",
                fontWeight: 700,
                color: "text.primary",
              },
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid #e0e0e0",
                fontWeight: 500,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f8fafc",
              },
              "& .overdue-row": {
                backgroundColor: "#fef2f2",
                "& .MuiDataGrid-cell": {
                  borderColor: "#fecaca",
                },
                "&:hover": {
                  backgroundColor: "#fee2e2",
                },
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e0e0e0",
                backgroundColor: "#f8fafc",
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
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mt: 3,
        minHeight: 400,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "text.primary",
        }}
      >
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
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 1.5,
          }}
        >
          {error}
        </Alert>
      ) : (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={historyData}
            columns={historyColumns}
            getRowId={(row) => row.transactionId}
            getRowClassName={(params) =>
              isOverdue(params.row.dueDate) && !params.row.returnDate
                ? "overdue-row"
                : ""
            }
            pageSize={5}
            rowsPerPageOptions={[5, 10, 25]}
            disableSelectionOnClick
            disableRowSelectionOnClick
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1.5,
              "& .MuiDataGrid-header": {
                backgroundColor: "#f8fafc",
                fontWeight: 700,
                color: "text.primary",
              },
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid #e0e0e0",
                fontWeight: 500,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f8fafc",
              },
              "& .overdue-row": {
                backgroundColor: "#fef2f2",
                "& .MuiDataGrid-cell": {
                  borderColor: "#fecaca",
                },
                "&:hover": {
                  backgroundColor: "#fee2e2",
                },
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e0e0e0",
                backgroundColor: "#f8fafc",
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
    <ThemeProvider theme={typographyTheme}>
      <Box sx={{ display: "flex" }}>
        <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - 280px)` },
            ml: { md: `280px` },
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
          }}
        >
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              backgroundColor: "white",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                }}
              >
                Dashboard
              </Typography>
            </Toolbar>
          </Box>

          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Welcome, {user?.userName || "User"}!
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      opacity: 0.9,
                      fontWeight: 500,
                    }}
                  >
                    {user?.role || "STUDENT"} Dashboard
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                        }}
                      >
                        Currently Borrowed
                      </Typography>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          mb: 1,
                        }}
                      >
                        {dashboardCounts.currentlyBorrowed}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 500,
                        }}
                      >
                        Active borrowings
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                        }}
                      >
                        Overdue Books
                      </Typography>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 700,
                          color: "error.main",
                          mb: 1,
                        }}
                      >
                        {dashboardCounts.overdue}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 500,
                        }}
                      >
                        Past due date
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                        }}
                      >
                        Total Borrowed
                      </Typography>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 700,
                          color: "success.main",
                          mb: 1,
                        }}
                      >
                        {dashboardCounts.totalBorrowed}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 500,
                        }}
                      >
                        Lifetime borrowings
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                mt: 3,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <BottomNavigation
                showLabels
                value={selectedTab}
                onChange={(_event, value) => setSelectedTab(value)}
                sx={{
                  backgroundColor: "white",
                  borderBottom: "1px solid #e0e0e0",
                  "& .MuiBottomNavigationAction-root": {
                    color: "text.secondary",
                    fontWeight: 500,
                    "&.Mui-selected": {
                      color: "primary.main",
                      fontWeight: 600,
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
          </Container>
        </Box>
      </Box>
      /* Fine Payment Modal */
      <Dialog
        open={fineModal.open}
        onClose={handleCloseFineModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            pb: 2,
          }}
        >
          <WarningIcon color="error" sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Overdue Book Fine
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Payment required before return
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          {fineModal.bookData && (
            <>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {fineModal.bookData.bookTitle}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Due Date: {fineModal.bookData.dueDate}
                </Typography>
                <Typography
                  variant="body2"
                  color="error.main"
                  sx={{ fontWeight: 500 }}
                >
                  Days Overdue:{" "}
                  {Math.ceil(
                    (new Date() - new Date(fineModal.bookData.dueDate)) /
                      (1000 * 60 * 60 * 24)
                  )}
                </Typography>
              </Paper>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  backgroundColor: "#f8fafc",
                  borderRadius: 1.5,
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total Fine Amount:
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "error.main",
                  }}
                >
                  ${fineModal.fineAmount}
                </Typography>
              </Box>

              {!fineModal.paymentCompleted ? (
                <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
                  Please pay the fine to proceed with book return.
                </Alert>
              ) : (
                <Alert severity="success" sx={{ borderRadius: 1.5 }}>
                  Payment successful! You can now return the book.
                </Alert>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseFineModal}
            variant="outlined"
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 1.5,
            }}
          >
            Cancel
          </Button>

          {!fineModal.paymentCompleted ? (
            <Button
              onClick={handlePayFine}
              variant="contained"
              startIcon={<PaymentIcon />}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1.5,
                backgroundColor: "success.main",
                "&:hover": {
                  backgroundColor: "success.dark",
                },
              }}
            >
              Pay Fine (${fineModal.fineAmount})
            </Button>
          ) : (
            <Button
              onClick={handleFinalReturn}
              variant="contained"
              color="primary"
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1.5,
              }}
            >
              Return Book
            </Button>
          )}
        </DialogActions>
      </Dialog>
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
    </ThemeProvider>
  );
};

export default Dashboard;
