import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import Global Auth
import { AlertCircle, Lock, User } from "lucide-react";
 
const Login = ({ onLogin }) => {
  // 1. HOOKS & STATE
  const { login } = useAuth(); // Access the global login function
  const navigate = useNavigate();
  const location = useLocation();
 
  const [credentials, setCredentials] = useState({
    identifier: "", // Can be UserID OR Email
    password: "",
  });
  const [error, setError] = useState("");
 
  // 2. HANDLERS
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error on typing
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    // A. Fetch Users from "Database" (LocalStorage)
    const storedUsers = JSON.parse(localStorage.getItem("eshop_users")) || [];
 
    // B. Find User Matching Logic
    // Check if Input matches (UserID OR Email) AND Password matches
    const validUser = storedUsers.find(
      (user) =>
        (user.id === credentials.identifier ||
          user.email === credentials.identifier) &&
        user.password === credentials.password
    );
 
    if (validUser) {
      // C. SUCCESS: Update Global State
      login(validUser);
 
      // Close Modal if function provided
      if (onLogin) onLogin(validUser);
 
      // D. REDIRECT LOGIC
      // Check if user came from a specific page (like Cart), otherwise go Home
      // 'location.state?.from' is set by protected routes (we will add this to Cart later)
      const fromPage = location.state?.from?.pathname || "/";
      navigate(fromPage, { replace: true });
    } else {
      // E. FAILURE: Show Error
      setError("Invalid User ID/Email or Password. Please try again.");
    }
  };
 
  return (
    <form onSubmit={handleSubmit} className="animate__animated animate__fadeIn">
      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3">
          <AlertCircle size={16} /> {error}
        </div>
      )}
 
      {/* Input: User ID or Email */}
      <div className="mb-3">
        <label className="form-label text-muted small fw-bold">
          User ID or Email
        </label>
        <div className="input-group">
          <span className="input-group-text bg-light border-0">
            <User size={18} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control form-control-lg bg-light border-0"
            name="identifier"
            placeholder="e.g. rahul_8821 or rahul@gmail.com"
            value={credentials.identifier}
            onChange={handleChange}
            required
          />
        </div>
      </div>
 
      {/* Input: Password */}
      <div className="mb-3">
        <label className="form-label text-muted small fw-bold">Password</label>
        <div className="input-group">
          <span className="input-group-text bg-light border-0">
            <Lock size={18} className="text-muted" />
          </span>
          <input
            type="password"
            className="form-control form-control-lg bg-light border-0"
            name="password"
            placeholder="••••••••"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
      </div>
 
      {/* Forgot Password Link */}
      <div className="d-flex justify-content-end mb-4">
        <button
          type="button"
          className="btn btn-link text-decoration-none text-muted p-0 small"
          onClick={() => alert("Feature coming soon! (Reset via Email)")}
        >
          Forgot Password?
        </button>
      </div>
 
      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-dark w-100 py-3 fw-bold shadow-sm"
      >
        Login Securely
      </button>
    </form>
  );
};
 
export default Login;
 