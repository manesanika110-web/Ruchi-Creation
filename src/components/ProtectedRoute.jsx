import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

/**
 * Route protection wrapper.
 * Redirects unauthenticated visitors to /register (or /login)
 * while preserving the attempted path.
 */
export const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoggingOut } = useApp();
  const location = useLocation();

  if (isLoggingOut) {
    return <Navigate to="/" replace />;
  }

  if (!currentUser) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return children;
};
