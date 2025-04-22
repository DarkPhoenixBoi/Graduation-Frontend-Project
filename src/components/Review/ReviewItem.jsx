import styles from "./Review.module.css";

function ReviewItem({ review }) {
  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <strong>{review.username}</strong>
        <span className={styles.rating}>★ {review.rating}</span>
        <span className={styles.date}>
          {new Date(review.date).toLocaleDateString()}
        </span>
      </div>
      <p className={styles.comment}>{review.comment}</p>
    </div>
  );
}

export default ReviewItem;
