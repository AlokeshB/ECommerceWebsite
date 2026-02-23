import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const FormField = ({ label, id, disabled, ...props }) => (
  <div className="mb-3">
    <label htmlFor={id} className="form-label fw-bold small">
      {label}
    </label>
    <input
      {...props}
      id={id}
      className="form-control"
      disabled={disabled}
      required
    />
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = (data) => {
    const { name, email, phone, password, confirmPassword, address, city, state, zipCode } = data;

    if (!name || !email || !password || !confirmPassword || !phone || !address || !city || !state || !zipCode) {
      return "Please fill in all required fields.";
    }
    if (!/^[A-Za-z\s]{2,}$/.test(name)) {
      return "Name must contain letters only (minimum 2 characters).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      return "Phone number must be 10 digits.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const result = await authRegister(formData);

    if (result.success) {
      setSuccess("Registration successful! Redirecting to home...");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setError(result.error || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <div className="container py-5 flex-grow-1">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              <button
                onClick={() => navigate("/")}
                className="btn btn-link text-dark p-0 d-flex align-items-center gap-2 mb-4"
              >
                <ArrowLeft size={20} /> Back to Home
              </button>

              <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-md-5">
                  <h2 className="fw-bold mb-1 text-center">Create Account</h2>
                  <p className="text-muted text-center mb-4 small">
                    Join us and start shopping
                  </p>

                  {error && (
                    <div
                      className="alert alert-danger d-flex gap-2 mb-4"
                      role="alert"
                    >
                      <AlertCircle size={18} className="flex-shrink-0" />
                      <div className="small">{error}</div>
                    </div>
                  )}

                  {success && (
                    <div
                      className="alert alert-success d-flex gap-2 mb-4"
                      role="alert"
                    >
                      <CheckCircle size={18} className="flex-shrink-0" />
                      <div className="small">{success}</div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormField
                          label="Full Name"
                          id="name"
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormField
                          label="Email Address"
                          id="email"
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormField
                          label="Phone Number"
                          id="phone"
                          type="tel"
                          name="phone"
                          placeholder="Enter 10-digit number"
                          value={formData.phone}
                          onChange={handleChange}
                          maxLength="10"
                          disabled={loading}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormField
                          label="City"
                          id="city"
                          type="text"
                          name="city"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormField
                          label="State"
                          id="state"
                          type="text"
                          name="state"
                          placeholder="Enter state"
                          value={formData.state}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormField
                          label="Zip Code"
                          id="zipCode"
                          type="text"
                          name="zipCode"
                          placeholder="Enter zip code"
                          value={formData.zipCode}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="country"
                            className="form-label fw-bold small"
                          >
                            Country
                          </label>
                          <select
                            id="country"
                            name="country"
                            className="form-control"
                            value={formData.country}
                            onChange={handleChange}
                            disabled={loading}
                          >
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <FormField
                          label="Address Line"
                          id="address"
                          type="text"
                          name="address"
                          placeholder="Enter your address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormField
                          label="Password"
                          id="password"
                          type="password"
                          name="password"
                          placeholder="Min 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormField
                          label="Confirm Password"
                          id="confirmPassword"
                          type="password"
                          name="confirmPassword"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                    </div>

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
                          ></span>
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>

                  <hr className="my-4" />
                  <p className="text-center text-muted small mb-0">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-dark fw-bold text-decoration-none"
                    >
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
