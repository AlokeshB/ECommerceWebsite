import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User as UserIcon, ShoppingCart, X, Power } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Layout.css";
import { CATEGORY_DATA } from "./categories";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

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

  const CategoryMenu = ({ id, title }) => (
    <div className="nav-item position-relative">
      <button
        onClick={() => navigate(`/category/${id}`)}
        className="text-dark text-decoration-none fw-bold small px-2 border-0 bg-transparent cursor-pointer"
        style={{ fontSize: "14px" }}
      >
        {title}
      </button>
      <div className="mega-menu">
        <div className="mega-inner">
          <div className="row g-3 justify-content-center">
            {(CATEGORY_DATA.find((c) => c.id === id)?.subcategories || []).map((sub, i) => (
              <div className="col-4" key={i}>
                <div className="fw-bold small mb-2">{sub.name}</div>
                <ul className="list-unstyled">
                  {sub.types.map((t, j) => (
                    <li key={j}>
                      <a href="#" className="text-muted text-decoration-none small" onClick={(e) => e.preventDefault()}>
                        {t}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
            <span style={{ letterSpacing: "0.5px" }}>FASHION-HUB</span>
          </Link>

          <div className="d-flex align-items-center gap-4 ms-4 d-none d-md-flex nav-categories">
            <CategoryMenu id="women" title="WOMEN" />
            <CategoryMenu id="men" title="MEN" />
            <CategoryMenu id="kids" title="KIDS" />
          </div>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <div className="d-flex align-items-center">
              {showSearch ? (
                <div className="input-group input-group-sm animate__animated animate__fadeInRight" style={{ width: "200px" }}>
                  <input type="text" className="form-control border-end-0" placeholder="Search..." autoFocus />
                  <button className="btn btn-outline-secondary border-start-0 bg-white" onClick={() => setShowSearch(false)}>
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button className="btn btn-link text-dark p-0" onClick={() => setShowSearch(true)}>
                  <Search size={22} />
                </button>
              )}
            </div>

            <Link to="/cart" className="btn btn-link text-dark p-0 position-relative">
              <ShoppingCart size={22} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "10px" }}>
                {getCartCount?.() || 0}
              </span>
            </Link>

            {user ? (
              <div className="d-flex align-items-center gap-3 ps-2 border-start">
                <div className="d-flex align-items-center gap-2" onClick={handleUserAction} style={{ cursor: "pointer" }}>
                  <div
                    className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: "32px", height: "32px" }}
                  >
                    {(user.fullName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="d-none d-md-block">
                    <p className="mb-0 small fw-bold text-dark" style={{ lineHeight: 1 }}>
                      Hi, {(user.fullName || "User").split(" ")[0]}
                    </p>
                    <span className="text-muted" style={{ fontSize: "10px" }}>
                      Account
                    </span>
                  </div>
                </div>
                <button className="btn btn-link text-danger p-0 border-0 mb-0" onClick={handleLogout} title="Logout">
                  <Power size={20} />
                </button>
              </div>
            ) : (
              <button className="btn btn-link text-dark p-0" onClick={handleUserAction}>
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