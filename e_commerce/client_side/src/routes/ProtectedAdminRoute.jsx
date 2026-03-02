import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for loading to complete before making any decisions
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedAdminRoute;