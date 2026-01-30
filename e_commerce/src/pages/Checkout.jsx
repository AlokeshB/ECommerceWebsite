import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import { useNotifications } from "../context/NotificationContext";
import Navbar from "../components/Navbar";
import Login from "../pages/Login";
import {
  MapPin,
  ChevronRight,
  CheckCircle,
  Loader2,
  Lock,
  PartyPopper,
  Sparkles,
} from "lucide-react";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrder();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // State Management
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSidePopup, setShowSidePopup] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [newOrderId, setNewOrderId] = useState("");

  useEffect(() => {
    if (user && cartItems.length === 0 && !showSuccessModal && !isFinalizing) {
      navigate("/cart");
    }
  }, [user, cartItems, navigate, showSuccessModal, isFinalizing]);

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    const totalAmount = getCartTotal();
    const discount = totalAmount > 1000 ? 200 : 0;
    const deliveryCharges = totalAmount > 500 ? 0 : 40;
    const finalAmount = totalAmount - discount + deliveryCharges;

    const newOrder = createOrder({
      customerName: user?.fullName || user?.name || "Customer",
      email: user?.email,
      items: cartItems,
      subtotal: totalAmount,
      discount,
      deliveryCharges,
      totalAmount: finalAmount,
      paymentMethod,
      address: user?.address || "No address provided",
      city: user?.city || "",
      zip: user?.zip || "",
      date: new Date().toLocaleDateString("en-IN"),
      total: finalAmount,
    });

    addNotification("Alert: A new order has been placed!", "admin");

    setTimeout(() => {
      setIsProcessing(false);
      setNewOrderId(newOrder.id);

      const existingOrders =
        JSON.parse(localStorage.getItem("fhub_orders")) || [];
      localStorage.setItem(
        "fhub_orders",
        JSON.stringify([newOrder, ...existingOrders]),
      );

      setShowSuccessModal(true);
      setShowSidePopup(true);
      setTimeout(() => setShowSidePopup(false), 4000);
    }, 2000);
  };

  const handleFinalRedirect = () => {
    setShowSuccessModal(false);
    setIsFinalizing(true);

    // Increased timing slightly to let the animation play out comfortably
    setTimeout(() => {
      clearCart();
      navigate(`/tracking/${newOrderId}`);
    }, 2500);
  };

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
              <div className="bg-dark text-white rounded-circle d-inline-flex p-3 mb-3">
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
    <div className="bg-light min-vh-100 position-relative">
      <Navbar />

      {/* SIDE POPUP (TOAST) */}
      <div
        className={`position-fixed top-0 end-0 m-4 p-3 bg-dark text-white rounded-3 shadow-lg animate__animated ${showSidePopup ? "animate__fadeInRight" : "animate__fadeOutRight d-none"}`}
        style={{ zIndex: 2000, maxWidth: "300px" }}
      >
        <div className="d-flex align-items-center gap-3">
          <PartyPopper className="text-warning" />
          <div>
            <div className="fw-bold small">Order Placed</div>
            <div className="small opacity-75">
              Check your email for details.
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-header bg-white py-3 text-uppercase fw-bold small">
                1. Delivery Address
              </div>
              <div className="card-body">
                <div className="p-3 border rounded border-primary bg-light">
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">
                      {user.fullName || user.name}
                    </span>
                    <span className="badge bg-secondary">HOME</span>
                  </div>
                  <p className="small text-muted mb-0 mt-1 d-flex gap-2">
                    <MapPin size={16} className="text-dark flex-shrink-0" />
                    {user.address
                      ? `${user.address}, ${user.city} - ${user.zip}`
                      : "Address not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3 text-uppercase fw-bold small">
                2. Payment Method
              </div>
              <div className="card-body">
                {["upi", "card", "cod"].map((method) => (
                  <div
                    key={method}
                    className={`form-check p-3 border rounded mb-2 ${paymentMethod === method ? "border-primary bg-light" : ""}`}
                  >
                    <input
                      className="form-check-input me-2"
                      type="radio"
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
                  <h5 className="fw-bold text-dark">
                    ₹{getCartTotal().toLocaleString()}
                  </h5>
                </div>
                <button
                  className="btn btn-dark w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
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

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div
          className="modal fade show d-block animate__animated animate__fadeIn"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg text-center p-4">
              <div className="modal-body">
                <div className="mb-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 animate__animated animate__bounceIn">
                    <CheckCircle size={60} className="text-success" />
                  </div>
                </div>
                <h2 className="fw-bold mb-2">Order Confirmed!</h2>
                <p className="text-muted mb-4">
                  Thank you, <strong>{user?.fullName || user?.name}</strong>.
                  Your style journey has begun!
                </p>
                <div className="bg-light p-3 rounded-3 mb-4 border border-dashed">
                  <span className="small text-muted d-block text-uppercase">
                    Order ID
                  </span>
                  <span className="fw-bold text-primary">#{newOrderId}</span>
                </div>
                <button
                  className="btn btn-dark w-100 py-3 fw-bold"
                  onClick={handleFinalRedirect}
                >
                  TRACK ORDER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SIMPLIFIED AESTHETIC LOADER --- */}
      {isFinalizing && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center animate__animated animate__fadeIn"
          style={{
            zIndex: 3000,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(5px)",
          }}
        >
          <div className="text-center animate__animated animate__zoomIn">
            {/* Title */}
            <h2
              className="fw-bold mb-3 d-flex align-items-center justify-content-center gap-2"
              style={{ letterSpacing: "-0.5px" }}
            >
              Processing
              <Sparkles
                className="text-warning animate__animated animate__pulse animate__infinite"
                size={28}
                strokeWidth={2.5}
              />
            </h2>

            {/* Subtitle */}
            <p className="text-muted fs-5 mb-5 opacity-75">
              Syncing your order with our delivery partners...
            </p>

            {/* Minimalist Pill Loader */}
            <div
              className="progress shadow-sm overflow-hidden"
              style={{
                height: "8px",
                width: "280px",
                margin: "0 auto",
                borderRadius: "10px",
                backgroundColor: "#e9ecef",
              }}
            >
              <div
                className="progress-bar bg-dark progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
