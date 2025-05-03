import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import styles from "./AssignTags.module.css";

const AssignTags = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [bookTags, setBookTags] = useState([]);

  const baseUrl = "http://127.0.0.1:8000";

  useEffect(() => {
    api.get(`/api/books`).then((res) => setBooks(res.data));
    api.get(`/api/tags`).then((res) => setAllTags(res.data));
  }, []);

  const selectBook = async (book) => {
    setSelectedBook(book);
    const res = await api.get(`/api/books/${book.id}`);
    setBookTags(res.data.tags.map((tag) => tag.id)); // Get tag IDs instead of names
    console.log(res.data.tags);
  };
  const saveTags = async () => {
    if (!selectedBook) return;
    const bookId = selectedBook.id;

    try {
      console.log("Tags to update ", bookTags);
      await api.post(`/api/books/${bookId}/tags`, {
        tag_ids: bookTags,
      });
      alert("Tags updated successfully");
    } catch (err) {
      console.error("Failed to update tags", err);
    }
  };

  const toggleTag = (tagId) => {
    setBookTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2>Assign/Remove Tags from Books</h2>

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
        <div className={styles.tagSection}>
          <h3>Tags for: {selectedBook.title}</h3>
          <div className={styles.tagGrid}>
            {allTags.map((tag) => {
              const assigned = bookTags.includes(tag.id); // compare IDs
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`${styles.tagBtn} ${assigned ? styles.assigned : ""}`}
                >
                  {tag.tag_name}
                </button>
              );
            })}
          </div>

          <button onClick={saveTags} className={styles.saveButton}>
            Save Tags
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignTags;
