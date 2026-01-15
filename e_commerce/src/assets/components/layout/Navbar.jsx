import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  User as UserIcon,
  ShoppingCart,
  X,
  Grid,
  Power,
} from "lucide-react";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Layout.css";
import { CATEGORY_DATA } from "./categories";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();

  // Destructure functions from contexts
  // Ensure these names match exactly what is in your Context Provider 'value' prop
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();

  const [showSearch, setShowSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // 1. Handle Login Success
  const handleLoginSuccess = () => {
    setShowAuthModal(false);
    // No need to set local state; AuthContext handles the 'user' globally
  };

  // 2. Handle Logout
  const handleLogout = (e) => {
    e.stopPropagation(); // Prevent triggering handleUserAction if nested
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  // 3. Handle User Icon / Profile Click
  const handleUserAction = () => {
    if (user) {
      navigate("/profile");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          {/* Brand */}
          <Link
            className="navbar-brand fw-bold text-primary d-flex align-items-center gap-2"
            to="/"
          >
            <span style={{ letterSpacing: "1px" }}>FASHIONIFY</span>
          </Link>

          {/* Categories Button */}
          <button
            className="btn btn-light d-flex align-items-center gap-2 ms-3 border-0 bg-light-subtle text-dark"
            onClick={() => setShowCategoryModal(true)}
            style={{ borderRadius: "20px", padding: "8px 16px" }}
          >
            <Grid size={18} />
            <span className="fw-bold small d-none d-md-inline">Categories</span>
          </button>

          {/* Right Side Icons */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            {/* Search Toggle */}
            <div className="d-flex align-items-center">
              {showSearch ? (
                <div
                  className="input-group input-group-sm animate__animated animate__fadeInRight"
                  style={{ width: "200px" }}
                >
                  <input
                    type="text"
                    className="form-control border-end-0"
                    placeholder="Search..."
                    autoFocus
                  />
                  <button
                    className="btn btn-outline-secondary border-start-0 bg-white"
                    onClick={() => setShowSearch(false)}
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-link text-dark p-0"
                  onClick={() => setShowSearch(true)}
                >
                  <Search size={22} />
                </button>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="btn btn-link text-dark p-0 position-relative"
            >
              <ShoppingCart size={22} />
              {/* Check if getCartCount exists before calling to avoid crash */}
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "10px" }}
              >
                {getCartCount ? getCartCount() : 0}
              </span>
            </Link>

            {/* USER PROFILE & LOGOUT LOGIC */}
            {user ? (
              <div className="d-flex align-items-center gap-3 ps-2 border-start">
                <div
                  className="d-flex align-items-center gap-2"
                  onClick={handleUserAction}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: "32px", height: "32px" }}
                  >
                    {/* Fallback to 'U' if fullName is missing */}
                    {user.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="d-none d-md-block">
                    <p
                      className="mb-0 small fw-bold text-dark"
                      style={{ lineHeight: 1 }}
                    >
                      Hi, {user.fullName ? user.fullName.split(" ")[0] : "User"}
                    </p>
                    <span className="text-muted" style={{ fontSize: "10px" }}>
                      Account
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-link text-danger p-0 border-0 mb-0"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <Power size={20} />
                </button>
              </div>
            ) : (
              <button
                className="btn btn-link text-dark p-0"
                onClick={() => setShowAuthModal(true)}
              >
                <UserIcon size={22} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --- MODALS (Categories & Auth) --- */}
      {/* ... keeping your existing modal code here as it was structurally sound ... */}

      {/* Category Modal Code remains same as your snippet */}
      {showCategoryModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060 }}
          onClick={() => setShowCategoryModal(false)}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 bg-light">
                <h5 className="modal-title fw-bold">Browse Categories</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCategoryModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  {CATEGORY_DATA.map((cat) => (
                    <div className="col-md-3" key={cat.id}>
                      <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                        <cat.icon size={18} />
                        <h6 className="fw-bold mb-0">{cat.title}</h6>
                      </div>
                      <ul className="list-unstyled ps-4">
                        {cat.subcategories.map((sub, i) => (
                          <li key={i} className="small text-muted mb-1">
                            {sub.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal Code remains same as your snippet */}
      {showAuthModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1070 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAuthModal(false)}
                ></button>
              </div>
              <div className="modal-body pt-0 px-4 pb-4 text-center">
                <h4 className="fw-bold">
                  {isRegistering ? "Join Fashionify" : "Welcome Back"}
                </h4>
                <p className="text-muted small mb-4">
                  Access your orders and profile
                </p>

                {isRegistering ? (
                  <Register onRegisterSuccess={() => setIsRegistering(false)} />
                ) : (
                  <Login onLogin={handleLoginSuccess} />
                )}

                <div className="mt-4">
                  <span className="text-muted small">
                    {isRegistering
                      ? "Already have an account?"
                      : "New to Fashionify?"}
                  </span>
                  <button
                    className="btn btn-link btn-sm fw-bold text-decoration-none"
                    onClick={() => setIsRegistering(!isRegistering)}
                  >
                    {isRegistering ? "Login Now" : "Register Here"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
