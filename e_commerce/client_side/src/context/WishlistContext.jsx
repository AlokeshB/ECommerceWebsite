import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const WishlistContext = createContext();
const API_URL = "http://localhost:5000/api";

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("authToken");

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setWishlistItems(data.wishlist?.items || []);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch wishlist from API on mount
  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token, fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!token) {
      return { success: false, error: "Please login first" };
    }

    try {
      const response = await fetch(`${API_URL}/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (data.success) {
        setWishlistItems(data.wishlist?.items || []);
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!token) return { success: false };

    try {
      const response = await fetch(`${API_URL}/wishlist/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setWishlistItems(data.wishlist?.items || []);
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      return { success: false };
    }
  };

  const checkIfInWishlist = async (productId) => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/wishlist/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      return data.inWishlist || false;
    } catch (err) {
      console.error("Error checking wishlist:", err);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item.productId._id === productId || item.productId === productId
    );
  };

  const clearWishlist = async () => {
    if (!token) return { success: false };

    try {
      const response = await fetch(`${API_URL}/wishlist/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setWishlistItems([]);
        return { success: true };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        checkIfInWishlist,
        clearWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
