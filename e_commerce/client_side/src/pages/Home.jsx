import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Zap, Loader2, Heart, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNotifications } from "../context/NotificationContext";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addNotification } = useNotifications();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState({});
  const [sizeModalProduct, setSizeModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [cartActionType, setCartActionType] = useState("");

  useEffect(() => {
    // Fetch products from backend API
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
          // Check wishlist status for each product
          if (user) {
            const wishlistStatus = {};
            data.products.forEach(product => {
              wishlistStatus[product._id] = isInWishlist(product._id);
            });
            setWishlistItems(wishlistStatus);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleBuyNow = (product) => {
    if (!user) {
      addNotification("Please login to purchase items", "error");
      navigate("/login");
      return;
    }
    
    // Check if product has sizes
    if (product.sizes && product.sizes.length > 0) {
      setSizeModalProduct(product);
      setSelectedSize("");
      setCartActionType("buy");
      return;
    }
    
    // Store product for single-item checkout
    sessionStorage.setItem("buyNowItem", JSON.stringify({
      productId: product._id,
      quantity: 1,
    }));
    
    navigate("/checkout");
  };

  const handleAddToCart = (product) => {
    if (!user) {
      addNotification("Please login to add items", "error");
      navigate("/login");
      return;
    }
    
    // Check if product has sizes
    if (product.sizes && product.sizes.length > 0) {
      setSizeModalProduct(product);
      setSelectedSize("");
      setCartActionType("cart");
      return;
    }
    
    // Add product without size to cart
    addProductToCart(product._id, 1, null);
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

  const handleWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addNotification("Please login to use wishlist", "error");
      navigate("/login");
      return;
    }

    try {
      const isCurrentlyInWishlist = wishlistItems[product._id];

      if (isCurrentlyInWishlist) {
        const result = await removeFromWishlist(product._id);
        if (result.success) {
          setWishlistItems({ ...wishlistItems, [product._id]: false });
          addNotification("Removed from wishlist", "info");
        }
      } else {
        const result = await addToWishlist(product._id);
        if (result.success) {
          setWishlistItems({ ...wishlistItems, [product._id]: true });
          addNotification("Added to wishlist", "success");
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      addNotification("Error updating wishlist", "error");
    }
  };

  const ProductCard = ({ product }) => (
    <div className="col-6 col-md-4 col-lg-3">
      <Link to={`/product/${product._id}`} className="text-decoration-none">
        <div className="card border-0 shadow-sm h-100 overflow-hidden position-relative" style={{ transition: "transform 0.3s, box-shadow 0.3s" }} onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
        }} onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
        }}>
          {/* Wishlist Heart */}
          <button
            onClick={(e) => handleWishlist(e, product)}
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
            <Heart
              size={20}
              fill={wishlistItems[product._id] ? "red" : "none"}
              color={wishlistItems[product._id] ? "red" : "currentColor"}
              stroke={wishlistItems[product._id] ? "red" : "currentColor"}
            />
          </button>

          <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "180px" }}>
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={(e) => {
                e.target.src = "https://via.placeholder.com/180?text=No+Image";
              }} />
            ) : (
              <span style={{ fontSize: "60px" }}>📦</span>
            )}
          </div>

          <div className="card-body p-2 p-md-3">
            <span className="badge bg-light text-dark border mb-2" style={{ fontSize: "10px" }}>
              {product.category}
            </span>
            <h6 className="fw-bold text-truncate mb-1" style={{ color: "#333" }}>{product.name}</h6>
            
            {/* Price with Discount */}
            <div className="mb-2">
              {product.discountPercentage && product.discountPercentage > 0 ? (
                <div className="d-flex align-items-center gap-2">
                  <p className="text-muted mb-0" style={{ textDecoration: "line-through", fontSize: "12px" }}>
                    ₹{product.price?.toLocaleString("en-IN") || 0}
                  </p>
                  <p className="text-danger fw-bold mb-0">
                    ₹{(product.price * (1 - product.discountPercentage / 100)).toFixed(0)}
                  </p>
                  <span className="badge bg-danger" style={{ fontSize: "10px" }}>
                    {product.discountPercentage}% off
                  </span>
                </div>
              ) : (
                <p className="text-dark fw-bold mb-2">₹{product.price?.toLocaleString("en-IN") || 0}</p>
              )}
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-dark btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(product);
                }}
              >
                <ShoppingCart size={14} />
                <span style={{ fontSize: "12px" }}>Add</span>
              </button>
              <button
                className="btn btn-dark btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  handleBuyNow(product);
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

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <main className="flex-grow-1 p-4">
        <div className="container">
          <div className="bg-dark text-white rounded-2 p-5 mb-4 text-center">
            <h1 className="display-4 fw-bold">Welcome to FASHION-HUB</h1>
            <p className="lead mb-0">Discover the best deals on premium fashion today</p>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
              <Loader2 className="spinner-border text-dark" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No products available</h5>
            </div>
          ) : (
            <>
              <h4 className="fw-bold mb-4">Featured Products</h4>
              <div className="row g-3 g-md-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

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
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">Please select a size for {sizeModalProduct.name}</p>
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

      <Footer />
    </div>
  );
};

export default Home;