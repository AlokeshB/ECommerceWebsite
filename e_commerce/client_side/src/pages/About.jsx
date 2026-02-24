import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, Zap, Globe, Shield, Rocket, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const gradientStyle = "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)";

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "#f8f9fa" }}>
      <Navbar />
      <div className="flex-grow-1">
        {/* Navigation */}
        <div className="border-bottom bg-white py-3 sticky-top" style={{ top: "50px" }}>
          <div className="container">
            <button
              onClick={() => navigate("/")}
              className="btn btn-link text-dark p-0 d-flex align-items-center gap-2"
            >
              <ArrowLeft size={20} /> Back to Home
            </button>
          </div>
        </div>

        {/* Hero Section with Animated Gradient */}
        <div
          className="py-5"
          style={{
            background: gradientStyle,
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="container py-5">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <h1 className="display-3 fw-bold mb-3" style={{ lineHeight: "1.2" }}>
                  Welcome to <span style={{ textDecoration: "underline", textDecorationColor: "#f093fb" }}>Fashion Hub</span>
                </h1>
                <p className="lead mb-4" style={{ fontSize: "1.3rem", opacity: 0.95 }}>
                  Your ultimate destination for trendy, stylish, and affordable fashion that
                  empowers you to express yourself.
                </p>
                <div className="d-flex gap-3">
                  <button
                    className="btn btn-light fw-bold px-4 py-2"
                    onClick={() => navigate("/")}
                  >
                    Start Shopping 🛍️
                  </button>
                  <button
                    className="btn btn-outline-light fw-bold px-4 py-2"
                    onClick={() => navigate("/category/men")}
                  >
                    Explore Collections
                  </button>
                </div>
              </div>
              <div className="col-lg-6 text-center">
                <div
                  style={{
                    fontSize: "150px",
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  👗
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          `}</style>
        </div>

        {/* Mission & Vision Cards */}
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-md-6">
              <div
                className="card border-0 h-100 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  boxShadow: "0 10px 40px rgba(102, 126, 234, 0.3)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop"
                  alt="Mission"
                  style={{ height: "200px", objectFit: "cover", opacity: 0.2 }}
                />
                <div className="card-body p-4 position-relative" style={{ zIndex: 1 }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Rocket size={40} />
                    <h5 className="card-title fw-bold mb-0">Our Mission</h5>
                  </div>
                  <p className="card-text" style={{ opacity: 0.95 }}>
                    To revolutionize fashion retail by providing high-quality products at unbeatable
                    prices with exceptional service that empowers every individual to express their
                    unique style.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="card border-0 h-100 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                  boxShadow: "0 10px 40px rgba(245, 87, 108, 0.3)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a5?w=500&h=300&fit=crop"
                  alt="Vision"
                  style={{ height: "200px", objectFit: "cover", opacity: 0.2 }}
                />
                <div className="card-body p-4 position-relative" style={{ zIndex: 1 }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Globe size={40} />
                    <h5 className="card-title fw-bold mb-0">Our Vision</h5>
                  </div>
                  <p className="card-text" style={{ opacity: 0.95 }}>
                    To become India's most trusted fashion hub by delivering diverse, trendy
                    collections for Men, Women, and Kids with uncompromising quality and amazing
                    customer experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ background: gradientStyle }} className="text-white py-5">
          <div className="container">
            <div className="row text-center g-4">
              <div className="col-md-4">
                <div style={{ padding: "30px" }}>
                  <h3 className="display-5 fw-bold mb-2">50K+</h3>
                  <p className="text-white" style={{ opacity: 0.9 }}>Happy Customers</p>
                </div>
              </div>
              <div
                className="col-md-4"
                style={{
                  borderLeft: "1px solid rgba(255,255,255,0.2)",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div style={{ padding: "30px" }}>
                  <h3 className="display-5 fw-bold mb-2">10K+</h3>
                  <p className="text-white" style={{ opacity: 0.9 }}>Products Available</p>
                </div>
              </div>
              <div className="col-md-4">
                <div style={{ padding: "30px" }}>
                  <h3 className="display-5 fw-bold mb-2">48H</h3>
                  <p className="text-white" style={{ opacity: 0.9 }}>Fast Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container py-5">
          <h2 className="text-center fw-bold mb-5">Why Choose Fashion Hub?</h2>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div
                className="card border-0 h-100 overflow-hidden"
                style={{
                  background: "rgba(102, 126, 234, 0.1)",
                  borderLeft: "4px solid #667eea",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(102, 126, 234, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=150&fit=crop"
                  alt="Trends"
                  style={{
                    height: "150px",
                    objectFit: "cover",
                    opacity: 0.3,
                  }}
                />
                <div className="card-body p-4 text-center">
                  <div style={{ fontSize: "50px", marginBottom: "15px" }}>🎨</div>
                  <h5 className="card-title fw-bold mb-2">Trendy Collections</h5>
                  <p className="card-text text-muted">
                    Latest fashion trends updated regularly.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div
                className="card border-0 h-100 overflow-hidden"
                style={{
                  background: "rgba(240, 147, 251, 0.1)",
                  borderLeft: "4px solid #f093fb",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(240, 147, 251, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1575260051383-30fbc6905ee1?w=300&h=150&fit=crop"
                  alt="Prices"
                  style={{
                    height: "150px",
                    objectFit: "cover",
                    opacity: 0.3,
                  }}
                />
                <div className="card-body p-4 text-center">
                  <div style={{ fontSize: "50px", marginBottom: "15px" }}>💰</div>
                  <h5 className="card-title fw-bold mb-2">Best Prices</h5>
                  <p className="card-text text-muted">
                    Affordable without compromising quality.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div
                className="card border-0 h-100 overflow-hidden"
                style={{
                  background: "rgba(0, 212, 255, 0.1)",
                  borderLeft: "4px solid #00d4ff",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 212, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=150&fit=crop"
                  alt="Delivery"
                  style={{
                    height: "150px",
                    objectFit: "cover",
                    opacity: 0.3,
                  }}
                />
                <div className="card-body p-4 text-center">
                  <div style={{ fontSize: "50px", marginBottom: "15px" }}>⚡</div>
                  <h5 className="card-title fw-bold mb-2">Fast Delivery</h5>
                  <p className="card-text text-muted">
                    Swift shipping with real-time tracking.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div
                className="card border-0 h-100 overflow-hidden"
                style={{
                  background: "rgba(245, 87, 108, 0.1)",
                  borderLeft: "4px solid #f5576c",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(245, 87, 108, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1579165466741-7664c59ea290?w=300&h=150&fit=crop"
                  alt="Security"
                  style={{
                    height: "150px",
                    objectFit: "cover",
                    opacity: 0.3,
                  }}
                />
                <div className="card-body p-4 text-center">
                  <div style={{ fontSize: "50px", marginBottom: "15px" }}>🔒</div>
                  <h5 className="card-title fw-bold mb-2">Secure Shopping</h5>
                  <p className="card-text text-muted">
                    Your data and payments are protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Features Grid */}
        <div className="bg-light py-5">
          <div className="container">
            <h3 className="text-center fw-bold mb-5">More Reasons to Love Us</h3>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="d-flex gap-3 p-3 bg-white rounded">
                  <div style={{ fontSize: "40px" }}>✅</div>
                  <div>
                    <h6 className="fw-bold">Quality Assured</h6>
                    <small className="text-muted">Every product is carefully curated and quality checked.</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex gap-3 p-3 bg-white rounded">
                  <div style={{ fontSize: "40px" }}>🤝</div>
                  <div>
                    <h6 className="fw-bold">24/7 Support</h6>
                    <small className="text-muted">Our dedicated team is always ready to help you.</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex gap-3 p-3 bg-white rounded">
                  <div style={{ fontSize: "40px" }}>🔄</div>
                  <div>
                    <h6 className="fw-bold">Easy Returns</h6>
                    <small className="text-muted">Hassle-free returns within 30 days.</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex gap-3 p-3 bg-white rounded">
                  <div style={{ fontSize: "40px" }}>🎁</div>
                  <div>
                    <h6 className="fw-bold">Exclusive Offers</h6>
                    <small className="text-muted">Regular discounts and exclusive member benefits.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="py-5 text-white text-center"
          style={{
            background: gradientStyle,
          }}
        >
          <div className="container">
            <h2 className="fw-bold mb-3">Ready to Transform Your Wardrobe?</h2>
            <p className="lead mb-4" style={{ fontSize: "1.1rem" }}>
              Discover thousands of amazing styles that match your personality.
            </p>
            <button
              className="btn btn-light fw-bold btn-lg px-5"
              onClick={() => navigate("/")}
            >
              Explore Now →
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
