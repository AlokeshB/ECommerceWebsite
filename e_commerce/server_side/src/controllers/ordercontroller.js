const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @route   POST /api/orders/create
// @desc    Create a new order
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Please provide shipping address",
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const user = await User.findById(req.user.id);

    // Prepare order items
    const items = cart.items.map((item) => ({
      productId: item.productId._id,
      productName: item.productId.name,
      quantity: item.quantity,
      price: item.price,
    }));

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const shippingCost = 50; // Fixed shipping cost
    const tax = Math.round(totalAmount * 0.18); // 18% GST
    
    // Generate unique order number - Format: ORDER<5-digit-random>
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ORDER${randomNumber}`;

    // Ensure all required shipping address fields are present
    // Concatenate address from street, address, and other fields if needed
    const addressParts = [];
    if (shippingAddress.street) addressParts.push(shippingAddress.street);
    if (shippingAddress.address) addressParts.push(shippingAddress.address);
    const fullAddress = addressParts.length > 0 ? addressParts.join(", ") : user.address || "Address not provided";
    
    const completeShippingAddress = {
      name: shippingAddress.fullName || user.name || "Customer",
      email: user.email,
      phone: shippingAddress.phone || user.phone || "",
      address: fullAddress,
      city: shippingAddress.city || user.city || "Unknown",
      state: shippingAddress.state || user.state || "Unknown",
      zipCode: shippingAddress.zipCode || user.zipCode || "000000",
      country: shippingAddress.country || "India",
    };

    // Create order
    const order = await Order.create({
      orderNumber,
      userId: req.user.id,
      items,
      shippingAddress: completeShippingAddress,
      totalAmount: totalAmount + shippingCost + tax,
      shippingCost,
      tax,
      paymentMethod: paymentMethod === "upi" ? "bank_transfer" : paymentMethod === "cod" ? "credit_card" : "credit_card",
      orderStatus: "pending",
      paymentStatus: "pending",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      statusHistory: [
        {
          status: "pending",
          note: "Order created",
        },
      ],
    });

    // Update product stock based on sizes
    for (let item of cart.items) {
      const product = await Product.findById(item.productId._id);
      
      if (product && product.sizes && product.sizes.length > 0) {
        // Update size-based stock
        if (item.size) {
          const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
          if (sizeIndex !== -1) {
            product.sizes[sizeIndex].stock -= item.quantity;
          }
        }
      }
      
      await product.save();
    }

    // Clear cart
    await Cart.findByIdAndDelete(cart._id);

    // Create notification for admin about new order
    try {
      const admins = await User.find({ role: "admin" });
      const adminNotificationPromises = admins.map(admin =>
        Notification.create({
          userId: admin._id,
          message: `New order #${order.orderNumber} received from ${user.name || user.email}. Amount: ₹${order.totalAmount}`,
          type: "order",
          role: "admin",
          relatedId: order._id.toString(),
        })
      );
      await Promise.all(adminNotificationPromises);
    } catch (notificationError) {
      console.error("Error creating admin notifications:", notificationError);
      // Don't fail order creation if notifications fail
    }

    // Return success response with order details
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: order.items,
        shippingAddress: order.shippingAddress,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
exports.getOrderDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Try to find by MongoDB ID first, then by orderNumber
    let order = await Order.findById(id).populate("userId", "name email");
    
    if (!order) {
      // Try to find by orderNumber
      order = await Order.findOne({ orderNumber: id }).populate("userId", "name email");
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is the order owner or admin
    if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/orders/my-orders
// @desc    Get all orders of logged-in user
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is the order owner
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    if (order.orderStatus !== "pending" && order.orderStatus !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled in current status",
      });
    }

    // Refund stock based on sizes
    for (let item of order.items) {
      const product = await Product.findById(item.productId);
      
      if (product && product.sizes && product.sizes.length > 0) {
        // Refund size-based stock
        if (item.size) {
          const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
          if (sizeIndex !== -1) {
            product.sizes[sizeIndex].stock += item.quantity;
          }
        }
      }
      
      await product.save();
    }

    order.orderStatus = "cancelled";
    order.paymentStatus = "refunded";
    order.statusHistory.push({
      status: "cancelled",
      note: "Order cancelled by user",
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/orders/track/:id
// @desc    Track order
// @access  Public
exports.trackOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Try to find by MongoDB ID first, then by orderNumber
    let order = await Order.findById(id);
    
    if (!order) {
      // Try to find by orderNumber
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        statusHistory: order.statusHistory,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        items: order.items,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
