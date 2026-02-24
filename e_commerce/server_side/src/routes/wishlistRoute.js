const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkIfInWishlist,
  clearWishlist,
} = require("../controllers/wishlistcontroller");

// All routes require authentication
router.use(authMiddleware);

// Get wishlist
router.get("/", getWishlist);

// Add to wishlist
router.post("/add", addToWishlist);

// Check if in wishlist
router.post("/check", checkIfInWishlist);

// Remove from wishlist
router.delete("/remove/:productId", removeFromWishlist);

// Clear wishlist
router.delete("/clear", clearWishlist);

module.exports = router;
