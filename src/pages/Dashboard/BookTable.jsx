import React, { useState, useEffect} from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, TextField, MenuItem, Box, Typography
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { libraryService } from "../../services/libraryService";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import axios from 'axios';

export default function BookTable () {

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showSuccess, showInfo } = useToast();

  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const navigate = useNavigate();

  const booksPerPage = 10;

  let url = 'http://localhost:9009/api/v1/transactions'; // get
  let bookulr ='http://localhost:9009/api/books' ; // post
  let booklistUrl = 'http://localhost:9009/api/books/list'; // get
  let API_URL = 'http://localhost:9009/'

  // Yup validation schema
  const validationSchema = Yup.object({
    book_title: Yup.string().required("Book title is required"),
    book_author: Yup.string().required("Author name is required"),
    category: Yup.string().required("Category is required"),
    isbn: Yup.string()
      .matches(/^[0-9\-]+$/, "Invalid ISBN format")
      .required("ISBN is required"),
    image_url: Yup.string().url("Must be a valid URL").required("Image URL is required"),
    publisher_name: Yup.string().required("Publisher name is required"),
    publication_date: Yup.date().required("Publication date is required"),
    price: Yup.number().positive("Must be positive").required("Price is required"),
    created_at: Yup.date().required("Created date is required"),
    total_copies: Yup.number()
      .integer("Must be a whole number")
      .min(1, "At least 1 copy")
      .required("Total copies required"),
    available_copies: Yup.number()
      .integer()
      .min(0, "Cannot be negative")
      .required("Available copies required"),
    rating: Yup.number()
      .integer("Must be a whole number")
      .min(0, "Min 0")
      .max(5, "Max 5")
  });

  // Formik Schemea
  const formik = useFormik({
    initialValues: {
      book_title: "",
      book_author: "",
      ccategory: "Others", 
      isbn: "",
      image_url: "",
      publisher_name: "",
      publication_date: "",
      price: "",
      created_at: "",
      total_copies: "0",
      available_copies: "",
      rating: "3",
    },
    validationSchema,
    onSubmit: (values) => {
      if (editingIndex !== null) {
        const updatedBooks = [...books];
        updatedBooks[editingIndex] = values;
        setBooks(updatedBooks);
      } else {
        setBooks([...books, values]);
      }
      handleClose();
    },
  });

  // Open / Close / Delete
  const handleOpen = (index = null) => {
    if (index !== null) {
      setEditingIndex(index);
      formik.setValues(books[index]);
    } else {
      setEditingIndex(null);
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingIndex(null);
    formik.resetForm();
  };

  // const handleDelete = (index) => {
  //   const updatedBooks = books.filter((_, i) => i !== index);
  //   setBooks(updatedBooks);
  // };

  useEffect(() => {
      fetchBooks();
    }, []);

    // get all books from DB
    const fetchBooks = async () => {
     try {
       setLoading(true);
       const data = await libraryService.getAllBooks();
       console.log("bokk..",data)
       const books= Array.isArray(data) ? data : [];
       setBooks(books);
     } catch (error) {
       setError(error.message || "Failed to fetch books");
     } finally {
       setLoading(false);
     }
   };

  // Delete book by ID
  const handleDelete = async (bookId) => {
    try {
      const data = await libraryService.deleteBook(bookId);
      console.log('delet', data)
      // Remove from UI list
      const books = books.filter((book) => book.bookId !== bookId);
      setBooks(books);
      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Error deleting book.");
    }
  };


    const addBook = async (bookId) => {
    try {
      await axios.post(`${API_URL}/${bookId}`);
      // Remove from UI list
      const books = books.filter((book) => book.bookId !== bookId);
      setBooks(books);
      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Error deleting book.");
    }
  };



  return (
    <div style={{ padding: "20px" }}>
     <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1">
             Books Records
          </Typography>
        </Box>

      <Button variant="contained" color="secondary" onClick={() => handleOpen()}>
        Add Book
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>S.No</b></TableCell>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>Author</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>ISBN</b></TableCell>
              <TableCell><b>Publisher</b></TableCell>
              {/* <TableCell><b>Price</b></TableCell> */}
              {/* <TableCell><b>Total Copies</b></TableCell> */}
              <TableCell><b>Available</b></TableCell>
              {/* <TableCell><b>Rating</b></TableCell> */}
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No books added yet
                </TableCell>
              </TableRow>
            ) : (
              books.map((b, index) => (
                <TableRow key={index}>
                  <TableCell>{b.bookId}</TableCell>
                  <TableCell>{b.bookTitle}</TableCell>
                  <TableCell>{b.bookAuthor}</TableCell>
                  <TableCell>{b.category}</TableCell>
                  <TableCell>{b.isbn}</TableCell>
                  <TableCell>{b.publisherName}</TableCell>
                  <TableCell>{b.price}</TableCell>
                  <TableCell>{b.totalCopies}</TableCell>
                  <TableCell>{b.availableCopies}</TableCell>
                  {/* <TableCell>{b.rating}</TableCell> */}
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpen(index)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📘 Add / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingIndex !== null ? "Edit Book" : "Add New Book"}</DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            {/* Grid layout for clean UI */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px"
            }}>
              <TextField
                label="Book Title"
                name="book_title"
                fullWidth
                value={formik.values.book_title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.book_title && Boolean(formik.errors.book_title)}
                helperText={formik.touched.book_title && formik.errors.book_title}
              />
              <TextField
                label="Author"
                name="book_author"
                fullWidth
                value={formik.values.book_author}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.book_author && Boolean(formik.errors.book_author)}
                helperText={formik.touched.book_author && formik.errors.book_author}
              />
              <TextField
                label="Category"
                name="category"
                select
                fullWidth
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                <MenuItem value="Fiction">Fiction</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="History">History</MenuItem>
                <MenuItem value="Others">Others</MenuItem>

              </TextField>
              <TextField
                label="ISBN"
                name="isbn"
                fullWidth
                value={formik.values.isbn}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.isbn && Boolean(formik.errors.isbn)}
                helperText={formik.touched.isbn && formik.errors.isbn}
              />
              <TextField
                label="Image URL"
                name="image_url"
                fullWidth
                value={formik.values.image_url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.image_url && Boolean(formik.errors.image_url)}
                helperText={formik.touched.image_url && formik.errors.image_url}
              />
              <TextField
                label="Publisher Name"
                name="publisher_name"
                fullWidth
                value={formik.values.publisher_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.publisher_name && Boolean(formik.errors.publisher_name)}
                helperText={formik.touched.publisher_name && formik.errors.publisher_name}
              />
              <TextField
                label="Publication Date"
                name="publication_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formik.values.publication_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.publication_date && Boolean(formik.errors.publication_date)}
                helperText={formik.touched.publication_date && formik.errors.publication_date}
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
              <TextField
                label="Created At"
                name="created_at"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formik.values.created_at}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.created_at && Boolean(formik.errors.created_at)}
                helperText={formik.touched.created_at && formik.errors.created_at}
              />
              {/* <TextField
                label="Total Copies"
                name="total_copies"
                type="number"
                fullWidth
                value={formik.values.total_copies}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.total_copies && Boolean(formik.errors.total_copies)}
                helperText={formik.touched.total_copies && formik.errors.total_copies}
              />
              <TextField
                label="Available Copies"
                name="available_copies"
                type="number"
                fullWidth
                value={formik.values.available_copies}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.available_copies && Boolean(formik.errors.available_copies)}
                helperText={formik.touched.available_copies && formik.errors.available_copies}
              /> */}
              {/* <TextField
                label="Rating"
                name="rating"
                type="number"
                fullWidth
                value={formik.values.rating}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.rating && Boolean(formik.errors.rating)}
                helperText={formik.touched.rating && formik.errors.rating}
              /> */}
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

