import { Link } from "react-router-dom";
import styles from "./checkoutsuccess.module.css";

function CheckoutSuccess() {
  return (
    <div className={styles.successContainer}>
      <h1 className={styles.title}>Thank you for your purchase!</h1>
      <p className={styles.subtitle}>
        You can find your books in your library.
      </p>
      <Link to="/library" className={styles.libraryLink}>
        Go to Library
      </Link>
    </div>
  );
}

export default CheckoutSuccess;
