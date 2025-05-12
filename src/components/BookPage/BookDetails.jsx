import React from "react";
import BookActions from "./BookActions";
import AudiobookPlayer from "./AudiobookPlayer";
import styles from "./BookPage.module.css";
import baseURL from "../../config";

function BookDetails({ book, handleAccessAudiobook }) {
  const imageUrl = book.image?.startsWith("http")
    ? book.image
    : `${baseURL}/storage/${book.image}`;

  return (
    <div className={styles.bookDetails}>
      <div className={styles.coverAndActionsWrapper}>
        <div className={styles.coverWrapper}>
          <img
            src={imageUrl || "/placeholder-cover.png"}
            alt={book.title}
            className={styles.coverImage}
          />
        </div>
        <BookActions book={book} onAccessAudiobook={handleAccessAudiobook} />
      </div>
      <div className={styles.infoWrapper}>
        <h1 className={styles.title}>{book.title}</h1>
        <p className={styles.author}>by {book.author}</p>
        <p className={styles.genre}>{book.genre}</p>
        <p className={styles.published}>
          Published on: {new Date(book.published_date).toLocaleDateString()}
        </p>
        <p className={styles.availability}>Availability: {book.availability}</p>
        <p className={styles.price}>
          <strong>{book.price ? `$${book.price}` : "Free"}</strong>
        </p>
        <p className={styles.description}>{book.description}</p>
        {book.audiobook && <AudiobookPlayer audiobook={book.audio_sample} />}
      </div>
    </div>
  );
}

export default BookDetails;
