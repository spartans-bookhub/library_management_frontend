import React, { useState ,useEffect} from "react";
import axios from 'axios';


export default function BookSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
 



  const handleSearch = () => {
    const results = books.filter(book =>
      book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.bookAuthor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(results);
  };



useEffect(() => {
    
    axios.get('http://localhost:9009/api/books/list') 
    //   .then((res) => setBooks(res.data))
      .then((res) => console.log(setBooks(res.data),"setbooksdata"))
      .catch((err) => console.log('Error fetching books:', err));
  }, []);




  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2> Search</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Enter book title or author..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor:"#cecece"
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <li
              key={book.bookId}
              style={{
                background: "#f9f9f9",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
              }}
            >
              <strong>{book.bookTitle}</strong>
              <br />
              <small>by {book.bookAuthor}</small>
            </li>
          ))
        ) : (
          <p>No books found. Try searching!</p>
        )}
      </ul>
    </div>
  );
}




