import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import baseURL from "../config";
import styles from "./BookItem.module.css";

function BookItem({ book }) {
  const { title, author, image, price } = book;
  const [hovered, setHovered] = useState(false);

  const imageUrl = image?.startsWith("http")
    ? image
    : `${baseURL}/storage/${image}`;

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/browse/book/${book.id}`); // Actual route
    // navigate("/browse/book"); // Temporary route for testing
  };
  return (
    <div
      className={styles.bookCard}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <img src={imageUrl} alt={title} className={styles.bookCover} />
      <h3 className={styles.bookTitle}>{title}</h3>
      <p className={styles.bookAuthor}>{author}</p>
      <p className={styles.bookPrice}>{price ? `$${price}` : "Free"}</p>

      <div
        className={`${styles.previewBox} ${hovered ? styles.previewBoxVisible : ""}`}
      >
        <p>
          <strong>Author:</strong> {book.author}
        </p>
        <p>
          <strong>Genre:</strong> {book.genre}
        </p>
        <p>
          <strong>Description:</strong> Temporary description of the book. This
          is a placeholder text to show how the description will look like when
          the book is hovered over.
          {/* book.description.slice(0, 120) */}
          ...
        </p>
      </div>
    </div>
  );
}

export default BookItem;
