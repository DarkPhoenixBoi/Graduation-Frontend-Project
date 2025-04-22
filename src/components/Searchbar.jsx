import React, { useState } from "react";
import styles from "./Searchbar.module.css";
export default function Searchbar({ value, onChange }) {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for books..."
        className={styles.searchInput}
      />
    </div>
  );
}
