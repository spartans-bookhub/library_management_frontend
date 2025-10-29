import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { libraryService } from "../../services/libraryService";
import {  ThemeProvider } from "@mui/material";
import { typographyTheme } from "../../styles/typography";
import BookForm from "./BookForm";
// import BookTable from "./BookTable";
import BokTable from "./BokTable";


const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await libraryService.getAllBooks();
      console.log("data=="+data)
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setSnackbar({ open: true, message: "Failed to fetch books", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = (book) => {
    setBooks((prev) => [book, ...prev]);
  };

  const handleUpdateBook = async (updatedBook) => {
     setLoading(true);
    try {
      const data = await libraryService.updateBook(updatedBook.id, updatedBook);
      console.log("Updated Book Data from admin:", data);
      setBooks((prev) =>
        prev.map((b) => (b.bookId === data.bookId ? { ...data } : b))
      );
    } catch (error) {
      console.error("Error fetching books:", error);
      // setSnackbar({ open: true, message: "Failed to update book" });
    } finally {
      setLoading(false);
    }
    // setBooks((prev) =>
    //   prev.map((b) =>
    //     b.id === updatedBook.id || b.bookId === updatedBook.bookId
    //       ? { ...updatedBook }
    //       : b
    //   )
    // );
  };

  const handleDeleteBook = async (id) => {
    console.log("Deleting Book ID:");
    try {
      let deletedId = await libraryService.deleteBook(id);
      console.log("Deleted Book ID:", deletedId);
      fetchBooks()
      // setBooks(prev => prev.filter(b => b.bookId !== id)); 
      setSnackbar({ open: true, message: "Book deleted successfully", severity: "success" });
    } catch (error) {
      console.error("Failed to delete book:", error);
      setSnackbar({ open: true, message: "Failed to delete book", severity: "error" });
    } 
  };

  const uniqueAuthors = new Set(books.map((b) => b.bookAuthor)).size;
  const uniqueCategories = new Set(books.map((b) => b.category)).size;

  return (

    <ThemeProvider theme={typographyTheme}>
      <Box sx={{ p: 4, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
       <Typography variant="h6">Book Management</Typography>
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Total Books</Typography>
            <Typography variant="h4" color="primary">{books.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Unique Authors</Typography>
            <Typography variant="h4" color="primary">{uniqueAuthors}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Categories</Typography>
            <Typography variant="h4" color="primary">{uniqueCategories}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Add / Edit Book Form */}
      <BookForm
        editingBook={editingBook}
        setEditingBook={setEditingBook}
        onBookAdded={handleAddBook}
        onBookUpdated={handleUpdateBook}
        setSnackbar={setSnackbar}
      />

      {/* Books Table */}
      <Box sx={{ mt: 4 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <BokTable
            books={books}
            onEdit={setEditingBook}
            onDelete={handleDeleteBook}
          />
        )}
      </Box>

      {/* Snackbar Alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;