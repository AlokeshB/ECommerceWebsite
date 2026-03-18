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

router.post("/:id/credit-coins", authMiddleware, async (req, res) => {
  try {
    const creditFashioCoins = require("../controllers/ordercontroller").creditFashioCoins;
    const result = await creditFashioCoins(req.params.id);
    if (result) {
      res.json({ success: true, message: "Coins credited successfully" });
    } else {
      res.json({ success: false, message: "Failed to credit coins or already processed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
