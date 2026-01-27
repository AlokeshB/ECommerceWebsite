import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, Clock } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export const NotificationBell = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, clearNotifications } = useNotifications();
  const dropdownRef = useRef(null);

  // Filter notifications based on role (Admin vs User)
  const roleNotifications = notifications.filter((n) => n.role === role);
  const unreadCount = roleNotifications.filter((n) => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Bell Icon & Badge */}
      <button
        className="btn btn-link text-dark p-0 border-0 shadow-none position-relative"
        onClick={() => setIsOpen(!isOpen)}
        style={{ transition: "transform 0.2s" }}
      >
        <Bell size={22} className={isOpen ? "text-primary" : ""} />
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{
              fontSize: "10px",
              padding: "4px 6px",
              border: "2px solid white",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Popup */}
      {isOpen && (
        <div
          className="position-absolute bg-white shadow-lg rounded-3 border"
          style={{
            top: "40px",
            right: role === "admin" ? "0" : "-10px",
            width: "320px",
            zIndex: 1100,
            maxHeight: "450px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
            <h6 className="mb-0 fw-bold">Notifications</h6>
            {roleNotifications.length > 0 && (
              <button
                className="btn btn-sm text-danger p-0 small"
                onClick={() => clearNotifications(role)}
              >
                Clear All
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-auto" style={{ maxHeight: "380px" }}>
            {roleNotifications.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <Bell size={30} className="mb-2 opacity-25" />
                <p className="small mb-0">No notifications yet</p>
              </div>
            ) : (
              roleNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 border-bottom position-relative notification-item ${
                    !n.isRead ? "bg-light text-dark" : "text-muted opacity-75"
                  }`}
                  style={{ transition: "background 0.3s" }}
                >
                  <div className="d-flex justify-content-between gap-2">
                    <p className={`small mb-1 ${!n.isRead ? "fw-bold" : ""}`}>
                      {n.message}
                    </p>
                    {!n.isRead && (
                      <button
                        className="btn btn-sm btn-outline-success p-1 border-0"
                        onClick={() => markAsRead(n.id)}
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                  <div
                    className="d-flex align-items-center gap-1 text-muted"
                    style={{ fontSize: "10px" }}
                  >
                    <Clock size={10} />
                    {n.timestamp}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
