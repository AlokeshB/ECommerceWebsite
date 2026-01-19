import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Import Auth to check login status

// 1. UNIQUE PRODUCT DATA (Fixes the "same card repeating" issue)
// const PRODUCTS = [
//   {
//     id: 101,
//     name: "Premium Wireless Headphones",
//     price: 2999,
//     img: "🎧",
//     category: "Electronics",
//   },
//   {
//     id: 102,
//     name: "Smart Fitness Watch",
//     price: 4500,
//     img: "⌚",
//     category: "Wearables",
//   },
//   {
//     id: 103,
//     name: "Classic Denim Jacket",
//     price: 1899,
//     img: "🧥",
//     category: "Fashion",
//   },
//   {
//     id: 104,
//     name: "Running Sports Shoes",
//     price: 3200,
//     img: "👟",
//     category: "Fashion",
//   },
//   {
//     id: 105,
//     name: "Leather Travel Wallet",
//     price: 899,
//     img: "👛",
//     category: "Accessories",
//   },
//   {
//     id: 106,
//     name: "Mechanical Gaming Keyboard",
//     price: 5499,
//     img: "⌨️",
//     category: "Electronics",
//   },
//   {
//     id: 107,
//     name: "Polarized Sunglasses",
//     price: 1200,
//     img: "🕶️",
//     category: "Fashion",
//   },
//   {
//     id: 108,
//     name: "Portable Bluetooth Speaker",
//     price: 2100,
//     img: "🔊",
//     category: "Electronics",
//   },
// ];

const Home = () => {
  const { addToCart } = useCart();
  const { user } = useAuth(); // Access global user state
  const navigate = useNavigate();

  // 2. PROTECTED BUY NOW LOGIC
  const handleBuyNow = (product) => {
    if (!user) {
      // If not logged in, alert and don't proceed.
      // The Navbar Login modal will handle the actual login.
      alert("Please login to purchase items!");
      return;
    }

    // If logged in, add to cart and go to checkout/cart
    addToCart(product);
    navigate("/cart");
  };

  const handleAddToCart = (product) => {
    // Add unique product object to cart
    addToCart(product);
    // Optional: show a small toast or notification
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <div className="d-flex flex-grow-1 container-fluid px-0">
        <aside className="d-none d-md-block">
          <Sidebar />
        </aside>

        <main className="flex-grow-1 p-4">
          <div className="container">
            {/* Hero Section */}
            <div className="bg-primary text-white rounded-3 p-5 mb-4 shadow-sm text-center animate__animated animate__fadeIn">
              <h1 className="display-4 fw-bold">Welcome to FASHIONIFY</h1>
              <p className="lead">
                Discover the best deals on premium products today.
              </p>
              <button className="btn btn-light fw-bold px-4 py-2 mt-2 shadow-sm">
                Shop Now
              </button>
            </div>

            <h4 className="fw-bold mb-3">Featured Products</h4>

            {/* 3. DYNAMIC PRODUCT GRID */}
            <div className="row g-3 g-md-4">
              {PRODUCTS.map((product) => (
                <div
                  className="col-6 col-sm-6 col-md-4 col-lg-3"
                  key={product.id}
                >
                  <div className="card border-0 shadow-sm h-100 overflow-hidden product-card">
                    {/* Product Image Area */}
                    <div
                      className="card-body d-flex align-items-center justify-content-center bg-white"
                      style={{ height: "180px", fontSize: "60px" }}
                    >
                      {product.img}
                    </div>

                    {/* Product Details */}
                    <div className="card-body p-2 p-md-3">
                      <div className="mb-1">
                        <span
                          className="badge bg-light text-primary border mb-2"
                          style={{ fontSize: "10px" }}
                        >
                          {product.category}
                        </span>
                      </div>
                      <h6
                        className="fw-bold text-truncate mb-1"
                        title={product.name}
                      >
                        {product.name}
                      </h6>
                      <p className="text-primary fw-bold mb-2">
                        ₹{product.price.toLocaleString("en-IN")}.00
                      </p>

                      <div className="d-flex flex-column flex-xl-row gap-2 mt-2">
                        <button
                          className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 px-1"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart size={14} />
                          <span style={{ fontSize: "12px" }}>Add to Cart</span>
                        </button>
                        <button
                          className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 px-1"
                          onClick={() => handleBuyNow(product)}
                        >
                          <Zap size={14} />
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

      <Footer />
    </div>
  );
};

export default Home;
