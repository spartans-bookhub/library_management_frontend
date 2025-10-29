import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  TextField,
  Button,
  Paper,
  Typography,
  Chip,
  ThemeProvider,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { libraryService } from "../../services/libraryService";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { typographyTheme } from "../../styles/typography";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await libraryService.getAllTransaction();
        const dataWithId = response.map((row, index) => ({
          id: row.transactionId || index,
          ...row,
        }));
        setTransactions(dataWithId);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Filter transactions for search
  const filteredTransactions = transactions.filter((t) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      t.bookTitle.toLowerCase().includes(lowerSearch) ||
      t.userName.toLowerCase().includes(lowerSearch) ||
      (t.borrowDate &&
        t.borrowDate.toString().toLowerCase().includes(lowerSearch)) ||
      (t.dueDate && t.dueDate.toString().toLowerCase().includes(lowerSearch)) ||
      (t.returnDate &&
        t.returnDate.toString().toLowerCase().includes(lowerSearch)) ||
      (t.fineAmount !== null && t.fineAmount.toString().includes(lowerSearch))
    );
  });

  const columns = [
    {
      field: "serialNo",
      headerName: "S.No",
      width: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const index = filteredTransactions.findIndex(
          (t) => t.id === params.row.id
        );
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "primary.main",
              fontSize: "0.9rem",
            }}
          >
            {index + 1}
          </Typography>
        );
      },
    },
    {
      field: "bookTitle",
      headerName: "Book Title",
      width: 250,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "userName",
      headerName: "User",
      width: 160,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: "text.primary" }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "borrowDate",
      headerName: "Borrow Date",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
          {params.value}
        </Typography>
      ),
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
            fontSize: "0.875rem",
            fontWeight: isOverdue(params.value, params.row.returnDate)
              ? 600
              : 400,

            color: isOverdue(params.value, params.row.returnDate)
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
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.875rem",
            color: params.value ? "text.primary" : "text.secondary",
            fontStyle: params.value ? "normal" : "italic",
          }}
        >
          {params.value || "Not Returned"}
        </Typography>
      ),
    },
    {
      field: "fineAmount",
      headerName: "Fine (₹)",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const amount =
          params.value !== null && params.value !== undefined
            ? Number(params.value).toFixed(2)
            : "0.00";
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: Number(amount) > 0 ? "#d32f2f" : "#666666",
              fontSize: "0.875rem",
            }}
          >
            ₹{amount}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const isReturned = !!params.row.returnDate;
        const overdue = isOverdue(params.row.dueDate, params.row.returnDate);

        let status = "Active";
        let bgColor = "#fff3cd";
        let textColor = "#856404";

        if (isReturned) {
          status = "Returned";
          bgColor = "#f0f9f0";
          textColor = "#2e7d32";
        } else if (overdue) {
          status = "Overdue";
          bgColor = "#ffebee";
          textColor = "#d32f2f";
        }

        return (
          <Box
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,

              color: textColor,
            }}
          >
            {status}
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const isOverdue = (dueDate, returnDate) => {
    if (returnDate) return false; // Already returned
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const exportToExcel = () => {
    if (!transactions || transactions.length === 0) return;

    // Excel data with status column
    const dataToExport = filteredTransactions.map((t) => {
      const isReturned = !!t.returnDate;
      const overdue = isOverdue(t.dueDate, t.returnDate);

      let status = "Active";
      if (isReturned) {
        status = "Returned";
      } else if (overdue) {
        status = "Overdue";
      }

      return {
        "Book Title": t.bookTitle,
        User: t.userName,
        "Borrow Date": t.borrowDate,
        "Due Date": t.dueDate,
        "Return Date": t.returnDate || "Not Returned",
        "Fine (₹)":
          t.fineAmount !== null ? Number(t.fineAmount).toFixed(2) : "0.00",
        Status: status,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "LibraryTransactionReport.xlsx");
  };

  return (
    <ThemeProvider theme={typographyTheme}>
      <Box sx={{ width: "100%" }}>
        {/* Header Section */}
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
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                Transaction History
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.9, fontWeight: 500 }}
              >
                Track all borrowing and return activities
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={exportToExcel}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "primary.main",
                fontWeight: 600,
                textTransform: "none",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                "&:hover": {
                  backgroundColor: "white",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Export to Excel
            </Button>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                All Transactions ({filteredTransactions.length} records)
              </Typography>
              <TextField
                label="Search transactions"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
                sx={{
                  minWidth: 250,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </Box>

          {/* DataGrid */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={filteredTransactions}
                columns={columns}
                getRowId={(row) => row.id}
                getRowClassName={(params) =>
                  isOverdue(params.row.dueDate, params.row.returnDate)
                    ? "overdue-row"
                    : ""
                }
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
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
                    backgroundColor: "#fafafa",
                    "& .MuiDataGrid-cell": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid #e0e0e0",
                    backgroundColor: "#f8fafc",
                  },
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                  sorting: {
                    sortModel: [{ field: "borrowDate", sort: "desc" }],
                  },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default TransactionTable;
