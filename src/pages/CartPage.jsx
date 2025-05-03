import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import styles from "./CartPage.module.css"; // Assuming you have a CSS module for styles

function formatPrice(amount) {
  if (typeof amount !== "number") {
    amount = Number(amount) || 0;
  }
  return `$${amount.toFixed(2)}`;
}

function CartPage() {
  const { cartItems, setCartItems, removeFromCart } = useCart();
  const [removingId, setRemovingId] = useState(null); // 👈 to track which item is being removed

  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate(); // To redirect after checkout

  const baseUrl = "http://localhost:8000"; // or use from .env

  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (Number(item?.book?.price) || 0), 0)
    : 0;

  const handleRemove = async (id) => {
    try {
      setRemovingId(id);
      await removeFromCart(id);
    } finally {
      setRemovingId(null);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setCheckingOut(true);
    console.log("Checking out with items:", cartItems);
    try {
      for (const item of cartItems) {
        await api.post(`/api/purchases`, {
          user_id: item.user_id, // Replace with your real user ID
          book_id: item.book.id, // careful: use `item.book.id`
          type: item?.book?.availability?.toLowerCase(), // or "rent" if renting
        });
        await removeFromCart(item.id);
      }
      // After successful checkout
      setCartItems([]); // Clear cart

      navigate("/checkout-success"); // Redirect to success page (optional)
    } catch (error) {
      console.error("Checkout failed:", error);
      // Optionally show an error message
    } finally {
      setCheckingOut(false);
    }
  };
  useEffect(() => {
    console.log("Cart items updated:", cartItems);
  }, [cartItems]);
  return (
    <div className={styles.cartWrapper}>
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <div className={styles.cartItemTitle}>{item.book?.title}</div>
                <div className={styles.cartItemActions}>
                  <span>{formatPrice(item.book?.price)}</span>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemove(item.id)}
                    disabled={removingId === item.id} // 👈 disable if it's being removed
                  >
                    {removingId === item.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.totalPrice}>
            Total: {formatPrice(totalPrice)}
          </div>

          <button
            className={styles.checkoutButton}
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? "Processing..." : "Proceed to Checkout"}
          </button>
        </>
      )}
    </div>
  );
}

export default CartPage;
