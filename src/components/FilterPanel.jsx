import React from "react";
import styles from "./FilterPanel.module.css";

function FilterPanel({
  filters,
  onChange,
  sortOptions,
  selectedSort,
  onSortChange,
}) {
  return (
    <div className={styles.panel}>
      {/* Sort Section */}
      <div className={styles.sortSection}>
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className={styles.sortSelect}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Genres */}
      <div className={styles.section}>
        <p>Genres</p>
        <div className={styles.multiColumn}>
          {filters.genres.map((genre) => (
            <label key={genre}>
              <input
                type="checkbox"
                value={genre}
                checked={filters.selectedGenres.includes(genre)}
                onChange={() => onChange("Genres", genre)}
              />
              {genre}
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className={styles.section}>
        <p>Tags</p>
        <div className={styles.multiColumn}>
          {filters.tags.map((tag) => (
            <label key={tag}>
              <input
                type="checkbox"
                value={tag}
                checked={filters.selectedTags.includes(tag)}
                onChange={() => onChange("Tags", tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
