const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
  markAllAsRead,
  getUnreadCount,
} = require("../controllers/notificationcontroller");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all notifications
router.get("/", getNotifications);

// Create new notification
router.post("/", createNotification);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Mark all as read
router.patch("/mark-all-read", markAllAsRead);

// Mark individual notification as read
router.patch("/:id/read", markAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

module.exports = router;
