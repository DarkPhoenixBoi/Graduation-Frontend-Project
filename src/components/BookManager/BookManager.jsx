import { useState } from "react";
import BookTable from "./BookTable";
import BookForm from "./BookForm";
import styles from "./BookManager.module.css";

const sampleBooks = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Adventure",
    price: 14.99,
    availability: "Available",
    publishedDate: "2003-04-15",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    price: 29.99,
    availability: "Available",
    publishedDate: "2008-08-01",
  },
];

export default function BookManager() {
  const [books, setBooks] = useState(sampleBooks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const handleAddClick = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const handleSave = (book) => {
    if (book.id) {
      setBooks((prev) =>
        prev.map((b) => (b.id === book.id ? { ...b, ...book } : b))
      );
    } else {
      setBooks((prev) => [...prev, { ...book, id: Date.now() }]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Manage Books</h2>
        <button className={styles.addButton} onClick={handleAddClick}>
          + Add New Book
        </button>
      </div>
      <BookTable books={books} onEdit={handleEdit} onDelete={handleDelete} />
      {isFormOpen && (
        <BookForm
          book={editingBook}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
