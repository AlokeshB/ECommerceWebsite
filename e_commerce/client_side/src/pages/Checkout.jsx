import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useBuyNow } from "../context/BuyNowContext";
import { useAuth } from "../context/AuthContext";
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
  const { buyNowItem, clearBuyNow } = useBuyNow();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // State Management
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSidePopup, setShowSidePopup] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [newOrderId, setNewOrderId] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [paymentCards, setPaymentCards] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);

  // Determine if this is a Buy Now flow
  const isBuyNowCheckout = !!buyNowItem;
  const checkoutItems = useMemo(() => isBuyNowCheckout ? [buyNowItem] : cartItems, [isBuyNowCheckout, buyNowItem, cartItems]);
  const checkoutTotal = useMemo(() => {
    if (isBuyNowCheckout && buyNowItem) {
      // Calculate effective price (after discount)
      if (buyNowItem.discountPrice) {
        return buyNowItem.discountPrice * (buyNowItem.quantity || 1);
      } else if (buyNowItem.discountPercentage && buyNowItem.price) {
        return (buyNowItem.price * (1 - buyNowItem.discountPercentage / 100)) * (buyNowItem.quantity || 1);
      } else if (buyNowItem.price) {
        return buyNowItem.price * (buyNowItem.quantity || 1);
      }
      return 0;
    }
    return getCartTotal();
  }, [isBuyNowCheckout, buyNowItem, getCartTotal]);

  // Fetch cart on component mount if not already loaded and not Buy Now
  useEffect(() => {
    if (user && !isBuyNowCheckout && cartItems.length === 0 && !loading) {
      fetchCart();
    }
  }, [user, fetchCart, loading, isBuyNowCheckout, cartItems.length]);

  useEffect(() => {
    // Only redirect to cart/home if checkout is empty and fully loaded
    if (user && checkoutItems.length === 0 && !loading && !showSuccessModal && !isFinalizing && !isBuyNowCheckout) {
      navigate("/cart");
    }
  }, [user, checkoutItems, navigate, showSuccessModal, isFinalizing, loading, isBuyNowCheckout]);

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
        if (data.success && Array.isArray(data.cards)) {
          setPaymentCards(data.cards);
          // Set first card as default
          if (data.cards.length > 0) {
            setSelectedCard(data.cards[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching payment cards:", error);
      } finally {
        setLoadingCards(false);
      }
    };

    if (user) fetchCards();
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!user) {
      addNotification("Please login to place an order", "error");
      return;
    }

    if (!checkoutItems || checkoutItems.length === 0) {
      addNotification(isBuyNowCheckout ? "Product information missing" : "Your cart is empty", "error");
      return;
    }

    if (paymentMethod === "card" && !selectedCard) {
      addNotification("Please select a payment card", "error");
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate pricing breakdown
      let cartTotal = checkoutTotal;
      const discount = cartTotal > 1000 ? 200 : 0;
      const shippingCost = cartTotal > 500 || cartTotal === 0 ? 0 : 50;
      const platformFee = cartTotal > 0 ? 10 : 0;
      const finalTotal = cartTotal - discount + shippingCost + platformFee;

      // Get selected address or use user default
      const addressToUse = addresses.find(a => a._id === selectedAddress) || addresses[0];

      // Prepare order data with calculated breakdown
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
        paymentMethod: paymentMethod === "card" ? "credit_card" : paymentMethod,
        paymentCard: selectedCard || undefined,
        cartTotal: cartTotal,
        discount: discount,
        shippingCost: shippingCost,
        platformFee: platformFee,
        finalTotal: finalTotal,
        isBuyNow: isBuyNowCheckout,
        buyNowItem: isBuyNowCheckout ? buyNowItem : undefined,
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

    // Only clear cart if not Buy Now flow
    if (!isBuyNowCheckout) {
      const authToken = sessionStorage.getItem("authToken");
      fetch("http://localhost:5000/api/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).catch((error) => console.error("Error clearing cart:", error));
    }

    // Clear Buy Now item
    clearBuyNow();

    // Redirect to tracking page with order ID
    setTimeout(() => {
      if (!isBuyNowCheckout) {
        clearCart();
      }
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
                  <div>
                    <label className="small text-muted fw-bold d-block mb-3">
                      📍 Select Delivery Address
                    </label>
                    <div className="mb-3">
                      <select
                        className="form-select"
                        value={selectedAddress || ""}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderColor: "#dee2e6",
                          fontSize: "14px",
                          fontWeight: "500",
                          borderRadius: "6px",
                          padding: "10px 12px",
                          border: "1px solid #dee2e6"
                        }}
                      >
                        <option value="">Select an address...</option>
                        {addresses.map((address) => (
                          <option key={address._id} value={address._id}>
                            {address.type || "HOME"} • {address.fullName} • {address.city}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedAddress && (
                      <div className="p-4 rounded-3 border border-2" style={{ backgroundColor: "#f0f7ff", borderColor: "#0d6efd" }}>
                        {addresses.map((address) => (
                          selectedAddress === address._id && (
                            <div key={address._id}>
                              <div className="mb-3">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <MapPin size={18} className="text-primary" style={{ flexShrink: 0 }} />
                                  <div>
                                    <h6 className="fw-bold mb-0" style={{ fontSize: "14px", color: "#212529" }}>
                                      {address.fullName || "Address"}
                                    </h6>
                                  </div>
                                  <span className="badge bg-primary" style={{ marginLeft: "auto", fontSize: "11px" }}>
                                    {address.type || "HOME"}
                                  </span>
                                </div>
                              </div>
                              <p className="text-dark mb-2" style={{ fontSize: "13px", lineHeight: "1.6", marginLeft: "0" }}>
                                {address.address || address.street}<br/>
                                {address.city}, {address.state} - {address.zipCode}
                              </p>
                              <p className="mb-0 fw-500 text-dark" style={{ fontSize: "13px" }}>
                                📞 <strong>{address.phone || user?.phone || "Not provided"}</strong>
                              </p>
                            </div>
                          )
                        ))}
                      </div>
                    )}
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
                {["card", "bank_transfer", "cod"].map((method) => (
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
                        {method === "card"
                          ? "Credit / Debit Card"
                          : method === "bank_transfer"
                            ? "Bank Transfer / UPI"
                            : "Cash on Delivery"}
                      </label>
                    </div>

                    {/* Card Selection */}
                    {paymentMethod === "card" && method === "card" && (
                      <div className="ms-4 mb-3">
                        {loadingCards ? (
                          <p className="text-muted small">Loading saved cards...</p>
                        ) : paymentCards.length > 0 ? (
                          <div>
                            <label className="small text-muted fw-bold d-block mb-3">
                              💳 Select Payment Card
                            </label>
                            <div className="mb-3">
                              <select
                                className="form-select"
                                value={selectedCard || ""}
                                onChange={(e) => setSelectedCard(e.target.value)}
                                style={{
                                  backgroundColor: "#f8f9fa",
                                  borderColor: "#dee2e6",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  borderRadius: "6px",
                                  padding: "10px 12px",
                                  border: "1px solid #dee2e6"
                                }}
                              >
                                <option value="">Select a card...</option>
                                {paymentCards.map((card) => (
                                  <option key={card._id} value={card._id}>
                                    {card.cardHolderName} • ••• {card.cardNumber?.slice(-4)} • Exp: {card.expiryMonth}/{card.expiryYear}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {selectedCard && (
                              <div className="p-4 rounded-3 border border-2" style={{ backgroundColor: "#f0f7ff", borderColor: "#198754" }}>
                                {paymentCards.map((card) => (
                                  selectedCard === card._id && (
                                    <div key={card._id}>
                                      <div className="d-flex align-items-center gap-2 mb-3">
                                        <div style={{ fontSize: "28px" }}>💳</div>
                                        <div>
                                          <h6 className="fw-bold mb-0" style={{ fontSize: "14px", color: "#212529" }}>
                                            {card.cardHolderName}
                                          </h6>
                                          <p className="text-muted mb-0" style={{ fontSize: "12px" }}>Credit/Debit Card</p>
                                        </div>
                                        <span className="badge bg-success" style={{ marginLeft: "auto", fontSize: "11px" }}>
                                          VERIFIED
                                        </span>
                                      </div>
                                      <p className="text-dark mb-2" style={{ fontSize: "14px", letterSpacing: "2px", fontFamily: "monospace" }}>
                                        •••• •••• •••• {card.cardNumber?.slice(-4)}
                                      </p>
                                      <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                                        Expires: {card.expiryMonth}/{card.expiryYear}
                                      </p>
                                    </div>
                                  )
                                ))}
                              </div>
                            )}
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
            {/* ORDER ITEMS */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-header bg-white py-3 text-uppercase fw-bold small">
                📦 Order Summary
              </div>
              <div className="card-body">
                {checkoutItems && checkoutItems.length > 0 ? (
                  <div>
                    {checkoutItems.map((item, index) => (
                      <div key={index} className="mb-3 pb-3 border-bottom d-flex gap-3">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                          />
                        )}
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1" style={{ fontSize: "14px" }}>
                            {item.name}
                          </h6>
                          <div className="text-muted small mb-2">
                            Qty: {item.quantity || 1}
                            {item.selectedSize && <span> • Size: {item.selectedSize}</span>}
                          </div>
                          <div className="fw-bold text-dark">
                            ₹{((item.discountPrice || (item.price * (1 - (item.discountPercentage || 0) / 100)) || item.price) * (item.quantity || 1)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center py-3">No items</p>
                )}
              </div>
            </div>

            <div
              className="card border-0 shadow-sm sticky-top"
              style={{ top: "90px" }}
            >
              <div className="card-body">
                <h6 className="text-muted fw-bold small border-bottom pb-2">
                  PRICE DETAILS
                </h6>
                <div className="d-flex justify-content-between my-3">
                  <span>Price ({isBuyNowCheckout ? "1 item" : `${cartItems.length} items`})</span>
                  <span>₹{checkoutTotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-success">
                  <span>Discount</span>
                  <span>- ₹{(checkoutTotal > 1000 ? 200 : 0).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Delivery Fee</span>
                  <span className={checkoutTotal > 500 || checkoutTotal === 0 ? "text-success" : "text-dark"}>
                    {checkoutTotal > 500 || checkoutTotal === 0 ? "FREE" : "₹50"}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Platform Fee</span>
                  <span>₹{checkoutTotal > 0 ? 10 : 0}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <h5 className="fw-bold">Total Payable</h5>
                  <h5 className="fw-bold text-dark">
                    ₹{(checkoutTotal - (checkoutTotal > 1000 ? 200 : 0) + (checkoutTotal > 500 || checkoutTotal === 0 ? 0 : 50) + (checkoutTotal > 0 ? 10 : 0)).toLocaleString()}
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
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-body p-4 text-center">
                {paymentMethod === "cod" ? (
                  <>
                    <div className="mb-4">
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 animate__animated animate__bounceIn"
                        style={{ width: "80px", height: "80px", backgroundColor: "#fff3cd" }}
                      >
                        <span style={{ fontSize: "40px" }}>💰</span>
                      </div>
                    </div>
                    <h4 className="fw-bold mb-2 text-dark">Payment on Delivery</h4>
                    <p className="text-muted mb-3">
                      Your order has been placed successfully! Payment of <strong>₹{(checkoutTotal - (checkoutTotal > 1000 ? 200 : 0) + (checkoutTotal > 500 || checkoutTotal === 0 ? 0 : 50) + (checkoutTotal > 0 ? 10 : 0)).toLocaleString()}</strong> will be collected at the time of delivery.
                    </p>
                    <p className="text-muted small">Order ID: <strong>{newOrderId}</strong></p>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 animate__animated animate__bounceIn"
                        style={{ width: "80px", height: "80px", backgroundColor: "#d4edda" }}
                      >
                        <CheckCircle className="text-success" size={40} />
                      </div>
                    </div>
                    <h4 className="fw-bold mb-2 text-success">Payment Successful</h4>
                    <p className="text-muted mb-3">
                      Your order has been confirmed and payment received successfully!
                    </p>
                    <p className="text-muted small">Order ID: <strong>{newOrderId}</strong></p>
                  </>
                )}
                <div className="d-flex gap-2 mt-4">
                  <button
                    className="btn btn-secondary flex-grow-1"
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate("/");
                    }}
                  >
                    Continue Shopping
                  </button>
                  <button
                    className="btn btn-dark flex-grow-1"
                    onClick={handleFinalRedirect}
                  >
                    Track Order
                  </button>
                </div>
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
