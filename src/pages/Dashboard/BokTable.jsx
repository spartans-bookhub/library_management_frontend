import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const BokTable = ({ books, onEdit, onDelete }) => (
  <Paper sx={{ p: 2 }}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
            <TableCell><strong>Image</strong></TableCell>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Author</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell><strong>ISBN</strong></TableCell>
            <TableCell><strong>Total Copies</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.length === 0 ? (
            <TableRow>
              <TableCell align="center" colSpan={7}>No books available</TableCell>
            </TableRow>
          ) : (
            books.map((book) => (
              <TableRow key={book.id || book.bookId}>
                <TableCell>
                  <Avatar
                    src={book.image_url || book.imageUrl}
                    variant="rounded"
                    sx={{ width: 48, height: 48 }}
                  />
                </TableCell>
                <TableCell>{book.bookTitle}</TableCell>
                <TableCell>{book.bookAuthor}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.totalCopies || book.total_copies}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => onEdit(book)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(book.id || book.bookId)}>
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
);

export default BokTable;
