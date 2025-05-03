import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import BookItem from "../components/BookItem";
import api from "../api/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = "http://127.0.0.1:8000";

  useEffect(() => {
    api
      .get(`/api/books`)
      .then((res) => {
        setBooks(res.data.books || res.data);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.home}>
      {/* Hero Banner Section */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Explore the World of Books</h1>
          <p className={styles.heroSubtitle}>
            Find your next great read or audiobook
          </p>
          <Link to="/browse" className={styles.ctaButton}>
            Browse Books
          </Link>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sliderWrapper}>
          <h2 className={styles.sectionTitle}>Featured Books</h2>

          {loading ? (
            <p>Loading books...</p>
          ) : (
            <Swiper
              slidesPerView={3}
              spaceBetween={10}
              navigation={true}
              modules={[Navigation]}
              breakpoints={{
                375: { slidesPerView: 1 },
                560: { slidesPerView: 2 },
                820: { slidesPerView: 3 },
                1070: { slidesPerView: 4 },
              }}
            >
              {books.map((book, index) => (
                <SwiperSlide key={index}>
                  <BookItem book={book} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
