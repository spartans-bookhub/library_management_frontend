// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Stack,
//    CircularProgress
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { libraryService } from "../../services/libraryService";
// import { ReportChart } from "./ReportChart";
// import { useAuth } from "../../context/AuthContext";
// import { useCart } from "../../context/CartContext";
// import { useToast } from "../../context/ToastContext";
// import axios from 'axios';

// export default function BookTable () {

//   const [books, setBooks] = useState([]);
//   const [filteredBooks, setFilteredBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { showSuccess, showInfo } = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState(null);

//   const [open, setOpen] = useState(false);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const navigate = useNavigate();

//   const booksPerPage = 10;

//   let url = 'http://localhost:9111/api/v1/transactions'; // get
//   let bookUrl ='http://localhost:9111/api/books' ; // post
//   let booklistUrl = 'http://localhost:9111/api/books/list'; // get
//   let API_URL = 'http://localhost:9111/'

//   // Yup validation schema
//   const validateFields = () => {
//     const newErrors = {};

//     // Title validation
//     if (!newBook.bookTitle.trim()) {
//       newErrors.bookTitle = "Title is required.";
//     } else if (newBook.bookTitle.trim().length < 2) {
//       newErrors.bookTitle = "Title must be at least 2 characters long.";
//     } else if (newBook.bookTitle.trim().length > 100) {
//       newErrors.bookTitle = "Title must not exceed 100 characters.";
//     }

//     // Author validation
//     if (!newBook.bookAuthor.trim()) {
//       newErrors.bookAuthor = "Author is required.";
//     } else if (newBook.bookAuthor.trim().length < 2) {
//       newErrors.bookAuthor = "Author name must be at least 2 characters long.";
//     } else if (!/^[a-zA-Z\s.'-]+$/.test(newBook.bookAuthor.trim())) {
//       newErrors.bookAuthor = "Author name can only contain letters, spaces, and basic punctuation.";
//     }

//     // Category validation
//     if (!newBook.category.trim()) {
//       newErrors.category = "Category is required.";
//     } else if (newBook.category.trim().length < 2) {
//       newErrors.category = "Category must be at least 2 characters long.";
//     }

//     // ISBN validation
//     if (!newBook.isbn.trim()) {
//       newErrors.isbn = "ISBN is required.";
//     } else if (!/^[0-9\-]+$/.test(newBook.isbn)) {
//       newErrors.isbn = "ISBN must contain only numbers or dashes.";
//     } else if (newBook.isbn.replace(/-/g, '').length !== 6) {
//       newErrors.isbn = "ISBN must be 6 digits long (excluding dashes).";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // returns true if valid
//   };

//   // Formik Schemea
//   const formik = useFormik({
//     initialValues: {
//       book_title: "",
//       book_author: "",
//       ccategory: "Others", 
//       isbn: "",
//       image_url: "",
//       publisher_name: "",
//       publication_date: "",
//       price: "",
//       created_at: "",
//       total_copies: "0",
//       available_copies: "",
//       rating: "3",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       if (editingIndex !== null) {
//         const updatedBooks = [...books];
//         updatedBooks[editingIndex] = values;
//         setBooks(updatedBooks);
//       } else {
//         setBooks([...books, values]);
//       }
//       handleClose();
//     },
//   });

//   useEffect(() => {
//       fetchBooks();
//     }, []);

//   // add book
//   const addBook = async () => {
//     // Reset any previous API errors
//     setApiError(null);
//     // First check validation using validateFields
//     if (!validateFields()) {
//       return; // stop if validation fails
//     }
//     setIsSubmitting(true);
//     try {
//       await libraryService.createBook(newBook);
//       // Clear form and errors on success
//       setNewBook({ bookTitle: "", bookAuthor: "", category: "", isbn: "" });
//       setErrors({});
//       await fetchBooks();
//       // Show success message (you can add a toast/snackbar here)
//       alert("Book added successfully!");
//     } catch (error) {
//       // Handle specific API errors
//       const errorMessage = error.response?.data?.message || "Failed to add book. Please try again.";
//       setApiError(errorMessage);
//       console.error("Failed to add book:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Open / Close / Delete
//   const handleOpen = (index = null) => {
//     if (index !== null) {
//       setEditingIndex(index);
//       formik.setValues(books[index]);
//     } else {
//       setEditingIndex(null);
//       formik.resetForm();
//     }
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setEditingIndex(null);
//     formik.resetForm();
//   };

//   // const handleDelete = (index) => {
//   //   const updatedBooks = books.filter((_, i) => i !== index);
//   //   setBooks(updatedBooks);
//   // };

//     // get all books from DB
//    const fetchBooks = async () => {
//     try {
//       const data = await libraryService.getAllBooks();
//       console.log("data===", data)
//       setBooks(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.log("Failed to fetch books:", error);
//     }
//   };
//   // Delete book by ID
//   const deleteBook = async (id) => {
//     try {
//       console.log("id="+id)
//       await libraryService.deleteBook(id);
//       await fetchBooks(); 
//     } catch (error) {
//       console.log("Failed to delete book:", error);
//     }
//   };


//  const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewBook((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };



//   return (
//     <div style={{ padding: "20px" }}>
//      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//           <Typography variant="h5" component="h1">
//               Library Admin Dashboard - Books Records
//           </Typography>
//         </Box>

//       <Button variant="contained" color="secondary" onClick={() => handleOpen()}>
//         Add Book
//       </Button>

//       <TableContainer component={Paper} sx={{ mt: 3 }}>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//             <TableRow>
//               <TableCell><b>S.No</b></TableCell>
//               <TableCell><b>Title</b></TableCell>
//               <TableCell><b>Author</b></TableCell>
//               <TableCell><b>Category</b></TableCell>
//               <TableCell><b>ISBN</b></TableCell>
//               <TableCell><b>Publisher</b></TableCell>
//               {/* <TableCell><b>Price</b></TableCell> */}
//               {/* <TableCell><b>Total Copies</b></TableCell> */}
//               <TableCell><b>Available</b></TableCell>
//               {/* <TableCell><b>Rating</b></TableCell> */}
//               <TableCell align="center"><b>Actions</b></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {books.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={10} align="center">
//                   No books added yet
//                 </TableCell>
//               </TableRow>
//             ) : (
//               books.map((b, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{b.bookId}</TableCell>
//                   <TableCell>{b.bookTitle}</TableCell>
//                   <TableCell>{b.bookAuthor}</TableCell>
//                   <TableCell>{b.category}</TableCell>
//                   <TableCell>{b.isbn}</TableCell>
//                   <TableCell>{b.publisherName}</TableCell>
//                   <TableCell>{b.price}</TableCell>
//                   <TableCell>{b.totalCopies}</TableCell>
//                   <TableCell>{b.availableCopies}</TableCell>
//                   {/* <TableCell>{b.rating}</TableCell> */}
//                   <TableCell align="center">
//                     <IconButton color="primary" onClick={() => handleOpen(index)}>
//                       <Edit />
//                     </IconButton>
//                     <IconButton color="error" onClick={() => handleDelete(index)}>
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* 📘 Add / Edit Dialog */}
//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogTitle>{editingIndex !== null ? "Edit Book" : "Add New Book"}</DialogTitle>

//         <form onSubmit={formik.handleSubmit}>
//           <DialogContent dividers>
//             {/* Grid layout for clean UI */}
//             <div style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "16px"
//             }}>
// //               <TextField
//             label="Title"
//             name="bookTitle"
//             value={newBook.bookTitle}
//             onChange={handleInputChange}
//             error={!!errors.bookTitle}
//             helperText={errors.bookTitle}
//             disabled={isSubmitting}
//             fullWidth
//           />
//           <TextField
//             label="Author"
//             name="bookAuthor"
//             value={newBook.bookAuthor}
//             onChange={handleInputChange}
//             error={!!errors.bookAuthor}
//             helperText={errors.bookAuthor}
//             disabled={isSubmitting}
//             fullWidth
//           />
//           <TextField
//               <TextField
//                 label="Category"
//                 name="category"
//                 select
//                 fullWidth
//                 value={formik.values.category}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.category && Boolean(formik.errors.category)}
//                 helperText={formik.touched.category && formik.errors.category}
//               >
//                 <MenuItem value="Fiction">Fiction</MenuItem>
//                 <MenuItem value="Science">Science</MenuItem>
//                 <MenuItem value="Technology">Technology</MenuItem>
//                 <MenuItem value="History">History</MenuItem>
//                 <MenuItem value="Others">Others</MenuItem>

//               </TextField>
//               <TextField
//                 label="ISBN"
//                 name="isbn"
//                 fullWidth
//                 value={formik.values.isbn}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.isbn && Boolean(formik.errors.isbn)}
//                 helperText={formik.touched.isbn && formik.errors.isbn}
//               />
//               <TextField
//                 label="Image URL"
//                 name="image_url"
//                 fullWidth
//                 value={formik.values.image_url}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.image_url && Boolean(formik.errors.image_url)}
//                 helperText={formik.touched.image_url && formik.errors.image_url}
//               />
//               <TextField
//                 label="Publisher Name"
//                 name="publisher_name"
//                 fullWidth
//                 value={formik.values.publisher_name}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.publisher_name && Boolean(formik.errors.publisher_name)}
//                 helperText={formik.touched.publisher_name && formik.errors.publisher_name}
//               />
//               <TextField
//                 label="Publication Date"
//                 name="publication_date"
//                 type="date"
//                 InputLabelProps={{ shrink: true }}
//                 fullWidth
//                 value={formik.values.publication_date}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.publication_date && Boolean(formik.errors.publication_date)}
//                 helperText={formik.touched.publication_date && formik.errors.publication_date}
//               />
//               <TextField
//                 label="Price"
//                 name="price"
//                 type="number"
//                 fullWidth
//                 value={formik.values.price}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.price && Boolean(formik.errors.price)}
//                 helperText={formik.touched.price && formik.errors.price}
//               />
//               <TextField
//                 label="Created At"
//                 name="created_at"
//                 type="date"
//                 InputLabelProps={{ shrink: true }}
//                 fullWidth
//                 value={formik.values.created_at}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.created_at && Boolean(formik.errors.created_at)}
//                 helperText={formik.touched.created_at && formik.errors.created_at}
//               />
//               {/* <TextField
//                 label="Total Copies"
//                 name="total_copies"
//                 type="number"
//                 fullWidth
//                 value={formik.values.total_copies}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.total_copies && Boolean(formik.errors.total_copies)}
//                 helperText={formik.touched.total_copies && formik.errors.total_copies}
//               />
//               <TextField
//                 label="Available Copies"
//                 name="available_copies"
//                 type="number"
//                 fullWidth
//                 value={formik.values.available_copies}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.available_copies && Boolean(formik.errors.available_copies)}
//                 helperText={formik.touched.available_copies && formik.errors.available_copies}
//               /> */}
//               {/* <TextField
//                 label="Rating"
//                 name="rating"
//                 type="number"
//                 fullWidth
//                 value={formik.values.rating}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.rating && Boolean(formik.errors.rating)}
//                 helperText={formik.touched.rating && formik.errors.rating}
//               /> */}
//             </div>
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button type="submit" variant="contained" color="primary">
//               {editingIndex !== null ? "Update" : "Add"}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </div>
//   );
// };

