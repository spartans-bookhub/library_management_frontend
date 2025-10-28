import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Avatar,
  LinearProgress,
  TextField,
  MenuItem,
  Stack,
  Paper,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { libraryService } from "../../services/libraryService";

const validationSchema = Yup.object({
  bookTitle: Yup.string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must not exceed 100 characters")
    .required("Title is required"),
  bookAuthor: Yup.string()
    .matches(/^[a-zA-Z\s.'-]+$/, "Invalid author name")
    .required("Author is required"),
  category: Yup.string().required("Category is required"),
  isbn: Yup.string()
    .matches(/^[0-9\-]+$/, "ISBN must contain only numbers or dashes")
    .required("ISBN is required"),
  totalCopies: Yup.number()
    .integer("Must be an integer")
    .min(1, "At least 1 copy required")
    .required("Total copies required"),
  imageUrl: Yup.string().required("Image is required"),
});

const BookForm = ({ editingBook, setEditingBook, onBookAdded, onBookUpdated, setSnackbar }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const formik = useFormik({
    initialValues: {
      bookTitle: "",
      bookAuthor: "",
      category: "",
      isbn: "",
      totalCopies: "",
      imageUrl: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingBook) {
          const updated = await libraryService.updateBook(editingBook.bookId || editingBook.id, values);
          onBookUpdated(updated);
          setSnackbar({ open: true, message: "Book updated successfully", severity: "success" });
        } else {
          const created = await libraryService.createBook(values);
          onBookAdded(created);
          setSnackbar({ open: true, message: "Book added successfully", severity: "success" });
        }
        resetForm();
        setEditingBook(null);
      } catch (error) {
        console.error("Error saving book:", error);
        setSnackbar({ open: true, message: "Failed to save book", severity: "error" });
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (editingBook) {
      formik.setValues({
        bookTitle: editingBook.bookTitle || "",
        bookAuthor: editingBook.bookAuthor || "",
        category: editingBook.category || "",
        isbn: editingBook.isbn || "",
        totalCopies: editingBook.totalCopies || editingBook.total_copies || "",
        imageUrl: editingBook.imageUrl || editingBook.image_url || "",
      });
    }
  }, [editingBook]);

  const handleFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setUploading(true);
      setUploadProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (progress >= 100) {
          clearInterval(interval);
          setUploading(false);
          formik.setFieldValue("imageUrl", dataUrl);
        }
        setUploadProgress(progress);
      }, 200);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={formik.handleSubmit}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="Title"
            name="bookTitle"
            value={formik.values.bookTitle}
            onChange={formik.handleChange}
            error={formik.touched.bookTitle && Boolean(formik.errors.bookTitle)}
            helperText={formik.touched.bookTitle && formik.errors.bookTitle}
          />

          <TextField
            label="Author"
            name="bookAuthor"
            value={formik.values.bookAuthor}
            onChange={formik.handleChange}
            error={formik.touched.bookAuthor && Boolean(formik.errors.bookAuthor)}
            helperText={formik.touched.bookAuthor && formik.errors.bookAuthor}
          />

          <TextField
            label="ISBN"
            name="isbn"
            value={formik.values.isbn}
            onChange={formik.handleChange}
            error={formik.touched.isbn && Boolean(formik.errors.isbn)}
            helperText={formik.touched.isbn && formik.errors.isbn}
          />

          <TextField
            select
            label="Category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="Fiction">Fiction</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Technology">Technology</MenuItem>
            <MenuItem value="History">History</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>

          <TextField
            label="Total Copies"
            name="totalCopies"
            type="number"
            value={formik.values.totalCopies}
            onChange={formik.handleChange}
            error={formik.touched.totalCopies && Boolean(formik.errors.totalCopies)}
            helperText={formik.touched.totalCopies && formik.errors.totalCopies}
            sx={{ width: 150 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <input
              accept="image/*"
              id="upload-img"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            <label htmlFor="upload-img">
              <Button variant="outlined" component="span" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </label>
            {uploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ width: 100 }} />}
            <Avatar src={formik.values.imageUrl} variant="rounded" sx={{ width: 56, height: 56 }} />
          </Box>

          <Box>
            <Button type="submit" variant="contained" color="primary">
              {editingBook ? "Update Book" : "Add Book"}
            </Button>
            {editingBook && (
              <Button
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
                onClick={() => setEditingBook(null)}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default BookForm;
