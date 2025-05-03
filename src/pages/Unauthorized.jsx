import React from "react";
import { Link } from "react-router-dom";
import styles from "./Unauthorized.module.css"; // optional CSS module

const Unauthorized = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>403 - Unauthorized</h1>
      <p className={styles.message}>
        You don’t have permission to access this page.
      </p>
      <Link to="/" className={styles.link}>
        Go to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
