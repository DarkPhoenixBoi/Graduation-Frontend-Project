import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

import baseURL from "../config";

import styles from "./Signup.module.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    setSubmitError(null);
  };

  const validate = () => {
    const newErrors = {};
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) newErrors.name = "Name is required.";
    else if (name.length > 255)
      newErrors.name = "Name must be less than 256 characters.";

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email is invalid.";
    else if (email.length < 3 || email.length > 64)
      newErrors.email = "Email must be between 3 and 64 characters.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8 || password.length > 64)
      newErrors.password = "Password must be between 8 and 64 characters.";
    else if (/\s/.test(password))
      newErrors.password = "Password must not contain spaces.";

    if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!validate()) return;

    try {
      await api.post(`/api/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });
      setSuccess(true);
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <h2 className={styles.title}>Create an Account</h2>
        <form onSubmit={handleSubmit} className={styles.signupForm} noValidate>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}

          <button type="submit" className={styles.signupButton}>
            Sign Up
          </button>

          {submitError && <p className={styles.error}>{submitError}</p>}
          {success && (
            <p className={styles.success}>Account created successfully!</p>
          )}
        </form>
        <p className={styles.loginText}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
