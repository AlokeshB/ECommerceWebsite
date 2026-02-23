const mongoose = require("mongoose");

const paymentCardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardNumber: {
      type: String,
      required: [true, "Card number is required"],
      trim: true,
    },
    cardHolder: {
      type: String,
      required: [true, "Cardholder name is required"],
      trim: true,
    },
    expiryMonth: {
      type: String,
      required: [true, "Expiry month is required"],
    },
    expiryYear: {
      type: String,
      required: [true, "Expiry year is required"],
    },
    cvv: {
      type: String,
      required: [true, "CVV is required"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PaymentCard", paymentCardSchema);
