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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { libraryService } from "../../services/libraryService";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { showSuccess, showInfo } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset to page 1 on filter/search change
  }, [books, searchTerm, categoryFilter, availabilityFilter, sortBy]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getAllBooks();
      const booksArray = Array.isArray(data) ? data : [];
      setBooks(booksArray);
      setFilteredBooks(booksArray);
    } catch (error) {
      setError(error.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...books];

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.bookAuthor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((book) => book.category === categoryFilter);
    }

    if (availabilityFilter === "available") {
      filtered = filtered.filter((book) => book.availableCopies > 0);
    } else if (availabilityFilter === "out_of_stock") {
      filtered = filtered.filter((book) => book.availableCopies === 0);
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "title_asc":
            return a.bookTitle.localeCompare(b.bookTitle);
          case "title_desc":
            return b.bookTitle.localeCompare(a.bookTitle);
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "rating_asc":
            return a.rating - b.rating;
          case "rating_desc":
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
    }

    setFilteredBooks(filtered);
  };

  const handleAddToCart = async (book) => {
    try {
      if (isInCart(book.bookId)) {
        showInfo("Book is already in your cart");
        return;
      }

      await addToCart(book);
      showSuccess(`"${book.bookTitle}" added to cart!`);
    } catch (error) {
      setError(error.message || "Failed to add book to cart");
    }
  };

  const getAvailabilityColor = (availableCopies) => {
    if (availableCopies === 0) return "error";
    if (availableCopies <= 2) return "warning";
    return "success";
  };

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

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
        {/* Header */}
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

        {/* Search and Filter Controls */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          gap={2}
          flexWrap="wrap"
        >
          {/* Search */}
          <Box flex={1} minWidth="300px">
            <TextField
              fullWidth
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: "400px" }}
            />
          </Box>

          {/* Filters */}
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {[...new Set(books.map((b) => b.category))]
                  .filter(Boolean)
                  .map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Availability</InputLabel>
              <Select
                value={availabilityFilter}
                label="Availability"
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <MenuItem value="">All Books</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="out_of_stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="title_asc">Title A-Z</MenuItem>
                <MenuItem value="title_desc">Title Z-A</MenuItem>
                <MenuItem value="price_asc">Price Low-High</MenuItem>
                <MenuItem value="price_desc">Price High-Low</MenuItem>
                <MenuItem value="rating_asc">Rating Low-High</MenuItem>
                <MenuItem value="rating_desc">Rating High-Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
          {Array.isArray(currentBooks) &&
            currentBooks.map((book) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={book.bookId}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minHeight: 480,
                    width: "100%",
                    maxWidth: "250px",
                    minWidth: "250px",
                    borderRadius: 2,
                    overflow: "hidden", // keeps consistent box model
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {/* IMAGE CONTAINER: fixed size, contain + center */}
                  <Box
                    sx={{
                      height: 200, // <- same height for all
                      width: "100%",
                      bgcolor: book.imageUrl ? "transparent" : "grey.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                      // Optional: keep a consistent visual frame
                      borderBottom: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {book.imageUrl ? (
                      <CardMedia
                        component="img"
                        image={book.imageUrl}
                        alt={book.bookTitle}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain", // <- contain
                          objectPosition: "center", // <- center
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        No Image
                      </Typography>
                    )}

                    {book.category && (
                      <Chip
                        label={book.category}
                        size="small"
                        color="primary"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          fontSize: "0.75rem",
                          maxWidth: "70%",
                          // prevent chip text from stretching layout
                          ".MuiChip-label": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        }}
                      />
                    )}
                  </Box>

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      p: 2,
                      overflow: "hidden",
                      "&:last-child": { pb: 2 },
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        mb: 0.75,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: "calc(1.3em * 2)",
                        maxHeight: "calc(1.3em * 2)",
                        minWidth: 0,
                      }}
                      title={book.bookTitle}
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
                        minWidth: 0,
                      }}
                      title={book.bookAuthor}
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
                      sx={{ minWidth: 0 }}
                    >
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight={600}
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        ₹{book.price}
                      </Typography>
                      <Chip
                        label={`${book.availableCopies}/${book.totalCopies}`}
                        size="small"
                        color={getAvailabilityColor(book.availableCopies)}
                        variant="outlined"
                        sx={{ ml: 1, flexShrink: 0 }}
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
                          whiteSpace: "nowrap",
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

        {/* Pagination */}
        {filteredBooks.length > booksPerPage && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BookList;
