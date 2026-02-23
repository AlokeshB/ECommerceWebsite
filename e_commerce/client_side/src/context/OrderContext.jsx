import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const API_URL = "http://localhost:5000/api";

  // Fetch orders from backend on initialization
  useEffect(() => {
    fetchOrdersFromBackend();
  }, []);

  // Fetch orders from backend
  const fetchOrdersFromBackend = async () => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) {
        setIsInitialized(true);
        return;
      }

      const response = await fetch(`${API_URL}/orders/my-orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders from backend:", error);
    } finally {
      setIsInitialized(true);
    }
  };

  const createOrder = useCallback(async (orderData) => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) return null;

      const response = await fetch(`${API_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (data.success) {
        setOrders((prev) => [data.order, ...prev]);
        return data.order;
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
    return null;
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) return;

      const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, orderStatus: status } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }, []);

  const getOrderById = useCallback((orderId) => {
    return orders.find((order) => order._id === orderId);
  }, [orders]);

  const getUserOrders = useCallback(() => {
    return orders;
  }, [orders]);

  const getAllOrders = useCallback(() => orders, [orders]);

  const deleteOrder = useCallback(async (orderId) => {
    try {
      // If you have a delete endpoint, use it
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }, []);

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
        fetchOrdersFromBackend,
        isInitialized,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
