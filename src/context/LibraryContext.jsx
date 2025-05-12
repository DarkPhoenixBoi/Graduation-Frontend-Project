import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

export const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = async () => {
    try {
      const response = await api.get(`/api/library`);
      setLibrary(response.data);
    } catch (error) {
      console.error("Failed to fetch library:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToLibrary = async (book) => {
    try {
      const response = await api.post(`/api/purchases`, {
        book_id: book.id,
        type: "purchase",
      });
      await fetchLibrary();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.warn("Book already in library.");
      } else {
        console.error("Failed to add to library:", error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchLibrary();
    }
  }, []);

  return (
    <LibraryContext.Provider
      value={{ library, setLibrary, loading, fetchLibrary, addToLibrary }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
