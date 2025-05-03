import React from "react";
import styles from "./Footer.module.css";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.ribbon}></div>
      <div className={styles.container}>
        <div className={styles.brand}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <p>Your gateway to stories in text and sound.</p>
        </div>

        <div className={styles.linksSection}>
          <div>
            <h4>Explore</h4>
            <ul>
              <li>
                <a href="/browse">Browse Books</a>
              </li>
              <li>
                <a href="/genres">Genres</a>
              </li>
              <li>
                <a href="/Vocalize">Vocalize</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/careers">Careers</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.social}>
          <a href="#">
            <FaFacebook />
          </a>
          <a href="#">
            <FaTwitter />
          </a>
          <a href="#">
            <FaInstagram />
          </a>
          <a href="#">
            <FaGithub />
          </a>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Vocalize. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
