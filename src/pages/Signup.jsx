import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Signup.module.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // TODO: Add validation and send to backend
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Signup submitted:", formData);
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <h2 className={styles.title}>Create an Account</h2>
        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
          />
          <button type="submit" className={styles.signupButton}>
            Sign Up
          </button>
        </form>
        <p className={styles.loginText}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
export default Signup;
