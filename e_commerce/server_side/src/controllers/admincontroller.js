const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const APIFeatures = require("../utils/apiFeatures");

// @route   POST /api/admin/products/create
// @desc    Create a new product
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, category, stock } = req.body;

    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice: discountPrice || null,
      category,
      stock,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, category, stock, isActive } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/admin/products/:id
// @desc    Delete product (soft delete)
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const resultPerPage = 10;

    const apiFeature = new APIFeatures(Order.find(), req.query)
      .sort()
      .pagination(resultPerPage);

    const orders = await apiFeature.query;
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      orders,
      totalOrders,
      resultPerPage,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        note: note || "Status updated by admin",
      });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private/Admin
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue
    const revenueData = await Order.aggregate([
      {
        $match: { paymentStatus: "completed" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get top products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        ordersByStatus,
        topProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const resultPerPage = 10;

    const apiFeature = new APIFeatures(User.find(), req.query)
      .search()
      .sort()
      .pagination(resultPerPage);

    const users = await apiFeature.query;
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      users,
      totalUsers,
      resultPerPage,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated",
      user,
    });
  } catch (error) {
    next(error);
  }
};
