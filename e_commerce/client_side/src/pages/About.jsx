import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  Zap,
  Globe,
  Shield,
  Rocket,
  TrendingUp,
  Users,
  CheckCircle,
  Truck,
  Award,
  Headphones,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const gradientStyle =
    "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)";
  const gradientPurple = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  const gradientPink = "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ background: "#f8f9fa" }}
    >
      <Navbar />
      <div className="flex-grow-1">
        {/* Navigation */}
        {/* <div
          className="border-bottom bg-white py-3 sticky-top"
          style={{ top: "50px" }}
        >
          <div className="container">
            <button
              onClick={() => navigate("/")}
              className="btn btn-link text-dark p-0 d-flex align-items-center gap-2"
            >
              <ArrowLeft size={20} /> Back to Home
            </button>
          </div>
        </div> */}

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
              <center>
                <div className="col-lg-6">
                  <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                    {/* <img
                      src="/Media (1).jpg"
                      alt="Fashion Hub Logo"
                      style={{ height: "60px", width: "auto", objectFit: "contain" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    /> */}
                    <h1
                      className="display-4 fw-bold mb-0"
                      style={{ lineHeight: "1.2" }}
                    >
                      Welcome to{" "}
                      <span
                        style={{
                          
                          textDecorationColor: "#f093fb",
                        }}
                      >
                        FASHION HUB
                      </span>
                    </h1>
                  </div>
                  <p
                    className="lead mb-4"
                    style={{
                      fontSize: "1.1rem",
                      opacity: 0.95,
                      lineHeight: "1.6",
                    }}
                  >
                    Your ultimate destination for trendy, stylish, and
                    affordable fashion that empowers you to express yourself and
                    stand out from the crowd. Discover quality clothing for the
                    entire family at unbeatable prices.
                  </p>
                  <div className="d-flex gap-3 flex-wrap" style={{ justifyContent: "space-between" }}>
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
              </center>
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
            {/* Mission Card */}
            <div className="col-lg-6">
              <div
                className="card border-0 h-100 overflow-hidden shadow-sm"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(102, 126, 234, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "250px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=350&fit=crop&ixlib=rb-4.0.3"
                    alt="Our Mission"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x350?text=Our+Mission";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: gradientPurple,
                      opacity: 0.85,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <Rocket size={60} />
                    <h5 className="fw-bold text-white text-center">
                      Our Mission
                    </h5>
                  </div>
                </div>
                <div className="card-body p-4">
                  <p
                    className="card-text"
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      color: "#555",
                    }}
                  >
                    To revolutionize fashion retail by providing high-quality,
                    trendy products at unbeatable prices with exceptional
                    customer service that empowers every individual to express
                    their unique style and personality.
                  </p>
                  <div className="d-flex gap-3 mt-4 flex-wrap">
                    <span
                      className="badge bg-light text-dark border"
                      style={{ fontSize: "12px" }}
                    >
                      Quality First
                    </span>
                    <span
                      className="badge bg-light text-dark border"
                      style={{ fontSize: "12px" }}
                    >
                      Customer Focused
                    </span>
                    <span
                      className="badge bg-light text-dark border"
                      style={{ fontSize: "12px" }}
                    >
                      Affordable
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="col-lg-6">
              <div
                className="card border-0 h-100 overflow-hidden shadow-sm"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(245, 87, 108, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "250px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="https://pearlwebsitecdn-prod-d8bgbfaqbgcghcfw.a01.azurefd.net/drupal-files/inline-images/Vision%20Board%20for%20Aspiring%20Fashion%20Designers%204.png"
                    alt="Our Vision"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x350?text=Our+Vision";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: gradientPink,
                      opacity: 0.85,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <Globe size={60} />
                    <h5 className="fw-bold text-white text-center">
                      Our Vision
                    </h5>
                  </div>
                </div>
                <div className="card-body p-4">
                  <p
                    className="card-text"
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      color: "#555",
                    }}
                  >
                    To become India's most trusted fashion destination by
                    delivering diverse, trendy collections for Men, Women, and
                    Kids with uncompromising quality, innovation, and amazing
                    customer experiences that exceed expectations.
                  </p>
                  <div className="d-flex gap-3 mt-4 flex-wrap">
                    <span
                      className="badge bg-light text-dark border"
                      style={{ fontSize: "12px" }}
                    >
                      Innovation
                    </span>
                    <span
                      className="badge bg-light text-dark border"
                      style={{ fontSize: "12px" }}
                    >
                      Diversity
                    </span>
                    <span
                      className="badge bg-light text-dark border"
                      style={{ fontSize: "12px" }}
                    >
                      Excellence
                    </span>
                  </div>
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
                  <p className="text-white" style={{ opacity: 0.9 }}>
                    Happy Customers
                  </p>
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
                  <p className="text-white" style={{ opacity: 0.9 }}>
                    Products Available
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div style={{ padding: "30px" }}>
                  <h3 className="display-5 fw-bold mb-2">48H</h3>
                  <p className="text-white" style={{ opacity: 0.9 }}>
                    Fast Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Why Choose Fashion Hub?</h2>
            <p
              className="text-muted"
              style={{ maxWidth: "600px", margin: "0 auto" }}
            >
              We're committed to delivering exceptional fashion experiences with
              quality products, affordable prices, and outstanding customer
              service.
            </p>
          </div>
          <div className="row g-4">
            {/* Trendy Collections */}
            <div className="col-lg-3 col-md-6">
              <div
                className="card border-0 h-100 overflow-hidden shadow-sm"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(102, 126, 234, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                }}
              >
                <div
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    background: "#f0f0f0",
                  }}
                >
                  <img
                    src="https://www.shauryasanadhya.com/cdn/shop/articles/Clothing_Brands_for_Women_in_India_e2c64f11-eb87-4d1f-8c8d-e0d181a2164d.jpg?v=1767815764"
                    alt="Trendy Collections"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x250?text=Trendy+Collections";
                    }}
                  />
                </div>
                <div className="card-body p-4 text-center">
                  <div className="mb-3" style={{ fontSize: "50px" }}>
                    ✨
                  </div>
                  <h5 className="card-title fw-bold mb-2">
                    Trendy Collections
                  </h5>
                  <p
                    className="card-text text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Latest fashion trends updated regularly to keep you in
                    style.
                  </p>
                </div>
              </div>
            </div>

            {/* Best Prices */}
            <div className="col-lg-3 col-md-6">
              <div
                className="card border-0 h-100 overflow-hidden shadow-sm"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(240, 147, 251, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                }}
              >
                <div
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    background: "#f0f0f0",
                  }}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRRYyfLsoLsnaBvDv5AOw5jcX8sEMaDfzKHw&s"
                    alt="Best Prices"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x250?text=Best+Prices";
                    }}
                  />
                </div>
                <div className="card-body p-4 text-center">
                  <div className="mb-3" style={{ fontSize: "50px" }}>
                    💰
                  </div>
                  <h5 className="card-title fw-bold mb-2">Best Prices</h5>
                  <p
                    className="card-text text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Affordable fashion without compromising on quality or style.
                  </p>
                </div>
              </div>
            </div>

            {/* Fast Delivery */}
            <div className="col-lg-3 col-md-6">
              <div
                className="card border-0 h-100 overflow-hidden shadow-sm"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(0, 212, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                }}
              >
                <div
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    background: "#f0f0f0",
                  }}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1f-HjBliN8lAOdCFjWuSl46C2t2ppqqs97A&s"
                    alt="Fast Delivery"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x250?text=Fast+Delivery";
                    }}
                  />
                </div>
                <div className="card-body p-4 text-center">
                  <div className="mb-3" style={{ fontSize: "50px" }}>
                    ⚡
                  </div>
                  <h5 className="card-title fw-bold mb-2">Fast Delivery</h5>
                  <p
                    className="card-text text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Swift shipping with real-time tracking for your peace of
                    mind.
                  </p>
                </div>
              </div>
            </div>

            {/* Secure Shopping */}
            <div className="col-lg-3 col-md-6">
              <div
                className="card border-0 h-100 overflow-hidden shadow-sm"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(245, 87, 108, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                }}
              >
                <div
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    background: "#f0f0f0",
                  }}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaRK_6yoIXhuJNJAtEuuHB9Qmyarwv7hlKyA&s"
                    alt="Secure Shopping"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x250?text=Secure+Shopping";
                    }}
                  />
                </div>
                <div className="card-body p-4 text-center">
                  <div className="mb-3" style={{ fontSize: "50px" }}>
                    🔒
                  </div>
                  <h5 className="card-title fw-bold mb-2">Secure Shopping</h5>
                  <p
                    className="card-text text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Your data and payments are protected with industry-leading
                    security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Features Grid */}
        <div className="bg-light py-5">
          <div className="container">
            <h3 className="text-center fw-bold mb-5">
              More Reasons to Love Us
            </h3>
            <div className="row g-4">
              {/* Quality Assured */}
              <div className="col-md-6 col-lg-3">
                <div
                  className="card border-0 h-100 overflow-hidden shadow-sm"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                  }}
                >
                  <div className="card-body text-center p-4">
                    <Award
                      size={40}
                      style={{ color: "#667eea", marginBottom: "15px" }}
                    />
                    <h6 className="fw-bold mb-2">Quality Assured</h6>
                    <small className="text-muted">
                      Every product is carefully curated and quality checked.
                    </small>
                  </div>
                </div>
              </div>

              {/* 24/7 Support */}
              <div className="col-md-6 col-lg-3">
                <div
                  className="card border-0 h-100 overflow-hidden shadow-sm"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                  }}
                >
                  <div className="card-body text-center p-4">
                    <Headphones
                      size={40}
                      style={{ color: "#f093fb", marginBottom: "15px" }}
                    />
                    <h6 className="fw-bold mb-2">24/7 Support</h6>
                    <small className="text-muted">
                      Our dedicated team is always ready to help you.
                    </small>
                  </div>
                </div>
              </div>

              {/* Easy Returns */}
              <div className="col-md-6 col-lg-3">
                <div
                  className="card border-0 h-100 overflow-hidden shadow-sm"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                  }}
                >
                  <div className="card-body text-center p-4">
                    <Truck
                      size={40}
                      style={{ color: "#00d4ff", marginBottom: "15px" }}
                    />
                    <h6 className="fw-bold mb-2">Easy Returns</h6>
                    <small className="text-muted">
                      Hassle-free returns within 30 days.
                    </small>
                  </div>
                </div>
              </div>

              {/* Exclusive Offers */}
              <div className="col-md-6 col-lg-3">
                <div
                  className="card border-0 h-100 overflow-hidden shadow-sm"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                  }}
                >
                  <div className="card-body text-center p-4">
                    <Zap
                      size={40}
                      style={{ color: "#f5576c", marginBottom: "15px" }}
                    />
                    <h6 className="fw-bold mb-2">Exclusive Offers</h6>
                    <small className="text-muted">
                      Regular discounts and exclusive member benefits.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="py-5 text-white position-relative overflow-hidden"
          style={{
            background: gradientStyle,
          }}
        >
          <div className="container position-relative" style={{ zIndex: 2 }}>
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <h2 className="fw-bold mb-3" style={{ fontSize: "2.5rem" }}>
                  Ready to Transform Your Wardrobe?
                </h2>
                <p
                  className="lead mb-4"
                  style={{ fontSize: "1.1rem", opacity: 0.95 }}
                >
                  Discover thousands of amazing styles that match your
                  personality and express your unique fashion sense.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <button
                    className="btn btn-light fw-bold px-4 py-2"
                    onClick={() => navigate("/")}
                  >
                    Shop Now 🛍️
                  </button>
                  <button
                    className="btn btn-outline-light fw-bold px-4 py-2"
                    onClick={() => navigate("/category/women")}
                  >
                    Explore Collections
                  </button>
                </div>
              </div>
              <div
                className="col-lg-6 text-center"
                style={{
                  height: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop&ixlib=rb-4.0.3"
                  alt="Fashion Collection"
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "15px",
                    opacity: 0.9,
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/500x600?text=Fashion+Collection";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
