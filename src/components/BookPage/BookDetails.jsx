import React from "react";
import BookActions from "./BookActions";
import AudiobookPlayer from "./AudiobookPlayer";
import styles from "./BookPage.module.css";

function BookDetails({
  book,
  handleAddToCart,
  handleRent,
  handleAccessAudiobook,
}) {
  return (
    <div className={styles.bookDetails}>
      <div className={styles.coverAndActionsWrapper}>
        <div className={styles.coverWrapper}>
          <img
            src={book.image || "/placeholder-cover.png"}
            alt={book.title}
            className={styles.coverImage}
          />
        </div>
        <BookActions
          book={book}
          onAddToCart={handleAddToCart}
          onRent={handleRent}
          onAccessAudiobook={handleAccessAudiobook}
        />
      </div>
      <div className={styles.infoWrapper}>
        <h1 className={styles.title}>{book.title}</h1>
        <p className={styles.author}>by {book.author}</p>
        <p className={styles.genre}>{book.genre}</p>
        <p className={styles.published}>
          Published on: {new Date(book.publishedDate).toLocaleDateString()}
        </p>
        <p className={styles.availability}>Availability: {book.availability}</p>
        <p className={styles.price}>
          <strong>{book.price ? `$${book.price}` : "Free"}</strong>
        </p>
        <p className={styles.description}>{book.description}</p>
        {book.audiobook && <AudiobookPlayer audiobook={book.audiobook} />}
      </div>
    </div>
  );
}

export default BookDetails;
