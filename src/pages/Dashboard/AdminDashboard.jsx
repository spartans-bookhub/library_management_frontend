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

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ bookTitle: "", bookAuthor: "", category: "", isbn: "", bookId: "" });
  // const [transactions, setTransactions] = useState([]);


  // Fetch all books
  const fetchBooks = async () => {
    try {
      const data = await libraryService.getAllBooks();
      console.log("data==="+JSON.stringify(data))
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Failed to fetch books:", error);
    }
  };

    // Fetch all transactions
  // const fetchTransactions = async () => {
  //   try {
  //     const data = await libraryService.getHighFine();
  //     console.log("data==="+JSON.stringify(data))
  //     setTransactions(Array.isArray(data) ? data : []);
  //   } catch (error) {
  //     console.log("Failed to fetch books:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchTransactions();
  // }, []);

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

  const addBook = async () => {
    if (!newBook.bookTitle || !newBook.bookAuthor || !newBook.isbn) {
      alert("Please enter title, author, and ISBN!");
      return;
    }

    try {
      await libraryService.createBook(newBook);
      setNewBook({ bookTitle: "", bookAuthor: "", category: "", isbn: "" });
      await fetchBooks(); 
    } catch (error) {
      console.log("Failed to add book:", error);
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
         📚 Library Admin Dashboard
      </Typography>

      {/* ADD BOOK */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Book
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Title"
            name="bookTitle"
            value={newBook.bookTitle}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="ISBN"
            name="isbn"
            value={newBook.isbn}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Author"
            name="bookAuthor"
            value={newBook.bookAuthor}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Genre"
            name="category"
            value={newBook.category}
            onChange={handleInputChange}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={addBook} sx={{ height: "56px" }}>
            Add
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
                <TableCell><strong>Genre</strong></TableCell>
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
                    <TableCell>{book.bookTitle}{book.bookId}</TableCell>
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

      {/* TRANSACTION TABLE */}
      {/* <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Transaction Data
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Book</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((t) => ( 
                <TableRow key={t.id}>
                  <TableCell>{t.userName}</TableCell>
                  <TableCell>{t.contactNumber}</TableCell>
                  <TableCell>{t.totalFine}</TableCell>
                  <TableCell
                    sx={{
                      color: t.type === "Issued" ? "error.main" : "success.main",
                      fontWeight: "bold",
                    }}
                  >
                    {t.type}
                  </TableCell>
                  <TableCell>{t.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper> */}
    </Box>
  );
};

export default AdminDashboard;


