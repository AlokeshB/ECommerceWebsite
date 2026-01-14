import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  User as UserIcon,
  ShoppingCart,
  X,
  Menu,
  Grid,
} from "lucide-react";
// import Modal from '../../components/common/Modal';
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Layout.css";
import { CATEGORY_DATA } from "./categories";
import { useCart } from "../../context/CartContext.jsx";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const { getCartCount } = useCart();
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
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

          {/* New Categories Button */}
          <button
            className="btn btn-light d-flex align-items-center gap-2 ms-3 border-0 bg-light-subtle text-dark"
            onClick={() => setShowCategoryModal(true)}
            style={{ borderRadius: "20px", padding: "8px 16px" }}
          >
            <Grid size={18} />
            <span className="fw-bold small">Categories</span>
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
                    className="form-control border-start-0"
                    placeholder="Search..."
                  />
                  <button
                    className="btn btn-outline-secondary border-start-0"
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

            <Link
              to="/cart"
              className="btn btn-link text-dark p-0 position-relative"
            >
              <ShoppingCart size={22} />
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "10px" }}
              >
                {getCartCount()} {/* Dynamic Number */}
              </span>
            </Link>

            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-dark small">Hi, {user.name}</span>
                <UserIcon size={22} className="text-primary" />
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

      {/* --- CATEGORY MODAL (Mega Menu) --- */}
      {showCategoryModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          onClick={() => setShowCategoryModal(false)}
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 bg-light">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Grid size={20} className="text-primary" /> Browse Categories
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCategoryModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  {CATEGORY_DATA.map((cat) => (
                    <div className="col-md" key={cat.id}>
                      <div className="d-flex align-items-center gap-2 mb-3 text-primary">
                        <cat.icon size={20} />
                        <h6 className="fw-bold mb-0 text-uppercase">
                          {cat.title}
                        </h6>
                      </div>
                      <ul className="list-unstyled">
                        {cat.subcategories.map((sub, idx) => (
                          <li key={idx} className="mb-2">
                            <span className="fw-bold text-dark small">
                              {sub.name}
                            </span>
                            <ul className="list-unstyled ps-2 mt-1 border-start border-2">
                              {sub.types.slice(0, 4).map((type) => (
                                <li
                                  key={type}
                                  className="text-muted small py-1 hover-primary"
                                  style={{ cursor: "pointer" }}
                                >
                                  {type}
                                </li>
                              ))}
                              {sub.types.length > 4 && (
                                <li className="text-primary small fw-bold cursor-pointer">
                                  + More
                                </li>
                              )}
                            </ul>
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

      {/* --- AUTH MODAL (Existing) --- */}
      {showAuthModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {isRegistering ? "Create Account" : "Welcome Back"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAuthModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {isRegistering ? (
                  <Register onRegisterSuccess={() => setIsRegistering(false)} />
                ) : (
                  <Login onLogin={handleLoginSuccess} />
                )}
                <div className="mt-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="authCheck"
                    checked={isRegistering}
                    onChange={() => setIsRegistering(!isRegistering)}
                  />
                  <label
                    className="form-check-label text-muted small"
                    htmlFor="authCheck"
                  >
                    Don't have an account? Register
                  </label>
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
