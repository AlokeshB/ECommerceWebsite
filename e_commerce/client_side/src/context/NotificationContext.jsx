import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // 1. Initialize state from localStorage (or empty array if nothing exists)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("app_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Sync to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem("app_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((message, role) => {
    const newNotification = {
      id: Date.now(),
      message,
      role,
      isRead: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearNotifications = (role) => {
    setNotifications((prev) => prev.filter((n) => n.role !== role));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};