import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { PRODUCTS } from "../data/products";

const Home = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    if (!user) {
      alert("Please login to purchase items!");
      navigate("/login");
      return;
    }
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <main className="flex-grow-1 p-4">
        <div className="container">
          {/* Hero Section */}
          <div className="bg-dark text-white rounded-2 p-5 mb-4 text-center">
            <h1 className="display-4 fw-bold">Welcome to FASHION-HUB</h1>
            <p className="lead mb-0">Discover the best deals on premium fashion today</p>
          </div>

          {/* Products Grid */}
          <h4 className="fw-bold mb-4">Featured Products</h4>
          <div className="row g-3 g-md-4">
            {PRODUCTS.map((product) => (
              <div className="col-6 col-md-4 col-lg-3" key={product.id}>
                <div className="card border-0 shadow-sm h-100 overflow-hidden">
                  {/* Product Image */}
                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "180px" }}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      ) : (
                        <span style={{ fontSize: "60px" }}>📦</span>
                      )}
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="card-body p-2 p-md-3">
                    <span className="badge bg-light text-dark border mb-2" style={{ fontSize: "10px" }}>
                      {product.category}
                    </span>
                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                      <h6 className="fw-bold text-truncate mb-1">{product.name}</h6>
                    </Link>
                    <p className="text-dark fw-bold mb-2">₹{product.price.toLocaleString("en-IN")}</p>

                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-dark btn-sm flex-fill d-flex align-items-center justify-content-center gap-1" onClick={() => addToCart(product)}>
                        <ShoppingCart size={14} />
                        <span style={{ fontSize: "12px" }}>Add</span>
                      </button>
                      <button className="btn btn-dark btn-sm flex-fill d-flex align-items-center justify-content-center gap-1" onClick={() => handleBuyNow(product)}>
                        <Zap size={14} />
                        <span style={{ fontSize: "12px" }}>Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;