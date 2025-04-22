import React, { useState } from "react";
import SearchBar from "./Searchbar";
import FilterPanel from "./FilterPanel";
import styles from "./FilterBar.module.css";

function FilterBar({
  filters,
  onFilterChange,
  searchValue,
  onSearchChange,
  sortOptions,
  onSortChange,
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <SearchBar value={searchValue} onChange={onSearchChange} />
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={styles.filterButton}
        >
          <img
            src="src/assets/filter.png"
            alt="Filter"
            className={styles.filterIcon}
          />
        </button>
      </div>
      {showFilters && (
        <div className={styles.panelWrapper}>
          <FilterPanel
            filters={filters}
            onChange={onFilterChange}
            sortOptions={sortOptions}
            onSortChange={onSortChange}
          />
        </div>
      )}
    </div>
  );
}

export default FilterBar;
