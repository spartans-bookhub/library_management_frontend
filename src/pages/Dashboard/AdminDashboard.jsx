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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { libraryService } from "../../services/libraryService";
import { ReportChart } from "./ReportChart";

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ bookTitle: "", bookAuthor: "", category: "", isbn: "", bookId: "" });
  const [errors, setErrors] = useState({}); // check validation errors
  // const [transactions, setTransactions] = useState([]);

// Validate inputs
  const validateFields = () => {
    const newErrors = {};

    // Title validation
    if (!newBook.bookTitle.trim()) {
      newErrors.bookTitle = "Title is required.";
    } else if (newBook.bookTitle.trim().length < 2) {
      newErrors.bookTitle = "Title must be at least 2 characters long.";
    } else if (newBook.bookTitle.trim().length > 100) {
      newErrors.bookTitle = "Title must not exceed 100 characters.";
    }

    // Author validation
    if (!newBook.bookAuthor.trim()) {
      newErrors.bookAuthor = "Author is required.";
    } else if (newBook.bookAuthor.trim().length < 2) {
      newErrors.bookAuthor = "Author name must be at least 2 characters long.";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(newBook.bookAuthor.trim())) {
      newErrors.bookAuthor = "Author name can only contain letters, spaces, and basic punctuation.";
    }

    // Category validation
    if (!newBook.category.trim()) {
      newErrors.category = "Category is required.";
    } else if (newBook.category.trim().length < 2) {
      newErrors.category = "Category must be at least 2 characters long.";
    }

    // ISBN validation
    if (!newBook.isbn.trim()) {
      newErrors.isbn = "ISBN is required.";
    } else if (!/^[0-9\-]+$/.test(newBook.isbn)) {
      newErrors.isbn = "ISBN must contain only numbers or dashes.";
    } else if (newBook.isbn.replace(/-/g, '').length !== 6) {
      newErrors.isbn = "ISBN must be 6 digits long (excluding dashes).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // returns true if valid
  };


  // Fetch all books
  const fetchBooks = async () => {
    try {
      const data = await libraryService.getAllBooks();
      console.log("data===", data)
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Failed to fetch books:", error);
    }
  };

  // Fetch all books
  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // add book
  const addBook = async () => {
    // Reset any previous API errors
    setApiError(null);

    // First check validation using validateFields
    if (!validateFields()) {
      return; // stop if validation fails
    }

    setIsSubmitting(true);
    try {
      await libraryService.createBook(newBook);
      
      // Clear form and errors on success
      setNewBook({ bookTitle: "", bookAuthor: "", category: "", isbn: "" });
      setErrors({});
      await fetchBooks();
      
      // Show success message (you can add a toast/snackbar here)
      alert("Book added successfully!");
    } catch (error) {
      // Handle specific API errors
      const errorMessage = error.response?.data?.message || "Failed to add book. Please try again.";
      setApiError(errorMessage);
      console.error("Failed to add book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBook = async (id) => {
    try {
      console.log("id="+id)
      await libraryService.deleteBook(id);
      await fetchBooks(); 
    } catch (error) {
      console.log("Failed to delete book:", error);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" gutterBottom color="primary">
         Library Admin Dashboard
      </Typography>

      {/* ADD BOOK */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Book
        </Typography>

        {apiError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {apiError}
          </Typography>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
            placeholder="xxxxxx"
            fullWidth
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
          <TextField
            label="Category"
            name="category"
            value={newBook.category}
            onChange={handleInputChange}
            error={!!errors.category}
            helperText={errors.category}
            disabled={isSubmitting}
            fullWidth
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={addBook} 
            disabled={isSubmitting}
            sx={{ height: "56px" }}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
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
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Author</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Isbn</strong></TableCell>
                <TableCell><strong>Available</strong></TableCell>
                
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No books added yet.</TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow key={book.bookId}>
                    <TableCell>{book.bookTitle}</TableCell>
                    <TableCell>{book.bookAuthor}</TableCell>
                    <TableCell>{book.category}</TableCell>
                     <TableCell>{book.isbn}</TableCell>
                     <TableCell>{book.availableCopies}</TableCell>
                    
                    <TableCell>
                      <IconButton color="error" onClick={() => deleteBook(book.bookId)}>
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

