import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User as UserIcon, ShoppingCart, X, Power } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const CategoryButton = ({ id, title, navigate }) => (
  <button
    onClick={() => navigate(`/category/${id}`)}
    className="btn btn-link text-dark text-decoration-none fw-bold p-0"
    style={{ fontSize: "18px" }}
  >
    {title}
  </button>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUserAction = () => {
    navigate(user ? "/profile" : "/login");
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Search for:", searchQuery);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3" style={{ top: 0, zIndex: 1000 }}>
      <div className="container-fluid px-5">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/" style={{ fontSize: "24px", minWidth: "150px" }}>
          FASHION-HUB
        </Link>

        {/* Category Links - Centered */}
        <div className="d-none d-md-flex gap-5 flex-grow-1 justify-content-center">
          <CategoryButton id="women" title="WOMEN" navigate={navigate} />
          <CategoryButton id="men" title="MEN" navigate={navigate} />
          <CategoryButton id="kids" title="KIDS" navigate={navigate} />
        </div>

        {/* Right side actions */}
        <div className="d-flex align-items-center gap-3" style={{ minWidth: "150px", justifyContent: "flex-end" }}>
          {/* Search Bar */}
          {showSearch ? (
            <div className="input-group input-group-sm" style={{ width: "200px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                autoFocus
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-link text-dark p-0"
              onClick={() => setShowSearch(true)}
              title="Search"
            >
              <Search size={26} />
            </button>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="btn btn-link text-dark p-0 position-relative">
            <ShoppingCart size={26} />
            {getCartCount?.() > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "10px" }}>
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* User Actions */}
          {user ? (
            <div className="d-flex align-items-center gap-2 ps-2 border-start">
              <button
                className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
                onClick={handleUserAction}
                style={{ minWidth: "auto" }}
              >
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: "32px", height: "32px", fontSize: "14px" }}>
                  {(user.fullName || user.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="d-none d-md-block text-start">
                  <div className="small fw-bold text-dark">Hi, {(user.fullName || user.name || "User").split(" ")[0]}</div>
                  <div className="text-muted" style={{ fontSize: "11px" }}>Account</div>
                </div>
              </button>
              <button
                className="btn btn-link text-danger p-0"
                onClick={handleLogout}
                title="Logout"
              >
                <Power size={24} />
              </button>
            </div>
          ) : (
            <button className="btn btn-link text-dark p-0" onClick={handleUserAction} title="Login">
              <UserIcon size={26} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;