import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
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
  const navigate = useNavigate();

  const totalAmount = getCartTotal();
  const discount = totalAmount > 1000 ? 200 : 0; // Fake logic: ₹200 off if total > 1000
  const deliveryCharges = totalAmount > 500 ? 0 : 40;
  const finalAmount = totalAmount - discount + deliveryCharges;

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column min-vh-100 bg-light">
        <div className="container py-4 flex-grow-1">
          <h4 className="fw-bold mb-4">
            Shopping Cart ({getCartCount()} items)
          </h4>

          {cartItems.length === 0 ? (
            /* EMPTY STATE */
            <div className="text-center py-5 bg-white rounded shadow-sm">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png"
                alt="Empty Cart"
                style={{ width: "200px", opacity: 0.8 }}
              />
              <h5 className="mt-3">Your cart is empty!</h5>
              <p className="text-muted">Add items to it now.</p>
              <Link to="/" className="btn btn-primary px-4 mt-2">
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {/* LEFT COLUMN: Cart Items */}
              <div className="col-lg-8">
                <div className="bg-white rounded shadow-sm overflow-hidden">
                  {cartItems.map((item) => (
                    <div
                      className="p-3 border-bottom d-flex gap-3 align-items-start"
                      key={item.id}
                    >
                      {/* Image */}
                      <div
                        className="bg-light rounded d-flex align-items-center justify-content-center"
                        style={{
                          width: "100px",
                          height: "100px",
                          fontSize: "2rem",
                        }}
                      >
                        {item.img}
                      </div>

                      {/* Details */}
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">{item.name}</h6>
                        <p className="text-muted small mb-1">
                          Seller: RetailNet
                        </p>

                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="fw-bold fs-5">
                            ₹{item.price * item.qty}
                          </span>
                          <span className="text-muted small text-decoration-line-through">
                            ₹{item.price * item.qty + 500}
                          </span>
                          <span className="text-success small fw-bold">
                            20% Off
                          </span>
                        </div>

                        {/* Controls */}
                        <div className="d-flex align-items-center gap-4">
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-circle p-1"
                              style={{ width: "28px", height: "28px" }}
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.qty === 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="fw-bold px-2">{item.qty}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-circle p-1"
                              style={{ width: "28px", height: "28px" }}
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          {/* <div className="d-flex align-items-right gap-2"> */}
                            <button
                              className="btn btn-link text-danger p-0 border-0"
                              onClick={() => removeFromCart(item.id)}
                              title="Remove Item"
                            >
                              <Trash2 size={20} />
                            </button>
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <Link
                    to="/"
                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: Price Details */}
              <div className="col-lg-4">
                <div
                  className="bg-white rounded shadow-sm p-3 position-sticky"
                  style={{ top: "90px" }}
                >
                  <h6 className="text-muted text-uppercase fw-bold small border-bottom pb-2">
                    Price Details
                  </h6>

                  <div className="d-flex justify-content-between mb-2 mt-3">
                    <span>Price ({getCartCount()} items)</span>
                    <span>₹{totalAmount}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount</span>
                    <span>- ₹{discount}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Delivery Charges</span>
                    <span
                      className={deliveryCharges === 0 ? "text-success" : ""}
                    >
                      {deliveryCharges === 0 ? "Free" : `₹${deliveryCharges}`}
                    </span>
                  </div>

                  <hr className="border-dashed" />

                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold fs-5">Total Amount</span>
                    <span className="fw-bold fs-5">₹{finalAmount}</span>
                  </div>

                  <button
                    className="btn btn-primary w-100 py-3 fw-bold shadow-sm text-white"
                    onClick={() => navigate("/checkout")}
                  >
                    PLACE ORDER
                  </button>

                  <div className="mt-3 d-flex align-items-center justify-content-center gap-2 text-muted small">
                    <ShieldCheck size={16} />
                    <span>
                      Safe and Secure Payments. 100% Authentic products.
                    </span>
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
