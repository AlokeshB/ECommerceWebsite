const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addPaymentCard,
  getPaymentCards,
  getPaymentCard,
  deletePaymentCard,
  updatePaymentCard,
} = require("../controllers/paymentcardcontroller");

// All payment card routes require authentication
router.post("/", authMiddleware, addPaymentCard);
router.get("/", authMiddleware, getPaymentCards);
router.get("/:id", authMiddleware, getPaymentCard);
router.put("/:id", authMiddleware, updatePaymentCard);
router.delete("/:id", authMiddleware, deletePaymentCard);

module.exports = router;
