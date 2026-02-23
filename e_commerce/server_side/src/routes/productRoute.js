const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllProducts,
  getProductDetail,
  getProductsByCategory,
  searchProducts,
  addReview,
  getProductReviews,
  getCategories,
} = require("../controllers/productcontroller");

// Public routes
router.get("/", getAllProducts);
router.get("/categories", getCategories);
router.get("/category/:category", getProductsByCategory);
router.get("/search/:keyword", searchProducts);
router.get("/:id", getProductDetail);
router.get("/:id/reviews", getProductReviews);

// Private routes
router.post("/:id/review", authMiddleware, addReview);

module.exports = router;
