const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartcontroller");

// All cart routes are private
router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.put("/update/:itemId", authMiddleware, updateCartItem);
router.delete("/remove/:itemId", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
