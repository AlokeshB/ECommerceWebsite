import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  User as UserIcon,
  ShoppingCart,
  X,
  Power,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Layout.css";
import { CATEGORY_DATA } from "./categories";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
 
const Navbar = () => {
  const navigate = useNavigate();
 
  // Destructure functions from contexts
  // Ensure these names match exactly what is in your Context Provider 'value' prop
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
 
  const [showSearch, setShowSearch] = useState(false);
 
  // 1. Handle User Icon / Profile Click
  const handleUserAction = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  // 2. Handle Logout
  const handleLogout = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };
 
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          {/* Brand */}
          <Link
            className="navbar-brand fw-bold d-flex align-items-center gap-2"
            to="/"
          >
            <span style={{ letterSpacing: "0.5px" }}>FASHION-HUB</span>
          </Link>
 
          {/* Category Links (hover to open centered mega-menu) */}
          <div className="d-flex align-items-center gap-4 ms-4 d-none d-md-flex nav-categories">
            {/* Women */}
            <div className="nav-item position-relative">
              <a href="#" className="text-dark text-decoration-none fw-bold small px-2" style={{ fontSize: "14px" }}>
                WOMEN
              </a>
              <div className="mega-menu">
                <div className="mega-inner">
                  <div className="row g-3 justify-content-center">
                    {(CATEGORY_DATA.find(c=>c.id==="women")?.subcategories || []).map((sub,i)=>(
                      <div className="col-4" key={i}>
                        <div className="fw-bold small mb-2">{sub.name}</div>
                        <ul className="list-unstyled">
                          {sub.types.map((t,j)=>(
                            <li key={j}>
                              <a href="#" className="text-muted text-decoration-none small" onClick={(e)=>e.preventDefault()}>{t}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
 
            {/* Men */}
            <div className="nav-item position-relative">
              <a href="#" className="text-dark text-decoration-none fw-bold small px-2" style={{ fontSize: "14px" }}>
                MEN
              </a>
              <div className="mega-menu">
                <div className="mega-inner">
                  <div className="row g-3 justify-content-center">
                    {(CATEGORY_DATA.find(c=>c.id==="men")?.subcategories || []).map((sub,i)=>(
                      <div className="col-4" key={i}>
                        <div className="fw-bold small mb-2">{sub.name}</div>
                        <ul className="list-unstyled">
                          {sub.types.map((t,j)=>(
                            <li key={j}>
                              <a href="#" className="text-muted text-decoration-none small" onClick={(e)=>e.preventDefault()}>{t}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
 
            {/* Kids */}
            <div className="nav-item position-relative">
              <a href="#" className="text-dark text-decoration-none fw-bold small px-2" style={{ fontSize: "14px" }}>
                KIDS
              </a>
              <div className="mega-menu">
                <div className="mega-inner">
                  <div className="row g-3 justify-content-center">
                    {(CATEGORY_DATA.find(c=>c.id==="kids")?.subcategories || []).map((sub,i)=>(
                      <div className="col-4" key={i}>
                        <div className="fw-bold small mb-2">{sub.name}</div>
                        <ul className="list-unstyled">
                          {sub.types.map((t,j)=>(
                            <li key={j}>
                              <a href="#" className="text-muted text-decoration-none small" onClick={(e)=>e.preventDefault()}>{t}</a>
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
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
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
                onClick={handleUserAction}
              >
                <UserIcon size={22} />
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;