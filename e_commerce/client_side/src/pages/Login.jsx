import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Lock, Shield } from "lucide-react";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const result = await login(email, password);

    if (result.success) {
      const redirectPath = result.user?.role === "admin" ? "/admin" : "/";
      navigate(redirectPath);
    } else {
      setError(result.error || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <div className="container py-5 flex-grow-1">
          <div className="row justify-content-center">
            <div className="col-12 col-md-5">
              <button onClick={() => navigate("/")} className="btn btn-link text-dark p-0 d-flex align-items-center gap-2 mb-4">
                <ArrowLeft size={20} /> Back to Home
              </button>

              <div className={`card shadow-sm border-0 ${isAdmin ? "border-top border-warning border-3" : ""}`}>
                <div className="card-body p-4 p-md-5">
                  {/* Admin Toggle */}
                  <div className="form-check form-switch d-flex justify-content-center mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="adminToggle"
                      checked={isAdmin}
                      onChange={(e) => {
                        setIsAdmin(e.target.checked);
                        setError("");
                      }}
                      disabled={loading}
                      style={{ width: "2rem", height: "1.25rem", cursor: "pointer" }}
                    />
                    <label className="form-check-label ms-2 fw-bold small" htmlFor="adminToggle">
                      {isAdmin ? "🔐 Admin Login" : "👤 User Login"}
                    </label>
                  </div>

                  <div className="text-center mb-4">
                    {isAdmin ? (
                      <>
                        <div className="d-flex justify-content-center mb-2">
                          <Shield size={40} className="text-warning" />
                        </div>
                        <h2 className="fw-bold mb-1">Admin Dashboard</h2>
                        <p className="text-muted small">Sign in with your admin credentials</p>
                      </>
                    ) : (
                      <>
                        <div className="d-flex justify-content-center mb-2">
                          <Lock size={40} className="text-dark" />
                        </div>
                        <h2 className="fw-bold mb-1">Welcome Back</h2>
                        <p className="text-muted small">Sign in to your account</p>
                      </>
                    )}
                  </div>

                  {error && (
                    <div className="alert alert-danger d-flex gap-2 mb-4">
                      <AlertCircle size={18} className="flex-shrink-0 mt-1" />
                      <div className="small">{error}</div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold small">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-dark w-100 fw-bold py-2 mb-3" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </button>
                  </form>

                  {!isAdmin && (
                    <>
                      <hr className="my-4" />
                      <p className="text-center text-muted small mb-0">
                        Don't have an account?{" "}
                        <a href="/register" className="text-dark fw-bold text-decoration-none">
                          Create one
                        </a>
                      </p>
                    </>
                  )}
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

export default Login;