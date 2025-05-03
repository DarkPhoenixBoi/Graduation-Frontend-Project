import React from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./pages/Unauthorized";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Library from "./pages/Library";
import VocalizePage from "./pages/VocalizePage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import BookPage from "./pages/BookPage";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import ManageBooks from "./pages/Dashboard/ManageBooks";
import ManageTags from "./pages/Dashboard/ManageTags";
import AssignTags from "./pages/Dashboard/AssignTags";
import ManageReviews from "./pages/Dashboard/ManageReviews";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import CartPage from "./pages/CartPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import "./App.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <div className="pageWrapper">
            <Navbar isDashboard />
            <main className="mainContent">
              <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/browse" element={<Browse />} />

                {/* User-only pages */}
                <Route
                  element={<RequireAuth allowedRoles={["user", "admin"]} />}
                >
                  <Route path="/browse/book/:id" element={<BookPage />} />
                  <Route path="/vocalize" element={<VocalizePage />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route
                    path="/checkout-success"
                    element={<CheckoutSuccess />}
                  />
                </Route>

                {/* Admin-only pages */}
                <Route element={<RequireAuth allowedRoles={["admin"]} />}>
                  {/* Dashboard Routes */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route path="books" element={<ManageBooks />} />
                    <Route path="tags" element={<ManageTags />} />
                    <Route path="assign-tags" element={<AssignTags />} />
                    <Route path="reviews" element={<ManageReviews />} />
                  </Route>
                </Route>
                <Route path="/*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
