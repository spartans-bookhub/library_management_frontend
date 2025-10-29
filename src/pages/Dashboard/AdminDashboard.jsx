import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { libraryService } from "../../services/libraryService";
import { ThemeProvider } from "@mui/material";
import { typographyTheme } from "../../styles/typography";
import BookForm from "./BookForm";
import BokTable from "./BokTable";

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [addBookModalOpen, setAddBookModalOpen] = useState(false);
  const [editBookModalOpen, setEditBookModalOpen] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await libraryService.getAllBooks();
      console.log("data==" + data);
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch books",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = (book) => {
    setBooks((prev) => [book, ...prev]);
    setAddBookModalOpen(false);
    setSnackbar({
      open: true,
      message: "Book added successfully!",
      severity: "success",
    });
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setEditBookModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditBookModalOpen(false);
    setEditingBook(null);
  };

  const handleUpdateBook = async (updatedBook) => {
    setLoading(true);
    try {
      const data = await libraryService.updateBook(updatedBook.id, updatedBook);
      console.log("Updated Book Data from admin:", data);
      setBooks((prev) =>
        prev.map((b) => (b.bookId === data.bookId ? { ...data } : b))
      );
      setEditBookModalOpen(false);
      setEditingBook(null);
      setSnackbar({
        open: true,
        message: "Book updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating book:", error);
      setSnackbar({
        open: true,
        message: "Failed to update book",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id) => {
    console.log("Deleting Book ID:");
    try {
      let deletedId = await libraryService.deleteBook(id);
      console.log("Deleted Book ID:", deletedId);
      fetchBooks();
      // setBooks(prev => prev.filter(b => b.bookId !== id));
      setSnackbar({
        open: true,
        message: "Book deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to delete book:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete book",
        severity: "error",
      });
    }
  };

  const uniqueAuthors = new Set(books.map((b) => b.bookAuthor)).size;
  const uniqueCategories = new Set(books.map((b) => b.category)).size;

  return (
    <ThemeProvider theme={typographyTheme}>
      <Box sx={{ bgcolor: "transparent", minHeight: "100vh" }}>
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
                Book Inventory
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.9, fontWeight: 500 }}
              >
                Manage your library's book collection
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddBookModalOpen(true)}
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
              Add New Book
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "text.secondary", mb: 1 }}
              >
                Total Books
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {books.length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "text.secondary", mb: 1 }}
              >
                Unique Authors
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "success.main" }}
              >
                {uniqueAuthors}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "text.secondary", mb: 1 }}
              >
                Categories
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "warning.main" }}
              >
                {uniqueCategories}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Books Inventory ({books.length} books)
            </Typography>
          </Box>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <CircularProgress size={40} />
              <Typography
                variant="body2"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                Loading books...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <BokTable
                books={books}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
              />
            </Box>
          )}
        </Paper>

        <Dialog
          open={addBookModalOpen}
          onClose={() => setAddBookModalOpen(false)}
          maxWidth="md"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Add New Book
            </Typography>
            <IconButton
              onClick={() => setAddBookModalOpen(false)}
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <BookForm
              editingBook={null}
              setEditingBook={() => {}}
              onBookAdded={handleAddBook}
              onBookUpdated={() => {}}
              setSnackbar={setSnackbar}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={editBookModalOpen}
          onClose={handleCloseEditModal}
          maxWidth="md"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Edit Book
            </Typography>
            <IconButton
              onClick={handleCloseEditModal}
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <BookForm
              editingBook={editingBook}
              setEditingBook={setEditingBook}
              onBookAdded={() => {}}
              onBookUpdated={handleUpdateBook}
              setSnackbar={setSnackbar}
            />
          </DialogContent>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
