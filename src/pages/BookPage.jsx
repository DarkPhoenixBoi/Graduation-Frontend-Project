import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookDetails from "../components/BookPage/BookDetails";

import RelatedBooksSlider from "../components/BookPage/RelatedBooksSlider";
import styles from "../components/BookPage/BookPage.module.css";

import tempAudiobook from "../assets/tempAudiobook.wav";
import ReviewList from "../components/Review/ReviewList";

function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  const dummyReviews = [
    {
      id: 1,
      userId: 101,
      username: "booklover92",
      bookId: 501,
      rating: 5,
      comment: "Absolutely loved this book! A must-read for fantasy fans.",
      date: "2024-12-15T10:30:00Z",
    },
    {
      id: 2,
      userId: 102,
      username: "literaryowl",
      bookId: 501,
      rating: 4,
      comment:
        "Great pacing and character development. Ending felt a bit rushed.",
      date: "2025-01-08T15:45:00Z",
    },
    {
      id: 3,
      userId: 103,
      username: "pageflipper",
      bookId: 501,
      rating: 3,
      comment:
        "Interesting premise but not quite my style. Still worth checking out.Interesting premise but not quite my style. Still worth checking out.Interesting premise but not quite my style. Still worth checking out.Interesting premise but not quite my style. Still worth checking out.Interesting premise but not quite my style. Still worth checking out.Interesting premise but not quite my style. Still worth checking out.Interesting premise but not quite my style. Still worth checking out.Interesting premise but not quite my style. Still worth checking out.Interesting premise but not quite my style. Still worth checking out.Interesting premise but not quite my style. Still worth checking out.Interesting premise but not quite my style. Still worth checking out.",
      date: "2025-03-21T08:20:00Z",
    },
    {
      id: 4,
      userId: 104,
      username: "storyseeker",
      bookId: 501,
      rating: 5,
      comment:
        "Masterfully written and incredibly immersive. Can’t wait for the sequel!",
      date: "2025-04-01T17:00:00Z",
    },
    {
      id: 5,
      userId: 105,
      username: "readsrule",
      bookId: 501,
      rating: 4,
      comment: "Solid read. Loved the plot twists and vivid world-building.",
      date: "2025-04-18T11:10:00Z",
    },
  ];

  useEffect(() => {
    // Replace with real API call
    async function fetchBook() {
      const res = await fetch(`/api/books/${id}`);
      const data = await res.json();
      setBook(data);
    }
    function fetchDummyBook() {
      const dummyBook = {
        bookID: 1,
        title: "Echoes of Eternity",
        author: "Lena Martell",
        genre: "Fantasy",
        price: 9.99,
        description:
          "Step into a realm where magic and adventure intertw,ine where heroes rise against darkness and unlikely alliances are forged. Join our young protagonist as they navigate a world filled with mysterious creatures, ancient secrets, and thrilling battles that will test their courage and determination. Embark on a journey that will challenge your imagination and tug at your heartstrings, as you discover the power of friendship, the importance of choice, and the resilience of the human spirit. Experience a tale that will transport you to another time and place, where anything is possible and the line between reality and fantasy blurs. Dive into this epic story that will captivate readers of all ages and leave them eagerly anticipating the next chapter.",
        image:
          "https://marketplace.canva.com/EAFfSnGl7II/2/0/1003w/canva-elegant-dark-woods-fantasy-photo-book-cover-vAt8PH1CmqQ.jpg",
        availability: "Purchase",
        publishedDate: "2023-06-15",
        fileURL: "https://example.com/ebooks/echoes-of-eternity.epub",
        audiobook: {
          audiobookID: 1,
          bookID: 1,
          fileURL: `${tempAudiobook}`,
          duration: "00:15:00",
        },
      };
      setBook(dummyBook);
    }
    // fetchBook();
    fetchDummyBook();
  }, [id]);

  if (!book) return <div>Loading...</div>;

  const handleAddToCart = (book) => {
    // Logic to add the book to the cart
    console.log("Added to cart:", book);
  };

  const handleRent = (book) => {
    // Logic to rent the book
    console.log("Rented:", book);
  };

  const handleAccessAudiobook = (book) => {
    // Logic to access the audiobook
    console.log("Accessing audiobook:", book);
  };
  return (
    <div className={styles.bookPage}>
      <BookDetails
        book={book}
        handleAddToCart={handleAddToCart}
        handleRent={handleRent}
        handleAccessAudiobook={handleAccessAudiobook}
      />
      <ReviewList reviews={dummyReviews} />
      {/* <RelatedBooksSlider genre={book.genre} /> */}
    </div>
  );
}

export default BookPage;
