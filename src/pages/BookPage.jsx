import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

import BookDetails from "../components/BookPage/BookDetails";
import RelatedBooksSlider from "../components/BookPage/RelatedBooksSlider";
import ReviewList from "../components/Review/ReviewList";

import styles from "../components/BookPage/BookPage.module.css";
import Loading from "../components/Loading";

import baseURL from "../config";

function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookRes = await api.get(`/api/books/${id}`);
        const bookData = bookRes.data.book ?? bookRes.data; // for backend flexibility
        setBook(bookData);
        console.log("Book data:", bookData);
        const reviewsRes = await api.get(`/api/reviews/book/${id}`);
        setReviews(reviewsRes.data.reviews ?? reviewsRes.data); // adapt if needed

        setLoading(false);
      } catch (error) {
        console.error("Error fetching book data:", error);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAccessAudiobook = (book) => {
    console.log("Accessing audiobook:", book);
    // TODO: redirect to audiobook player or download
  };

  if (loading) return <Loading />;
  if (!book) return <div>Book not found.</div>;

  return (
    <div className={styles.bookPage}>
      <BookDetails book={book} handleAccessAudiobook={handleAccessAudiobook} />
      <ReviewList reviews={reviews} />
      <RelatedBooksSlider genre={book.genre} currentBookId={book.id} />
    </div>
  );
}

export default BookPage;
