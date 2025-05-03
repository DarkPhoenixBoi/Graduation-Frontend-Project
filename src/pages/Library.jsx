import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import BookReader from "../components/BookReader"; // Assuming you have a BookReader component
import styles from "./Library.module.css";
import reviewIcon from "../assets/review-icon2.svg";
import dummyFile from "../assets/The Adventures of Sherlock Holmes.pdf";

function Library() {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = useContext(AuthContext); // Use context

  const baseUrl = "http://localhost:8000";
  const userId = user?.id;

  useEffect(() => {
    async function fetchLibrary() {
      try {
        const response = await api.get(`/api/library`);
        setLibrary(response.data);
        console.log("Library data:", response.data);
      } catch (error) {
        console.error("Failed to fetch library", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLibrary();
  }, []);

  const openReviewModal = (book, review = null) => {
    setSelectedBook(book);
    setIsReviewModalOpen(true);
    if (review) {
      setExistingReview(review);
      setRating(review.rating);
      setReviewText(review.comment);
    } else {
      setExistingReview(null);
      setRating(0);
      setReviewText("");
    }
  };

  const closeReviewModal = () => {
    setSelectedBook(null);
    setIsReviewModalOpen(false);
    setRating(0);
    setReviewText("");
    setExistingReview(null);
  };

  const submitReview = async () => {
    if (!rating || !reviewText) {
      alert("Please provide a rating and a review.");
      return;
    }

    try {
      const reviewData = {
        rating: rating,
        comment: reviewText,
        user_id: userId,
        book_id: selectedBook.id,
      };

      const url = existingReview
        ? `${baseUrl}/api/reviews/${existingReview.id}`
        : `${baseUrl}/api/reviews`;

      const method = existingReview ? "patch" : "post";

      const response = await axios({
        method: method,
        url: url,
        data: reviewData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Review submitted successfully:", response.data);

      // After submitting, you may want to refresh the library to reflect updated review
      closeReviewModal();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit your review. Please try again.");
    }
  };

  const openReader = (fileUrl) => {
    // Split the fileUrl into type and filename
    const [type, fileName] = fileUrl.split("/");

    // Construct the URL to fetch the file from the new API route
    const fileDownloadUrl = `${baseUrl}/api/files/${type}/${fileName}`;

    setSelectedFile(fileDownloadUrl);
    setIsReaderOpen(true);
  };

  const closeReader = () => {
    setSelectedFile(null);
    setIsReaderOpen(false);
  };

  const playAudiobook = (audiobook) => {
    console.log("playing audiobook");
  };

  if (loading) return <p>Loading your library...</p>;

  return (
    <div className={styles.libraryWrapper}>
      <h1 className={styles.pageTitle}>Your Library</h1>
      <div className={styles.libraryGrid}>
        {library.map((item) => {
          const book = item.book;
          if (!book) return null;

          return (
            <div key={book.id} className={styles.libraryItem}>
              <img
                src={`${baseUrl}/storage/${book.image}`}
                alt={book.title}
                className={styles.bookImage}
              />
              <div className={styles.bookInfo}>
                <h2 className={styles.bookTitle}>
                  {book.title}
                  <button
                    className={styles.reviewIconButton}
                    onClick={() => openReviewModal(book, item.review)}
                    title={item.review ? "Edit Review" : "Add Review"}
                  >
                    <img
                      src={reviewIcon}
                      alt="✍️"
                      className={styles.reviewIcon}
                    />
                  </button>
                </h2>
                <p className={styles.bookAuthor}>By {book.author}</p>
              </div>
              <div className={styles.buttonGroup}>
                {book.file_url && (
                  <button
                    className={styles.actionButton}
                    onClick={() => openReader(book.file_url)}
                  >
                    📖 Read
                  </button>
                )}
                {book.audiobook && book.audiobook.file_url && (
                  <button
                    className={styles.actionButton}
                    onClick={() => playAudiobook(book.audiobook)}
                  >
                    🎧 Listen
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isReviewModalOpen && selectedBook && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>
              {existingReview ? "Edit Review" : "Add Review"} for{" "}
              {selectedBook.title}
            </h2>

            {/* Rating Stars */}
            <div className={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${rating >= star ? styles.filled : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review Textarea */}
            <textarea
              className={styles.reviewTextarea}
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>

            <div className={styles.modalButtons}>
              <button className={styles.submitButton} onClick={submitReview}>
                {existingReview ? "Update Review" : "Submit Review"}
              </button>
              <button
                className={styles.cancelButton}
                onClick={closeReviewModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isReaderOpen && selectedFile && (
        <BookReader fileUrl={selectedFile} onClose={closeReader} />
      )}
    </div>
  );
}

export default Library;
