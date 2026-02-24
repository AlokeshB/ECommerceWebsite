import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon, ShoppingCart, X, Power, Menu, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { NotificationBell } from "./NotificationBell.jsx";

const CategorySlider = ({ navigate, closeMobileMenu, isOpen, onToggle }) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const categories = [
    { id: "men", title: "Men", emoji: "👔" },
    { id: "women", title: "Women", emoji: "👗" },
    { id: "kids", title: "Kids", emoji: "👶" },
  ];

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 150;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(handleScroll, 300);
    }
  };

  const handleCategoryClick = (id) => {
    navigate(`/category/${id}`);
    closeMobileMenu?.();
    onToggle?.(false);
  };

  if (!isOpen) return null;

  return (
    <div className="position-relative d-flex align-items-center gap-2">
      <button
        className="btn btn-sm p-1"
        style={{
          opacity: canScrollLeft ? 1 : 0.4,
          cursor: canScrollLeft ? "pointer" : "default",
          minWidth: "32px",
          background: "transparent",
          border: "none",
        }}
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        title="Previous"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={sliderRef}
        className="d-flex gap-2 overflow-hidden"
        style={{
          scrollBehavior: "smooth",
          flex: 1,
          maxWidth: "300px",
        }}
        onScroll={handleScroll}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="btn btn-outline-dark fw-6 text-nowrap px-3 py-2"
            style={{
              fontSize: "13px",
              minWidth: "90px",
              transition: "all 0.2s ease",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#333";
              e.target.style.color = "white";
              e.target.style.borderColor = "#333";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#333";
              e.target.style.borderColor = "#333";
            }}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.emoji} {cat.title}
          </button>
        ))}
      </div>

      <button
        className="btn btn-sm p-1"
        style={{
          opacity: canScrollRight ? 1 : 0.4,
          cursor: canScrollRight ? "pointer" : "default",
          minWidth: "32px",
          background: "transparent",
          border: "none",
        }}
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        title="Next"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const { getWishlistCount } = useWishlist();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategorySlider, setShowCategorySlider] = useState(false);

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

  const scrollToFooter = () => {
    const footerElement = document.querySelector("footer");
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: "smooth" });
      closeMobileMenu();
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-light bg-white border-bottom sticky-top py-2 py-md-3"
        style={{ top: 0, zIndex: 1000 }}
      >
        <div
          className="container-fluid px-2 px-md-5"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <Link
            className="navbar-brand fw-bold"
            to="/"
            style={{ fontSize: "18px", minWidth: "110px", margin: 0 }}
            onClick={closeMobileMenu}
          >
            FASHION-HUB
          </Link>

          {/* Desktop Menu - Centered (Desktop Only - xl screens and up) */}
          <div
            className="d-none d-xl-flex gap-3 align-items-center"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              minWidth: "400px",
              justifyContent: "center",
            }}
          >
            {/* CATEGORIES Toggle */}
            <button
              className="btn btn-link text-dark text-decoration-none fw-bold p-0"
              style={{ fontSize: "15px" }}
              onClick={() => setShowCategorySlider(!showCategorySlider)}
            >
              CATEGORIES ▼
            </button>

            {showCategorySlider && (
              <CategorySlider
                navigate={navigate}
                isOpen={true}
                onToggle={setShowCategorySlider}
              />
            )}

            {!showCategorySlider && (
              <>
                <Link
                  to="/about"
                  className="btn btn-link text-dark text-decoration-none fw-bold p-0"
                  style={{ fontSize: "15px" }}
                >
                  ABOUT US
                </Link>

                <button
                  className="btn btn-link text-dark text-decoration-none fw-bold p-0"
                  style={{ fontSize: "15px" }}
                  onClick={scrollToFooter}
                >
                  CONTACT US
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle and Right side actions */}
          <div
            className="d-flex align-items-center gap-2 gap-md-3"
            style={{ marginLeft: "auto" }}
          >
            {/* Mobile Menu Toggle - Hide on xl and up */}
            <button
              className="btn btn-link d-xl-none p-0 text-dark me-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              title="Menu"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
            {user && <NotificationBell role="user" />}
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="btn btn-link text-dark p-0 position-relative"
              title="Wishlist"
            >
              <Heart size={20} />
              {getWishlistCount?.() > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "10px" }}
                >
                  {getWishlistCount()}
                </span>
              )}
            </Link>
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="btn btn-link text-dark p-0 position-relative"
            >
              <ShoppingCart size={20} />
              {getCartCount?.() > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "10px" }}
                >
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
                  <div
                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                    style={{ width: "28px", height: "28px", fontSize: "12px" }}
                  >
                    {(user.fullName || user.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="d-none d-lg-block text-start">
                    <div className="small fw-bold text-dark">
                      Hi, {(user.fullName || user.name || "User").split(" ")[0]}
                    </div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>
                      Account
                    </div>
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
              <button
                className="btn btn-link text-dark p-0"
                onClick={handleUserAction}
                title="Login"
              >
                <UserIcon size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          className="d-xl-none bg-light border-bottom py-3 px-3"
          style={{ zIndex: 999 }}
        >
          <div className="d-flex flex-column gap-2">
            {/* Mobile Categories Toggle */}
            <button
              className="btn btn-link text-dark text-decoration-none fw-bold p-0 text-start"
              style={{ fontSize: "15px" }}
              onClick={() => setShowCategorySlider(!showCategorySlider)}
            >
              CATEGORIES {showCategorySlider ? "▲" : "▼"}
            </button>

            {showCategorySlider && (
              <div className="ms-2">
                <CategorySlider
                  navigate={navigate}
                  closeMobileMenu={closeMobileMenu}
                  isOpen={true}
                  onToggle={setShowCategorySlider}
                />
              </div>
            )}

            {!showCategorySlider && (
              <>
                <Link
                  to="/about"
                  className="btn btn-link text-dark text-decoration-none fw-bold p-0 text-start"
                  style={{ fontSize: "15px" }}
                  onClick={closeMobileMenu}
                >
                  ABOUT US
                </Link>

                <button
                  className="btn btn-link text-dark text-decoration-none fw-bold p-0 w-100 text-start"
                  style={{ fontSize: "15px" }}
                  onClick={scrollToFooter}
                >
                  CONTACT US
                </button>
              </>
            )}

            <hr className="my-2" />
            {user && (
              <Link
                to="/profile"
                className="btn btn-link text-dark text-decoration-none fw-bold p-0 text-start"
                onClick={closeMobileMenu}
              >
                My Profile
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
