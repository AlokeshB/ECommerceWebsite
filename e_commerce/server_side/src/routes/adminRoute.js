const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getDashboardAnalytics,
  getAllUsers,
  updateUserRole,
} = require("../controllers/admincontroller");

// Product management routes
router.post("/products/create", authMiddleware, adminMiddleware, createProduct);
router.put("/products/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/products/:id", authMiddleware, adminMiddleware, deleteProduct);

// Order management routes
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
router.put("/orders/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

// Analytics routes
router.get("/analytics/dashboard", authMiddleware, adminMiddleware, getDashboardAnalytics);

// User management routes
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.put("/users/:id/role", authMiddleware, adminMiddleware, updateUserRole);

module.exports = router;
