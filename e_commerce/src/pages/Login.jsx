import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
 
 
 
 
 
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Admin credentials
  const ADMIN_EMAIL = "admin@fashionhub.com";
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Simulate login process
    setLoading(true);
    setTimeout(() => {
      // Check if admin credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminData = {
          email: email,
          name: "Admin",
          fullName: "System Administrator",
          role: "admin",
        };

        login(adminData);
        setLoading(false);
        navigate("/admin");
      } else {
        // Regular user login
        const userData = {
          email: email,
          name: email.split("@")[0],
          fullName: email.split("@")[0],
          role: "user",
        };

        login(userData);
        setLoading(false);
        navigate("/");
      }
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

              {/* Login Card */}
              <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-md-5">
                  {/* Title */}
                  <h2 className="fw-bold mb-1 text-center">Welcome Back</h2>
                  <p className="text-muted text-center mb-4 small">
                    Sign in to your account to continue shopping
                  </p>

                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-danger d-flex gap-2 mb-4" role="alert">
                      <AlertCircle size={18} className="flex-shrink-0" />
                      <div className="small">{error}</div>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-bold small">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-bold small">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>

                    {/* Login Button */}
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
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="d-flex align-items-center gap-3 my-4">
                    <hr className="flex-grow-1 m-0" />
                    <span className="text-muted small">or</span>
                    <hr className="flex-grow-1 m-0" />
                  </div>

                  {/* Sign Up Link */}
                  <p className="text-center text-muted small mb-0">
                    Don't have an account?{" "}
                    <a href="/register" className="text-dark fw-bold text-decoration-none">
                      Create one
                    </a>
                  </p>
                </div>
              </div>

              {/* Info Section
              <div className="mt-4 p-3 bg-white rounded shadow-sm border-start border-5 border-dark">
                <p className="small text-muted mb-2">
                  <strong>Demo Credentials:</strong>
                </p>
                <p className="small text-muted mb-1">
                  👤 <strong>Regular User:</strong> Use any email and password to test user features.
                </p>
                <p className="small text-muted mb-0">
                  🔐 <strong>Admin:</strong> Email: <code>admin@fashionhub.com</code> | Password: <code>admin123</code>
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
 
export default Login;