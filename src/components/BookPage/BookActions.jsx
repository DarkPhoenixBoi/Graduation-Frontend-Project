import React from "react";
import { useState } from "react";

import { useCart } from "../../context/CartContext";

import styles from "./BookPage.module.css";

function BookActions({ book, onAccessAudiobook }) {
  const handleAudiobook = () => onAccessAudiobook(book);

  const { cartItems, addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);

  const isInCart =
    book &&
    Array.isArray(cartItems) &&
    cartItems.some((item) => item.book && item.book.id === book.id);

  const handleAddToCart = async () => {
    if (book && !isInCart && !addingToCart) {
      try {
        setAddingToCart(true);
        await addToCart(book);
      } finally {
        setAddingToCart(false);
      }
    }
  };
  return (
    <div className={styles.actionsWrapper}>
      <button
        className={`${styles.button} ${styles.addToCart}`}
        onClick={handleAddToCart}
        disabled={isInCart || addingToCart}
      >
        {addingToCart
          ? "Adding..."
          : isInCart
            ? "Already in Cart"
            : "Add to Cart"}
      </button>
      {book.availability === "Rent" && (
        <button
          className={`${styles.button} ${styles.rent}`}
          onClick={handleAddToCart}
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
