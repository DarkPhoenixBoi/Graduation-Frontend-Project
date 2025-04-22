import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookItem from "../components/BookItem";
import FilterBar from "../components/FilterBar";
import styles from "./browse.module.css"; // Create this CSS module
import { useLocation } from "react-router-dom";

//temp
import tempAudiobook from "../assets/tempAudiobook.wav";

function Browse() {
  const [books, setBooks] = useState([]);
  const location = useLocation();
  const paramsTest = new URLSearchParams(location.search);
  const genre = paramsTest.get("genre");

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
      "Self-Help",
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
    tags: ["New", "Popular", "Recommended"], // Example tags
    selectedGenres: [],
    selectedTags: [],
  });
  const [sortOption, setSortOption] = useState("title");

  const params = new URLSearchParams();

  if (searchValue) {
    params.append("search", searchValue);
  }

  if (filters.selectedGenres.length > 0) {
    params.append("genres", filters.selectedGenres.join(","));
  }

  if (filters.selectedTags.length > 0) {
    params.append("tags", filters.selectedTags.join(","));
  }

  if (sortOption) {
    params.append("sort", sortOption);
  }

  const apiUrl = `/api/books?${params.toString()}`;
  console.log(apiUrl); // Log the API URL for debugging

  const sortOptions = [
    { value: "title_asc", label: "Title (A-Z)" },
    { value: "title_desc", label: "Title (Z-A)" },
    { value: "price_low", label: "Price (Low to High)" },
    { value: "price_high", label: "Price (High to Low)" },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      const genreFilter = filters.selectedGenres.join(",");
      const tagFilter = filters.selectedTags.join(",");
      const searchQuery = searchValue ? `&search=${searchValue}` : "";
      const filterQuery =
        genreFilter || tagFilter
          ? `&genres=${genreFilter}&tags=${tagFilter}`
          : "";

      const response = await fetch(`/api/books?${searchQuery}${filterQuery}`);
      const data = await response.json();
      setBooks(data.books);
    };

    fetchBooks();
  }, [searchValue, filters]);

  // START DELETE
  useEffect(() => {
    // Simulate fetching books by genre (replace with API call later)
    fetchBooksByGenre(genre);
  }, [genre]);

  const fetchBooksByGenre = (genre) => {
    // Simulated data

    const allBooks = [
      {
        id: 1,
        title: "Echoes of Eternity",
        author: "Lena Martell",
        genre: "Fantasy",
        price: 9.99,
        description:
          "Step into a realm where magic and adventure intertwine, where heroes rise against darkness and unlikely alliances are forged. Join our young protagonist as they navigate a world filled with mysterious creatures, ancient secrets, and thrilling battles that will test their courage and determination. Embark on a journey that will challenge your imagination and tug at your heartstrings, as you discover the power of friendship, the importance of choice, and the resilience of the human spirit. Experience a tale that will transport you to another time and place, where anything is possible and the line between reality and fantasy blurs. Dive into this epic story that will captivate readers of all ages and leave them eagerly anticipating the next chapter.",
        image:
          "https://marketplace.canva.com/EAFfSnGl7II/2/0/1003w/canva-elegant-dark-woods-fantasy-photo-book-cover-vAt8PH1CmqQ.jpg",
        availability: "Purchase",
        publishedDate: "2023-06-15",
        fileURL: "https://example.com/ebooks/echoes-of-eternity.epub",
        audiobook: {
          audiobookID: 1,
          bookID: 1,
          fileURL: `${tempAudiobook}`,
          duration: "00:15:00",
        },
      },
      {
        id: 2,
        title: "Shadows in the Mist",
        author: "Dorian Blackwell",
        genre: "Fantasy",
        price: 12.99,
        description:
          "Enter a realm of shadows and intrigue, where dark legends awaken and dangerous secrets lurk behind every mist-veiled corner. Follow a determined hero as he battles supernatural forces and uncovers truths hidden in the depths of an enchanted forest. A story of suspense, sacrifice, and the hidden magic woven into the fabric of a mysterious land.",
        image: "/src/assets/Title4.png",
        availability: "Purchase",
        publishedDate: "2023-07-21",
        fileURL: "https://example.com/ebooks/shadows-in-the-mist.epub",
        audiobook: {
          audiobookID: 2,
          bookID: 2,
          fileURL: `${tempAudiobook}`,
          duration: "00:20:00",
        },
      },
      {
        id: 3,
        title: "Frostbound Legacy",
        author: "Seraphina Winters",
        genre: "Fantasy",
        price: 10.99,
        description:
          "In a kingdom cursed with eternal winter, a reluctant hero rises to awaken ancient magic long thought lost. Journey through frost-covered landscapes as age-old myths and the raw power of nature collide in a battle for survival against relentless, icy forces.",
        image: "/src/assets/Title2.png",
        availability: "Purchase",
        publishedDate: "2023-08-05",
        fileURL: "https://example.com/ebooks/frostbound-legacy.epub",
        audiobook: {
          audiobookID: 3,
          bookID: 3,
          fileURL: `${tempAudiobook}`,
          duration: "00:18:30",
        },
      },
      {
        id: 4,
        title: "Celestial Chronicles",
        author: "Jonathan Aurelius",
        genre: "Fantasy",
        price: 11.99,
        description:
          "Travel through a universe where stars hold the keys to ancient prophecies and celestial beings guide the fate of mortals. Unravel the secrets of long-forgotten scrolls and embark on an odyssey that blurs the lines between myth and reality in a cosmos teeming with wonder.",
        image: "/src/assets/Title1.png",
        availability: "Purchase",
        publishedDate: "2023-09-10",
        fileURL: "https://example.com/ebooks/celestial-chronicles.epub",
        audiobook: {
          audiobookID: 4,
          bookID: 4,
          fileURL: `${tempAudiobook}`,
          duration: "00:22:00",
        },
      },
      {
        id: 5,
        title: "Moonlit Reverie",
        author: "Elara Moon",
        genre: "Fantasy",
        price: 8.99,
        description:
          "Experience a mesmerizing tale of enchantment where the glow of the moon weaves dreams and reality into a delicate tapestry. Follow a daring heroine on a journey through enchanted forests and magical realms, where every whisper of the wind carries a secret waiting to be unraveled.",
        image: "/src/assets/Title5.png",
        availability: "Purchase",
        publishedDate: "2023-10-01",
        fileURL: "https://example.com/ebooks/moonlit-reverie.epub",
        audiobook: {
          audiobookID: 5,
          bookID: 5,
          fileURL: `${tempAudiobook}`,
          duration: "00:17:45",
        },
      },
      {
        id: 6,
        title: "Book 6",
        author: "Author 6",
        image: "/src/assets/Title3.png",
        genre: "Non-fiction",
      },
      {
        id: 7,
        title: "Book 7",
        author: "Author 7",
        image: "/src/assets/Title6.png",
        genre: "Horror",
      },
      {
        id: 8,
        title: "Book 8",
        author: "Author 8",
        image: "/src/assets/Title4.png",
        genre: "Poetry",
      },
      {
        id: 9,
        title: "Book 9",
        author: "Author 9",
        image: "/src/assets/Title5.png",
        genre: "Drama",
      },
      {
        id: 10,
        title: "Book 10",
        author: "Author 10",
        image: "/src/assets/Title3.png",
        genre: "Sci-Fi",
      },
      {
        id: 11,
        title: "Book 11",
        author: "Author 11",
        image: "/src/assets/Title5.png",
        genre: "Thriller",
      },
      {
        id: 12,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title5.png",
        genre: "History",
      },
      {
        id: 13,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 14,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 15,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 16,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 17,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 18,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 19,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 20,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 21,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 22,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 23,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 24,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 25,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title2.png",
        genre: "History",
      },
      {
        id: 26,
        title: "Book 12",
        author: "Author 12",
        image: "/src/assets/Title6.png",
        genre: "History",
      },
    ];
    if (!genre) {
      setBooks(allBooks);
      return;
    }
    const filtered = allBooks.filter(
      (book) => book.genre.toLowerCase() === genre.toLowerCase()
    );
    setBooks(filtered);
  };
  // END DELETE

  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => {
      console.log(prevFilters);
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
    // Optionally: refetch or re-filter books using newSortOption
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
