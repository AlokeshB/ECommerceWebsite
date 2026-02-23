const PaymentCard = require("../models/PaymentCard");

// @route   POST /api/payment-cards
// @desc    Add a new payment card
// @access  Private
exports.addPaymentCard = async (req, res, next) => {
  try {
    const { cardNumber, cardHolder, expiryMonth, expiryYear, cvv, isDefault } = req.body;

    // Validation
    if (!cardNumber || !cardHolder || !expiryMonth || !expiryYear || !cvv) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Create payment card
    const paymentCard = await PaymentCard.create({
      userId: req.user.id,
      cardNumber,
      cardHolder,
      expiryMonth,
      expiryYear,
      cvv,
      isDefault: isDefault || false,
    });

    res.status(201).json({
      success: true,
      message: "Payment card added successfully",
      card: paymentCard,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/payment-cards
// @desc    Get all payment cards for logged-in user
// @access  Private
exports.getPaymentCards = async (req, res, next) => {
  try {
    const cards = await PaymentCard.find({ userId: req.user.id, isActive: true });

    res.status(200).json({
      success: true,
      cards,
      count: cards.length,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/payment-cards/:id
// @desc    Get single payment card
// @access  Private
exports.getPaymentCard = async (req, res, next) => {
  try {
    const card = await PaymentCard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Payment card not found",
      });
    }

    // Check if card belongs to user
    if (card.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      card,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/payment-cards/:id
// @desc    Delete payment card
// @access  Private
exports.deletePaymentCard = async (req, res, next) => {
  try {
    const card = await PaymentCard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Payment card not found",
      });
    }

    // Check if card belongs to user
    if (card.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await PaymentCard.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Payment card deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/payment-cards/:id
// @desc    Update payment card
// @access  Private
exports.updatePaymentCard = async (req, res, next) => {
  try {
    let card = await PaymentCard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Payment card not found",
      });
    }

    // Check if card belongs to user
    if (card.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Update fields
    const { cardNumber, cardHolder, expiryMonth, expiryYear, cvv, isDefault } = req.body;

    if (cardNumber) card.cardNumber = cardNumber;
    if (cardHolder) card.cardHolder = cardHolder;
    if (expiryMonth) card.expiryMonth = expiryMonth;
    if (expiryYear) card.expiryYear = expiryYear;
    if (cvv) card.cvv = cvv;
    if (isDefault !== undefined) card.isDefault = isDefault;

    card = await card.save();

    res.status(200).json({
      success: true,
      message: "Payment card updated successfully",
      card,
    });
  } catch (error) {
    next(error);
  }
};
