import React, { useState, useEffect } from "react";
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
  MenuItem,
  LinearProgress,
  Avatar,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { libraryService } from "../../services/libraryService";
import { ReportChart } from "./ReportChart";

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    bookTitle: "",
    bookAuthor: "",
    category: "",
    isbn: "",
    bookId: "",
    imageUrl: "",
    totalCopies: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);``
  const [apiError, setApiError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editingTempId, setEditingTempId] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ Validation (updated to disallow negative total copies)
  const validateFields = () => {
    const newErrors = {};

    if (!newBook.bookTitle || !newBook.bookTitle.trim()) {
      newErrors.bookTitle = "Title is required.";
    } else if (newBook.bookTitle.trim().length < 2) {
      newErrors.bookTitle = "Title must be at least 2 characters long.";
    }

    if (!newBook.bookAuthor || !newBook.bookAuthor.trim()) {
      newErrors.bookAuthor = "Author is required.";
    }

    if (!newBook.category || !newBook.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (!newBook.isbn || !newBook.isbn.trim()) {
      newErrors.isbn = "ISBN is required.";
    } else if (!/^[0-9\-]+$/.test(newBook.isbn)) {
      newErrors.isbn = "ISBN must contain only numbers or dashes.";
    } else if (newBook.isbn.replace(/-/g, "").length !== 6) {
      newErrors.isbn = "ISBN must be 6 digits long (excluding dashes).";
    }

    // ✅ Total copies validation — no negatives
    if (newBook.totalCopies === "" || newBook.totalCopies === null) {
      newErrors.totalCopies = "Total copies is required.";
    } else {
      const tc = Number(newBook.totalCopies);
      if (!Number.isInteger(tc) || tc < 1) {
        newErrors.totalCopies = "Total copies must be an integer >= 1.";
      }
    }

    // Image validation
    if (!newBook.imageUrl || !newBook.imageUrl.trim()) {
      newErrors.imageUrl = "Image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchBooks = async () => {
    try {
      const data = await libraryService.getAllBooks();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? (value === "" ? "" : Number(value)) : value;
    setNewBook((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setUploading(true);
      setUploadProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 20) + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setNewBook((prev) => ({
            ...prev,
            imageUrl: dataUrl,
          }));
          setUploading(false);
        }
        setUploadProgress(progress);
      }, 200);
    };
    reader.readAsDataURL(file);
  };

  const addBook = async () => {
    setApiError(null);

    if (uploading) {
      setApiError("Image is still uploading. Please wait.");
      return;
    }

    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      bookTitle: newBook.bookTitle.trim(),
      bookAuthor: newBook.bookAuthor.trim(),
      category: newBook.category.trim(),
      isbn: newBook.isbn.trim(),
      image_url: newBook.imageUrl,
      total_copies: Number(newBook.totalCopies),
    };

    if (isEditing) {
      const prevBooks = [...books];
      setBooks((prev) =>
        prev.map((b) => {
          const idMatch = b.bookId === editingBookId || b.id === editingBookId;
          const tempMatch = editingTempId && b.tempId === editingTempId;
          if (idMatch || tempMatch) {
            return {
              ...b,
              ...payload,
              imageUrl: payload.image_url,
              totalCopies: payload.total_copies,
            };
          }
          return b;
        })
      );

      try {
        const updated = await libraryService.updateBook(editingBookId, payload);
        const normalized = {
          ...updated,
          imageUrl: updated.image_url ?? updated.imageUrl,
          totalCopies: updated.total_copies ?? updated.totalCopies,
        };
        setBooks((prev) =>
          prev.map((b) => {
            const idMatch = b.bookId === editingBookId || b.id === editingBookId;
            const tempMatch = editingTempId && b.tempId === editingTempId;
            return idMatch || tempMatch ? normalized : b;
          })
        );
        cancelEdit();
        alert("Book updated successfully!");
      } catch (error) {
        setBooks(prevBooks);
        setApiError("Failed to update book. Please try again.");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const tempId = `temp-${Date.now()}`;
      const localBook = {
        tempId,
        ...payload,
        imageUrl: payload.image_url,
        totalCopies: payload.total_copies,
      };

      setBooks((prev) => [localBook, ...prev]);

      try {
        const created = await libraryService.createBook(payload);
        const createdNormalized = {
          ...created,
          imageUrl: created.image_url ?? created.imageUrl,
          totalCopies: created.total_copies ?? created.totalCopies,
        };
        setBooks((prev) => prev.map((b) => (b.tempId === tempId ? createdNormalized : b)));
        cancelEdit();
        alert("Book added successfully!");
      } catch (error) {
        setBooks((prev) => prev.filter((b) => b.tempId !== tempId));
        setApiError("Failed to add book. Please try again.");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEdit = (book) => {
    const id = book.bookId || book.id || null;
    const tempId = book.tempId || null;
    setEditingBookId(id);
    setEditingTempId(tempId);
    setIsEditing(true);

    setNewBook({
      bookTitle: book.bookTitle ?? "",
      bookAuthor: book.bookAuthor ?? "",
      category: book.category ?? "",
      isbn: book.isbn ?? "",
      bookId: id ?? "",
      imageUrl: book.image_url ?? book.imageUrl ?? "",
      totalCopies: book.total_copies ?? book.totalCopies ?? "",
    });
    setErrors({});
  };

  const cancelEdit = () => {
    setNewBook({
      bookTitle: "",
      bookAuthor: "",
      category: "",
      isbn: "",
      bookId: "",
      imageUrl: "",
      totalCopies: "",
    });
    setIsEditing(false);
    setEditingBookId(null);
    setEditingTempId(null);
    setErrors({});
  };

  const deleteBook = async (id) => {
    try {
      await libraryService.deleteBook(id);
      await fetchBooks();
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" gutterBottom color="primary">
        Library Admin Dashboard
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {isEditing ? "Edit Book" : "Add New Book"}
        </Typography>

        {apiError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {apiError}
          </Typography>
        )}

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="Title"
            name="bookTitle"
            value={newBook.bookTitle}
            onChange={handleInputChange}
            error={!!errors.bookTitle}
            helperText={errors.bookTitle}
            disabled={isSubmitting}
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
            sx={{ minWidth: 220 }}
          />
          <TextField
            label="ISBN"
            name="isbn"
            value={newBook.isbn}
            onChange={handleInputChange}
            error={!!errors.isbn}
            helperText={errors.isbn}
            disabled={isSubmitting}
            placeholder="xxxxxx"
            sx={{ minWidth: 160 }}
          />
          <TextField
            select
            label="Category"
            name="category"
            value={newBook.category}
            onChange={handleInputChange}
            error={!!errors.category}
            helperText={errors.category}
            disabled={isSubmitting}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="Fiction">Fiction</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Technology">Technology</MenuItem>
            <MenuItem value="History">History</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>

          {/* ✅ Total Copies */}
          <TextField
            label="Total Copies"
            name="totalCopies"
            type="number"
            value={newBook.totalCopies}
            onChange={handleInputChange}
            error={!!errors.totalCopies}
            helperText={errors.totalCopies}
            disabled={isSubmitting}
            sx={{ minWidth: 140 }}
            inputProps={{ min: 1 }}
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
      </Paper>

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
                <TableCell><strong>Available</strong></TableCell>
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
                    <TableCell>{book.total_copies ?? book.totalCopies ?? "-"}</TableCell>
                    <TableCell>{book.availableCopies ?? "-"}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(book)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deleteBook(book.bookId || book.id)}
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
