import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import styles from "./ManageBooks.module.css";

import baseURL from "../../config";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    price: "",
    availability: "Free",
    published_date: "",
    file: null,
    image: null,
    audiobook_file: null,
  });

  const fetchBooks = () => {
    api.get(`/api/books`).then((res) => setBooks(res.data));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double-click
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("description", formData.description);
    data.append("genre", formData.genre);
    data.append("price", formData.price);
    data.append("availability", formData.availability);
    data.append("published_date", formData.published_date);
    if (formData.file) data.append("file", formData.file);
    if (formData.image) data.append("image", formData.image);
    if (formData.audio_sample)
      data.append("audio_sample", formData.audio_sample);
    if (editBook) data.append("_method", "PUT");

    try {
      const response = await api.post(
        editBook ? `/api/books/${editBook.id}` : `/api/books`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const newBook = response.data.book || response.data;

      if (formData.audiobook_file) {
        const audioData = new FormData();
        audioData.append("file", formData.audiobook_file);

        const hasAudiobook = editBook?.audiobook?.id;
        if (hasAudiobook) {
          audioData.append("_method", "PUT");
          await api.post(
            `/api/audiobooks/${editBook.audiobook.id}`,
            audioData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } else {
          audioData.append("book_id", newBook.id);
          await api.post(`/api/audiobooks`, audioData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      setBooks((prev) =>
        editBook
          ? prev.map((b) => (b.id === newBook.id ? newBook : b))
          : [...prev, newBook]
      );

      setShowForm(false);
      setEditBook(null);
      setFormData({
        title: "",
        author: "",
        description: "",
        genre: "",
        price: "",
        availability: "Free",
        published_date: "",
        file: null,
        image: null,
        audiobook_file: null,
      });
      setImagePreview(null);
      fetchBooks();
    } catch (error) {
      console.error("Submission error", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await api.delete(`/api/books/${id}`);
        setBooks((prev) => prev.filter((b) => b.id !== id));
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const openEdit = (book) => {
    console.log("✏️ Editing Book", book);

    setEditBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || "",
      genre: book.genre,
      price: book.price,
      availability: book.availability,
      published_date: book.published_date,
      file: null,
      image: null, // 👈 Clear out the string path
      audiobook_file: null,
    });
    setImagePreview(`${baseURL}/storage/${book.image}`);
    setShowForm(true);
    fetchBooks();
  };
  return (
    <div className={styles.container}>
      <h2>Manage Books</h2>
      <button onClick={() => setShowForm(true)} className={styles.addButton}>
        + Add Book
      </button>
      <table className={styles.bookTable}>
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                {book.image && (
                  <img
                    src={`${baseURL}/storage/${book.image}`}
                    alt={book.title}
                    style={{
                      width: "60px",
                      height: "auto",
                      borderRadius: "4px",
                    }}
                  />
                )}
              </td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>${book.price}</td>
              <td>{book.availability}</td>
              <td>{book.published_date}</td>
              <td>
                <button
                  onClick={() => openEdit(book)}
                  className={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className={styles.modal}>
          <form onSubmit={handleSubmit} className={styles.bookForm}>
            <h3>{editBook ? "Edit Book" : "Add Book"}</h3>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              required
            />
            <input
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Author"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              rows="4"
              style={{ resize: "vertical" }}
            ></textarea>
            <input
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              placeholder="Genre"
              required
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              required
            />
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
            >
              <option value="Free">Free</option>
              <option value="Purchase">Purchase</option>
              <option value="Rent">Rent</option>
            </select>
            <input
              name="published_date"
              type="date"
              value={formData.published_date}
              onChange={handleInputChange}
              required
            />
            <div className={styles.formSection}>
              <label htmlFor="file">Book File (PDF/EPUB):</label>
              <input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.epub"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, file: e.target.files[0] }))
                }
                required={!editBook}
              />

              <label htmlFor="audiobook">Full Audiobook:</label>
              <input
                id="audiobook"
                name="audiobook"
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    audiobook_file: e.target.files[0],
                  }))
                }
              />

              <label htmlFor="audio_sample">Audio Sample:</label>
              <input
                id="audio_sample"
                name="audio_sample"
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    audio_sample: e.target.files[0],
                  }))
                }
              />

              <label htmlFor="image">Cover Image (JPG/PNG):</label>
              <input
                id="image"
                name="image"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData((prev) => ({ ...prev, image: file }));
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.imagePreview}
                />
              )}
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setImagePreview(null);
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
