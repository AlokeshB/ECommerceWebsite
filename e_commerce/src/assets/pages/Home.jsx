import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";

const Home = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate("/cart"); // Redirect immediately
  };
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* 1. Top Navigation */}
      <Navbar />

      {/* 2. Main Layout Area (Sidebar + Content) */}
      <div className="d-flex flex-grow-1 container-fluid px-0">
        {/* Left Sidebar (Hidden on small mobile screens ideally, but visible for now) */}
        <aside className="d-none d-md-block">
          <Sidebar />
        </aside>

        {/* Right Main Content */}
        <main className="flex-grow-1 p-4">
          <div className="container">
            {/* Hero Section / Banner Placeholder */}
            <div className="bg-primary text-white rounded-3 p-5 mb-4 shadow-sm text-center">
              <h1 className="display-4 fw-bold">Welcome to FASHIONIFY</h1>
              <p className="lead">
                Discover the best deals on premium products today.
              </p>
              <button className="btn btn-light fw-bold px-4 py-2 mt-2">
                Shop Now
              </button>
            </div>

            {/* Product Grid Placeholder to show layout works */}
            <h4 className="fw-bold mb-3">Featured Products</h4>
            <div className="row g-3 g-md-4">
              {" "}
              {/* Increased gutter for better spacing on desktop */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                <div className="col-6 col-sm-6 col-md-4 col-lg-3" key={item}>
                  <div className="card border-0 shadow-sm h-100 overflow-hidden">
                    {/* Product Image Area */}
                    <div
                      className="card-body d-flex align-items-center justify-content-center bg-light"
                      style={{ height: "160px" }}
                    >
                      <span className="text-muted small fw-bold text-uppercase">
                        Product {item}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="card-body p-2 p-md-3">
                      <h6
                        className="fw-bold text-truncate mb-1"
                        title={`Sample Product ${item}`}
                      >
                        Sample Product {item}
                      </h6>
                      <p className="text-primary fw-bold mb-2">₹999.00</p>

                      {/* Responsive Buttons Container */}
                      <div className="d-flex flex-column flex-xl-row gap-2 mt-2">
                        <button
                          className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 px-1"
                          onClick={() => addToCart(item)}
                        >
                          <ShoppingCart size={14} />{" "}
                          <span style={{ fontSize: "12px" }}>Add to Cart</span>
                        </button>
                        <button
                          className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 px-1"
                          onClick={() => handleBuyNow(item)}
                        >
                          <Zap size={14} />{" "}
                          <span style={{ fontSize: "12px" }}>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* 3. Bottom Footer */}
      <Footer />
    </div>
  );
};

export default Home;
