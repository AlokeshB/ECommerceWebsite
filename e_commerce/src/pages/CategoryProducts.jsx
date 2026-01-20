import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PRODUCTS } from "../data/products";
import { CATEGORY_DATA, TECHNICAL_FILTERS } from "../components/categories";
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

  // State for filters
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedFits, setSelectedFits] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [priceRange, setPriceRange] = useState([1000, 10000]);
  const [expandedFilters, setExpandedFilters] = useState({
    subcategories: true,
    fabric: true,
    fit: false,
    pattern: false,
    price: true,
  });

  // Filter products based on selected filters
  const filteredProducts = categoryProducts.filter((product) => {
    // Subcategory filter
    if (selectedSubcategories.length > 0) {
      if (!selectedSubcategories.includes(product.subCategory)) {
        return false;
      }
    }

    // Fabric filter
    if (selectedFabrics.length > 0) {
      // Assuming fabric info would be in product data
      // For now, we'll skip this check
    }

    // Fit filter
    if (selectedFits.length > 0) {
      // Assuming fit info would be in product data
    }

    // Pattern filter
    if (selectedPatterns.length > 0) {
      // Assuming pattern info would be in product data
    }

    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  const toggleSubcategory = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const toggleFabric = (fabric) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric)
        ? prev.filter((f) => f !== fabric)
        : [...prev, fabric]
    );
  };

  const toggleFit = (fit) => {
    setSelectedFits((prev) =>
      prev.includes(fit) ? prev.filter((f) => f !== fit) : [...prev, fit]
    );
  };

  const togglePattern = (pattern) => {
    setSelectedPatterns((prev) =>
      prev.includes(pattern)
        ? prev.filter((p) => p !== pattern)
        : [...prev, pattern]
    );
  };

  const toggleFilterExpand = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const clearAllFilters = () => {
    setSelectedSubcategories([]);
    setSelectedFabrics([]);
    setSelectedFits([]);
    setSelectedPatterns([]);
    setPriceRange([1000, 10000]);
  };

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

          <div className="row g-4">
            {/* Sidebar with Filters */}
            <div className="col-lg-3">
              <div className="bg-white rounded-3 p-4 sticky-top filter-sidebar">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">FILTERS</h5>
                  <button
                    className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                </div>

                {/* Subcategories Filter */}
                <div className="filter-group mb-4 pb-4 border-bottom">
                  <div
                    className="d-flex justify-content-between align-items-center cursor-pointer mb-3"
                    onClick={() => toggleFilterExpand("subcategories")}
                  >
                    <h6 className="fw-bold mb-0">Categories</h6>
                    {expandedFilters.subcategories ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                  {expandedFilters.subcategories && (
                    <div className="filter-options">
                      {categoryData.subcategories.map((subcat) => (
                        <div key={subcat.name} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`subcat-${subcat.name}`}
                            checked={selectedSubcategories.includes(subcat.name)}
                            onChange={() => toggleSubcategory(subcat.name)}
                          />
                          <label
                            className="form-check-label small"
                            htmlFor={`subcat-${subcat.name}`}
                          >
                            {subcat.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Filter */}
                <div className="filter-group mb-4 pb-4 border-bottom">
                  <div
                    className="d-flex justify-content-between align-items-center cursor-pointer mb-3"
                    onClick={() => toggleFilterExpand("price")}
                  >
                    <h6 className="fw-bold mb-0">Price</h6>
                    {expandedFilters.price ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                  {expandedFilters.price && (
                    <div className="price-filter">
                      <div className="d-flex justify-content-between mb-2 small">
                        <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
                        <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
                      </div>
                      <input
                        type="range"
                        className="form-range w-100"
                        min="1000"
                        max="10000"
                        step="100"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([parseInt(e.target.value), priceRange[1]])
                        }
                      />
                      <input
                        type="range"
                        className="form-range w-100 mt-2"
                        min="1000"
                        max="10000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], parseInt(e.target.value)])
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Fabric Filter */}
                <div className="filter-group mb-4 pb-4 border-bottom">
                  <div
                    className="d-flex justify-content-between align-items-center cursor-pointer mb-3"
                    onClick={() => toggleFilterExpand("fabric")}
                  >
                    <h6 className="fw-bold mb-0">Fabric</h6>
                    {expandedFilters.fabric ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                  {expandedFilters.fabric && (
                    <div className="filter-options">
                      {TECHNICAL_FILTERS[0].options.map((fabric) => (
                        <div key={fabric} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`fabric-${fabric}`}
                            checked={selectedFabrics.includes(fabric)}
                            onChange={() => toggleFabric(fabric)}
                          />
                          <label
                            className="form-check-label small"
                            htmlFor={`fabric-${fabric}`}
                          >
                            {fabric}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fit Filter */}
                <div className="filter-group mb-4 pb-4 border-bottom">
                  <div
                    className="d-flex justify-content-between align-items-center cursor-pointer mb-3"
                    onClick={() => toggleFilterExpand("fit")}
                  >
                    <h6 className="fw-bold mb-0">Fit</h6>
                    {expandedFilters.fit ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                  {expandedFilters.fit && (
                    <div className="filter-options">
                      {TECHNICAL_FILTERS[1].options.map((fit) => (
                        <div key={fit} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`fit-${fit}`}
                            checked={selectedFits.includes(fit)}
                            onChange={() => toggleFit(fit)}
                          />
                          <label
                            className="form-check-label small"
                            htmlFor={`fit-${fit}`}
                          >
                            {fit}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pattern Filter */}
                <div className="filter-group">
                  <div
                    className="d-flex justify-content-between align-items-center cursor-pointer mb-3"
                    onClick={() => toggleFilterExpand("pattern")}
                  >
                    <h6 className="fw-bold mb-0">Pattern</h6>
                    {expandedFilters.pattern ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                  {expandedFilters.pattern && (
                    <div className="filter-options">
                      {TECHNICAL_FILTERS[4].options.map((pattern) => (
                        <div key={pattern} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`pattern-${pattern}`}
                            checked={selectedPatterns.includes(pattern)}
                            onChange={() => togglePattern(pattern)}
                          />
                          <label
                            className="form-check-label small"
                            htmlFor={`pattern-${pattern}`}
                          >
                            {pattern}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              <div className="mb-4">
                <h3 className="fw-bold mb-1">{categoryData.title}</h3>
                <p className="text-muted small mb-0">
                  Showing {filteredProducts.length} products
                </p>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="row g-3">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="col-sm-6 col-lg-4">
                      <div
                        className="bg-white rounded-3 overflow-hidden product-card h-100 cursor-pointer"
                        onClick={() => navigate(`/product/${product.id}`)}
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
                  <p className="text-muted mb-3">No products found matching your filters</p>
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={clearAllFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryProducts;
