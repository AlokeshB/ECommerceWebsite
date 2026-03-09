import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck } from "lucide-react";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert("Please log in to place your order.");
    } else if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
    } else {
      navigate("/checkout");
    }
  };

  const totalAmount = getCartTotal?.() || 0;
  const discount = totalAmount > 1000 ? 200 : 0;
  const deliveryCharges = totalAmount > 500 || totalAmount === 0 ? 0 : 50;
  const platformFee = totalAmount > 0 ? 10 : 0;
  const finalAmount = totalAmount - discount + deliveryCharges + platformFee;

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column min-vh-100 bg-light">
        <div className="container-fluid px-2 px-sm-3 px-md-4 py-3 py-md-4 flex-grow-1">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 mb-4 text-center text-md-start">
            <h4 className="fw-bold mb-0">
              Shopping Bag{" "}
              <span className="text-muted fw-normal fs-6">
                ({getCartCount?.() || 0} items)
              </span>
            </h4>
            <Link
              to="/"
              className="text-dark text-decoration-none small fw-bold d-none d-md-block"
            >
              + Add more from wishlist
            </Link>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-4 py-md-5 bg-white rounded-3 rounded-md-4 shadow-sm border mx-auto" style={{ maxWidth: "400px" }}>
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png"
                alt="Empty Cart"
                className="mb-3"
                style={{ width: "clamp(120px, 50vw, 180px)", opacity: 0.7 }}
              />
              <h5 className="fw-bold" style={{ fontSize: "clamp(14px, 3vw, 16px)" }}>Your bag is empty!</h5>
              <p className="text-muted small px-3 px-md-4">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/" className="btn btn-dark px-3 px-md-4 rounded-pill mt-2" style={{ fontSize: "clamp(12px, 2vw, 14px)" }}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="row g-2 g-sm-3 g-md-4 justify-content-center">
              {/* Cart Items List */}
              <div className="col-12 col-lg-8">
                <div className="d-flex flex-column gap-2 gap-md-3">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.productId?._id || index}
                      className="bg-white rounded-3 shadow-sm p-2 p-md-3 border d-flex flex-column flex-sm-row align-items-center gap-2 gap-md-3"
                    >
                      {/* Modern Small Image Container */}
                      <div
                        className="rounded-2 border bg-light d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0 mx-auto mx-sm-0"
                        style={{
                          width: "clamp(70px, 20vw, 100px)",
                          height: "clamp(70px, 20vw, 100px)",
                          padding: "6px",
                        }}
                      >
                        {item.productId && typeof item.productId === 'object' && item.productId.image ? (
                          <img
                            src={item.productId.image}
                            alt={item.productId?.name || "Product"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/100?text=No+Image";
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "2rem" }}>📦</span>
                        )}
                      </div>

                      {/* Product Details Area */}
                      <div className="flex-grow-1 w-100">
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center align-items-sm-start gap-2 text-center text-sm-start">
                          <div className="flex-grow-1">
                            <h6
                              className="fw-bold mb-0 text-dark"
                              style={{ fontSize: "clamp(12px, 2vw, 15px)" }}
                            >
                              {item.productId?.name}
                            </h6>
                            <p
                              className="text-muted mb-2"
                              style={{ fontSize: "clamp(11px, 1.5vw, 12px)" }}
                            >
                              Sold by:{" "}
                              <span className="text-dark fw-medium">
                                FashionHub Retail
                              </span>
                            </p>
                          </div>
                          <button
                            className="btn btn-link text-danger p-0 border-0 transition-all opacity-75 flex-shrink-0"
                            style={{ hover: { opacity: 1 } }}
                            onClick={() => removeFromCart(item.productId?._id || item.productId)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start justify-content-center justify-content-sm-between gap-2 gap-sm-3 mt-2">
                          {/* Prices */}
                          <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                            <span className="fw-bold text-dark" style={{ fontSize: "clamp(12px, 2vw, 14px)" }}>
                              ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                            </span>
                            <span
                              className="text-muted text-decoration-line-through"
                              style={{ fontSize: "clamp(10px, 1.5vw, 12px)" }}
                            >
                              ₹
                              {(
                                (item.productId?.price || item.price + 500) *
                                (item.quantity || 1)
                              ).toLocaleString()}
                            </span>
                            <span
                              className="badge bg-success-subtle text-success border border-success-subtle rounded-pill"
                              style={{ fontSize: "clamp(9px, 1vw, 10px)" }}
                            >
                              {item.productId?.discountPercentage || 20}% OFF
                            </span>
                          </div>

                          {/* Aesthetic Quantity Pill */}
                          <div className="d-flex align-items-center border rounded-pill bg-light px-1">
                            <button
                              className="btn btn-sm border-0 p-1"
                              onClick={() => {
                                const newQty = (item.quantity || 1) - 1;
                                if (newQty >= 1) {
                                  updateQuantity(item.productId?._id || item.productId, newQty);
                                }
                              }}
                              disabled={(item.quantity || 1) <= 1}
                            >
                              <Minus size={14} className="text-dark" />
                            </button>
                            <span
                              className="fw-bold px-2"
                              style={{ fontSize: "clamp(12px, 1.5vw, 13px)" }}
                            >
                              {item.quantity || 1}
                            </span>
                            <button
                              className="btn btn-sm border-0 p-1"
                              onClick={() => {
                                const newQty = (item.quantity || 1) + 1;
                                updateQuantity(item.productId?._id || item.productId, newQty);
                              }}
                            >
                              <Plus size={14} className="text-dark" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Link
                    to="/"
                    className="btn btn-link text-dark text-decoration-none fw-bold p-0 d-flex align-items-center gap-2"
                  >
                    <ArrowLeft size={18} /> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Price Summary Sticky Sidebar */}
              <div className="col-12 col-lg-4">
                <div
                  className="card border-0 shadow-sm rounded-3 p-3 p-md-4 position-sticky text-center text-lg-start"
                  style={{ top: "90px" }}
                >
                  <h6 className="text-dark fw-bold text-uppercase small mb-3" style={{ fontSize: "clamp(12px, 2vw, 14px)" }}>
                    Order Summary
                  </h6>

                  <div className="d-flex flex-column gap-2 mb-3">
                    <div className="d-flex justify-content-center justify-content-lg-between text-muted" style={{ fontSize: "clamp(11px, 1.5vw, 13px)" }}>
                      <span>Bag Total</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-center justify-content-lg-between" style={{ fontSize: "clamp(11px, 1.5vw, 13px)" }}>
                      <span className="text-muted">Bag Discount</span>
                      <span className="text-success">
                        - ₹{discount.toLocaleString()}
                      </span>
                    </div>
                    <div className="d-flex justify-content-center justify-content-lg-between" style={{ fontSize: "clamp(11px, 1.5vw, 13px)" }}>
                      <span className="text-muted">Delivery Fee</span>
                      <span
                        className={
                          deliveryCharges === 0 ? "text-success" : "text-dark"
                        }
                      >
                        {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}
                      </span>
                    </div>
                    <div className="d-flex justify-content-center justify-content-lg-between" style={{ fontSize: "clamp(11px, 1.5vw, 13px)" }}>
                      <span className="text-muted">Platform Fee</span>
                      <span className="text-dark">
                        ₹{platformFee}
                      </span>
                    </div>
                  </div>

                  <hr className="my-2" />

                  <div className="d-flex flex-column align-items-center align-items-lg-start gap-2 mb-3">
                    <span className="fw-bold" style={{ fontSize: "clamp(12px, 2vw, 14px)" }}>Total Amount</span>
                    <span className="fw-bold" style={{ fontSize: "clamp(14px, 3vw, 18px)" }}>
                      ₹{finalAmount.toLocaleString()}
                    </span>
                  </div>

                  <button
                    className="btn btn-dark w-100 py-2 py-md-3 rounded-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                    style={{ fontSize: "clamp(12px, 2vw, 14px)" }}
                    onClick={handleCheckout}
                  >
                    PROCEED TO CHECKOUT
                  </button>

                  <div className="mt-3 p-2 p-md-3 bg-light rounded-2 d-flex align-items-start gap-2">
                    <ShieldCheck
                      size={16}
                      className="text-success flex-shrink-0 mt-1"
                    />
                    <p className="text-muted m-0" style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}>
                      Safe and Secure Payments. 100% Authentic products. Easy
                      returns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
