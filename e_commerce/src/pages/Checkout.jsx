import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Login from "../pages/Login";
import {
  MapPin,
  ChevronRight,
  CheckCircle,
  ShieldCheck,
  Loader2,
  Lock,
} from "lucide-react";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("default");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Redirect if empty cart
  useEffect(() => {
    if (user && cartItems.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [user, cartItems, navigate, orderPlaced]);

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    // 1. CREATE ORDER OBJECT
    const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000); // Random 6 digit ID
    const newOrder = {
      id: orderId,
      userId: user.id,
      items: cartItems,
      total: getCartTotal(),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: "Ordered", // Initial Status
      address: user.address,
      city: user.city,
      zip: user.zip,
      paymentMethod: paymentMethod,
    };

    // 2. SIMULATE API CALL
    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true); // Show Success Screen

      // 3. SAVE TO LOCAL STORAGE (Simulating Database)
      const existingOrders =
        JSON.parse(localStorage.getItem("eshop_orders")) || [];
      localStorage.setItem(
        "eshop_orders",
        JSON.stringify([newOrder, ...existingOrders])
      );

      // 4. CLEAR CART & REDIRECT
      setTimeout(() => {
        clearCart();
        navigate(`/tracking/${orderId}`); // Redirect to unique tracking page
      }, 2000);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-white">
        <div className="text-center animate__animated animate__zoomIn">
          <CheckCircle size={80} className="text-success mb-3" />
          <h2 className="fw-bold">Order Placed!</h2>
          <p className="text-muted fs-5">Thank you, {user?.fullName}.</p>
          <div className="mt-4 d-flex align-items-center justify-content-center gap-2">
            <Loader2
              className="spinner-border text-primary border-0"
              size={20}
            />
            <span className="small text-muted">Redirecting to tracking...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Navbar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
          <div
            className="card border-0 shadow-lg p-4"
            style={{ maxWidth: "400px", width: "100%" }}
          >
            <div className="text-center mb-4">
              <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex p-3 mb-3">
                <Lock size={32} />
              </div>
              <h4 className="fw-bold">Checkout Securely</h4>
              <Login />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Address Section */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-header bg-white py-3">
                <h6 className="mb-0 fw-bold">1. DELIVERY ADDRESS</h6>
              </div>
              <div className="card-body">
                <div className="p-3 border rounded border-primary bg-light">
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">{user.fullName}</span>
                    <span className="badge bg-secondary">HOME</span>
                  </div>
                  <p className="small text-muted mb-0 mt-1 d-flex gap-2">
                    <MapPin size={16} className="text-primary flex-shrink-0" />
                    {user.address
                      ? `${user.address}, ${user.city} - ${user.zip}`
                      : "Address not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h6 className="mb-0 fw-bold">2. PAYMENT METHOD</h6>
              </div>
              <div className="card-body">
                {["upi", "card", "cod"].map((method) => (
                  <div
                    key={method}
                    className={`form-check p-3 border rounded mb-2 ${
                      paymentMethod === method ? "border-primary bg-light" : ""
                    }`}
                  >
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      name="payment"
                      id={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    <label
                      className="form-check-label fw-bold text-uppercase small"
                      htmlFor={method}
                    >
                      {method === "upi"
                        ? "UPI / PhonePe / GPay"
                        : method === "card"
                        ? "Credit / Debit Card"
                        : "Cash on Delivery"}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm sticky-top"
              style={{ top: "90px" }}
            >
              <div className="card-body">
                <h6 className="text-muted fw-bold small border-bottom pb-2">
                  PRICE DETAILS
                </h6>
                <div className="d-flex justify-content-between my-3">
                  <span>Price ({cartItems.length} items)</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-success">
                  <span>Delivery</span>
                  <span>FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <h5 className="fw-bold">Total Payable</h5>
                  <h5 className="fw-bold text-primary">
                    ₹{getCartTotal().toLocaleString()}
                  </h5>
                </div>
                <button
                  className="btn btn-primary w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="spinner-border spinner-border-sm" />{" "}
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      CONFIRM ORDER <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
