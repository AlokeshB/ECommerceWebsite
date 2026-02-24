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
  const [loginMode, setLoginMode] = useState("user");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleModeSwitch = (mode) => {
    setLoginMode(mode);
    setError("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const result = await login(email, password, loginMode);

    if (result.success) {
      const redirectPath = result.user?.role === "admin" ? "/admin" : "/";
      navigate(redirectPath);
    } else {
      setError(result.error || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  const isUserMode = loginMode === "user";

  return (
    <>
      <div className="d-flex flex-column min-vh-100" style={{ background: "#f8f9fa" }}>
        <div className="container py-5 flex-grow-1">
          <div className="row justify-content-center">
            <div className="col-12 col-md-5">
              <button 
                onClick={() => navigate("/")} 
                className="btn btn-link text-dark p-0 d-flex align-items-center gap-2 mb-4"
              >
                <ArrowLeft size={20} /> Back to Home
              </button>

              <div className="card shadow-sm border-0 overflow-hidden">
                {/* Mode Switcher */}
                <div 
                  className="d-flex"
                  style={{
                    background: isUserMode 
                      ? "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                      : "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
                    padding: "8px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("user")}
                    disabled={loading}
                    className="btn w-50 fw-bold py-2"
                    style={{
                      background: isUserMode ? "white" : "transparent",
                      color: isUserMode ? "#2c3e50" : "white",
                      border: "none",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                      cursor: loading ? "default" : "pointer",
                      opacity: loading && !isUserMode ? 0.6 : 1,
                    }}
                  >
                    👤 User Login
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("admin")}
                    disabled={loading}
                    className="btn w-50 fw-bold py-2"
                    style={{
                      background: !isUserMode ? "white" : "transparent",
                      color: !isUserMode ? "#e67e22" : "white",
                      border: "none",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                      cursor: loading ? "default" : "pointer",
                      opacity: loading && isUserMode ? 0.6 : 1,
                    }}
                  >
                    🔐 Admin Login
                  </button>
                </div>

                {/* Form Header */}
                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    {isUserMode ? (
                      <>
                        <div 
                          className="d-inline-flex justify-content-center align-items-center rounded-circle mb-3"
                          style={{
                            background: "#e8f4f8",
                            width: "60px",
                            height: "60px",
                          }}
                        >
                          <Lock size={32} style={{ color: "#2c3e50" }} />
                        </div>
                        <h2 className="fw-bold mb-2" style={{ color: "#2c3e50" }}>Welcome Back</h2>
                        <p className="text-muted small">Sign in with your user credentials</p>
                      </>
                    ) : (
                      <>
                        <div 
                          className="d-inline-flex justify-content-center align-items-center rounded-circle mb-3"
                          style={{
                            background: "#fef3e2",
                            width: "60px",
                            height: "60px",
                          }}
                        >
                          <Shield size={32} style={{ color: "#e67e22" }} />
                        </div>
                        <h2 className="fw-bold mb-2" style={{ color: "#e67e22" }}>Admin Portal</h2>
                        <p className="text-muted small">Sign in with admin credentials only</p>
                      </>
                    )}
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div 
                      className="alert d-flex gap-2 mb-4"
                      style={{
                        background: "#ffe5e5",
                        color: "#c33",
                        border: "1px solid #ffcccc",
                        borderRadius: "6px",
                      }}
                    >
                      <AlertCircle size={18} className="flex-shrink-0 mt-1" />
                      <div className="small">{error}</div>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-bold small" style={{ color: "#2c3e50" }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        style={{
                          borderColor: "#ddd",
                          borderRadius: "6px",
                        }}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold small" style={{ color: "#2c3e50" }}>
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        style={{
                          borderColor: "#ddd",
                          borderRadius: "6px",
                        }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn w-100 fw-bold py-2"
                      style={{
                        background: isUserMode 
                          ? "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
                          : "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        transition: "all 0.3s ease",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.8 : 1,
                      }}
                    >
                      {loading 
                        ? (isUserMode ? "Signing in..." : "Verifying Admin...")
                        : "Sign In"
                      }
                    </button>
                  </form>

                  {/* Footer Links */}
                  {isUserMode && (
                    <>
                      <hr className="my-4" style={{ borderColor: "#eee" }} />
                      <p className="text-center text-muted small mb-0">
                        Don't have an account?{" "}
                        <a 
                          href="/register" 
                          className="fw-bold text-decoration-none"
                          style={{ color: "#2c3e50" }}
                        >
                          Create one
                        </a>
                      </p>
                    </>
                  )}

                  {!isUserMode && (
                    <div className="alert small mt-4" style={{ background: "#fef3e2", borderRadius: "6px" }}>
                      <span className="fw-bold" style={{ color: "#e67e22" }}>⚠️ Admin Only</span>
                      <p className="mb-0 mt-2" style={{ color: "#666" }}>
                        Only admin accounts can access this portal. User credentials will be rejected.
                      </p>
                    </div>
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