import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Zap, Trash2, Heart, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNotifications } from "../context/NotificationContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addNotification } = useNotifications();
  const [sizeModalProduct, setSizeModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [cartActionType, setCartActionType] = useState("");

  const handleRemoveFromWishlist = async (productId) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      addNotification("Removed from wishlist", "success");
    } else {
      addNotification("Failed to remove from wishlist", "error");
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      addNotification("Please login to add items", "error");
      navigate("/login");
      return;
    }

    const productData = product.productId._id ? product.productId : product;
    
    // Check if product has sizes
    if (productData.sizes && productData.sizes.length > 0) {
      setSizeModalProduct(productData);
      setSelectedSize("");
      setCartActionType("cart");
      return;
    }
    
    // Add product without size to cart
    addProductToCart(productData._id, 1, null);
  };

  const addProductToCart = async (productId, quantity, size) => {
    const result = await addToCart({
      _id: productId,
      qty: quantity,
      size: size,
    });

    if (result.success) {
      addNotification("Product added to cart!", "success");
    } else {
      addNotification(result.error || "Failed to add to cart", "error");
    }
  };

  const handleBuyNow = (product) => {
    if (!user) {
      addNotification("Please login to purchase items", "error");
      navigate("/login");
      return;
    }

    const productData = product.productId._id ? product.productId : product;
    
    // Check if product has sizes
    if (productData.sizes && productData.sizes.length > 0) {
      // Store product and navigate to product detail page for size selection
      navigate(`/product/${productData._id}`);
      return;
    }
    
    // Store product for single-item checkout
    sessionStorage.setItem("buyNowItem", JSON.stringify({
      productId: productData._id,
      quantity: 1,
    }));
    
    navigate("/checkout");
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="d-flex flex-column min-vh-100 bg-light">
          <div className="container py-5 flex-grow-1">
            <div className="text-center">
              <h4 className="fw-bold mb-3">Login Required</h4>
              <p className="text-muted mb-4">Please login to view your wishlist</p>
              <Link to="/login" className="btn btn-dark px-4 rounded-pill">
                Login
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column min-vh-100 bg-light">
        {/* Size Selection Modal */}
        {sizeModalProduct && (
          <div className="modal d-block show" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Select Size</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setSizeModalProduct(null);
                      setSelectedSize("");
                      setCartActionType("");
                    }}
                  />
                </div>
                <div className="modal-body">
                  <h6 className="fw-bold mb-3">Choose a size for {sizeModalProduct.name}</h6>
                  <div className="d-flex gap-2 flex-wrap">
                    {sizeModalProduct.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        onClick={() => size.stock > 0 && setSelectedSize(size.size)}
                        className={`btn ${
                          selectedSize === size.size
                            ? "btn-dark"
                            : "btn-outline-dark"
                        }`}
                        style={{
                          minWidth: "80px",
                          borderWidth: selectedSize === size.size ? "2px" : "1px",
                        }}
                        disabled={size.stock === 0}
                      >
                        {size.size}
                        {size.stock === 0 && <small> (Out)</small>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSizeModalProduct(null);
                      setSelectedSize("");
                      setCartActionType("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => {
                      if (!selectedSize) {
                        addNotification("Please select a size", "error");
                        return;
                      }

                      if (cartActionType === "cart") {
                        addProductToCart(sizeModalProduct._id, 1, selectedSize);
                      } else if (cartActionType === "buy") {
                        sessionStorage.setItem("buyNowItem", JSON.stringify({
                          productId: sizeModalProduct._id,
                          quantity: 1,
                          size: selectedSize,
                        }));
                        navigate("/checkout");
                      }

                      setSizeModalProduct(null);
                      setSelectedSize("");
                      setCartActionType("");
                    }}
                    disabled={!selectedSize}
                  >
                    {cartActionType === "cart" ? "Confirm & Add to Cart" : "Confirm & Buy Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container py-4 flex-grow-1">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="fw-bold mb-0">
              My Wishlist{" "}
              <span className="text-muted fw-normal fs-6">
                ({wishlistItems.length} items)
              </span>
            </h4>
            <Link
              to="/"
              className="text-dark text-decoration-none small fw-bold d-none d-md-block"
            >
              + Continue Shopping
            </Link>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
              <Heart
                size={60}
                className="mb-3"
                style={{ opacity: 0.3, color: "#999" }}
              />
              <h5 className="fw-bold">Your wishlist is empty!</h5>
              <p className="text-muted small px-4">
                Start adding items you love to your wishlist
              </p>
              <Link to="/" className="btn btn-dark px-4 rounded-pill mt-2">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {wishlistItems.map((item) => {
                const product = item.productId;
                if (!product || !product._id) return null;

                return (
                  <div key={product._id} className="col-6 col-md-4 col-lg-3">
                    <Link
                      to={`/product/${product._id}`}
                      className="text-decoration-none"
                    >
                      <div
                        className="card border-0 shadow-sm h-100 overflow-hidden position-relative"
                        style={{
                          transition: "transform 0.3s, box-shadow 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow =
                            "0 10px 30px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                        }}
                      >
                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveFromWishlist(product._id);
                          }}
                          className="btn btn-light position-absolute"
                          style={{
                            top: "10px",
                            right: "10px",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          <Trash2 size={18} className="text-danger" />
                        </button>

                        <div
                          className="bg-light d-flex align-items-center justify-content-center"
                          style={{ height: "180px" }}
                        >
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                              }}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/180?text=No+Image";
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: "60px" }}>📦</span>
                          )}
                        </div>

                        <div className="card-body p-2 p-md-3">
                          <span
                            className="badge bg-light text-dark border mb-2"
                            style={{ fontSize: "10px" }}
                          >
                            {product.category}
                          </span>
                          <h6
                            className="fw-bold text-truncate mb-1"
                            style={{ color: "#333" }}
                          >
                            {product.name}
                          </h6>

                          {/* Price with Discount */}
                          <div className="mb-2">
                            {product.discountPercentage &&
                            product.discountPercentage > 0 ? (
                              <div className="d-flex align-items-center gap-2">
                                <p
                                  className="text-muted mb-0"
                                  style={{
                                    textDecoration: "line-through",
                                    fontSize: "12px",
                                  }}
                                >
                                  ₹{product.price?.toLocaleString("en-IN") || 0}
                                </p>
                                <p className="text-danger fw-bold mb-0">
                                  ₹
                                  {(
                                    product.price *
                                    (1 - product.discountPercentage / 100)
                                  ).toFixed(0)}
                                </p>
                                <span
                                  className="badge bg-danger"
                                  style={{ fontSize: "10px" }}
                                >
                                  {product.discountPercentage}% off
                                </span>
                              </div>
                            ) : (
                              <p className="text-dark fw-bold mb-2">
                                ₹{product.price?.toLocaleString("en-IN") || 0}
                              </p>
                            )}
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-dark btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                            >
                              <ShoppingCart size={14} />
                              <span style={{ fontSize: "12px" }}>Add</span>
                            </button>
                            <button
                              className="btn btn-dark btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleBuyNow(item);
                              }}
                            >
                              <Zap size={14} />
                              <span style={{ fontSize: "12px" }}>Buy</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
