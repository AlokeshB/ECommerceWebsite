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
  Zap,
} from "lucide-react";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, fetchCart, loading } = useCart();
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
  const [addresses, setAddresses] = useState([]);
  const [paymentCards, setPaymentCards] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);

  // Fetch cart on component mount if not already loaded
  useEffect(() => {
    if (user && cartItems.length === 0 && !loading) {
      fetchCart();
    }
  }, [user, fetchCart, loading]);

  useEffect(() => {
    // Only redirect to cart if cart is truly empty and fully loaded
    // But NOT if we just came from Buy Now flow
    const isBuyNowFlow = sessionStorage.getItem("isBuyNowFlow") === "true";
    if (user && cartItems.length === 0 && !loading && !showSuccessModal && !isFinalizing && !isBuyNowFlow) {
      navigate("/cart");
    }
    // Clear the flag after checking
    if (isBuyNowFlow) {
      sessionStorage.removeItem("isBuyNowFlow");
    }
  }, [user, cartItems, navigate, showSuccessModal, isFinalizing, loading]);

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const authToken = sessionStorage.getItem("authToken");
        if (!authToken) return;

        const response = await fetch("http://localhost:5000/api/auth/addresses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();
        if (data.success && Array.isArray(data.addresses)) {
          setAddresses(data.addresses);
          // Set first address as default
          if (data.addresses.length > 0) {
            setSelectedAddress(data.addresses[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    if (user) fetchAddresses();
  }, [user]);

  // Fetch payment cards
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const authToken = sessionStorage.getItem("authToken");
        if (!authToken) return;

        const response = await fetch("http://localhost:5000/api/payment-cards", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();
        if (data.success && Array.isArray(data.paymentCards)) {
          setPaymentCards(data.paymentCards);
          // Set first card as default
          if (data.paymentCards.length > 0) {
            setSelectedCard(data.paymentCards[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching payment cards:", error);
      } finally {
        setLoadingCards(false);
      }
    };

    if (user && paymentMethod === "card") fetchCards();
  }, [user, paymentMethod]);

  const handlePlaceOrder = async () => {
    if (!user) {
      addNotification("Please login to place an order", "error");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      addNotification("Your cart is empty", "error");
      return;
    }

    if (paymentMethod === "card" && !selectedCard) {
      addNotification("Please select a payment card", "error");
      return;
    }

    setIsProcessing(true);

    try {
      // Get selected address or use user default
      const addressToUse = addresses.find(a => a._id === selectedAddress) || addresses[0];

      // Prepare order data
      const orderData = {
        shippingAddress: addressToUse ? {
          fullName: addressToUse.fullName || user?.name || user?.fullName,
          address: addressToUse.address,
          city: addressToUse.city,
          state: addressToUse.state,
          zipCode: addressToUse.zipCode,
          country: addressToUse.country || "India",
          phone: addressToUse.phone,
        } : {
          fullName: user?.name || user?.fullName || "Customer",
          address: user?.address || "",
          city: user?.city || "",
          state: user?.state || "",
          zipCode: user?.zipCode || "",
          country: user?.country || "India",
          phone: user?.phone || "",
        },
        paymentMethod: paymentMethod,
        paymentCard: selectedCard || undefined,
      };

      // Call backend API
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!data.success) {
        setIsProcessing(false);
        addNotification(data.message || "Failed to place order", "error");
        return;
      }

      // Order placed successfully - extract orderNumber from response
      console.log("Order response:", data.order); // Debug log
      const orderNumber = data.order?.orderNumber;
      
      if (!orderNumber) {
        console.error("No orderNumber in response:", data.order);
        setIsProcessing(false);
        addNotification("Error: Order number not received", "error");
        return;
      }
      
      setNewOrderId(orderNumber);
      addNotification("Order placed successfully!", "success");

      setTimeout(() => {
        setIsProcessing(false);
        setShowSuccessModal(true);
        setShowSidePopup(true);
        setTimeout(() => setShowSidePopup(false), 4000);
      }, 1000);
    } catch (error) {
      setIsProcessing(false);
      console.error("Error placing order:", error);
      addNotification("Error placing order. Please try again.", "error");
    }
  };

  const handleFinalRedirect = () => {
    setShowSuccessModal(false);
    setIsFinalizing(true);

    // Clear cart via API
    const authToken = sessionStorage.getItem("authToken");
    fetch("http://localhost:5000/api/cart/clear", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).catch((error) => console.error("Error clearing cart:", error));

    // Redirect to tracking page with order ID
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
                {loadingAddresses ? (
                  <p className="text-muted">Loading addresses...</p>
                ) : addresses.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`p-4 border-2 rounded-3 cursor-pointer transition-all ${
                          selectedAddress === address._id
                            ? "border-primary bg-primary bg-opacity-10"
                            : "border-light bg-white"
                        }`}
                        onClick={() => setSelectedAddress(address._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-start gap-3">
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddress === address._id}
                              onChange={() => setSelectedAddress(address._id)}
                              className="mt-1"
                              style={{ cursor: "pointer" }}
                            />
                            <div>
                              <h6 className="fw-bold mb-1" style={{ fontSize: "15px" }}>
                                {address.fullName || "Address"}
                              </h6>
                              <p className="text-muted small mb-2">
                                {address.type || "HOME"}
                              </p>
                            </div>
                          </div>
                          <span className="badge bg-secondary">{address.type || "HOME"}</span>
                        </div>
                        <div className="ms-5">
                          <p className="small mb-2 d-flex gap-2">
                            <MapPin size={16} className="text-primary flex-shrink-0 mt-1" />
                            <span className="text-dark">
                              {address.address || address.street}, {address.city}, {address.state} - {address.zipCode}
                            </span>
                          </p>
                          <p className="small mb-0">
                            <strong>📞 {address.phone || user?.phone || "Not provided"}</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border-2 border-primary rounded-3 bg-primary bg-opacity-10">
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <input
                        type="radio"
                        name="address"
                        checked={true}
                        readOnly
                        className="mt-1"
                      />
                      <div>
                        <h6 className="fw-bold mb-1" style={{ fontSize: "15px" }}>
                          {user.fullName || user.name}
                        </h6>
                        <p className="text-muted small mb-0">HOME</p>
                      </div>
                    </div>
                    <div className="ms-5">
                      <p className="small mb-2 d-flex gap-2">
                        <MapPin size={16} className="text-primary flex-shrink-0 mt-1" />
                        <span className="text-dark">
                          {user.address
                            ? `${user.address}, ${user.city || ""}, ${user.state || ""} - ${user.zipCode || ""}`
                            : "No address provided. Please add an address in your profile."}
                        </span>
                      </p>
                      {user.phone && (
                        <p className="small mb-0">
                          <strong>📞 {user.phone}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3 text-uppercase fw-bold small">
                2. Payment Method
              </div>
              <div className="card-body">
                {["upi", "card", "cod"].map((method) => (
                  <div key={method}>
                    <div
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

                    {/* Card Selection */}
                    {paymentMethod === "card" && method === "card" && (
                      <div className="ms-4 mb-3">
                        {loadingCards ? (
                          <p className="text-muted small">Loading saved cards...</p>
                        ) : paymentCards.length > 0 ? (
                          <div className="d-flex flex-column gap-2">
                            {paymentCards.map((card) => (
                              <div
                                key={card._id}
                                className={`p-3 border rounded cursor-pointer transition-all ${
                                  selectedCard === card._id
                                    ? "border-primary bg-light"
                                    : "border-gray"
                                }`}
                                onClick={() => setSelectedCard(card._id)}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <input
                                      type="radio"
                                      name="card"
                                      checked={selectedCard === card._id}
                                      onChange={() => setSelectedCard(card._id)}
                                      className="me-2"
                                    />
                                    <span className="small">
                                      {card.cardHolderName} - ****
                                      {card.cardNumber?.slice(-4)}
                                    </span>
                                  </div>
                                  <span className="small text-muted">
                                    Exp: {card.expiryMonth}/{card.expiryYear}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted small">
                            No saved cards. Please add a card in your profile.
                          </p>
                        )}
                      </div>
                    )}
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
                  <span>Discount</span>
                  <span>- ₹{(getCartTotal() > 1000 ? 200 : 0).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Delivery Fee</span>
                  <span className={getCartTotal() > 500 || getCartTotal() === 0 ? "text-success" : "text-dark"}>
                    {getCartTotal() > 500 || getCartTotal() === 0 ? "FREE" : "₹50"}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Platform Fee</span>
                  <span>₹{getCartTotal() > 0 ? 10 : 0}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <h5 className="fw-bold">Total Payable</h5>
                  <h5 className="fw-bold text-dark">
                    ₹{(getCartTotal() - (getCartTotal() > 1000 ? 200 : 0) + (getCartTotal() > 500 || getCartTotal() === 0 ? 0 : 50) + (getCartTotal() > 0 ? 10 : 0)).toLocaleString()}
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
                <h2 className="fw-bold mb-1">Thank You!</h2>
                <h3 className="h5 text-muted mb-3">Order Confirmed</h3>
                <p className="text-muted mb-4">
                  Thank you, <strong>{user?.fullName || user?.name}</strong>.
                  Your order has been placed successfully. A confirmation email has been sent to your registered email address.
                </p>
                <div className="bg-light p-4 rounded-3 mb-4 border-2" style={{ borderColor: "#28a745" }}>
                  <span className="small text-muted d-block text-uppercase mb-2">
                    Order ID
                  </span>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <span className="fw-bold text-success fs-5">#{newOrderId}</span>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => {
                        navigator.clipboard.writeText(newOrderId);
                        addNotification("Order ID copied to clipboard!", "success");
                      }}
                      title="Copy Order ID"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <p className="text-muted small mb-4">
                  Keep this Order ID for reference. You can use it to track your order status anytime.
                </p>
                <button
                  className="btn btn-dark w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                  onClick={handleFinalRedirect}
                >
                  <Zap size={18} />
                  TRACK YOUR ORDER
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
