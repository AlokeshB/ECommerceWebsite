import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Zap, Loader2, ArrowLeft, Share2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useNotifications } from "../context/NotificationContext";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addNotification } = useNotifications();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setProduct(data.product);
        // Set default size if product has sizes
        if (data.product.sizes && data.product.sizes.length > 0) {
          setSelectedSize(data.product.sizes[0].size);
        }
        // Check if in wishlist
        if (user) {
          setInWishlist(isInWishlist(data.product._id));
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      addNotification("Error loading product", "error");
    } finally {
      setLoading(false);
    }
  }, [id, user, isInWishlist, addNotification]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    if (!user) {
      addNotification("Please login to add items to cart", "error");
      navigate("/login");
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      addNotification("Please select a size", "error");
      return;
    }

    try {
      const authToken = sessionStorage.getItem("authToken");

      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: parseInt(quantity),
          size: selectedSize || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        addNotification(`${product.name} added to cart!`, "success");
      } else {
        addNotification(data.message || "Error adding to cart", "error");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      addNotification("Error adding to cart", "error");
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      addNotification("Please login to purchase", "error");
      navigate("/login");
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      addNotification("Please select a size", "error");
      return;
    }

    sessionStorage.setItem(
      "buyNowItem",
      JSON.stringify({
        productId: product._id,
        quantity: parseInt(quantity),
        size: selectedSize || undefined,
      })
    );

    navigate("/checkout");
  };

  const handleWishlist = async () => {
    if (!user) {
      addNotification("Please login to use wishlist", "error");
      navigate("/login");
      return;
    }

    try {
      if (inWishlist) {
        const result = await removeFromWishlist(product._id);
        if (result.success) {
          setInWishlist(false);
          addNotification("Removed from wishlist", "info");
        }
      } else {
        const result = await addToWishlist(product._id);
        if (result.success) {
          setInWishlist(true);
          addNotification("Added to wishlist", "success");
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      addNotification("Error updating wishlist", "error");
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <Loader2 size={48} className="text-primary mb-3" style={{ animation: "spin 1s linear infinite" }} />
            <p>Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <p className="text-danger">Product not found</p>
            <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
              Go to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discountedPrice =
    product.discountPrice || product.effectivePrice || product.price;
  const originalPrice = product.price;
  const discountPercent = product.discountPercentage || 0;

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "#f8f9fa" }}>
      <Navbar />

      <div className="flex-grow-1 py-5">
        <div className="container">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="btn btn-link text-dark p-0 mb-4 d-flex align-items-center gap-2"
          >
            <ArrowLeft size={20} /> Back to Home
          </button>

          {/* Product Details */}
          <div className="row g-5">
            {/* Product Image */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm position-relative h-100" style={{ overflow: "hidden" }}>
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "100%",
                    background: "#f0f0f0",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400?text=No+Image";
                    }}
                  />
                </div>

                {/* Wishlist Heart */}
                <button
                  onClick={handleWishlist}
                  className="btn btn-light position-absolute"
                  style={{
                    top: "15px",
                    right: "15px",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <Heart
                    size={24}
                    fill={inWishlist ? "red" : "none"}
                    color={inWishlist ? "red" : "currentColor"}
                    stroke={inWishlist ? "red" : "currentColor"}
                  />
                </button>

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <div
                    className="position-absolute fw-bold"
                    style={{
                      top: "15px",
                      left: "15px",
                      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      zIndex: 1,
                    }}
                  >
                    -{discountPercent}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm p-4">
                {/* Category */}
                <div className="mb-3">
                  <span className="badge bg-secondary me-2">{product.category}</span>
                  {product.subCategory && (
                    <span className="badge bg-info">{product.subCategory}</span>
                  )}
                </div>

                {/* Title */}
                <h1 className="mb-3 fw-bold">{product.name}</h1>

                {/* Rating */}
                <div className="mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ color: "#ffc107", fontSize: "1.2rem" }}>★★★★☆</span>
                    <small className="text-muted">({product.numReviews || 0} reviews)</small>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="display-5 fw-bold" style={{ color: "#f5576c" }}>
                    ₹{discountedPrice.toFixed(2)}
                  </div>
                  {discountPercent > 0 && (
                    <small className="text-muted text-decoration-line-through">
                      ₹{originalPrice.toFixed(2)}
                    </small>
                  )}
                  {product.stock > 0 && (
                    <p className="text-success mt-2 mb-0">
                      <strong>✓ In Stock ({product.stock} available)</strong>
                    </p>
                  )}
                  {product.stock === 0 && (
                    <p className="text-danger mt-2 mb-0">
                      <strong>✗ Out of Stock</strong>
                    </p>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-4">
                    <h6 className="fw-bold">Description</h6>
                    <p className="text-muted">{product.description}</p>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold">Available Sizes</h6>
                    <div className="d-flex gap-2 flex-wrap">
                      {product.sizes.map((size, idx) => (
                        <button
                          key={idx}
                          onClick={() => size.stock > 0 && setSelectedSize(size.size)}
                          className={`btn btn-outline-${
                            selectedSize === size.size ? "primary" : "secondary"
                          }`}
                          style={{
                            minWidth: "60px",
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
                )}

                {/* Quantity */}
                <div className="mb-4">
                  <h6 className="fw-bold">Quantity</h6>
                  <div className="input-group" style={{ maxWidth: "150px" }}>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="btn btn-light border-2 fw-bold py-3"
                    style={{ borderColor: "#667eea", color: "#667eea" }}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart size={20} className="me-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="btn fw-bold py-3 text-white"
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                    disabled={product.stock === 0}
                  >
                    <Zap size={20} className="me-2" />
                    Buy Now
                  </button>
                </div>

                {/* Share */}
                <div className="mt-4 pt-4 border-top">
                  <button className="btn btn-link p-0 text-dark d-flex align-items-center gap-2">
                    <Share2 size={18} /> Share Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
