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

// All order routes require authentication
router.post("/create", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderDetail);
router.put("/:id/cancel", authMiddleware, cancelOrder);

// Public route for tracking (no auth required)
router.get("/track/:id", trackOrder);

module.exports = router;
