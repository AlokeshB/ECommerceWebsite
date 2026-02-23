import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const API_URL = "http://localhost:5000/api";

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from API when user is logged in
  useEffect(() => {
    if (token && user) {
      fetchCart();
    }
  }, [token, user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success) {
        setCartItems(data.cart.items || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!token) {
      console.error("User not authenticated");
      return { success: false, error: "Please login first" };
    }

    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id || product.id,
          quantity: product.qty || 1,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCartItems(data.cart.items || []);
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return { success: false };

    try {
      const itemId = cartItems.find(item => item.productId._id === productId || item.productId === productId)?._id;
      if (!itemId) return { success: false };

      const response = await fetch(`${API_URL}/cart/remove/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      
      if (data.success) {
        setCartItems(data.cart.items || []);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error removing from cart:", error);
      return { success: false };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token || quantity < 1) return { success: false };

    try {
      const itemId = cartItems.find(item => item.productId._id === productId || item.productId === productId)?._id;
      if (!itemId) return { success: false };

      const response = await fetch(`${API_URL}/cart/update/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCartItems(data.cart.items || []);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      return { success: false };
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const clearCart = async () => {
    if (!token) return { success: false };

    try {
      const response = await fetch(`${API_URL}/cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      
      if (data.success) {
        setCartItems([]);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartCount,
        getCartTotal,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
