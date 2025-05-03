import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import mainNavbarStyles from "./Navbar.module.css";
import dashboardNavbarStyles from "./navbardashboard.module.css";
import logo from "../assets/Logo.png";
import cartIcon from "../assets/cart.svg";
import userIcon from "../assets/person.svg";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const { user, isLoggedIn, logout } = useContext(AuthContext); // Use context

  const isDashboard = user?.role?.toLowerCase() == "admin";
  const styles = isDashboard ? dashboardNavbarStyles : mainNavbarStyles;

  const genres = [
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
  ];

  const handleGenreSelect = (genre) => {
    setShowGenreDropdown(false);
    navigate(`/browse?genre=${encodeURIComponent(genre)}`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <Link to="/">
          <img src={logo} alt="Logo" className={styles.logo} />
        </Link>
      </div>
      <div className={styles.navbarLinks}>
        <Link to="/">Home</Link>
        <div
          className={styles.browseDropdown}
          onMouseEnter={() => setShowGenreDropdown(true)}
          onMouseLeave={() => setShowGenreDropdown(false)}
        >
          <Link to="/browse" className={styles.browseDropdownToggle}>
            Browse ▾
          </Link>
          {showGenreDropdown && (
            <div className={styles.browseDropdownMenu}>
              <p className={styles.genreDescription}>Genre</p>
              <div className={styles.genreGrid}>
                {genres.map((genre) => (
                  <div
                    key={genre}
                    onClick={() => handleGenreSelect(genre)}
                    className={styles.browseDropdownItem}
                  >
                    {genre}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Link to="/vocalize">Vocalize</Link>
        <Link to="/library">Library</Link>
      </div>

      <div className={styles.navbarUser}>
        <div className={styles.cartIcon}>
          <Link to="/cart">
            <img src={cartIcon} alt="Cart" />
          </Link>
        </div>

        {isLoggedIn ? (
          <div className={styles.userDropdown} ref={dropdownRef}>
            <img
              src={userIcon}
              alt="User"
              className={styles.userIcon}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            />
            <div
              className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.show : ""}`}
            >
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
