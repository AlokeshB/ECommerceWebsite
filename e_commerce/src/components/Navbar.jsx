import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon, ShoppingCart, X, Power, Menu } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const CategoryButton = ({ id, title, navigate, onClick }) => (
  <button
    onClick={() => {
      navigate(`/category/${id}`);
      onClick?.();
    }}
    className="btn btn-link text-dark text-decoration-none fw-bold p-0 w-100 text-start"
    style={{ fontSize: "16px" }}
  >
    {title}
  </button>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleUserAction = () => {
    navigate(user ? "/profile" : "/login");
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
      setShowMobileMenu(false);
    }
  };

  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <>
      <nav className="navbar navbar-light bg-white border-bottom sticky-top py-2 py-md-3" style={{ top: 0, zIndex: 1000 }}>
        <div className="container-fluid px-2 px-md-5" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand */}
          <Link className="navbar-brand fw-bold" to="/" style={{ fontSize: "18px", minWidth: "110px", margin: 0 }} onClick={closeMobileMenu}>
            FASHION-HUB
          </Link>

          {/* Category Links - Centered (Desktop Only - xl screens and up) */}
          <div className="d-none d-xl-flex gap-4" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <CategoryButton id="women" title="WOMEN" navigate={navigate} />
            <CategoryButton id="men" title="MEN" navigate={navigate} />
            <CategoryButton id="kids" title="KIDS" navigate={navigate} />
          </div>

          {/* Mobile Menu Toggle and Right side actions */}
          <div className="d-flex align-items-center gap-2 gap-md-3" style={{ marginLeft: "auto" }}>
            {/* Mobile Menu Toggle - Hide on xl and up */}
            <button
              className="btn btn-link d-xl-none p-0 text-dark me-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              title="Menu"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className="btn btn-link text-dark p-0 position-relative">
              <ShoppingCart size={20} />
              {getCartCount?.() > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "10px" }}>
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Actions */}
            {user ? (
              <div className="d-flex align-items-center gap-1 gap-md-2 ps-2 border-start">
                <button
                  className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1 gap-md-2"
                  onClick={handleUserAction}
                  style={{ minWidth: "auto" }}
                >
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: "28px", height: "28px", fontSize: "12px" }}>
                    {(user.fullName || user.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="d-none d-lg-block text-start">
                    <div className="small fw-bold text-dark">Hi, {(user.fullName || user.name || "User").split(" ")[0]}</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>Account</div>
                  </div>
                </button>
                <button
                  className="btn btn-link text-danger p-0"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <Power size={20} />
                </button>
              </div>
            ) : (
              <button className="btn btn-link text-dark p-0" onClick={handleUserAction} title="Login">
                <UserIcon size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Only show on screens smaller than xl */}
      {showMobileMenu && (
        <div className="d-xl-none bg-light border-bottom py-3 px-3" style={{ zIndex: 999 }}>
          <div className="d-flex flex-column gap-3">
            <CategoryButton id="women" title="WOMEN" navigate={navigate} onClick={closeMobileMenu} />
            <CategoryButton id="men" title="MEN" navigate={navigate} onClick={closeMobileMenu} />
            <CategoryButton id="kids" title="KIDS" navigate={navigate} onClick={closeMobileMenu} />
            <hr className="my-2" />
            <Link to="/profile" className="btn btn-link text-dark text-decoration-none fw-bold p-0 text-start" onClick={closeMobileMenu}>
              My Profile
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;