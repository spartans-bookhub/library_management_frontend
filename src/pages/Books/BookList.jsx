import React, { useState, useEffect } from "react";
import {
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
  ThemeProvider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Fab,
  Slide,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Warning as WarningIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { libraryService } from "../../services/libraryService";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { typographyTheme } from "../../styles/typography";
import Sidebar from "../../components/common/sidebar";
import {
  prepareChatContext,
  callOpenAI,
  getWelcomeMessage,
  formatChatMessage,
  getQuickSuggestions,
} from "../../utils/chatbotUtils";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overdueModal, setOverdueModal] = useState({
    open: false,
    overdueBooks: [],
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const [quickSuggestions, setQuickSuggestions] = useState([]);
  const booksPerPage = 12;

  const {} = useAuth();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { showSuccess, showInfo } = useToast();

  useEffect(() => {
    fetchBooks();
    checkOverdueBooks();
    initializeChatContext();
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

  const checkOverdueBooks = async () => {
    try {
      const borrowedBooks = await libraryService.getBorrowedBooks();
      const overdueBooks = borrowedBooks.filter(
        (book) => book.fineAmount > 0 && book.transactionStatus === "DUE"
      );

      if (overdueBooks.length > 0) {
        setOverdueModal({
          open: true,
          overdueBooks,
        });
      }
    } catch (error) {
      console.error("Failed to check overdue books:", error);
    }
  };

  const handleCloseOverdueModal = () => {
    setOverdueModal({
      open: false,
      overdueBooks: [],
    });
  };

  const initializeChatContext = async () => {
    const context = await prepareChatContext();
    setChatContext(context);
    setQuickSuggestions(getQuickSuggestions(context));
    return context;
  };

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatLoading(true);

    // Add user message
    const userMsg = formatChatMessage(userMessage, "user");
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const response = await callOpenAI(userMessage, chatMessages, chatContext);
      const aiMsg = formatChatMessage(response, "ai");
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = formatChatMessage(
        "Sorry, I encountered an error. Please try again.",
        "ai"
      );
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
    if (!chatOpen && chatMessages.length === 0) {
      const welcomeMsg = getWelcomeMessage(chatContext);
      setChatMessages([welcomeMsg]);
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 280;

  if (loading) {
    return (
      <ThemeProvider theme={typographyTheme}>
        <Box sx={{ display: "flex", borderRadius: 0 }}>
          <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { md: `calc(100% - ${drawerWidth}px)` },
              ml: { md: `${drawerWidth}px` },
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="50vh"
            >
              <CircularProgress />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={typographyTheme}>
      <Box sx={{ display: "flex", borderRadius: 0 }}>
        <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
        >
          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                p: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 1,
                  }}
                >
                  Library Books
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Discover and borrow from our extensive collection
                </Typography>
              </Box>
            </Box>

            {/* Search and Filter Controls */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
              gap={3}
              flexWrap="wrap"
              sx={{
                p: 3,
                backgroundColor: "background.default",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {/* Search */}
              <Box flex={1} minWidth="300px">
                <TextField
                  fullWidth
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    maxWidth: "400px",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.paper",
                      borderRadius: 2,
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                    },
                  }}
                />
              </Box>

              {/* Filters */}
              <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 140,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.paper",
                      borderRadius: 2,
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                    },
                  }}
                >
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

                <FormControl
                  size="small"
                  sx={{
                    minWidth: 140,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.paper",
                      borderRadius: 2,
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                    },
                  }}
                >
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

                <FormControl
                  size="small"
                  sx={{
                    minWidth: 140,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.paper",
                      borderRadius: 2,
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                    },
                  }}
                >
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="">Default</MenuItem>
                    <MenuItem value="title_asc">Title A-Z</MenuItem>
                    <MenuItem value="title_desc">Title Z-A</MenuItem>
                    <MenuItem value="rating_asc">Rating Low-High</MenuItem>
                    <MenuItem value="rating_desc">Rating High-Low</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Error */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
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
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 12px 32px rgba(79, 70, 229, 0.15)",
                          borderColor: "primary.light",
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
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          mb={1.5}
                        >
                          <Rating value={book.rating} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary">
                            ({book.rating})
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          alignItems="center"
                          mb={2}
                          sx={{ minWidth: 0 }}
                        >
                          <Chip
                            label={`${book.availableCopies}/${book.totalCopies} Available`}
                            size="small"
                            color={getAvailabilityColor(book.availableCopies)}
                            variant="outlined"
                            sx={{ flexShrink: 0 }}
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
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                              py: 1.2,
                              fontSize: "0.875rem",
                              whiteSpace: "nowrap",
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                transform: "translateY(-1px)",
                                boxShadow: 3,
                              },
                            }}
                          >
                            {book.availableCopies === 0
                              ? "Out of Stock"
                              : isInCart(book.bookId)
                              ? `In Cart`
                              : "Add to Cart"}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            {/* If no books found */}
            {!loading && filteredBooks.length === 0 && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="30vh"
              >
                <Typography variant="h6" color="text.secondary">
                  This book is not available.
                </Typography>
              </Box>
            )}

            {/* Pagination */}
            {filteredBooks.length > booksPerPage && (
              <Box
                display="flex"
                justifyContent="center"
                mt={5}
                sx={{
                  p: 3,
                  backgroundColor: "background.default",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, value) => setCurrentPage(value)}
                  color="primary"
                  showFirstButton
                  showLastButton
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontWeight: 500,
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      <Fab
        color="primary"
        onClick={handleChatToggle}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          boxShadow: 3,
          "&:hover": {
            boxShadow: 6,
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        {chatOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      <Slide direction="up" in={chatOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: { xs: 320, sm: 400 },
            height: 500,
            zIndex: 999,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ChatIcon />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                BookNest AI
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleChatToggle}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: "auto",
              backgroundColor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {chatMessages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: "80%",
                    backgroundColor:
                      message.sender === "user" ? "primary.main" : "white",
                    color: message.sender === "user" ? "white" : "text.primary",
                    borderRadius:
                      message.sender === "user"
                        ? "15px 15px 5px 15px"
                        : "15px 15px 15px 5px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-wrap",
                      fontSize: "0.875rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {message.text}
                  </Typography>
                </Paper>
              </Box>
            ))}

            {chatLoading && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    backgroundColor: "white",
                    borderRadius: "15px 15px 15px 5px",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <CircularProgress size={8} />
                    <CircularProgress
                      size={8}
                      sx={{ animationDelay: "0.2s" }}
                    />
                    <CircularProgress
                      size={8}
                      sx={{ animationDelay: "0.4s" }}
                    />
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "white",
            }}
          >
            {/* Quick Suggestions */}
            {chatMessages.length <= 1 && quickSuggestions.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                    mb: 1,
                    display: "block",
                  }}
                >
                  Quick suggestions:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.75rem",
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.5,
                        borderColor: "grey.300",
                        color: "text.secondary",
                        "&:hover": {
                          backgroundColor: "primary.light",
                          borderColor: "primary.main",
                          color: "primary.main",
                        },
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask me anything about books..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={chatLoading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || chatLoading}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "&:disabled": {
                    backgroundColor: "grey.300",
                    color: "grey.500",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Slide>

      <Dialog
        open={overdueModal.open}
        onClose={handleCloseOverdueModal}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            pb: 2,
            backgroundColor: "#fff3cd",
            color: "#856404",
          }}
        >
          <WarningIcon sx={{ fontSize: 28, color: "error.main" }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Overdue Books Alert
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You have {overdueModal.overdueBooks.length} overdue book
              {overdueModal.overdueBooks.length > 1 ? "s" : ""} with pending
              fines
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          <List>
            {overdueModal.overdueBooks.map((book, index) => (
              <React.Fragment key={book.transactionId}>
                <ListItem
                  sx={{
                    backgroundColor: "#fef2f2",
                    borderRadius: 1.5,
                    mb: 1,
                    border: "1px solid #fecaca",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        {book.bookTitle}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Due Date: <strong>{book.dueDate}</strong>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Status:{" "}
                          <strong style={{ color: "#d32f2f" }}>
                            {book.transactionStatus}
                          </strong>
                        </Typography>
                        <Typography
                          variant="body1"
                          color="error.main"
                          sx={{ fontWeight: 600 }}
                        >
                          Fine Amount: ₹{book.fineAmount}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < overdueModal.overdueBooks.length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </React.Fragment>
            ))}
          </List>

          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "#f8fafc",
              borderRadius: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Total Fine Amount:
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "error.main",
              }}
            >
              ₹
              {overdueModal.overdueBooks.reduce(
                (total, book) => total + book.fineAmount,
                0
              )}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseOverdueModal}
            variant="outlined"
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 1.5,
            }}
          >
            I'll Handle Later
          </Button>
          <Button
            onClick={() => {
              handleCloseOverdueModal();
              window.location.href = "/student-dashboard";
            }}
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 1.5,
            }}
          >
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default BookList;
