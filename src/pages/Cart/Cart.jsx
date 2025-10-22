import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Grid,
  Paper,
  Alert,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { libraryService } from "../../services/libraryService";

const Cart = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { cartItems, removeFromCart, clearCart, getCartItemCount } = useCart();

  const { showSuccess, showError } = useToast();

  const handleRemoveItem = (bookId) => {
    removeFromCart(bookId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleBorrowBooks = async () => {
    try {
      setLoading(true);

      const bookIds = cartItems.map((item) => item.bookId);
      await libraryService.borrowBooks(bookIds);

      const bookCount = cartItems.length;
      const message = `Successfully borrowed ${bookCount} book${
        bookCount > 1 ? "s" : ""
      }!`;
      showSuccess(message);

      clearCart();

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      showError(error.message || "Failed to borrow books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            No Books Selected
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add books to your borrowing list to proceed.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/books")}
          >
            Browse Books
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Books to Borrow ({getCartItemCount()} book
            {getCartItemCount() !== 1 ? "s" : ""})
          </Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate("/books")}
              sx={{ mr: 2 }}
            >
              Add More Books
            </Button>
            <Button variant="outlined" color="error" onClick={handleClearCart}>
              Clear List
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Book Items */}
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item.bookId} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Book Image */}
                    <Grid item xs={3} sm={2}>
                      <Box
                        sx={{
                          height: 80,
                          backgroundColor: item.imageUrl
                            ? "transparent"
                            : "grey.100",
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.bookTitle}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.disabled">
                            No Image
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    {/* Book Details */}
                    <Grid item xs={7} sm={8}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {item.bookTitle}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        by {item.bookAuthor}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        Category: {item.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ISBN: {item.isbn}
                      </Typography>
                    </Grid>

                    {/* Remove Button */}
                    <Grid item xs={2} sm={2}>
                      <Box textAlign="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.bookId)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Borrow Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: "sticky", top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Borrowing Summary
                </Typography>

                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Books selected:</Typography>
                  <Typography fontWeight={600}>{getCartItemCount()}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography>Borrowing period:</Typography>
                  <Typography fontWeight={600}>14 days</Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleBorrowBooks}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? "Processing..." : "Borrow Books"}
                </Button>

                <Alert severity="info" sx={{ mt: 2 }}>
                  Books must be returned within 14 days. Late fees may apply.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Cart;
