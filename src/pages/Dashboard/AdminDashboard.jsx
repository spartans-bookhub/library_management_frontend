// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   Avatar,
//   LinearProgress,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Stack,
//   Divider,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { libraryService } from "../../services/libraryService";

// const validationSchema = Yup.object({
//   bookTitle: Yup.string()
//     .trim()
//     .min(2, "Title must be at least 2 characters")
//     .max(100, "Title must not exceed 100 characters")
//     .required("Book title is required"),
//   bookAuthor: Yup.string()
//     .trim()
//     .matches(/^[a-zA-Z\s.'-]+$/, "Author name can only contain letters and punctuation")
//     .required("Author is required"),
//   category: Yup.string().required("Category is required"),
//   isbn: Yup.string()
//     .trim()
//     .matches(/^[0-9\-]+$/, "ISBN must contain only numbers or dashes")
//     .length(8, "ISBN must be exactly 8 digits long")
//     .required("ISBN is required"),
//   totalCopies: Yup.number()
//     .typeError("Total copies must be a number")
//     .integer("Must be a whole number")
//     .min(1, "At least 1 copy required")
//     .required("Total copies required"),
//   imageUrl: Yup.string().required("Image is required"),
// });

// export default function AdminDashboard() {
//   const [books, setBooks] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [editingBook, setEditingBook] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchBooks = async () => {
//     setLoading(true);
//     try {
//       const data = await libraryService.getAllBooks();
//       setBooks(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching books:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const handleUpload = (file, setFieldValue) => {
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       const dataUrl = reader.result;
//       setUploading(true);
//       let progress = 0;
//       const interval = setInterval(() => {
//         progress += Math.random() * 25;
//         if (progress >= 100) {
//           clearInterval(interval);
//           setUploading(false);
//           setUploadProgress(100);
//           setFieldValue("imageUrl", dataUrl);
//         } else {
//           setUploadProgress(progress);
//         }
//       }, 200);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this book?")) return;
//     try {
//       await libraryService.deleteBook(id);
//       fetchBooks();
//     } catch (error) {
//       console.error("Error deleting book:", error);
//     }
//   };

//   const handleSubmit = async (values, { resetForm, setSubmitting }) => {
//     try {
//       const payload = {
//         bookTitle: values.bookTitle.trim(),
//         bookAuthor: values.bookAuthor.trim(),
//         category: values.category,
//         isbn: values.isbn,
//         total_copies: Number(values.totalCopies),
//         image_url: values.imageUrl,
//       };

//       if (editingBook) {
//         await libraryService.updateBook(editingBook.bookId || editingBook.id, payload);
//         alert("Book updated successfully!");
//       } else {
//         await libraryService.createBook(payload);
//         alert("Book added successfully!");
//       }

//       setEditingBook(null);
//       resetForm();
//       fetchBooks();
//     } catch (error) {
//       console.error("Error saving book:", error);
//       alert("Failed to save book. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const initialValues = editingBook
//     ? {
//         bookTitle: editingBook.bookTitle,
//         bookAuthor: editingBook.bookAuthor,
//         category: editingBook.category,
//         isbn: editingBook.isbn,
//         totalCopies: editingBook.total_copies ?? editingBook.totalCopies ?? 1,
//         imageUrl: editingBook.image_url ?? editingBook.imageUrl,
//       }
//     : {
//         bookTitle: "",
//         bookAuthor: "",
//         category: "",
//         isbn: "",
//         totalCopies: "",
//         imageUrl: "",
//       };

//   return (
//     <Box sx={{ p: 4, bgcolor: "#f8f9fb", minHeight: "100vh" }}>
//       <Typography variant="h4" align="center" fontWeight={600} color="primary.main" mb={3}>
//         Library Admin Dashboard
//       </Typography>

//       <Paper sx={{ p: 4, mb: 4 }}>
//         <Typography variant="h6" fontWeight={600} gutterBottom>
//           {editingBook ? "Edit Book" : "Add New Book"}
//         </Typography>

//         <Divider sx={{ mb: 3 }} />

//         <Formik
//           enableReinitialize
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
//             <Form>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6} md={4}>
//                   <TextField
//                     label="Title"
//                     name="bookTitle"
//                     value={values.bookTitle}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     fullWidth
//                     error={touched.bookTitle && !!errors.bookTitle}
//                     helperText={touched.bookTitle && errors.bookTitle}
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={6} md={4}>
//                   <TextField
//                     label="Author"
//                     name="bookAuthor"
//                     value={values.bookAuthor}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     fullWidth
//                     error={touched.bookAuthor && !!errors.bookAuthor}
//                     helperText={touched.bookAuthor && errors.bookAuthor}
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={6} md={4}>
//                   <TextField
//                     label="ISBN"
//                     name="isbn"
//                     value={values.isbn}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     fullWidth
//                     error={touched.isbn && !!errors.isbn}
//                     helperText={touched.isbn && errors.isbn}
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={6} md={4}>
//                   <TextField
//                     select
//                     label="Category"
//                     name="category"
//                     value={values.category}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     fullWidth
//                     error={touched.category && !!errors.category}
//                     helperText={touched.category && errors.category}
//                   >
//                     <MenuItem value="Fiction">Fiction</MenuItem>
//                     <MenuItem value="Science">Science</MenuItem>
//                     <MenuItem value="Technology">Technology</MenuItem>
//                     <MenuItem value="History">History</MenuItem>
//                     <MenuItem value="Others">Others</MenuItem>
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} sm={6} md={4}>
//                   <TextField
//                     label="Total Copies"
//                     name="totalCopies"
//                     type="number"
//                     value={values.totalCopies}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     fullWidth
//                     error={touched.totalCopies && !!errors.totalCopies}
//                     helperText={touched.totalCopies && errors.totalCopies}
//                     inputProps={{ min: 1 }}
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={6} md={4}>
//                   <Stack direction="row" spacing={2} alignItems="center">
//                     <Button
//                       variant="outlined"
//                       component="label"
//                       disabled={uploading}
//                     >
//                       {uploading ? "Uploading..." : "Upload Image"}
//                       <input
//                         type="file"
//                         hidden
//                         accept="image/*"
//                         onChange={(e) =>
//                           handleUpload(e.target.files?.[0], setFieldValue)
//                         }
//                       />
//                     </Button>
//                     <Avatar
//                       src={values.imageUrl}
//                       alt="Book cover"
//                       variant="rounded"
//                       sx={{ width: 56, height: 56 }}
//                     />
//                   </Stack>
//                   {uploading && (
//                     <LinearProgress
//                       variant="determinate"
//                       value={uploadProgress}
//                       sx={{ mt: 1 }}
//                     />
//                   )}
//                   {touched.imageUrl && errors.imageUrl && (
//                     <Typography color="error" variant="caption">
//                       {errors.imageUrl}
//                     </Typography>
//                   )}
//                 </Grid>

//                 <Grid item xs={12} mt={2}>
//                   <Stack direction="row" spacing={2}>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       disabled={isSubmitting || uploading}
//                     >
//                       {isSubmitting
//                         ? editingBook
//                           ? "Updating..."
//                           : "Adding..."
//                         : editingBook
//                         ? "Update Book"
//                         : "Add Book"}
//                     </Button>
//                     {editingBook && (
//                       <Button
//                         variant="outlined"
//                         color="secondary"
//                         onClick={() => setEditingBook(null)}
//                       >
//                         Cancel
//                       </Button>
//                     )}
//                   </Stack>
//                 </Grid>
//               </Grid>
//             </Form>
//           )}
//         </Formik>
//       </Paper>

//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h6" fontWeight={600} mb={2}>
//           Book List
//         </Typography>

//         {loading ? (
//           <Box textAlign="center" py={4}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <TableContainer>
//             <Table>
//               <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
//                 <TableRow>
//                   <TableCell><strong>#</strong></TableCell>
//                   <TableCell><strong>Image</strong></TableCell>
//                   <TableCell><strong>Title</strong></TableCell>
//                   <TableCell><strong>Author</strong></TableCell>
//                   <TableCell><strong>Category</strong></TableCell>
//                   <TableCell><strong>ISBN</strong></TableCell>
//                   <TableCell><strong>Total Copies</strong></TableCell>
//                   <TableCell><strong>Actions</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {books.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       No books available.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   books.map((book, index) => (
//                     <TableRow key={book.bookId || book.id}>
//                       <TableCell>{index + 1}</TableCell>
//                       <TableCell>
//                         <Avatar
//                           src={book.image_url ?? book.imageUrl}
//                           variant="rounded"
//                           sx={{ width: 48, height: 48 }}
//                         />
//                       </TableCell>
//                       <TableCell>{book.bookTitle}</TableCell>
//                       <TableCell>{book.bookAuthor}</TableCell>
//                       <TableCell>{book.category}</TableCell>
//                       <TableCell>{book.isbn}</TableCell>
//                       <TableCell>{book.total_copies ?? book.totalCopies}</TableCell>
//                       <TableCell>
//                         <IconButton
//                           color="primary"
//                           onClick={() => setEditingBook(book)}
//                         >
//                           <Edit />
//                         </IconButton>
//                         <IconButton
//                           color="error"
//                           onClick={() => handleDelete(book.bookId || book.id)}
//                         >
//                           <Delete />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>
//     </Box>
//   );
// }


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
<<<<<<< Updated upstream
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editingTempId, setEditingTempId] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

// ...existing code...
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
    } else {
      const isbnTrim = newBook.isbn.trim();
      // allow letters, numbers and dashes only
      if (!/^[A-Za-z0-9-]+$/.test(isbnTrim)) {
        newErrors.isbn = "ISBN must contain only letters, numbers or dashes.";
      } else {
        const cleaned = isbnTrim.replace(/-/g, "");
        // ensure there is at least something besides dashes
        if (cleaned.length === 0) {
          newErrors.isbn = "ISBN must contain letters or numbers (dashes alone are not allowed).";
        } else if (cleaned.length !== 8) {
          newErrors.isbn = "ISBN must be 8 characters long (excluding dashes).";
        } else if (!/^[A-Za-z0-9]+$/.test(cleaned)) {
          newErrors.isbn = "ISBN must contain only letters and numbers (excluding dashes).";
        }
      }
    }

    //  Total copies validation — no negatives
    if (newBook.totalCopies === "" || newBook.totalCopies === null) {
      newErrors.totalCopies = "Total copies is required.";
    } else {
      const tc = Number(newBook.totalCopies);
      if (!Number.isInteger(tc) || tc < 1) {
        newErrors.totalCopies = "Total copies must be an integer >= 1.";
      }
    }

    // Image validation
    // if (!newBook?.imageUrl || !newBook.imageUrl.trim()) {
    //   newErrors.imageUrl = "Image is required.";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Fetch books from API
=======
  const [editingBook, setEditingBook] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchBooks();
  }, []);

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
  const handleAddBook = (book) => {
    setBooks((prev) => [book, ...prev]);
  };

  const handleUpdateBook = (updatedBook) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === updatedBook.id || b.bookId === updatedBook.bookId
          ? { ...updatedBook }
          : b
      )
    );
  };

  const handleDeleteBook = async (id) => {
>>>>>>> Stashed changes
    try {
      await libraryService.deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id && b.bookId !== id));
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
<<<<<<< Updated upstream
      <Typography variant="h4" align="center" gutterBottom color="primary">
        Library Admin Dashboard
=======
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        📘 Library Admin Dashboard
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
                    <TableCell>{book.total_copies ?? book.totalCopies ?? "-"}</TableCell>
                    {/* <TableCell>{book.availableCopies ?? "-"}</TableCell> */}
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
=======
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
>>>>>>> Stashed changes
    </Box>
  );
};

export default AdminDashboard;
