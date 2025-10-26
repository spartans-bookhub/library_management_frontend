import React,{useState, useEffect} from "react";
import AdminNavbar from "./AdminNavbar";
import BookTable from "./BookTable";
import ViewCard from "./ViewCard";
import { useNavigate } from "react-router-dom";

export default function AdminHome({ Toggle }) {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const navigate = useNavigate();
  // const { user } = useAuth();
  // const { addToCart, isInCart, getItemQuantity } = useCart();
  // const { showSuccess, showInfo } = useToast();

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
  }
  

  return (
    <div className="px-3">
      <AdminNavbar Toggle={Toggle} />

      <ViewCard />
   
      <div className="container-fluid">
        <div className="row">
            <BookTable />
        </div>
      </div>
    </div>
  );
}
