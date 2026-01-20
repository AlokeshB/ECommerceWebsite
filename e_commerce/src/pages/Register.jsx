import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
 
 
 
const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
    age: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, phoneNo, password, confirmPassword, age } = formData;

    // Validation checks
    if (!name || !age || !email || !password || !confirmPassword || !phoneNo) {
      setError("Please fill in all fields.");
      return;
    }

    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (!nameRegex.test(name)) {
      setError("Name must contain letters only (minimum 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNo)) {
      setError("Phone number must be 10 digits.");
      return;
    }

    if (parseInt(age) < 18) {
      setError("You must be at least 18 years old to register.");
      return;
    }

    if (parseInt(age) > 100) {
      setError("Please enter a valid age.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Simulate registration
    setLoading(true);
    setTimeout(() => {
      const userData = {
        name: name,
        email: email,
        phone: phoneNo,
        role: "user",
      };

      login(userData);
      setSuccess("Registration successful! Redirecting...");
      setLoading(false);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    }, 500);
  };

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column min-vh-100 bg-light">
        <div className="container py-5 flex-grow-1">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              {/* Back Button */}
              <button
                onClick={() => navigate("/")}
                className="btn btn-link text-dark p-0 d-flex align-items-center gap-2 mb-4"
              >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </button>

              {/* Register Card */}
              <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-md-5">
                  {/* Title */}
                  <h2 className="fw-bold mb-1 text-center">Create Account</h2>
                  <p className="text-muted text-center mb-4 small">
                    Join us and start shopping
                  </p>

                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-danger d-flex gap-2 mb-4" role="alert">
                      <AlertCircle size={18} className="flex-shrink-0" />
                      <div className="small">{error}</div>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="alert alert-success d-flex gap-2 mb-4" role="alert">
                      <CheckCircle size={18} className="flex-shrink-0" />
                      <div className="small">{success}</div>
                    </div>
                  )}

                  {/* Register Form */}
                  <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-bold small">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>

                    {/* Age Field */}
                    <div className="mb-3">
                      <label htmlFor="age" className="form-label fw-bold small">
                        Age
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="age"
                        name="age"
                        placeholder="25"
                        value={formData.age}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>

                    {/* Email Field */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-bold small">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="mb-3">
                      <label htmlFor="phoneNo" className="form-label fw-bold small">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phoneNo"
                        name="phoneNo"
                        placeholder="9876543210"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        maxLength="10"
                        disabled={loading}
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-bold small">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Min 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label fw-bold small">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>

                    {/* Register Button */}
                    <button
                      type="submit"
                      className="btn btn-dark w-100 fw-bold py-2 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="d-flex align-items-center gap-3 my-4">
                    <hr className="flex-grow-1 m-0" />
                    <span className="text-muted small">or</span>
                    <hr className="flex-grow-1 m-0" />
                  </div>

                  {/* Login Link */}
                  <p className="text-center text-muted small mb-0">
                    Already have an account?{" "}
                    <a href="/login" className="text-dark fw-bold text-decoration-none">
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;