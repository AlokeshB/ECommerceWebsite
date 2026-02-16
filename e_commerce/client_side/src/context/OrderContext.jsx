import React, { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const localOrders = localStorage.getItem("fhub_orders");
      return localOrders ? JSON.parse(localOrders) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("fhub_orders", JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: "Processing",
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  const getUserOrders = (email) => {
    return orders.filter((order) => order.email === email);
  };

  const getAllOrders = () => orders;

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getUserOrders,
        getAllOrders,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
