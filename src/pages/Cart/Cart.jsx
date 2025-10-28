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
  Toolbar,
  ThemeProvider,
} from "@mui/material";
import { Delete, Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { libraryService } from "../../services/libraryService";
import Sidebar from "../../components/common/sidebar";
import { typographyTheme } from "../../styles/typography";

const Cart = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { cartItems, removeFromCart, clearCart, getCartItemCount } = useCart();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { showSuccess, showError } = useToast();

  const handleRemoveItem = async (bookId) => {
    try {
      await removeFromCart(bookId);
      showSuccess("Book removed from cart");
    } catch (error) {
      showError(error.message || "Failed to remove book from cart");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      showSuccess("Cart cleared successfully");
    } catch (error) {
      showError(error.message || "Failed to clear cart");
    }
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

      await clearCart();

      // Redirect to dashboard after 2 seconds

      navigate("/student-dashboard");
    } catch (error) {
      showError(error.message || "Failed to borrow books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <ThemeProvider theme={typographyTheme}>
        <Box sx={{ display: "flex" }}>
          <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { sm: `calc(100% - 280px)` },
              ml: { md: `280px` },
              minHeight: "100vh",
              backgroundColor: "#f8fafc",
            }}
          >
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                backgroundColor: "white",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                  }}
                >
                  My Cart
                </Typography>
              </Toolbar>
            </Box>

            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  No Books Selected
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: 3,
                    fontWeight: 500,
                  }}
                >
                  Add books to your borrowing list to proceed.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/books")}
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 1.5,
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Browse Books
                </Button>
              </Paper>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={typographyTheme}>
      <Box sx={{ display: "flex" }}>
        <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - 280px)` },
            ml: { md: `280px` },
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
          }}
        >
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              backgroundColor: "white",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                }}
              >
                My Cart
              </Typography>
            </Toolbar>
          </Box>

          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 2,
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                  }}
                >
                  Books to Borrow ({getCartItemCount()} book
                  {getCartItemCount() !== 1 ? "s" : ""})
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/books")}
                    sx={{
                      mr: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 1.5,
                    }}
                  >
                    Add More Books
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClearCart}
                    sx={{
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 1.5,
                    }}
                  >
                    Clear List
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {/* Book Items */}
                <Grid item xs={12} md={8}>
                  {cartItems.map((item) => (
                    <Card
                      key={item.bookId}
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: 2,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          boxShadow: 4,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                          {/* Book Image */}
                          <Grid item xs={3} sm={2}>
                            <Box
                              sx={{
                                height: 80,
                                backgroundColor: item.imageUrl
                                  ? "transparent"
                                  : "grey.100",
                                borderRadius: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                boxShadow: 1,
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
                                <Typography
                                  variant="caption"
                                  color="text.disabled"
                                  sx={{ fontWeight: 500 }}
                                >
                                  No Image
                                </Typography>
                              )}
                            </Box>
                          </Grid>

                          <Grid item xs={7} sm={8}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                mb: 0.5,
                                color: "text.primary",
                              }}
                            >
                              {item.bookTitle}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 0.5,
                                fontWeight: 500,
                              }}
                            >
                              by {item.bookAuthor}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 0.5,
                                fontWeight: 500,
                              }}
                            >
                              Category: {item.category}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 500 }}
                            >
                              ISBN: {item.isbn}
                            </Typography>
                          </Grid>

                          <Grid
                            item
                            xs={2}
                            sm={2}
                            style={{ marginLeft: "auto" }}
                          >
                            <Box textAlign="center">
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveItem(item.bookId)}
                                sx={{
                                  borderRadius: 1.5,
                                  transition: "all 0.2s ease-in-out",
                                  "&:hover": {
                                    backgroundColor: "error.light",
                                    color: "white",
                                    transform: "scale(1.1)",
                                  },
                                }}
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

                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      position: "sticky",
                      top: 20,
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          mb: 3,
                        }}
                      >
                        Borrowing Summary
                      </Typography>

                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography sx={{ fontWeight: 500 }}>
                          Books selected:
                        </Typography>
                        <Typography fontWeight={700} color="primary.main">
                          {getCartItemCount()}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="space-between" mb={3}>
                        <Typography sx={{ fontWeight: 500 }}>
                          Borrowing period:
                        </Typography>
                        <Typography fontWeight={700} color="primary.main">
                          14 days
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleBorrowBooks}
                        disabled={loading}
                        sx={{
                          mb: 2,
                          py: 1.5,
                          fontWeight: 700,
                          textTransform: "none",
                          borderRadius: 1.5,
                          fontSize: "1rem",
                          boxShadow: 2,
                          "&:hover": {
                            boxShadow: 3,
                          },
                        }}
                      >
                        {loading ? "Processing..." : "Borrow Books"}
                      </Button>

                      <Alert
                        severity="info"
                        sx={{
                          mt: 2,
                          borderRadius: 1.5,
                          fontWeight: 500,
                        }}
                      >
                        Books must be returned within 14 days. Late fees may
                        apply.
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Cart;
