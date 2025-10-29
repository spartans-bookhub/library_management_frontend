import React from "react";
import {
  IconButton,
  Avatar,
  Typography,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MenuBook as BookIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

const BokTable = ({ books, onEdit, onDelete }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Fiction: "primary",
      "Non-Fiction": "secondary",
      Science: "info",
      History: "warning",
      Biography: "success",
      Technology: "error",
    };
    return colors[category] || "default";
  };

  const columns = [
    {
      field: "serialNo",
      headerName: "S.No",
      width: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const index = books.findIndex(book => book.bookId === params.row.bookId);
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
      field: "bookDetails",
      headerName: "Book Details",
      width: 300,
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
          <Avatar
            src={params.row.image_url || params.row.imageUrl}
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "primary.light",
              color: "primary.contrastText",
            }}
          >
            <BookIcon />
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                lineHeight: 1.2,
              }}
            >
              {params.row.bookTitle}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                display: "block",
                mt: 0.5,
              }}
            >
              Available: {params.row.availableCopies || params.row.totalCopies}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "bookAuthor",
      headerName: "Author",
      width: 180,
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
      field: "category",
      headerName: "Category",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getCategoryColor(params.value)}
          size="small"
          sx={{
            fontWeight: 500,
            fontSize: "0.75rem",
          }}
        />
      ),
    },
    {
      field: "isbn",
      headerName: "ISBN",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            backgroundColor: "grey.100",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.8rem",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "totalCopies",
      headerName: "Copies",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: params.value > 0 ? "success.main" : "error.main",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
          <Tooltip title="Edit Book">
            <IconButton
              size="small"
              onClick={() => onEdit(params.row)}
              sx={{
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Book">
            <IconButton
              size="small"
              onClick={() => onDelete(params.row.bookId)}
              sx={{
                color: "error.main",
                "&:hover": {
                  backgroundColor: "error.light",
                  color: "error.contrastText",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (books.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          color: "text.secondary",
        }}
      >
        <BookIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          No books available
        </Typography>
        <Typography variant="body2">
          Add your first book to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={books}
        columns={columns}
        getRowId={(row) => row.bookId}
        pageSize={10}
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
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#f8fafc",
          },
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
      />
    </Box>
  );
};

    export default BokTable;