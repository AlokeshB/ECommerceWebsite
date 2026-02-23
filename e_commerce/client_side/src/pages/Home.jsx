import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Zap, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
    if (!user) {
      alert("Please login to purchase items!");
      navigate("/login");
      return;
    }
    
    // Store product for single-item checkout
    sessionStorage.setItem("buyNowItem", JSON.stringify({
      productId: product._id,
      quantity: 1,
    }));
    
    navigate("/checkout");
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      alert("Please login to add items!");
      navigate("/login");
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
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Added to cart!");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart. Please try again.");
    }
  };

  const ProductCard = ({ product }) => (
    <div className="col-6 col-md-4 col-lg-3">
      <div className="card border-0 shadow-sm h-100 overflow-hidden">
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "180px" }}>
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            ) : (
              <span style={{ fontSize: "60px" }}>📦</span>
            )}
          </div>
        </Link>

        <div className="card-body p-2 p-md-3">
          <span className="badge bg-light text-dark border mb-2" style={{ fontSize: "10px" }}>
            {product.category}
          </span>
          <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
            <h6 className="fw-bold text-truncate mb-1">{product.name}</h6>
          </Link>
          <p className="text-dark fw-bold mb-2">₹{product.price?.toLocaleString("en-IN") || 0}</p>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-dark btn-sm flex-fill d-flex align-items-center justify-content-center gap-1" onClick={() => handleAddToCart(product)}>
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
      <Footer />
    </div>
  );
};

export default Home;