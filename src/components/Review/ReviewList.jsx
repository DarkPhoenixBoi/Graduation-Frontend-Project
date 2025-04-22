import ReviewItem from "./ReviewItem";
import styles from "./Review.module.css";

function ReviewList({ reviews }) {
  return (
    <div className={styles.reviewList}>
      <h2 className={styles.sectionTitle}>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((r) => <ReviewItem key={r.id} review={r} />)
      )}
    </div>
  );
}

export default ReviewList;
