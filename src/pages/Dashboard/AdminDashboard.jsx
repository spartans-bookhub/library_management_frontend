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
    console.log("Deleting Book ID:", id);
    try {
      let deletedId = await libraryService.deleteBook(id);
      console.log("Deleted Book ID:", deletedId);
      setBooks((prev) => prev.filter((b) => b.bookId !== deletedId && b.id !== deletedId));
      setSnackbar({ open: true, message: "Book deleted successfully", severity: "success" });
    } catch (error) {
      console.error("Failed to delete book:", error);
      setSnackbar({ open: true, message: "Failed to delete book", severity: "error" });
    } 
  };

  const uniqueAuthors = new Set(books.map((b) => b.bookAuthor)).size;
  const uniqueCategories = new Set(books.map((b) => b.category)).size;

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {/* 📘 Library Admin Dashboard */}
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

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="Title"
            name="bookTitle"
            value={newBook.bookTitle}
            onChange={handleInputChange}
            error={!!errors.bookTitle}
            helperText={errors.bookTitle}
            disabled={isSubmitting}
            fullWidth
          />
          <TextField
            label="ISBN"
            name="isbn"
            value={newBook.isbn}
            onChange={handleInputChange}
            error={!!errors.isbn}
            helperText={errors.isbn}
            disabled={isSubmitting}
            placeholder="e.g., 978-0-123456-78-9"
            fullWidth
            sx={{ minWidth: 240 }}
          />
          <TextField
            label="Author"
            name="bookAuthor"
            value={newBook.bookAuthor}
            onChange={handleInputChange}
            error={!!errors.bookAuthor}
            helperText={errors.bookAuthor}
            disabled={isSubmitting}
            fullWidth
          />
          {/* Removed duplicate TextField components */}
          <TextField
            select
            label="Category"
            name="category"
            value={newBook.category}
            onChange={handleInputChange}
            error={!!errors.category}
            helperText={errors.category}
            disabled={isSubmitting}
            fullWidth
             sx={{ minWidth: 180 }}
          >
            <MenuItem value="Fiction">Fiction</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Technology">Technology</MenuItem>
            <MenuItem value="History">History</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>

          <Button 
            variant="contained" 
            color="primary" 
            onClick={addBook} 
            disabled={isSubmitting}
            sx={{ height: "56px" }}
            
          >
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
          
          {/*  Total Copies */}
          <TextField
            label="Total No. of Copies"
            name="totalCopies"
            type="number"
            value={newBook.totalCopies}
            onChange={handleInputChange}
            error={!!errors.totalCopies}
            helperText={errors.totalCopies}
            disabled={isSubmitting}
            sx={{ minWidth: 140 }}
            // inputProps={{ min: 1 }}
          />

          {/* Upload Image */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <input
              accept="image/*"
              id="book-image-file"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            <label htmlFor="book-image-file">
              <Button variant="outlined" component="span" disabled={isSubmitting || uploading}>
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </label>
            {uploading && <CircularProgress size={20} />}
            <Avatar
              src={newBook.imageUrl || undefined}
              variant="rounded"
              sx={{ width: 56, height: 56, bgcolor: "#e0e0e0" }}
            />
          </Box>

          <Box sx={{ width: 320 }}>
            {uploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 1 }} />}
            <TextField
              label="Image URL / Preview"
              name="imageUrl"
              value={newBook.imageUrl}
              onChange={handleInputChange}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl}
              disabled={isSubmitting}
              fullWidth
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={addBook}
              disabled={isSubmitting || uploading}
            >
              {isSubmitting ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update Book" : "Add Book"}
            </Button>
            {isEditing && (
              <Button variant="outlined" color="secondary" onClick={cancelEdit} disabled={isSubmitting}>
                Cancel
              </Button>
            )}
          </Box>
        </Stack>
      {/* </Paper> */}

      {/* ✅ BOOK TABLE */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Book List
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                {/* ✅ Serial Number instead of Book ID */}
                <TableCell><strong>#</strong></TableCell>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Author</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>ISBN</strong></TableCell>
                <TableCell><strong>Total Copies</strong></TableCell>
                {/* <TableCell><strong>Available</strong></TableCell> */}
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No books added yet.
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book, index) => (
                  <TableRow key={book.bookId || book.id || book.tempId || book.isbn}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Avatar
                        src={book.image_url ?? book.imageUrl}
                        variant="rounded"
                        sx={{ width: 48, height: 48 }}
                      />
                    </TableCell>
                    <TableCell>{book.bookTitle}</TableCell>
                    <TableCell>{book.bookAuthor}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.totalCopies ?? "-"}</TableCell>
                    {/* <TableCell>{book.availableCopies ?? "-"}</TableCell> */}
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(book)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deleteBook(book.bookId)}
                        disabled={!book.bookId && !book.id}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
