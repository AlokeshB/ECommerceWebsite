import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Copy } from "lucide-react";

const Register = ({ onRegisterSuccess }) => {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    zip: "",
  });

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  // 2. VALIDATION PATTERNS
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mobile: /^[6-9]\d{9}$/, // Starts with 6-9, followed by 9 digits
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, // Min 6 chars, 1 letter, 1 number
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 3. LOGIC & VALIDATION CHECKS

    // Check Empty Fields
    if (!formData.fullName || !formData.address) {
      return setError("Please fill in all required fields.");
    }

    // Check Patterns
    if (!patterns.email.test(formData.email)) {
      return setError("Invalid Email Address format.");
    }
    if (!patterns.mobile.test(formData.mobile)) {
      return setError(
        "Invalid Mobile Number (Must be 10 digits starting with 6-9)."
      );
    }
    if (!patterns.password.test(formData.password)) {
      return setError(
        "Password must be at least 6 characters and contain a number."
      );
    }

    // Check Password Match
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }

    // 4. GENERATE UNIQUE USER ID (firstName_randomNumber)
    const firstName = formData.fullName.trim().split(" ")[0].toLowerCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const uniqueID = `${firstName}_${randomNum}`;

    // 5. SAVE TO DATABASE (LocalStorage)
    // Create the final user object
    const newUser = {
      ...formData,
      id: uniqueID,
      registeredAt: new Date().toISOString(),
    };

    // Fetch existing users, check for duplicates, and save
    const existingUsers = JSON.parse(localStorage.getItem("eshop_users")) || [];

    const emailExists = existingUsers.some((u) => u.email === formData.email);
    if (emailExists) return setError("This Email is already registered.");

    localStorage.setItem(
      "eshop_users",
      JSON.stringify([...existingUsers, newUser])
    );

    // 6. SHOW SUCCESS MODAL
    setGeneratedId(uniqueID);
    setShowSuccessModal(true);
    setError("");
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    if (onRegisterSuccess) onRegisterSuccess(); // Switch to Login View
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedId);
    alert("ID copied to clipboard!");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="animate__animated animate__fadeIn"
      >
        {/* Error Display */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <div className="row g-3">
          {/* Full Name */}
          <div className="col-12">
            <label className="form-label text-muted small fw-bold">
              Full Name
            </label>
            <input
              type="text"
              className="form-control bg-light border-0"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mobile & Email */}
          <div className="col-md-6">
            <label className="form-label text-muted small fw-bold">
              Mobile
            </label>
            <input
              type="tel"
              className="form-control bg-light border-0"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-bold">
              Email Address
            </label>
            <input
              type="email"
              className="form-control bg-light border-0"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address Section */}
          <div className="col-12">
            <label className="form-label text-muted small fw-bold">
              Shipping Address
            </label>
            <textarea
              className="form-control bg-light border-0"
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-bold">City</label>
            <input
              type="text"
              className="form-control bg-light border-0"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-bold">
              Zip Code
            </label>
            <input
              type="text"
              className="form-control bg-light border-0"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Section */}
          <div className="col-md-6">
            <label className="form-label text-muted small fw-bold">
              Password
            </label>
            <input
              type="password"
              className="form-control bg-light border-0"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted small fw-bold">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control bg-light border-0"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="btn btn-success w-100 py-3 fw-bold shadow-sm"
          >
            Create Account
          </button>
        </div>
      </form>

      {/* SUCCESS MODAL POPUP */}
      {showSuccessModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 2000 }}
        >
          <div
            className="bg-white p-4 rounded-3 shadow-lg text-center animate__animated animate__zoomIn"
            style={{ maxWidth: "380px", width: "90%" }}
          >
            <CheckCircle size={50} className="text-success mb-3" />
            <h4 className="fw-bold text-success">Registration Successful!</h4>
            <p className="text-muted small">Your account has been created.</p>

            <div className="bg-light p-3 rounded border border-primary border-opacity-25 mb-3 position-relative">
              <span className="small text-muted d-block text-uppercase fw-bold mb-1">
                Your Login ID
              </span>
              <span className="fw-bold text-primary fs-4">{generatedId}</span>
              <button
                onClick={copyToClipboard}
                className="btn btn-sm btn-link position-absolute top-50 end-0 translate-middle-y text-muted"
                title="Copy ID"
              >
                <Copy size={16} />
              </button>
            </div>

            <p className="small text-danger fst-italic">
              * Please save this ID. You will need it (or your Email) to log in.
            </p>

            <button
              className="btn btn-dark w-100 fw-bold"
              onClick={handleCloseModal}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
