import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch notifications from backend on app initialization
  useEffect(() => {
    fetchNotificationsFromBackend();
  }, []);

  // Fetch notifications from backend API
  const fetchNotificationsFromBackend = async () => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) {
        setIsInitialized(true);
        return;
      }

      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.notifications)) {
        const formattedNotifications = data.notifications.map((notif) => ({
          id: notif._id,
          message: notif.message,
          role: notif.role || "user",
          isRead: notif.isRead || false,
          timestamp: notif.createdAt
            ? new Date(notif.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
          _id: notif._id, // Store MongoDB ID for backend operations
        }));
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications from backend:", error);
      // Keep existing notifications from localStorage on error
    } finally {
      setIsInitialized(true);
    }
  };

  const addNotification = useCallback((message, role = "user") => {
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

    // Also save to backend if user is authenticated
    saveNotificationToBackend(message, role);
  }, []);

  // Save notification to backend
  const saveNotificationToBackend = async (message, role) => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) return;

      await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          message,
          role,
        }),
      });
    } catch (error) {
      console.error("Error saving notification to backend:", error);
    }
  };

  const markAsRead = useCallback(async (id) => {
    // Update local state
    const notif = notifications.find((n) => n.id === id || n._id === id);
    if (notif) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id || n._id === id ? { ...n, isRead: true } : n
        )
      );

      // Update in backend if MongoDB ID exists
      if (notif._id) {
        try {
          const authToken = sessionStorage.getItem("authToken");
          if (authToken) {
            await fetch(
              `http://localhost:5000/api/notifications/${notif._id}/read`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
          }
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      }
    }
  }, [notifications]);

  const deleteNotification = useCallback(async (id) => {
    const notif = notifications.find((n) => n.id === id || n._id === id);
    if (notif && notif._id) {
      // Remove from local state
      setNotifications((prev) =>
        prev.filter((n) => n.id !== id && n._id !== id)
      );

      // Delete from backend if MongoDB ID exists
      try {
        const authToken = sessionStorage.getItem("authToken");
        if (authToken) {
          await fetch(
            `http://localhost:5000/api/notifications/${notif._id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
        }
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    } else {
      // For local-only notifications (no _id), just remove from state
      setNotifications((prev) =>
        prev.filter((n) => n.id !== id && n._id !== id)
      );
    }
  }, [notifications]);

  const clearNotifications = (role) => {
    setNotifications((prev) => prev.filter((n) => n.role !== role));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        deleteNotification,
        clearNotifications,
        fetchNotificationsFromBackend,
        isInitialized,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};