// import React, { useState } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Paper,
//   Grid,
//   Card,
//   CardContent,
//   Button,
// } from "@mui/material";
// import { styled } from '@mui/material/styles';
// import Stack from '@mui/material/Stack';
// import Sidebar from './Sidebar';
// import { useAuth } from "../../context/AuthContext";
// import BookTable from "./BookTable"
// import AdminHome from './AdminHome';
// import FilterSidebar from './FilterSidebar';
// import BookList from '../Books/BookList';
// import BookViewCard from './BookViewCard';


// export default function AdminDashboard() {
// const { user, logout } = useAuth();
// const [toggle, setToggle] = useState(false);

// const Toggle = ()=>{
//   setToggle(!toggle)
// }


//   return (
//     // Remove this provider when copying and pasting into your project.
//     <>
//     <Container disableGutters={true} maxWidth="lg" sx={{ mt: 1}}>
//           <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
//             <Box>
//                 <Typography variant="h4">
//                   Admin Dashboard
//                 </Typography>
//                 <Typography variant="subtitle1" color="text.secondary">
//                   Welcome,  
//                   {/* {user?.userName || "User"} */}
//                   ({user?.role || "ADMIN"})
//                 </Typography>
//               </Box>
//               {/* <Box sx={{ flexGrow: 1 }}>
//                 <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
//                     {Array.from(Array(6)).map((_, index) => (
//                       <Grid key={index} size={{ xs: 4, sm: 4, md: 4 }}>
//                         BOXXXXX
//                       </Grid>
//                   ))}
//                 </Grid>
//               </Box> */}
//             </Paper >
//       </Container>

//   <div className="container-fluid bg-secondary min-vh-100" >
//       <div className="row">
//         {/* <BookList /> */}
//         {/* <BookViewCard /> */}
           
              

//           {toggle && <div className="col-2 bg-white vh-100 position-fixed">
//                         <Sidebar />
//                     </div>
//             }
            
//             <div className="col-auto">
//                 <AdminHome  Toggle={Toggle}/>
//             </div>

//              {/* <div className="col-2 bg-white vh-100 float-left top-right">
//               <FilterSidebar />
//             </div> */}

//             {/* <div className="container-fluid">
//                 <div className="row">
//                     <BookTable />
//                 </div>
//               </div> */}

//           </div>
//         </div>
    
      

//     </>

//   );
// }

////////////////////////////////////////////////////////////////////////////////////////////////
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
    price: "",
    imageUrl: "",
    totalCopies: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editingTempId, setEditingTempId] = useState(null); // to match optimistic rows

  // upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Validate inputs
  const validateFields = () => {
    const newErrors = {};

    // Title validation
    if (!newBook.bookTitle || !newBook.bookTitle.trim()) {
      newErrors.bookTitle = "Title is required.";
    } else if (newBook.bookTitle.trim().length < 2) {
      newErrors.bookTitle = "Title must be at least 2 characters long.";
    } else if (newBook.bookTitle.trim().length > 100) {
      newErrors.bookTitle = "Title must not exceed 100 characters.";
    }

    // Author validation
    if (!newBook.bookAuthor || !newBook.bookAuthor.trim()) {
      newErrors.bookAuthor = "Author is required.";
    } else if (newBook.bookAuthor.trim().length < 2) {
      newErrors.bookAuthor = "Author name must be at least 2 characters long.";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(newBook.bookAuthor.trim())) {
      newErrors.bookAuthor = "Author name can only contain letters, spaces, and basic punctuation.";
    }

    // Category validation
    if (!newBook.category || !newBook.category.trim()) {
      newErrors.category = "Category is required.";
    } else if (newBook.category.trim().length < 2) {
      newErrors.category = "Category must be at least 2 characters long.";
    }

    // ISBN validation
    if (!newBook.isbn || !newBook.isbn.trim()) {
      newErrors.isbn = "ISBN is required.";
    } else if (!/^[0-9\-]+$/.test(newBook.isbn)) {
      newErrors.isbn = "ISBN must contain only numbers or dashes.";
    } else if (newBook.isbn.replace(/-/g, "").length !== 6) {
      newErrors.isbn = "ISBN must be 6 digits long (excluding dashes).";
    }

    // Price validation (optional depending on previous requests — kept if price exists)
    if (newBook.price !== "" && newBook.price !== null) {
      if (Number.isNaN(Number(newBook.price)) || Number(newBook.price) < 0) {
        newErrors.price = "Price must be a valid non-negative number.";
      }
    }

    // Total copies validation
    if (newBook.totalCopies === "" || newBook.totalCopies === null) {
      newErrors.totalCopies = "Total copies is required.";
    } else {
      const tc = Number(newBook.totalCopies);
      if (!Number.isInteger(tc) || tc < 1) {
        newErrors.totalCopies = "Total copies must be an integer >= 1.";
      }
    }

    // (availableCopies removed) 

    // Image URL / upload validation
    if (!newBook.imageUrl || !newBook.imageUrl.trim()) {
      newErrors.imageUrl = "Image is required. Please upload an image.";
    } else {
      const val = newBook.imageUrl.trim();
      const isDataUrl = /^data:image\/(png|jpeg|jpg|webp);base64,/.test(val);
      let isValidUrl = false;
      try {
        const u = new URL(val);
        isValidUrl = u.protocol === "http:" || u.protocol === "https:";
      } catch (e) {
        isValidUrl = false;
      }
      if (!isDataUrl && !isValidUrl) {
        newErrors.imageUrl = "Image must be a valid URL or uploaded file preview.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch all books
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

  // handle file selection & simulated upload
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

  // add or update book with optimistic UI update for both create and update
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

    // Prepare payload
    const payload = {
      bookTitle: newBook.bookTitle.trim(),
      bookAuthor: newBook.bookAuthor.trim(),
      category: newBook.category.trim(),
      isbn: newBook.isbn.trim(),
      // include optional price if present
      ...(newBook.price !== "" && newBook.price !== null ? { price: Number(newBook.price) } : {}),
      image_url: newBook.imageUrl,
      total_copies: Number(newBook.totalCopies),
    };

    if (isEditing) {
      // UPDATE flow
      const prevBooks = [...books];
      // optimistic update: map and replace matching row (match by id/bookId or tempId)
      setBooks((prev) =>
        prev.map((b) => {
          const idMatch = b.bookId === editingBookId || b.id === editingBookId;
          const tempMatch = editingTempId && b.tempId === editingTempId;
          if (idMatch || tempMatch) {
            return {
              ...b,
              bookTitle: payload.bookTitle,
              bookAuthor: payload.bookAuthor,
              category: payload.category,
              isbn: payload.isbn,
              price: payload.price ?? b.price,
              image_url: payload.image_url,
              imageUrl: payload.image_url,
              total_copies: payload.total_copies,
              totalCopies: payload.total_copies,
              availableCopies: payload.availableCopies,
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
        // success
        setIsEditing(false);
        setEditingBookId(null);
        setEditingTempId(null);
        setNewBook({
          bookTitle: "",
          bookAuthor: "",
          category: "",
          isbn: "",
          bookId: "",
          price: "",
          imageUrl: "",
          totalCopies: "",
          availableCopies: "",
        });
        setErrors({});
        alert("Book updated successfully!");
      } catch (error) {
        // revert optimistic update
        setBooks(prevBooks);
        const errorMessage = error?.response?.data?.message || "Failed to update book. Please try again.";
        setApiError(errorMessage);
        console.error("Failed to update book:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // CREATE flow (existing optimistic create)
      const tempId = `temp-${Date.now()}`;
      const localBook = {
        tempId,
        bookId: undefined,
        id: undefined,
        bookTitle: payload.bookTitle,
        bookAuthor: payload.bookAuthor,
        category: payload.category,
        isbn: payload.isbn,
        price: payload.price,
        imageUrl: payload.image_url,
        image_url: payload.image_url,
        total_copies: payload.total_copies,
        totalCopies: payload.total_copies,
        availableCopies: payload.availableCopies,
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
        // clear form
        setNewBook({
          bookTitle: "",
          bookAuthor: "",
          category: "",
          isbn: "",
          bookId: "",
          price: "",
          imageUrl: "",
          totalCopies: "",
          availableCopies: "",
        });
        setErrors({});
        setUploadProgress(0);
        setUploading(false);
        alert("Book added successfully!");
      } catch (error) {
        // remove optimistic entry and show error
        setBooks((prev) => prev.filter((b) => b.tempId !== tempId));
        const errorMessage = error?.response?.data?.message || "Failed to add book. Please try again.";
        setApiError(errorMessage);
        console.error("Failed to add book:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEdit = (book) => {
    // Normalize fields
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
      price: book.price ?? "",
      imageUrl: book.image_url ?? book.imageUrl ?? "",
      totalCopies: book.total_copies ?? book.totalCopies ?? "",
      availableCopies: book.availableCopies ?? (book.availableCopies === 0 ? 0 : ""),
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
      price: "",
      imageUrl: "",
      totalCopies: "",
      availableCopies: "",
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

      {/* ADD / EDIT BOOK */}
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

          <TextField
            label="Price"
            name="price"
            type="number"
            value={newBook.price}
            onChange={handleInputChange}
            error={!!errors.price}
            helperText={errors.price}
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          />

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
          />
          {/* availableCopies removed from form */}

          {/* Image upload area */}
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

      {/* BOOK TABLE */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Book List
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                <TableCell><strong>Book ID</strong></TableCell>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Author</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>ISBN</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Total Copies</strong></TableCell>
                <TableCell><strong>Available</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">No books added yet.</TableCell>
                </TableRow>
              ) : (
                books.map((book) => {
                  const id = book.bookId || book.id || null;
                  const isOptimistic = !id;
                  return (
                    <TableRow key={book.bookId || book.id || book.tempId || book.isbn}>
                      <TableCell>{id ?? book.tempId ?? "-"}</TableCell>
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
                      <TableCell>{book.price !== undefined ? book.price : "-"}</TableCell>
                      <TableCell>{book.total_copies ?? book.totalCopies ?? "-"}</TableCell>
                      <TableCell>{book.availableCopies ?? "-"}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(book)}
                          disabled={isOptimistic} // only allow edit when backend id exists
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => deleteBook(id)}
                          disabled={!id}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;

