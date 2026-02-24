const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/cart/add
// @route   POST /api/cart/add
// @desc    Add product to cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, size } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please provide product ID and quantity",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock based on size if product has sizes
    if (product.sizes && product.sizes.length > 0) {
      if (!size) {
        return res.status(400).json({
          success: false,
          message: "Please select a size",
        });
      }

      const sizeData = product.sizes.find(s => s.size === size);
      if (!sizeData) {
        return res.status(400).json({
          success: false,
          message: "Size not available",
        });
      }

      if (sizeData.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock for selected size",
        });
      }
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        size: size || undefined,
        price: product.effectivePrice || product.price,
      });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    const product = await Product.findById(cartItem.productId);

    // Check size-based stock if product has sizes
    if (product.sizes && product.sizes.length > 0 && cartItem.size) {
      const sizeData = product.sizes.find(s => s.size === cartItem.size);
      if (!sizeData || sizeData.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock for selected size",
        });
      }
    }

    cartItem.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cartItem.deleteOne();
    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // If cart doesn't exist, create an empty one
      cart = await Cart.create({ userId: req.user.id, items: [] });
    } else {
      // Clear existing cart items
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
