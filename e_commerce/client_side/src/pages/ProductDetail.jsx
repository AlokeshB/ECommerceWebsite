import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Zap, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Fetch product from backend API
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        
        if (data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <Loader2 className="spinner-border text-dark" />
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
            <h2>Product not found</h2>
            <button
              className="btn btn-dark mt-3"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get available sizes from product data
  const availableSizes = product.stock ? ["S", "M", "L", "XL"] : [];
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (!user) {
      alert("Please login to add items!");
      navigate("/login");
      return;
    }

    try {
      const authToken = sessionStorage.getItem("authToken");
      
      // Call backend API to add to cart
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`${quantity} item(s) added to cart!`);
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (!user) {
      alert("Please login to purchase items!");
      navigate("/login");
      return;
    }

    // For "Buy Now", create a direct checkout for this single item
    // without adding to cart first
    try {
      const authToken = sessionStorage.getItem("authToken");
      
      // Directly navigate to checkout with just this product
      // The checkout page will need to handle single-item purchase
      // We'll store the product temporarily and redirect
      sessionStorage.setItem("buyNowItem", JSON.stringify({
        productId: product._id,
        quantity: quantity,
        size: selectedSize,
      }));

      navigate("/checkout");
    } catch (error) {
      console.error("Error processing buy now:", error);
      alert("Error processing your request");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="flex-grow-1 bg-light py-4">
        <div className="container-fluid">
          {/* Breadcrumb */}
          <nav className="mb-4" aria-label="breadcrumb">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item">
                <a href="/" className="text-decoration-none text-muted">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a href="/" className="text-decoration-none text-muted">
                  {product.category}
                </a>
              </li>
              <li className="breadcrumb-item active text-dark">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="row g-4">
            {/* Left: Product Images */}
            <div className="col-lg-5">
              <div className="product-image-section bg-white rounded-3 p-3">
                <div
                  className="product-image-container d-flex align-items-center justify-content-center bg-white rounded-2 position-relative"
                  style={{
                    height: "500px",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {images && images[currentImageIndex] ? (
                    <img
                      src={images[currentImageIndex]}
                      alt={product.name}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <span style={{ fontSize: "120px" }}>📦</span>
                  )}

                  {/* Navigation Arrows - Only show if multiple images */}
                  {images.length > 1 && (
                    <>
                      <button
                        className="btn btn-light position-absolute start-0 top-50 translate-middle-y ms-2 shadow-sm"
                        onClick={handlePreviousImage}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        className="btn btn-light position-absolute end-0 top-50 translate-middle-y me-2 shadow-sm"
                        onClick={handleNextImage}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Images - Only show if multiple images */}
                {images.length > 1 && (
                  <div className="d-flex gap-2 overflow-auto mt-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`flex-shrink-0 border-2 rounded-2 cursor-pointer ${
                          currentImageIndex === idx
                            ? "border-dark"
                            : "border-light"
                        }`}
                        style={{
                          width: "80px",
                          height: "80px",
                          backgroundColor: "#f5f5f5",
                          cursor: "pointer",
                          overflow: "hidden",
                        }}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="col-lg-7">
              <div className="bg-white rounded-3 p-4 p-md-5">
                {/* Title and Price */}
                <h1 className="h3 fw-bold mb-4">{product.name}</h1>

                {/* Price Section */}
                <div className="mb-4">
                  <h2 className="h2 fw-bold text-dark mb-2">
                    ₹{product.price.toLocaleString("en-IN")}
                  </h2>
                  <div className="badge bg-danger mb-3">Sale</div>
                  <div className="small text-muted">
                    Original Price: ₹{product.old_price.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted mb-4">{product.description}</p>

                {/* Size Selection */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Select Size</h6>
                  <div className="d-flex gap-2 flex-wrap">
                    {allSizes.map((size) => {
                      const isAvailable = availableSizes.includes(size);
                      return (
                        <button
                          key={size}
                          className={`btn border-2 fw-bold ${
                            !isAvailable
                              ? "btn-light border-light text-muted"
                              : selectedSize === size
                              ? "btn-dark border-dark"
                              : "btn-outline-dark"
                          }`}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          style={{ minWidth: "50px" }}
                          title={!isAvailable ? "Out of stock" : ""}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Quantity</h6>
                  <div className="d-flex align-items-center gap-3">
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      style={{ maxWidth: "80px" }}
                    />
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3 mb-3">
                  <button
                    className="btn btn-dark btn-lg fw-bold flex-fill d-flex align-items-center justify-content-center gap-2"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart size={20} />
                    ADD TO BAG
                  </button>
                  <button
                    className="btn btn-outline-dark btn-lg fw-bold flex-fill d-flex align-items-center justify-content-center gap-2"
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                  >
                    <Zap size={20} />
                    BUY NOW
                  </button>
                </div>

                {/* Product Info */}
                <hr className="my-4" />
                <div className="small text-muted">
                  <p className="mb-2">
                    <strong>HANDPICKED STYLES | ASSURED QUALITY</strong>
                  </p>
                  <p className="mb-0">
                    Our model wears a Size M, with Height 5'11" and Chest 33"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
