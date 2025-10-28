import React, { useEffect, useState } from "react";
import { Box, CircularProgress, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { libraryService } from "../../services/libraryService";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

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
      (t.borrowDate && t.borrowDate.toString().toLowerCase().includes(lowerSearch)) ||
      (t.dueDate && t.dueDate.toString().toLowerCase().includes(lowerSearch)) ||
      (t.returnDate && t.returnDate.toString().toLowerCase().includes(lowerSearch)) ||
      (t.fineAmount !== null && t.fineAmount.toString().includes(lowerSearch))
    );
  });

  // Define columns
  const columns = [
    {
      field: "bookTitle",
      headerName: "Book Title",
      flex: 1,
      disableColumnMenu: true, // remove menu but keep sorting
      headerClassName: "custom-header",
    },
    {
      field: "userName",
      headerName: "User",
      flex: 1,
      disableColumnMenu: true,
       headerClassName: "custom-header",
    },
    {
      field: "borrowDate",
      headerName: "Borrow Date",
      flex: 1,
      disableColumnMenu: true,
       headerClassName: "custom-header",
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      disableColumnMenu: true,
       headerClassName: "custom-header",
    },
    {
      field: "returnDate",
      headerName: "Return Date",
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (params.value ? params.value : <em>Not Returned</em>),
       headerClassName: "custom-header",
    },
    {
      field: "fineAmount",
      headerName: "Fine (₹)",
      flex: 1,
      type: "number",
      disableColumnMenu: true,
      valueFormatter: (params) =>
        params.value !== null && params.value !== undefined
          ? Number(params.value).toFixed(2)
          : "0.00",
        headerClassName: "custom-header",
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

  const exportToExcel = () => {
  if (!transactions || transactions.length === 0) return;

  // Excel data
  const dataToExport = filteredTransactions.map((t) => ({
    "Book Title": t.bookTitle,
    "User": t.userName,
    "Borrow Date": t.borrowDate,
    "Due Date": t.dueDate,
    "Return Date": t.returnDate || "Not Returned",
    "Fine (₹)": t.fineAmount !== null ? Number(t.fineAmount).toFixed(2) : "0.00",
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "TransactionReport.xlsx");
};

  return (
    <Box sx={{ height: "100vh", width: "100%", p: 2, display: "flex", flexDirection: "column" }}>
      {/* Search Box */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
         <Button variant="contained" color="primary" onClick={exportToExcel}>
          Download Excel
        </Button>
      </Box>

      {/* DataGrid */}
      <Box sx={{ flexGrow: 1, ml: 2 }}>
        <DataGrid
          rows={filteredTransactions}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[]}   
          disableSelectionOnClick
          pagination
          sx={{
            "& .custom-header": {
              backgroundColor: "#1976d2",
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
            },
            "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#1976d2 !important",
                color: "black",
                fontSize: 14,
                fontWeight: "bold",
              },
            "& .MuiDataGrid-footerContainer .MuiDataGrid-selectedRowCount": {
              display: "none", // hides row count
            },
            "& .MuiDataGrid-footerContainer .MuiDataGrid-pagination": {
              justifyContent: "flex-end",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-selectLabel": {
              display: "none", // hides 'Rows per page' label
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-select": {
              display: "none", // hides the dropdown itself
            },
          }}
/>

      </Box>
    </Box>
  );
};

export default TransactionTable;
