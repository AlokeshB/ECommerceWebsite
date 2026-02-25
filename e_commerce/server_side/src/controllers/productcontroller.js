const Product = require("../models/Product");
const APIFeatures = require("../utils/apiFeatures");

// @route   GET /api/products
// @desc    Get all products with search, filter, sort
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const resultPerPage = 10;
    const productsCount = await Product.countDocuments();

    const apiFeature = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()
      .sort()
      .pagination(resultPerPage);

    const products = await apiFeature.query;

    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
exports.getProductDetail = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/category/:category
// @desc    Get products by category (case-insensitive)
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    // Use case-insensitive regex to match category
    const categoryRegex = new RegExp(`^${category}$`, "i");

    const apiFeature = new APIFeatures(
      Product.find({ category: categoryRegex, isActive: true }),
      req.query
    )
      .search()
      .sort()
      .pagination(10);

    const products = await apiFeature.query;

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/search/:keyword
// @desc    Search products
// @access  Public
exports.searchProducts = async (req, res, next) => {
  try {
    const { keyword } = req.params;

    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ],
      isActive: true,
    }).limit(20);

    res.status(200).json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/products/:id/review
// @desc    Add review to product (only allowed if user has delivered order for this product)
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user has already reviewed this product
    const existingReview = product.reviews.find(
      (review) => review.userId.toString() === req.user.id
    );
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Check if user has a delivered order for this product
    const Order = require("../models/Order");
    const userDeliveredOrder = await Order.findOne({
      userId: req.user.id,
      orderStatus: "delivered",
      "items.productId": productId,
    });

    if (!userDeliveredOrder) {
      return res.status(403).json({
        success: false,
        message: "You can only review products you have purchased and received",
      });
    }

    const review = {
      userId: req.user.id,
      userName: req.user.name,
      rating,
      comment: comment || "",
    };

    product.reviews.push(review);

    // Recalculate rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;
    product.numReviews = product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/:id/reviews
// @desc    Get all reviews of a product
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
      totalReviews: product.numReviews,
      averageRating: product.rating,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/category/list/all
// @desc    Get all unique categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};
