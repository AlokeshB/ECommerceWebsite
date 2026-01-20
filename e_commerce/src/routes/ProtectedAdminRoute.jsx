import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Check if user is logged in and has admin role
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is an admin
  return children;
};

export default ProtectedAdminRoute;
