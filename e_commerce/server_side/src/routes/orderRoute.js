const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createOrder,
  getOrderDetail,
  getMyOrders,
  cancelOrder,
  trackOrder,
} = require("../controllers/ordercontroller");

// Public route for tracking (no auth required) - MUST BE BEFORE /:id ROUTE
router.get("/track/:id", trackOrder);

// All other order routes require authentication
router.post("/create", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderDetail);
router.put("/:id/cancel", authMiddleware, cancelOrder);

module.exports = router;
