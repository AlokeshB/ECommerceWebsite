import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PRODUCTS } from "../data/products";
import { CATEGORY_DATA } from "../components/categories";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CategoryProducts.css";

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  // Get category data
  const categoryData = CATEGORY_DATA.find(
    (cat) => cat.id.toLowerCase() === category.toLowerCase()
  );

  // Get products for this category
  const categoryProducts = PRODUCTS.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );

  // State for sorting
  const [sortBy, setSortBy] = useState("relevance");

  // Apply sorting to products
  const sortedProducts = [...categoryProducts].sort((a, b) => {
    if (sortBy === "price-low-to-high") {
      return a.price - b.price;
    } else if (sortBy === "price-high-to-low") {
      return b.price - a.price;
    }
    // Default: relevance (original order)
    return 0;
  });

  if (!categoryData) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h2>Category not found</h2>
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
              <li className="breadcrumb-item active text-dark fw-bold">
                {categoryData.title}
              </li>
            </ol>
          </nav>

          {/* Header with Title and Sort Dropdown */}
          <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <h3 className="fw-bold mb-1">{categoryData.title}</h3>
              <p className="text-muted small mb-0">
                Showing {sortedProducts.length} products
              </p>
            </div>
            <div className="w-100 w-md-auto">
              <label className="form-label small fw-bold me-2 d-block d-md-inline">Sort by:</label>
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ maxWidth: "100%", maxWidth: "200px" }}
              >
                <option value="relevance">Relevance</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="row g-3">
              {sortedProducts.map((product) => (
                <div key={product.id} className="col-sm-6 col-lg-3">
                  <div
                    className="bg-white rounded-3 overflow-hidden product-card h-100 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
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
                          <p className="fw-bold mb-0">
                            ₹{product.price.toLocaleString("en-IN")}
                          </p>
                          <p className="text-muted text-decoration-line-through small mb-0">
                            ₹{product.old_price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <span className="badge bg-danger">Sale</span>
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryProducts;
