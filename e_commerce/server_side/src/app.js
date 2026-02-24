const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/errorMiddleware");

// Import routes
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const adminRoute = require("./routes/adminRoute");
const notificationRoute = require("./routes/notificationRoute");
const paymentcardRoute = require("./routes/paymentcardRoute");
const wishlistRoute = require("./routes/wishlistRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/admin", adminRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/payment-cards", paymentcardRoute);
app.use("/api/wishlist", wishlistRoute);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-Commerce API Server",
    version: "1.0.0",
    documentation: "/api/docs",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
