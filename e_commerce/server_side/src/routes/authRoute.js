const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/authcontroller");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Private routes
router.get("/profile", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

// Address routes
router.post("/addresses", authMiddleware, addAddress);
router.get("/addresses", authMiddleware, getAddresses);
router.put("/addresses/:addressId", authMiddleware, updateAddress);
router.delete("/addresses/:addressId", authMiddleware, deleteAddress);

module.exports = router;
