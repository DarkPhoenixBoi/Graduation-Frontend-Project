import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext"; // 👈 import AuthContext

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // 👈 get the logged-in user
  const userId = user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = "http://localhost:8000";

  useEffect(() => {
    if (!userId) {
      setCartItems([]); // Clear cart if user logs out
      return;
    }
    fetchCartItems();
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      const response = await api.get(`/api/cart/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Failed to fetch cart items", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (book) => {
    if (!userId) return; // Prevent unauthenticated access

    try {
      const response = await api.post(`/api/cart`, {
        user_id: userId,
        book_id: book.id,
      });
      setCartItems((prev) => [...prev, { ...response.data, book }]);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("Book already in cart");
      } else {
        console.error("Failed to add to cart", error);
      }
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/api/cart/${cartItemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        setCartItems,
        fetchCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
