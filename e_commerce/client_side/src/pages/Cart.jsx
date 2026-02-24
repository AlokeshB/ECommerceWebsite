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
    } else {
      navigate("/checkout");
    }
  };

  const totalAmount = getCartTotal?.() || 0;
  const discount = totalAmount > 1000 ? 200 : 0;
  const deliveryCharges = totalAmount > 500 || totalAmount === 0 ? 0 : 40;
  const finalAmount = totalAmount - discount + deliveryCharges;

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column min-vh-100 bg-light">
        <div className="container py-4 flex-grow-1">
          <div className="d-flex align-items-center justify-content-between mb-4">
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
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png"
                alt="Empty Cart"
                className="mb-3"
                style={{ width: "180px", opacity: 0.7 }}
              />
              <h5 className="fw-bold">Your bag is empty!</h5>
              <p className="text-muted small px-4">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/" className="btn btn-dark px-4 rounded-pill mt-2">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {/* Cart Items List */}
              <div className="col-lg-8">
                <div className="d-flex flex-column gap-3">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="bg-white rounded-4 shadow-sm p-3 border d-flex align-items-center"
                    >
                      {/* Modern Small Image Container */}
                      <div
                        className="rounded-3 border bg-white d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                        style={{
                          width: "100px",
                          height: "100px",
                          padding: "8px",
                        }}
                      >
                        {item.productId?.image ? (
                          <img
                            src={item.productId.image}
                            alt={item.productId?.name}
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
                      <div className="ms-3 flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6
                              className="fw-bold mb-0 text-dark"
                              style={{ fontSize: "15px" }}
                            >
                              {item.productId?.name}
                            </h6>
                            <p
                              className="text-muted mb-2"
                              style={{ fontSize: "12px" }}
                            >
                              Sold by:{" "}
                              <span className="text-dark fw-medium">
                                FashionHub Retail
                              </span>
                            </p>
                          </div>
                          <button
                            className="btn btn-link text-danger p-0 border-0 transition-all opacity-75"
                            style={{ hover: { opacity: 1 } }}
                            onClick={() => removeFromCart(item.productId?._id || item.productId)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mt-1">
                          {/* Prices */}
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold text-dark">
                              ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                            </span>
                            <span
                              className="text-muted text-decoration-line-through x-small"
                              style={{ fontSize: "12px" }}
                            >
                              ₹
                              {(
                                (item.productId?.price || item.price + 500) *
                                (item.quantity || 1)
                              ).toLocaleString()}
                            </span>
                            <span
                              className="badge bg-success-subtle text-success border border-success-subtle rounded-pill"
                              style={{ fontSize: "10px" }}
                            >
                              20% OFF
                            </span>
                          </div>

                          {/* Aesthetic Quantity Pill */}
                          <div className="d-flex align-items-center border rounded-pill bg-light px-1">
                            <button
                              className="btn btn-sm border-0 p-1"
                              onClick={() => updateQuantity(item.productId?._id || item.productId, -1)}
                              disabled={(item.quantity || 1) <= 1}
                            >
                              <Minus size={14} className="text-dark" />
                            </button>
                            <span
                              className="fw-bold px-2"
                              style={{ fontSize: "13px" }}
                            >
                              {item.quantity || 1}
                            </span>
                            <button
                              className="btn btn-sm border-0 p-1"
                              onClick={() => updateQuantity(item.productId?._id || item.productId, 1)}
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
              <div className="col-lg-4">
                <div
                  className="card border-0 shadow-sm rounded-4 p-4 position-sticky"
                  style={{ top: "90px" }}
                >
                  <h6 className="text-dark fw-bold text-uppercase small mb-4">
                    Order Summary
                  </h6>

                  <div className="d-flex flex-column gap-3 mb-4">
                    <div className="d-flex justify-content-between text-muted small">
                      <span>Bag Total</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">Bag Discount</span>
                      <span className="text-success">
                        - ₹{discount.toLocaleString()}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">Delivery Fee</span>
                      <span
                        className={
                          deliveryCharges === 0 ? "text-success" : "text-dark"
                        }
                      >
                        {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}
                      </span>
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold">Total Amount</span>
                    <span className="fw-bold fs-5">
                      ₹{finalAmount.toLocaleString()}
                    </span>
                  </div>

                  <button
                    className="btn btn-dark w-100 py-3 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                    onClick={handleCheckout}
                  >
                    PROCEED TO CHECKOUT
                  </button>

                  <div className="mt-4 p-3 bg-light rounded-3 d-flex align-items-start gap-2">
                    <ShieldCheck
                      size={20}
                      className="text-success flex-shrink-0 mt-1"
                    />
                    <p className="text-muted m-0" style={{ fontSize: "11px" }}>
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
