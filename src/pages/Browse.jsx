import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookItem from "../components/BookItem";
import FilterBar from "../components/FilterBar";
import styles from "./browse.module.css"; // Create this CSS module
import { useLocation } from "react-router-dom";
import api from "../api/axios";

//temp
import tempAudiobook from "../assets/tempAudiobook.wav";

function Browse() {
  const [books, setBooks] = useState([]);
  const location = useLocation();
  const paramsTest = new URLSearchParams(location.search);
  const genre = paramsTest.get("genre");
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    genres: [
      "Fiction",
      "Non-fiction",
      "Mystery",
      "Thriller",
      "Fantasy",
      "Sci-Fi",
      "Romance",
      "Horror",
      "Biography",
      "History",
      "Philosophy",
      "Poetry",
      "Crime",
      "Science",
      "Art",
      "Comics",
      "Drama",
      "Adventure",
      "Young Adult",
      "Children",
      "Classic",
      "Humor",
      "Spirituality",
      "Health",
      "Cooking",
      "Business",
      "Memoir",
      "Technology",
      "Politics",
      "Travel",
    ], // Example genres
    tags: [], // Example tags
    selectedGenres: [],
    selectedTags: [],
  });
  const [sortOption, setSortOption] = useState("alphabetical");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/api/tags");
        const tags = response.data.map((tag) => tag.tag_name);
        setFilters((prev) => ({ ...prev, tags }));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const paramsTest = new URLSearchParams(location.search);
    const genreFromUrl = paramsTest.get("genre");

    setFilters((prev) => ({
      ...prev,
      selectedGenres: genreFromUrl ? [genreFromUrl] : [],
      selectedTags: [],
    }));
  }, [location.search]);

  const params = new URLSearchParams();
  console.log(genre);
  if (searchValue) {
    params.append("search", searchValue);
  }

  useEffect(() => {
    if (genre && !filters.selectedGenres.includes(genre)) {
      setFilters((prev) => ({
        ...prev,
        selectedGenres: [...prev.selectedGenres, genre],
      }));
    }
  }, [genre]);

  if (filters.selectedGenres.length > 0) {
    params.append("genre", filters.selectedGenres.join(","));
  }

  if (filters.selectedTags.length > 0) {
    params.append("tag", filters.selectedTags.join(","));
  }

  if (sortOption) {
    params.append("sort", sortOption);
  }

  const baseUrl = "http://127.0.0.1:8000";

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (searchValue) params.append("search", searchValue);
    if (filters.selectedGenres.length > 0)
      params.append("genre", filters.selectedGenres.join(","));
    if (filters.selectedTags.length > 0)
      params.append("tag", filters.selectedTags.join(","));
    if (sortOption) params.append("sort", sortOption);
    return `/api/books/browse?${params.toString()}`;
  }, [searchValue, filters.selectedGenres, filters.selectedTags, sortOption]);

  console.log(apiUrl); // Log the API URL for debugging

  const sortOptions = [
    { value: "alphabetical", label: "Alphabetical" },
    { value: "popularity", label: "Popularity" },
    { value: "new", label: "New" },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get(`${apiUrl}`);
        setBooks(response.data.books || response.data); // Assuming your response data has a `books` key
        console.log("Fetched books:", response.data.books); // Log the fetched books for debugging
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [apiUrl]); // Adding `apiUrl` as a dependency to refetch when it's updated

  const handleFilterChange = (type, value) => {
    navigate("/browse", { replace: true });

    setFilters((prevFilters) => {
      const newSelected = prevFilters[`selected${type}`].includes(value)
        ? prevFilters[`selected${type}`].filter((item) => item !== value)
        : [...prevFilters[`selected${type}`], value];
      return {
        ...prevFilters,
        [`selected${type}`]: newSelected,
      };
    });
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
    console.log("Selected sort:", newSortOption);
  };

  return (
    <div className={styles.browse}>
      <FilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onFilterChange={handleFilterChange}
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
      />

      <h1 className={styles.genreTitle}>{genre}</h1>
      <div className={styles.bookGrid}>
        {books.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default Browse;
