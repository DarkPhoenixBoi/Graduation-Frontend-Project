import { useState, useContext, useEffect } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user: authUser, updateUser } = useContext(AuthContext);
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (authUser && authUser.profile_picture_url) {
      // Ensure the timestamp is always appended to force cache refresh
      setPreview(authUser.profile_picture_url + `?t=${Date.now()}`);
    }
  }, [authUser]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // Local preview of the selected image
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profilePicture || !authUser) {
      setErrors(["Please select a profile picture before uploading."]);
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", profilePicture);

    api
      .post(`/api/users/${authUser.id}/upload-profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const updatedUser = res.data.user;

        // Update user context with new profile data
        updateUser(updatedUser);

        // Update preview with the new profile picture URL and timestamp
        setPreview(updatedUser.profile_picture_url + `?t=${Date.now()}`);

        // Reset the form and error states
        setProfilePicture(null);
        setErrors([]);
        alert("Profile picture updated!");
      })
      .catch((error) => {
        const err = error.response?.data?.errors;
        if (err) {
          const messages = Object.values(err).flat();
          setErrors(messages);
        } else {
          setErrors(["Upload failed. Please try again."]);
        }
      });
  };

  if (!authUser) return <p>Loading profile...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Profile</h1>

      {preview && (
        <img src={preview} alt="Profile" className={styles.profileImage} />
      )}

      <div className={styles.info}>
        <p>
          <strong>Name:</strong> {authUser.name}
        </p>
        <p>
          <strong>Email:</strong> {authUser.email}
        </p>
        <p>
          <strong>Date Joined:</strong> {authUser.date_joined}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Upload New Profile Picture:</label>
        <input
          type="file"
          name="profile_picture"
          onChange={handleChange}
          accept="image/*"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Upload
        </button>
      </form>

      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.map((err, i) => (
            <p key={i} className={styles.error}>
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
