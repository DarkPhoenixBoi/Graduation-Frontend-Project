import React from "react";
import styles from "./BookPage.module.css";

function BookActions({ book, onAddToCart, onRent, onAccessAudiobook }) {
  const handleAddToCart = () => onAddToCart(book);
  const handleRent = () => onRent(book);
  const handleAudiobook = () => onAccessAudiobook(book);

  return (
    <div className={styles.actionsWrapper}>
      <button
        className={`${styles.button} ${styles.addToCart}`}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
      {book.availability === "Rent" && (
        <button
          className={`${styles.button} ${styles.rent}`}
          onClick={handleRent}
        >
          Rent
        </button>
      )}
      {book.audiobook && (
        <button
          className={`${styles.button} ${styles.audiobook}`}
          onClick={handleAudiobook}
        >
          Listen to Audiobook
        </button>
      )}
    </div>
  );
}

export default BookActions;
