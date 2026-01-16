import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // CHANGE 1: Initialize state from Local Storage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem("eshop_cart");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  // CHANGE 2: Update Local Storage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("eshop_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      }
      return [...prevItems, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQty = (item.qty || 1) + amount;
          return { ...item, qty: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.qty || 1), 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * (item.qty || 1),
      0
    );
  };

  // CHANGE 3: Only clear cart when order is actually placed
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("eshop_cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartCount,
        getCartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
