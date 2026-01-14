import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from local storage on startup (Optional but good for UX)
  useEffect(() => {
    const savedCart = localStorage.getItem('eshop_cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Save to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('eshop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      // Check if item already exists
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Increment quantity
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      // Add new item with qty 1
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  // Helper to get total count of items (e.g. 2 shirts + 1 pant = 3 items)
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.qty, 0);
  };

  // Helper to get total price
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getCartCount, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};