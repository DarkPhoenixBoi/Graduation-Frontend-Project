import React, { useState } from "react";

import { useCart } from "../../context/CartContext";
import { useLibrary } from "../../context/LibraryContext";

import styles from "./BookPage.module.css";

function BookActions({ book, onAccessAudiobook }) {
  const handleAudiobook = () => onAccessAudiobook(book);

  const { cartItems, addToCart } = useCart();
  const { library, addToLibrary } = useLibrary();

  const [adding, setAdding] = useState(false);

  const isInCart =
    book &&
    Array.isArray(cartItems) &&
    cartItems.some((item) => item.book?.id === book.id);

  const isInLibrary =
    book &&
    Array.isArray(library) &&
    library.some((item) => item.book?.id === book.id);

  const handleAddToLibrary = async () => {
    if (book && !isInLibrary && !adding) {
      try {
        setAdding(true);
        await addToLibrary(book);
      } finally {
        setAdding(false);
      }
    }
  };

  const handleAddToCart = async () => {
    if (book && !isInCart && !adding) {
      try {
        setAdding(true);
        await addToCart(book);
      } finally {
        setAdding(false);
      }
    }
  };

  return (
    <div className={styles.actionsWrapper}>
      {isInLibrary ? (
        <button className={styles.inLibrary} disabled>
          In Library
        </button>
      ) : book.availability === "Free" ? (
        <button
          className={`${styles.button} ${styles.addToLibrary}`}
          onClick={handleAddToLibrary}
          disabled={adding}
        >
          {adding ? "Adding..." : "Add to Library"}
        </button>
      ) : (
        <>
          <button
            className={`${styles.button} ${styles.addToCart}`}
            onClick={handleAddToCart}
            disabled={isInCart || adding}
          >
            {adding
              ? "Adding..."
              : isInCart
                ? "Already in Cart"
                : "Add to Cart"}
          </button>
          {book.availability === "Rent" && (
            <button
              className={`${styles.button} ${styles.rent}`}
              onClick={handleAddToCart}
              disabled={isInCart || adding}
            >
              Rent
            </button>
          )}
        </>
      )}
      {/* {book.audiobook && (
        <button
          className={`${styles.button} ${styles.audiobook}`}
          onClick={handleAudiobook}
        >
          Listen to Audiobook
        </button>
      )} */}
    </div>
  );
}

export default BookActions;
