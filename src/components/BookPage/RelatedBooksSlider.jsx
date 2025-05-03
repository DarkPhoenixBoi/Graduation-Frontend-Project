import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import api from "../../api/axios";

import "swiper/css";
import "swiper/css/navigation";

import BookItem from "../BookItem";
import styles from "./BookPage.module.css";

function RelatedBooksSlider({ genre, currentBookId }) {
  const [relatedBooks, setRelatedBooks] = useState([]);
  const baseUrl = "http://localhost:8000"; // Adjust based on your API base URL

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await api.get(
          `/api/books/browse?genre=${encodeURIComponent(genre)}`
        );
        const books = response.data.books || response.data; // Adjust based on your API response structure
        const filtered = books.filter((book) => book.id !== currentBookId);
        setRelatedBooks(filtered);
      } catch (error) {
        console.error("Failed to fetch related books:", error);
      }
    };

    if (genre) fetchRelated();
  }, [genre, currentBookId]);

  return (
    <div className={styles.sliderSection}>
      <h2 className={styles.sliderTitle}>More in this Genre</h2>
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        navigation={true}
        modules={[Navigation]}
        breakpoints={{
          375: { slidesPerView: 1 },
          560: { slidesPerView: 2 },
          820: { slidesPerView: 3 },
          1070: { slidesPerView: 4 },
        }}
      >
        {relatedBooks.map((book) => (
          <SwiperSlide key={book.id}>
            <BookItem book={book} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default RelatedBooksSlider;
