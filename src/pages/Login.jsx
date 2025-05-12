import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

import baseURL from "../config";

import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { login } = useContext(AuthContext); // Use context

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    setSubmitError(null);
  };

  const validate = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format.";

    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!validate()) return;

    try {
      const response = await api.post(`/api/login`, formData);

      const user = response.data.user;
      const token = response.data.token;

      login(user, token);

      // // Optional: Store also in cookie (for persistence or access in non-React code)
      // Cookies.set("token", token, {
      //   expires: 7,
      //   secure: true,
      //   sameSite: "Strict",
      // });

      // Cookies.set("user", JSON.stringify(user), {
      //   expires: 7,
      //   secure: true,
      //   sameSite: "Strict",
      // });

      setSuccess(true);
      if (user?.role?.toLowerCase() === "admin") {
        navigate("/dashboard");
      } else if (user?.role?.toLowerCase() === "user") {
        navigate("/"); // or "/browse" or whatever your user home route is
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setSubmitError(err.response.data.message);
      } else {
        setSubmitError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Login to Vocalize</h2>
        <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}

          <button type="submit" className={styles.loginButton}>
            Log In
          </button>

          {submitError && <p className={styles.error}>{submitError}</p>}
          {success && <p className={styles.success}>Login successful!</p>}
        </form>
        <p className={styles.signupText}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
