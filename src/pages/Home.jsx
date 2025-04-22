import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import BookItem from "../components/BookItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

function Home() {
  const featuredBooks = [
    { title: "Book 1", author: "Author 1", image: "/src/assets/Title1.png" },
    { title: "Book 2", author: "Author 2", image: "/src/assets/Title2.png" },
    { title: "Book 3", author: "Author 3", image: "/src/assets/Title3.png" },
    { title: "Book 3", author: "Author 3", image: "/src/assets/Title3.png" },
    { title: "Book 3", author: "Author 3", image: "/src/assets/Title3.png" },
    { title: "Book 3", author: "Author 3", image: "/src/assets/Title3.png" },
    { title: "Book 3", author: "Author 3", image: "/src/assets/Title3.png" },
    { title: "Book 3", author: "Author 3", image: "/src/assets/Title3.png" },
    { title: "Book 3", author: "Author 3", image: "/src/assets/Title3.png" },
    { title: "Book 3", author: "Author 3", image: "/src/assets/Title3.png" },
    { title: "Book 1", author: "Author 1", image: "/src/assets/Title1.png" },
    { title: "Book 2", author: "Author 2", image: "/src/assets/Title2.png" },
  ];

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
          <Swiper
            slidesPerView={3}
            spaceBetween={10} // Lower this if there's too much space
            navigation={true}
            modules={[Navigation]}
            breakpoints={{
              375: {
                slidesPerView: 1, // On smaller screens, show 1 book per row
              },
              560: {
                slidesPerView: 2, // 2 per row on medium screens
              },
              820: {
                slidesPerView: 3, // 3 per row on larger screens
              },
              1070: {
                slidesPerView: 4, // 3 per row on larger screens
              },
            }}
          >
            {featuredBooks.map((book, index) => (
              <SwiperSlide key={index}>
                <BookItem key={index} book={book} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}

export default Home;
