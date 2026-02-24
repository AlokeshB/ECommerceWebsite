const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ userId }).populate("items.productId");

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is empty",
        wishlist: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/wishlist/add
// @desc    Add product to wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a product ID",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        items: [{ productId }],
      });
    } else {
      // Check if product already in wishlist
      const exists = wishlist.items.find(
        (item) => item.productId.toString() === productId
      );

      if (exists) {
        return res.status(200).json({
          success: true,
          message: "Product already in wishlist",
          wishlist,
        });
      }

      wishlist.items.push({ productId });
      await wishlist.save();
    }

    await wishlist.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/wishlist/remove/:productId
// @desc    Remove product from wishlist
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/wishlist/check
// @desc    Check if product is in wishlist
// @access  Private
exports.checkIfInWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        inWishlist: false,
      });
    }

    const exists = wishlist.items.find(
      (item) => item.productId.toString() === productId
    );

    res.status(200).json({
      success: true,
      inWishlist: !!exists,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/wishlist/clear
// @desc    Clear entire wishlist
// @access  Private
exports.clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Wishlist.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};
