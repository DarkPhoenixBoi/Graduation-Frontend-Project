import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import styles from "./ManageReviews.module.css";

import baseURL from "../../config";

const ManageReviews = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`/api/books`).then((res) => setBooks(res.data));
  }, []);

  const selectBook = async (book) => {
    setSelectedBook(book);
    const res = await api.get(`/api/reviews/book/${book.id}`);
    setReviews(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this review?")) {
      try {
        await api.delete(`/api/reviews/${id}`);
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        console.error("Error deleting review", err);
      }
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2>Manage Reviews</h2>

      <input
        type="text"
        placeholder="Search books by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.bookList}>
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className={`${styles.bookItem} ${
              selectedBook?.id === book.id ? styles.selected : ""
            }`}
            onClick={() => selectBook(book)}
          >
            <strong>{book.title}</strong>
            <span>{book.author}</span>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div className={styles.reviewSection}>
          <h3>Reviews for: {selectedBook.title}</h3>
          <table className={styles.reviewTable}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.user_id}</td>
                  <td>{review.rating}</td>
                  <td>{review.comment}</td>
                  <td>
                    {/* You can implement edit later */}
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(review.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan="4">No reviews found for this book.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
