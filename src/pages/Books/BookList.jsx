import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Rating,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { libraryService } from "../../services/libraryService";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { showSuccess, showInfo } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getAllBooks();
      console.log("API Response:", data); // Debug log

      // Ensure data is an array
      const booksArray = Array.isArray(data) ? data : [];
      setBooks(booksArray);
    } catch (error) {
      console.error("API Error:", error); // Debug log
      setError(error.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (book) => {
    try {
      if (isInCart(book.bookId)) {
        showInfo("Book is already in your cart");
        return;
      }

      addToCart(book);
      showSuccess(`"${book.bookTitle}" added to cart!`);
    } catch (error) {
      setError(error.message || "Failed to add book to cart");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getAvailabilityColor = (availableCopies) => {
    if (availableCopies === 0) return "error";
    if (availableCopies <= 2) return "warning";
    return "success";
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Library Books
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {Array.isArray(books) &&
            books.map((book) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={book.bookId}
                sx={{ display: "flex" }}
              >
                <Card
                  sx={{
                    height: 420,
                    minHeight: 420,
                    maxHeight: 420,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 160,
                      minHeight: 160,
                      maxHeight: 160,
                      backgroundColor: book.imageUrl
                        ? "transparent"
                        : "grey.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {book.imageUrl ? (
                      <CardMedia
                        component="img"
                        height="160"
                        image={book.imageUrl}
                        alt={book.bookTitle}
                        sx={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        No Image
                      </Typography>
                    )}
                    <Chip
                      label={book.category}
                      size="small"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      p: 2,
                      height: 260, // Remaining height after image (420 - 160 = 260)
                      overflow: "hidden",
                      "&:last-child": { pb: 2 },
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.3,
                        height: "2.6rem", // Fixed height for exactly 2 lines
                        wordBreak: "break-word",
                      }}
                    >
                      {book.bookTitle}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      by {book.bookAuthor}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={0.5} mb={1.5}>
                      <Rating value={book.rating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">
                        ({book.rating})
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="h6" color="primary" fontWeight={600}>
                        ₹{book.price}
                      </Typography>
                      <Chip
                        label={`${book.availableCopies}/${book.totalCopies}`}
                        size="small"
                        color={getAvailabilityColor(book.availableCopies)}
                        variant="outlined"
                      />
                    </Box>

                    <Box mt="auto">
                      <Button
                        variant={
                          book.availableCopies === 0
                            ? "outlined"
                            : isInCart(book.bookId)
                            ? "outlined"
                            : "contained"
                        }
                        fullWidth
                        disabled={book.availableCopies === 0}
                        onClick={() => handleAddToCart(book)}
                        sx={{
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        {book.availableCopies === 0
                          ? "Out of Stock"
                          : isInCart(book.bookId)
                          ? `In Cart (${getItemQuantity(book.bookId)})`
                          : "Add to Cart"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {(!Array.isArray(books) || books.length === 0) && !loading && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              No books available in the library
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BookList;
