import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader2 } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CategoryProducts.css";

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");

  const getEffectivePrice = (product) => {
    if (product.discountPrice) {
      return product.discountPrice;
    }
    if (product.discountPercentage && product.discountPercentage > 0) {
      return product.price * (1 - product.discountPercentage / 100);
    }
    return product.price;
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setError(null);
        const response = await fetch(`http://localhost:5000/api/products/category/${category}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || `HTTP ${response.status}: Failed to fetch products`);
        }
        
        if (data.success) {
          setProducts(data.products || []);
        } else {
          throw new Error(data.message || 'No products found');
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryProducts();
    } else {
      setError('Invalid category');
      setLoading(false);
    }
  }, [category]);

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = getEffectivePrice(a);
    const priceB = getEffectivePrice(b);

    if (sortBy === "price-low-to-high") {
      return priceA - priceB;
    } else if (sortBy === "price-high-to-low") {
      return priceB - priceA;
    }
    return 0;
  });

  const categoryTitle = category ? (category.charAt(0).toUpperCase() + category.slice(1)) : 'Category';

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="flex-grow-1 bg-light py-4">
        <div className="container-fluid">
          <nav className="mb-4" aria-label="breadcrumb">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item">
                <a href="/" className="text-decoration-none text-muted">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item active text-dark fw-bold">
                {categoryTitle}
              </li>
            </ol>
          </nav>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
              <Loader2 className="spinner-border text-dark" />
            </div>
          ) : error ? (
            <div className="bg-white rounded-3 p-5 text-center">
              <i className="bi bi-exclamation-triangle-fill fs-1 text-warning mb-3"></i>
              <h5 className="text-danger mb-3">Error loading products</h5>
              <p className="text-muted mb-4">{error}</p>
              <button 
                className="btn btn-outline-primary me-2" 
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
              <button className="btn btn-dark" onClick={() => navigate('/')}>
                Home
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                <div>
                  <h3 className="fw-bold mb-1">{categoryTitle}</h3>
                  <p className="text-muted small mb-0 text-nowrap">
                    Showing {sortedProducts.length} products
                  </p>
                </div>
                <div className="w-100 w-md-auto d-flex align-items-center justify-content-end">
                  <label className="form-label small fw-bold me-2 d-block d-md-inline">Sort by:</label>
                  <select
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ maxWidth: "200px" }}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low-to-high">Price: Low to High</option>
                    <option value="price-high-to-low">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {sortedProducts.length > 0 ? (
                <div className="row g-3">
                  {sortedProducts.map((product) => (
                    <div key={product._id} className="col-12 col-sm-6 col-lg-3">
                      <div
                        className="bg-white rounded-3 overflow-hidden product-card h-100 cursor-pointer"
                        onClick={() => navigate(`/product/${product._id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          className="product-image-wrapper bg-light d-flex align-items-center justify-content-center"
                          style={{ height: "300px" }}
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
                            />
                          ) : (
                            <span style={{ fontSize: "60px" }}>📦</span>
                          )}
                        </div>
                        <div className="p-3">
                          <h6 className="fw-bold mb-2 text-truncate">
                            {product.name}
                          </h6>
                          <p className="text-muted small mb-2">
                            {product.subCategory}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="fw-bold mb-0 h5">
                                ₹{getEffectivePrice(product).toLocaleString("en-IN")}
                              </p>
                              {(product.discountPercentage > 0 || product.discountPrice) && (
                                <p className="text-muted text-decoration-line-through small mb-0">
                                  ₹{product.price.toLocaleString("en-IN")}
                                </p>
                              )}
                              {product.maxRedeemCoins > 0 && (
                                <div className="mt-1">
                                  <span className="badge bg-warning small">
                                    Max {product.maxRedeemCoins} coins
                                  </span>
                                </div>
                              )}
                            </div>
                            {(product.discountPercentage > 0 || product.discountPrice) && (
                              <span className="badge bg-danger">Sale</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3 p-5 text-center">
                  <p className="text-muted mb-3">No products found in this category</p>
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => navigate("/")}
                  >
                    Back to Home
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryProducts;

