import React from "react";
import styles from "./PageSelector.module.css";

const PageSelector = ({ onSelect }) => {
  const [page, setPage] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(page);
    if (!isNaN(pageNum) && pageNum > 0) {
      onSelect(pageNum);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="startPage" className={styles.label}>
        Start from page:
      </label>
      <input
        type="number"
        id="startPage"
        min="1"
        value={page}
        onChange={(e) => setPage(e.target.value)}
        placeholder="e.g. 5"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Start
      </button>
    </form>
  );
};

export default PageSelector;
